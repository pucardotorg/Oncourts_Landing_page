import React, { useRef, useState } from "react";
import SelectDocumentsModal from "../SelectDocumentsModal";
import CaseSummaryRow from "../CaseSummaryRow";
import FormActions from "../FormActions";
import { ctcStyles, ctcText } from "../../../styles/certifiedCopyStyles";
import type {
  CaseResult,
  Step2State,
  CaseBundleNode,
  CtcApplication,
  AuthData,
} from "../../../types";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";
import { svgIcons } from "../../../data/svgIcons";
import { updateCtcApplication } from "../../../services/ctcService";

interface Step2DocumentDetailsProps {
  isParty: boolean;
  step2: Step2State;
  updateStep2: (patch: Partial<Step2State>) => void;
  onNext: () => void;
  onBack: () => void;
  ctcApplication?: CtcApplication | null;
  onApplicationUpdate?: (app: CtcApplication) => void;
  tenantId: string;
  showErrorToast?: (message: string) => void;
  caseResult?: CaseResult | null;
  authData?: AuthData | null;
  bundleNodes: CaseBundleNode[];
  onSaving?: (saving: boolean) => void;
}

const Step2DocumentDetails: React.FC<Step2DocumentDetailsProps> = ({
  isParty,
  step2,
  updateStep2,
  onNext,
  onBack,
  ctcApplication,
  onApplicationUpdate,
  tenantId,
  showErrorToast,
  caseResult,
  authData,
  bundleNodes,
  onSaving,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useSafeTranslation();
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { uploadedFileName, selectedDocuments } = step2;

  // Helper to localize title with a number suffix (e.g. "VAKALATNAMA_HEADING 1" -> "Vakalat 1")
  const localizeTitle = (title: string): string => {
    const match = title.trim().match(/^(.*?)\s+(\d+)$/);
    if (match) {
      const baseTitle = match[1];
      const number = match[2];
      return `${t(baseTitle)} ${number}`;
    }
    return t(title);
  };

  /** Resolve a node ID back to its display title from the bundle tree */
  const getTitleById = (id: string, nodes: CaseBundleNode[]): string => {
    for (const node of nodes) {
      if (node?.id === id) return node?.title;
      if (node?.children) {
        const found = getTitleById(id, node?.children);
        if (found) return found;
      }
    }
    return id;
  };

  /** Recursively builds a new tree containing ONLY the selected node IDs and their direct parental path */
  const filterBundleNodesBySelection = (
    nodes: CaseBundleNode[],
    selectedIds: string[],
  ): CaseBundleNode[] => {
    const result: CaseBundleNode[] = [];

    for (const node of nodes) {
      if (selectedIds.includes(node.id)) {
        // If this exact node is selected, include it (without checking children to match exact leaf)
        result.push({ ...node, children: node.children ? [] : undefined });
      } else if (node.children) {
        // If not selected, check if any of its descendants are selected
        const filteredChildren = filterBundleNodesBySelection(
          node.children,
          selectedIds,
        );
        if (filteredChildren.length > 0) {
          // Keep the parental structural node but only with the pruned descendants
          result.push({ ...node, children: filteredChildren });
        }
      }
    }

    return result;
  };

  const canProceed =
    (isParty || Boolean(uploadedFileName)) && selectedDocuments?.length > 0;

  const removeDocument = (doc: string) =>
    updateStep2({
      selectedDocuments: selectedDocuments?.filter((d) => d !== doc),
    });

  /** Call _update with SAVE_DRAFT action, then navigate to Step 3 */
  const handleNext = async () => {
    if (isSaving) return; // prevent double-click
    if (ctcApplication?.ctcApplicationNumber && authData) {
      try {
        setIsSaving(true);
        onSaving?.(true);
        const res = await updateCtcApplication(
          {
            ...ctcApplication,
            tenantId,
            ctcApplicationNumber: ctcApplication?.ctcApplicationNumber,
            selectedCaseBundle: filterBundleNodesBySelection(
              bundleNodes,
              selectedDocuments || [],
            ) as CtcApplication["selectedCaseBundle"],
            workflow: { action: "SAVE_DRAFT" },
          },
          authData,
        );
        if (res?.ctcApplication) {
          onApplicationUpdate?.(res?.ctcApplication);
        }
      } catch (err) {
        console.error("SAVE_DRAFT failed:", err);
        showErrorToast?.("Failed to save application. Please try again.");
        return; // Don't navigate on error
      } finally {
        setIsSaving(false);
        onSaving?.(false);
      }
    }
    onNext();
  };

  return (
    <>
      <SelectDocumentsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={(docs) => {
          updateStep2({ selectedDocuments: docs });
          setShowModal(false);
        }}
        initialSelected={selectedDocuments}
        documents={bundleNodes}
        isParty={isParty}
        tenantId={tenantId}
        authData={authData}
      />

      <div className={ctcStyles.card}>
        <div className="flex flex-col gap-8">
          <CaseSummaryRow t={t} caseResult={caseResult} />
          {/* ── Two-column layout ─────────────────────────────────────────────── */}
          <div
            className={
              !isParty
                ? "grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 w-full"
                : "w-full"
            }
          >
            {/* ── Upload label  (mobile: order 1 | desktop: col-1 row-1) ── */}
            {!isParty && (
              <label
                className={`${ctcStyles.label} mb-1 order-1 md:order-none`}
              >
                {t(ctcText.step2.uploadLabel)}
              </label>
            )}

            {/* ── Select label  (mobile: order 3 | desktop: col-2 row-1) ── */}
            <label
              className={`${ctcStyles.label} mb-1 ${
                !isParty ? "order-3 md:order-none" : ""
              }`}
            >
              {t(ctcText.step2.docSelectLabel)}
            </label>

            {/* ── Upload input  (mobile: order 2 | desktop: col-1 row-2) ── */}
            {!isParty && (
              <div className="flex flex-col gap-1 order-2 md:order-none">
                <div className="flex items-center gap-3">
                  <div
                    className={`${ctcStyles.fileDisplayBox} ${
                      uploadedFileName ? "text-[#231F20]" : "text-[#BBBBBD]"
                    }`}
                  >
                    <span className="truncate">
                      {uploadedFileName || t(ctcText.step2.noFileSelected)}
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".txt,.doc,.pdf,.docx"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        updateStep2({
                          uploadedFileName: e.target.files[0].name,
                        });
                      }
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={ctcStyles.fileButton}
                  >
                    {svgIcons.UploadIcon()}
                    {uploadedFileName
                      ? t(ctcText.step2.reUpload)
                      : t(ctcText.step2.upload)}
                  </button>
                </div>
                <p className={ctcStyles.fileHint}>
                  {t(ctcText.step2.fileHint)}
                </p>
              </div>
            )}

            {/* ── Select input  (mobile: order 4 | desktop: col-2 row-2) ── */}
            <div
              className={`flex flex-col gap-1 ${
                !isParty ? "order-4 md:order-none" : "w-full max-w-2xl"
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`${ctcStyles.fileDisplayBox} text-[#0F172A]`}>
                  <span className="truncate">
                    {selectedDocuments?.length > 0
                      ? t(`${selectedDocuments?.length} documents selected`)
                      : t(ctcText?.step2?.noDocsSelected)}
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className={ctcStyles.fileButton}
                >
                  {svgIcons.SelectAddIcon()}
                  {t(ctcText.step2.select)}
                </button>
              </div>

              {/* Document tags */}
              {selectedDocuments?.length > 0 && (
                <div className={ctcStyles?.docTagGrid}>
                  {selectedDocuments?.map((doc) => (
                    <div
                      key={doc}
                      className={ctcStyles.docTag}
                      title={localizeTitle(getTitleById(doc, bundleNodes))}
                    >
                      <span className={ctcStyles.docTagText}>
                        {localizeTitle(getTitleById(doc, bundleNodes))}
                      </span>
                      <button
                        onClick={() => removeDocument(doc)}
                        className={ctcStyles.docTagRemove}
                      >
                        {svgIcons.OtpCloseIcon()}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom action buttons */}
          <FormActions
            secondaryLabel={ctcText.step2.goBack}
            onSecondary={onBack}
            primaryLabel={isSaving ? "Saving..." : ctcText.step2.next}
            onPrimary={handleNext}
            primaryDisabled={!canProceed || isSaving}
            isSecondaryDisabled={isSaving}
            primaryVariant="next"
          />
        </div>
      </div>
    </>
  );
};

export default Step2DocumentDetails;
