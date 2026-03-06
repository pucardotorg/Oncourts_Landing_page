import React from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import BaseModal from "./BaseModal";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onMakePayment: () => void;
  paymentLoader?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSkip,
  onMakePayment,
  paymentLoader = false,
}) => {
  const { t } = useSafeTranslation();

  const footer = (
    <>
      <button onClick={onSkip} className={ctcStyles.payBtnSkip}>
        {t(ctcText.payment.skip)}
      </button>
      <button
        onClick={onMakePayment}
        disabled={paymentLoader}
        className={`${ctcStyles.payBtnPay} ${paymentLoader ? "opacity-70 cursor-wait" : ""}`}
      >
        {paymentLoader ? "Processing..." : t(ctcText.payment.makePayment)}
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t(ctcText.payment.title)}
      footer={footer}
    >
      <div className={ctcStyles.payBody}>
        {/* Info banner */}
        <div className={ctcStyles.payInfoBanner}>
          <div className={ctcStyles.payInfoIconWrap}>
            {svgIcons.InfoIcon({ width: "25" })}
          </div>
          <div className={ctcStyles.payInfoText}>
            {t(ctcText.payment.infoBanner)}
          </div>
        </div>

        {/* Fee breakdown */}
        <div className={ctcStyles.payFeeList}>
          <div className={ctcStyles.payFeeRow}>
            <span>{t(ctcText.payment.amountDue)}</span>
            <span className={ctcStyles.payFeeValue}>
              {t(ctcText.payment.amountDueValue)}
            </span>
          </div>
          <div className={ctcStyles.payFeeRow}>
            <span>{t(ctcText.payment.courtFees)}</span>
            <span className={ctcStyles.payFeeValue}>
              {t(ctcText.payment.courtFeesValue)}
            </span>
          </div>
          <div className={ctcStyles.payFeeRow}>
            <span>{t(ctcText.payment.advocateFees)}</span>
            <span className={ctcStyles.payFeeValue}>
              {t(ctcText.payment.advocateFeesValue)}
            </span>
          </div>

          <div className={ctcStyles.payDivider} />

          <div className={ctcStyles.payTotalRow}>
            <span>{t(ctcText.payment.totalFees)}</span>
            <span>{t(ctcText.payment.totalFeesValue)}</span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default PaymentModal;
