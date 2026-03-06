import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";
import CaseSummaryRow from "../CaseSummaryRow";
import { svgIcons } from "../../../data/svgIcons";
import TextField from "../../ui/form/TextField";
import CustomDropdown from "../../ui/form/CustomDropdown";
import VerifyMobileNumber from "../VerifyMobileNumber";
import FormActions from "../FormActions";
import {
  CourtRoom,
  CaseResult,
  Step1State,
  AuthData,
  CtcApplication,
  CaseSearchResult,
} from "../../../types";
import { ctcStyles, ctcText } from "../../../styles/certifiedCopyStyles";
import {
  createCtcApplication,
  updateCtcApplication,
} from "../../../services/ctcService";

interface Step1CaseDetailsProps {
  courtOptions: CourtRoom[];
  step1: Step1State;
  updateStep1: (patch: Partial<Step1State>) => void;
  clearStep1: () => void;
  ctcApplication?: CtcApplication | null;
  onApplicationCreate?: (app: CtcApplication) => void;
  tenantId: string;
  showErrorToast?: (message: string) => void;
  caseResult?: CaseResult | null;
  onAuthDataReceived?: (data: AuthData) => void;
  authData?: AuthData | null;
  onSearchCase: (cnrInput: string) => Promise<void>;
  isSearching: boolean;
  onSaving?: (isSaving: boolean) => void;
}

const DEBOUNCE_MS = 100;

