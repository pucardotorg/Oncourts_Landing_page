import React, { useState } from "react";
import { useRouter } from "next/router";
import AddSignatureModal from "../AddSignatureModal";
import PaymentModal from "../PaymentModal";
import SuccessModal from "../SuccessModal";
import CaseSummaryRow from "../CaseSummaryRow";
import type { CaseResult } from "../../../types/case/models";
import FormActions from "../FormActions";
import { ctcStyles, ctcText } from "../../../styles/certifiedCopyStyles";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";
import useOpenApiPaymentProcess from "../../../hooks/useOpenApiPaymentProcess";
import { fetchBillFileStoreId } from "../../../services/openApiPaymentService";
import { updateCtcApplication } from "../../../services/ctcService";
import type { CtcApplication } from "../../../types";

interface Step3PreviewAndSignProps {
  onBack: () => void;
  ctcApplication?: CtcApplication | null;
  applicationNumber?: string;
  onApplicationUpdate?: (app: CtcApplication) => void;
  tenantId: string;
  showErrorToast?: (message: string) => void;
  caseResult?: CaseResult | null;
}

const Step3PreviewAndSign: React.FC<Step3PreviewAndSignProps> = ({
  onBack,
  ctcApplication,
  applicationNumber,
  onApplicationUpdate,
  tenantId,
  showErrorToast,
  caseResult,
}) => {
  const router = useRouter();
  const { t } = useSafeTranslation();

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isApplicationSigned, setIsApplicationSigned] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ─── Payment hook ─────────────────────────────────────────────────────
  const {
    fetchBill,
    openPaymentPortal,
    paymentLoader,
    showPaymentModal,
    setShowPaymentModal,
  } = useOpenApiPaymentProcess({
    tenantId,
    consumerCode: applicationNumber || "KL-000619-2026-AP2_APPL_FILING",
    service: "application-voluntary-submission",
  });

  const handleMakePayment = async () => {
    try {
      const bill = await fetchBill();

      // No pending bill — skip payment
      if (!bill?.Bill?.length) {
        setShowPaymentModal(false);
        setShowSuccessModal(true);
        return;
      }

      const paymentStatus = await openPaymentPortal(bill);

      if (paymentStatus) {
        // Fetch receipt file-store ID after successful payment
        try {
          const receipt = await fetchBillFileStoreId({
            billId: bill?.Bill?.[0]?.id as string,
            tenantId,
          });
          const fileStoreId = receipt?.Document?.fileStore;
          if (fileStoreId) {
            console.log("Receipt fileStoreId:", fileStoreId);
            // TODO: store fileStoreId for download if needed
          }
        } catch (err) {
          console.error("Failed to fetch payment receipt:", err);
        }

        setShowPaymentModal(false);
        setShowSuccessModal(true);
      } else {
        console.error("Payment was not completed.");
      }
    } catch (err) {
      console.error("Payment flow error:", err);
    }
  };

  /** Go back — call _update with EDIT action to revert to DRAFT_IN_PROGRESS */
  const handleGoBack = async () => {
    if (applicationNumber && ctcApplication) {
      try {
        const res = await updateCtcApplication({
          ...ctcApplication,
          tenantId,
          ctcApplicationNumber: applicationNumber,
          workflow: { action: "EDIT" },
        });
        if (res?.ctcApplication) {
          onApplicationUpdate?.(res?.ctcApplication);
        }
      } catch (err) {
        console.error("EDIT action failed:", err);
        showErrorToast?.("Failed to go back. Please try again.");
        return; // Don't navigate on error
      }
    }
    onBack();
  };

  const handleOpenSignature = () => {
    setIsApplicationSigned(false);
    setShowSignatureModal(true);
  };

  return (
    <>
      <div className={ctcStyles.card}>
        <div className="flex flex-col gap-6">
          <CaseSummaryRow t={t} caseResult={caseResult} />

          {/* Scrollable on mobile */}
          <div className="overflow-x-auto">
            <div className="flex flex-col gap-8 text-center text-[#1E293B] font-medium text-[16px] px-2 sm:px-8 mt-2 min-w-[320px]">
              <p className="font-bold leading-relaxed text-[17px]">
                Before The Special Court Of Judicial Magistrate of the First
                Class, for the trial of cases under
                <br />
                section 138 of NIA Act, 1881 at Kollam (&quot;24X7 ON
                Court&quot;)
              </p>

              <div className="w-full border-t border-l border-r border-[#1E293B] mt-4 flex flex-col text-[15px]">
                <div className="grid grid-cols-[1fr_2fr] border-b border-[#1E293B]">
                  <div className="p-4 border-r border-[#1E293B] text-left bg-[#F8FAFC]">
                    Complainant 1
                  </div>
                  <div className="p-4 text-left">Ravi Kumar</div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] border-b border-[#1E293B]">
                  <div className="p-4 border-r border-[#1E293B] text-left bg-[#F8FAFC] flex items-center">
                    Advocate
                  </div>
                  <div className="p-4 text-left">Suresh TN</div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] border-b border-[#1E293B] h-12 bg-white">
                  <div className="border-r border-[#1E293B] h-full bg-[#F8FAFC]"></div>
                  <div></div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] border-b border-[#1E293B]">
                  <div className="p-4 border-r border-[#1E293B] text-left bg-[#F8FAFC]">
                    Accused 1
                  </div>
                  <div className="p-4 text-left">Nithish J</div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] border-b border-[#1E293B]">
                  <div className="p-4 border-r border-[#1E293B] text-left bg-[#F8FAFC] flex items-center">
                    Advocate
                  </div>
                  <div className="p-4 text-left">Praveen Kumar</div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] border-b border-[#1E293B] h-12 bg-white">
                  <div className="border-r border-[#1E293B] h-full bg-[#F8FAFC]"></div>
                  <div></div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] border-b border-[#1E293B]">
                  <div className="p-4 border-r border-[#1E293B] text-left bg-[#F8FAFC] flex items-center">
                    Offence
                  </div>
                  <div className="p-4 text-left">
                    S. 138 of the Negotiable Instruments Act, 1881
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FormActions
            secondaryLabel={ctcText.step3.goBack}
            onSecondary={handleGoBack}
            primaryLabel={ctcText.step3.eSign}
            onPrimary={handleOpenSignature}
            primaryVariant="proceed"
          />
        </div>
      </div>

      <AddSignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        isSigned={isApplicationSigned}
        onSign={() => setIsApplicationSigned(true)}
        onProceed={() => {
          setShowSignatureModal(false);
          setShowPaymentModal(true);
        }}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSkip={() => {
          setShowPaymentModal(false);
          router.push("/certified-true-copies");
        }}
        onMakePayment={handleMakePayment}
        paymentLoader={paymentLoader}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onViewStatus={() => {
          setShowSuccessModal(false);
          router.push("/certified-true-copies");
        }}
      />
    </>
  );
};

export default Step3PreviewAndSign;
