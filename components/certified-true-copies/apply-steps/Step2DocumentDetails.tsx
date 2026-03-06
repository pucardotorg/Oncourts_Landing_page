import React, { useRef, useEffect, useState } from "react";
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
import { updateCtcApplication, previewDoc } from "../../../services/ctcService";

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
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useSafeTranslation();
  const [showModal, setShowModal] = useState(false);
  const [bundleNodes, setBundleNodes] = useState<CaseBundleNode[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  const { uploadedFileName, selectedDocuments } = step2;

  // Fetch document tree from preview API on mount
  // useEffect(() => {
  //   const fetchDocTree = async () => {
  //     const filingNumber = ctcApplication?.filingNumber;
  //     const courtId = ctcApplication?.courtId;
  //     if (!filingNumber || !courtId) {
  //       if (ctcApplication?.caseBundleNodes?.length) {
  //         setBundleNodes(ctcApplication?.caseBundleNodes as CaseBundleNode[]);
  //       }
  //       return;
  //     }
  //     if (!authData) {
  //       showErrorToast?.("Missing authentication details.");
  //       return;
  //     }
  //     try {
  //       setIsLoadingDocs(true);
  //       const res = await previewDoc(
  //         {
  //           filingNumber,
  //           courtId,
  //           ctcApplicationNumber: applicationNumber || undefined,
  //         },
  //         authData,
  //       );
  //       if (res?.caseBundleNodes?.length) {
  //         setBundleNodes(res?.caseBundleNodes as CaseBundleNode[]);
  //       } else if (ctcApplication?.caseBundleNodes?.length) {
  //         setBundleNodes(ctcApplication?.caseBundleNodes as CaseBundleNode[]);
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch document tree:", err);
  //       showErrorToast?.("Failed to load documents. Please try again.");
  //       if (ctcApplication?.caseBundleNodes?.length) {
  //         setBundleNodes(ctcApplication?.caseBundleNodes as CaseBundleNode[]);
  //       }
  //     } finally {
  //       setIsLoadingDocs(false);
  //     }
  //   };
  //   fetchDocTree();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ctcApplication?.filingNumber, ctcApplication?.courtId]);

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

  const canProceed =
    (isParty || Boolean(uploadedFileName)) && selectedDocuments?.length > 0;

  const removeDocument = (doc: string) =>
    updateStep2({
      selectedDocuments: selectedDocuments?.filter((d) => d !== doc),
    });

  /** Call _update with SUBMIT action, then navigate to Step 3 */
  const handleNext = async () => {
    if (ctcApplication?.ctcApplicationNumber && authData) {
      try {
        const res = await updateCtcApplication(
          {
            ...ctcApplication,
            tenantId,
            ctcApplicationNumber: ctcApplication?.ctcApplicationNumber,
            caseBundleNodes: bundleNodes as CtcApplication["caseBundleNodes"],
            workflow: { action: "SUBMIT" },
          },
          authData,
        );
        if (res?.ctcApplication) {
          onApplicationUpdate?.(res?.ctcApplication);
        }
      } catch (err) {
        console.error("SUBMIT failed:", err);
        showErrorToast?.("Failed to submit application. Please try again.");
        return; // Don't navigate on error
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
      />

      <div className={ctcStyles.card}>
        <div className="flex flex-col gap-8">
          <CaseSummaryRow t={t} caseResult={caseResult} />

          {isLoadingDocs && (
            <p className="text-sm text-gray-500 animate-pulse">
              Loading documents…
            </p>
          )}

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
                      title={getTitleById(doc, bundleNodes)}
                    >
                      <span className={ctcStyles.docTagText}>
                        {getTitleById(doc, bundleNodes)}
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
            primaryLabel={ctcText.step2.next}
            onPrimary={handleNext}
            primaryDisabled={!canProceed}
            primaryVariant="next"
          />
        </div>
      </div>
    </>
  );
};

export default Step2DocumentDetails;