const Step1CaseDetails: React.FC<Step1CaseDetailsProps> = ({
  courtOptions,
  step1,
  updateStep1,
  clearStep1,
  ctcApplication,
  onApplicationCreate,
  tenantId,
  showErrorToast,
  caseResult,
  onAuthDataReceived,
  authData,
  onSearchCase,
  isSearching,
  onSaving,
}) => {
  const { t } = useSafeTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const {
    selectedCourt,
    cnrNumber,
    caseNumber,
    hasSearched,
    phoneNumber,
    isPhoneVerified,
    isPartyToCase,
    name,
    designation,
  } = step1;

  // ─── Autocomplete state ─────────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState<CaseSearchResult[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const caseInputWrapperRef = useRef<HTMLDivElement>(null);

  // ─── Field class helpers ────────────────────────────────────────────────
  const courtFieldClass = `${ctcStyles.fieldInputHeight} ${hasSearched ? ctcStyles.fieldDisabled : ctcStyles.fieldEnabled}`;
  const caseFieldClass = `${ctcStyles.fieldInputHeight} ${hasSearched ? ctcStyles.fieldDisabled : ctcStyles.fieldEnabled}`;
  const isPartyClass = `${ctcStyles.fieldInputHeight} ${isPartyToCase === "yes" ? ctcStyles.fieldDisabled : ctcStyles.fieldEnabled}`;
  // ─── Derived validity ───────────────────────────────────────────────────
  const canSearch = Boolean(selectedCourt && cnrNumber);
  const canProceed =
    isPhoneVerified &&
    Boolean(isPartyToCase) &&
    Boolean(name) &&
    (isPartyToCase === "no" || Boolean(designation));

  // ─── Save draft (create or update) then move to Step 2 ─────────────────
  const handleProceed = async () => {
    const payload: CtcApplication = {
      ...ctcApplication,
      tenantId,
      caseNumber: caseResult?.stNumber || caseResult?.cmpNumber || "",
      cnrNumber: caseResult?.cnrNumber || "",
      caseTitle: caseResult?.caseTitle || "",
      filingNumber: caseResult?.filingNumber || "",
      courtId: caseResult?.courtId || "",
      applicantName: name || "",
      mobileNumber: phoneNumber || "",
      isPartyToCase: isPartyToCase === "yes",
      partyDesignation: designation,
      workflow: { action: "SAVE_DRAFT" },
    };

    try {
      if (!authData) {
        showErrorToast?.("Missing authentication details.");
        return;
      }

      setIsSaving(true);
      onSaving?.(true);

      if (ctcApplication?.ctcApplicationNumber) {
        // Returning user — update existing draft
        payload.ctcApplicationNumber = ctcApplication?.ctcApplicationNumber;
        payload.id = ctcApplication?.id;
        await updateCtcApplication(payload, authData);
      } else {
        // First-time — create new draft
        const res = await createCtcApplication(payload, authData);
        if (res?.ctcApplication) onApplicationCreate?.(res.ctcApplication);
      }
    } catch (err) {
      console.error("SAVE_DRAFT failed:", err);
      showErrorToast?.("Failed to save draft. Please try again.");
      return; // Don't navigate on error
    } finally {
      setIsSaving(false);
      onSaving?.(false);
    }
  };

  // ─── Close dropdown when clicking outside ──────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        caseInputWrapperRef.current &&
        !caseInputWrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Debounced API call ─────────────────────────────────────────────────
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query || query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const params = new URLSearchParams({
          searchText: query.trim(),
          limit: "5",
          offset: "0",
          tenantId: tenantId,
          courtId: selectedCourt,
        });

        const response = await fetch(`/api/case/search?${params.toString()}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("API error");

        const data = await response.json();

        // Normalize: the API may return results under different keys
        const results: CaseSearchResult[] = data?.cases || [];

        setSuggestions(results);
        setShowSuggestions(results?.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [selectedCourt, tenantId],
  );

  // ─── Handle input change with debounce ─────────────────────────────────
  const handleCaseNumberChange = (value: string) => {
    const sanitized = value.toUpperCase().replace(/[^A-Z0-9/]/g, "");
    updateStep1({ caseNumber: sanitized });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, DEBOUNCE_MS);
  };

  // ─── Handle suggestion selection ────────────────────────────────────────
  const handleSelectSuggestion = (item: CaseSearchResult) => {
    updateStep1({
      cnrNumber: item?.cnrNumber,
      caseNumber:
        item?.courtCaseNumber || item?.cmpNumber || item?.filingNumber,
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={ctcStyles.card}>
      <div className="flex flex-col gap-6">
        {/* Info banner — shown before search */}
        {!hasSearched && (
          <div className={ctcStyles.infoBox}>
            {svgIcons.InfoIcon({ width: "40" })}
            <p className={ctcStyles.infoText}>{t(ctcText.step1.infoParty)}</p>
          </div>
        )}

        {/* Court + Case Number row */}
        <div className={ctcStyles.fieldRow}>
          <div className={`${ctcStyles.fieldHalf} relative`}>
            <CustomDropdown
              label={ctcText.step1.selectCourt}
              value={selectedCourt || ""}
              onChange={(v) => updateStep1({ selectedCourt: v })}
              options={
                courtOptions?.map((c) => ({
                  label: c?.name || "",
                  value: c?.code || "",
                })) || []
              }
              disabled={hasSearched}
              className={courtFieldClass}
            />
          </div>

          {/* ── CNR / Case Number with autocomplete ── */}
          <div
            className={`${ctcStyles.fieldHalf} relative`}
            ref={caseInputWrapperRef}
          >
            {/* Label */}
            <label className="mb-1 block text-lg font-roboto font-normal text-[#0A0A0A]">
              {t(ctcText.step1.caseNumber)}
            </label>

            {/* Input wrapper */}
            <div className="relative">
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => handleCaseNumberChange(e.target.value)}
                disabled={hasSearched}
                placeholder={t(ctcText.step1.caseNumberPlaceholder)}
                className={`block w-full px-3 py-2 font-roboto text-base border-[1.5px] border-[#3D3C3C] rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${caseFieldClass} ${hasSearched ? "bg-gray-100 cursor-not-allowed" : ""}`}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                autoComplete="off"
              />

              {/* Loading spinner */}
              {isLoadingSuggestions && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="animate-spin h-4 w-4 text-teal-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul
                className=" left-0 right-0 bg-white border border-gray-200 shadow-lg overflow-y-auto"
                style={{ maxHeight: "220px" }} /* ~5 items × ~44px each */
              >
                {suggestions?.map((item, idx) => (
                  <li
                    key={idx}
                    onMouseDown={(e) => {
                      // Use mousedown so it fires before the input's blur
                      e.preventDefault();
                      handleSelectSuggestion(item);
                    }}
                    className="px-4 py-2.5 cursor-pointer hover:bg-teal-50 border-b border-gray-100 last:border-0"
                  >
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item?.courtCaseNumber ||
                        item?.cmpNumber ||
                        item?.filingNumber}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Pre-search actions ── */}
        {!hasSearched ? (
          <>
            <div className={ctcStyles.divider} />
            <div className="flex justify-end gap-4 mb-2 font-[Inter] font-medium">
              <button
                onClick={clearStep1}
                className="px-8 py-2 text-lg rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white font-roboto font-medium"
              >
                {t(ctcText.step1.clear)}
              </button>
              <button
                onClick={() => onSearchCase(cnrNumber)}
                disabled={!canSearch || isSearching || hasSearched}
                className={`px-8 py-2 text-lg rounded-md border border-transparent shadow-sm text-white focus:outline-none font-roboto font-medium ${
                  canSearch && !isSearching
                    ? "bg-[#0F766E] hover:bg-teal-700"
                    : "bg-[#8E8E8E] cursor-not-allowed"
                }`}
              >
                {isSearching ? t("Searching...") : t(ctcText.step1.searchCase)}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Case summary */}
            <CaseSummaryRow t={t} caseResult={caseResult} />

            {/* Info banner — shown after search */}
            <div className={ctcStyles.infoBox}>
              {svgIcons.InfoIcon({ width: "40" })}
              <p className={ctcStyles.infoText}>{t(ctcText.step1.infoPhone)}</p>
            </div>

            {/* Phone number + Party dropdown row */}
            <div
              className={`flex flex-col lg:flex-row gap-6 lg:gap-8 w-full mt-2`}
            >
              {/* Phone always takes at most half the width */}
              <div className="flex flex-col w-full lg:w-1/2 min-w-0">
                <VerifyMobileNumber
                  phoneNumber={phoneNumber}
                  onPhoneNumberChange={(v) => updateStep1({ phoneNumber: v })}
                  isPhoneVerified={isPhoneVerified}
                  onVerified={() => updateStep1({ isPhoneVerified: true })}
                  tenantId={tenantId}
                  filingNumber={caseResult?.filingNumber || caseNumber || ""}
                  courtId={selectedCourt || ""}
                  showErrorToast={showErrorToast}
                  onValidateSuccess={(data) => {
                    updateStep1({
                      isPartyToCase: data?.isPartyToCase ? "yes" : "no",
                      name: data?.userName || "",
                      designation: data?.designation || "",
                    });
                  }}
                  onAuthDataReceived={onAuthDataReceived}
                />
              </div>

              {/* Party question appears on right once phone verified */}
              {isPhoneVerified && (
                <div className="flex flex-col w-full lg:w-1/2 min-w-0 relative">
                  <CustomDropdown
                    label={ctcText.step1.partyQuestion}
                    value={isPartyToCase}
                    onChange={(v) => updateStep1({ isPartyToCase: v })}
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                    className={isPartyClass}
                    disabled={true}
                  />
                </div>
              )}
            </div>

            {/* Name / Party fields */}
            {isPartyToCase && (
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
                <div
                  className={`flex flex-col ${
                    isPartyToCase === "yes"
                      ? "flex-1"
                      : "w-full md:w-[calc(50%-12px)]"
                  }`}
                >
                  <TextField
                    label={ctcText.step1.name}
                    value={name}
                    onChange={(v) => updateStep1({ name: v })}
                    className={ctcStyles.fieldInputHeight}
                    disabled={isPartyToCase === "yes"}
                  />
                </div>
                {isPartyToCase === "yes" && (
                  <div className="flex flex-col flex-1">
                    <TextField
                      label={ctcText.step1.party}
                      value={designation}
                      onChange={(v) => updateStep1({ designation: v })}
                      className={ctcStyles.fieldInputHeight}
                      disabled={isPartyToCase === "yes"}
                    />
                  </div>
                )}
              </div>
            )}

            <FormActions
              secondaryLabel={ctcText.step1.clear}
              onSecondary={clearStep1}
              primaryLabel={
                isSaving ? "Saving..." : ctcText.step1.verifyProceed
              }
              onPrimary={handleProceed}
              primaryDisabled={!canProceed || isSaving}
              primaryVariant="proceed"
              isSecondaryDisabled={
                !!ctcApplication?.ctcApplicationNumber || isSaving
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Step1CaseDetails;
