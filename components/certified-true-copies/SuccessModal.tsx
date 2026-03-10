import React, { useState, useEffect } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";

interface SuccessModalProps {
  isOpen: boolean;
  applicationNumber: string;
  onClose: () => void;
  onViewStatus: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  applicationNumber,
  onClose,
  onViewStatus,
}) => {
  const { t } = useSafeTranslation();
  const [copied, setCopied] = useState(false);

  // Lock background scroll when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(applicationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className={ctcStyles.successOverlay} style={{ zIndex: 9999 }}>
      {/* Modal Container */}
      <div className={ctcStyles.successModalCard}>
        {/* Banner + Details grouped together seamlessly */}
        <div className={ctcStyles.successBody}>
          {/* Green success banner */}
          <div className={ctcStyles.successBanner}>
            <h2 className={ctcStyles.successBannerTitle}>
              {t(ctcText.success.banner)}
            </h2>
            <div className={ctcStyles.successCheckCircle}>
              {svgIcons.CheckIcon()}
            </div>
          </div>

          {/* Detail Block */}
          <div className={ctcStyles.successDetailCard}>
            <div className={ctcStyles.successDetailRow}>
              <span className={ctcStyles.successDetailLabel}>
                {t(ctcText.success.submissionDate)}
              </span>
              <span className={ctcStyles.successDetailValue}>
                {t(ctcText.success.submissionDateValue)}
              </span>
            </div>
            <div className={ctcStyles.successDetailRow}>
              <span className={ctcStyles.successDetailLabel}>
                {t(ctcText.success.submissionId)}
              </span>
              <div className={ctcStyles.successDetailValue}>
                {applicationNumber}
                <button
                  onClick={handleCopy}
                  className={ctcStyles.successCopyBtn}
                >
                  {svgIcons.CopyIcon()}
                  {copied ? t(ctcText.success.copied) : t(ctcText.success.copy)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons equal width row */}
        <div className={ctcStyles.successBtnRow}>
          <button className={ctcStyles.successBtnOutline}>
            {svgIcons.DownloadSuccessIcon()}
            {t(ctcText.success.download)}
          </button>
          <button onClick={onClose} className={ctcStyles.successBtnFill}>
            {t(ctcText.success.close)}
          </button>
          <button onClick={onViewStatus} className={ctcStyles.successBtnFill}>
            {t(ctcText.success.viewStatus)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
