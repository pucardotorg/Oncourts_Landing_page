import React, { useRef, useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import useESignOpenApi from "../../hooks/useESignOpenApi";
import { svgIcons } from "../../data/svgIcons";
import BaseModal from "./BaseModal";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";

interface AddSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSigned: boolean;
  onSign: () => void;
  onProceed: () => void;
  /** fileStoreId of the document to be e-signed via Aadhar */
  fileStoreId?: string;
  /** Page module identifier sent to the eSign API (e.g. "CTC") */
  pageModule?: string;
}

const AddSignatureModal: React.FC<AddSignatureModalProps> = ({
  isOpen,
  onClose,
  isSigned,
  onSign,
  onProceed,
  fileStoreId = "3c8c125e-2610-4295-bca1-ea2e69fc23b5",
  pageModule = "ci",
}) => {
  const { t } = useSafeTranslation();
  const { handleEsign } = useESignOpenApi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isESignLoading, setIsESignLoading] = useState(false);
  const [eSignError, setESignError] = useState("");

  const handleAadharESign = async () => {
    setIsESignLoading(true);
    setESignError("");
    try {
      const redirected = await handleEsign(
        "Signature",
        pageModule,
        fileStoreId,
        "Signature",
      );
      // redirected = true → page will redirect to CDAC portal; we do nothing
      // redirected = false → API failed or no form data returned
      if (!redirected) {
        setESignError("e-Sign request failed. Please try again.");
      }
      // Do NOT call onSign() here. After the user completes signing on the
      // CDAC portal, they're redirected back and checkSignStatus() marks them
      // as signed.
    } catch {
      setESignError("Something went wrong. Please try again.");
    } finally {
      setIsESignLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onSign();
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        disabled={isESignLoading}
        className={ctcStyles.sigFooterBtnBack}
      >
        {t(ctcText.addSig.backBtn)}
      </button>
      <button
        onClick={onProceed}
        disabled={!isSigned || isESignLoading}
        className={`${ctcStyles.sigFooterBtnProceed} ${
          isSigned && !isESignLoading
            ? ctcStyles.sigFooterBtnProceedActive
            : ctcStyles.sigFooterBtnProceedDisabled
        }`}
      >
        {t(ctcText.addSig.proceedBtn)}
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t(ctcText.addSig.title)}
      footer={footer}
    >
      <div className={ctcStyles.sigModalBody}>
        {/* Label + Signed badge on the same row */}
        <div className="flex items-center gap-4 mb-4">
          <label className={ctcStyles.sigModalLabel}>
            {t(ctcText.addSig.yourSignature)}
          </label>
          {isSigned && (
            <div className={ctcStyles.sigBadgeSigned}>
              {t(ctcText.addSig.signedBadge)}
            </div>
          )}
        </div>

        {!isSigned && (
          <div className="flex flex-col gap-3">
            <div className={ctcStyles.sigActionRow}>
              {/* E-Sign with Aadhar button — shows spinner while loading */}
              <button
                onClick={handleAadharESign}
                disabled={isESignLoading}
                className={`${ctcStyles.sigEsignBtn} ${
                  isESignLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isESignLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-teal-700"
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
                    {t("Processing…")}
                  </span>
                ) : (
                  t(ctcText.addSig.eSignBtn)
                )}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isESignLoading}
                className={`${ctcStyles.sigUploadLink} ${
                  isESignLoading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {svgIcons.UploadIcon()}
                {t(ctcText.addSig.uploadLink)}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </div>

            {/* Error message */}
            {eSignError && (
              <p className="text-red-600 text-xs font-medium mt-1">
                {eSignError}
              </p>
            )}

            <p className={ctcStyles.sigDownloadHint}>
              {t(ctcText.addSig.downloadHint)}{" "}
              <a href="#" className={ctcStyles.sigDownloadLink}>
                {t(ctcText.addSig.downloadLinkText)}
              </a>
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default AddSignatureModal;
