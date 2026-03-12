import React from "react";
import BaseModal from "./BaseModal";
import { CtcApplication } from "../../types";
import DocViewWrapper from "./DocViewWrapper";
import { ctcText } from "../../styles/certifiedCopyStyles";

export interface TopInfoItem {
  label: string;
  value: React.ReactNode;
}

export interface FooterButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

interface ViewApplicationModalProps {
  t: (key: string) => string;
  isOpen: boolean;
  onClose: () => void;
  application: CtcApplication | null;
  topInfoColumns?: TopInfoItem[][];
  footerButtons?: FooterButton[];
  modalTitle: string;
  fileStoreId?: string;
  tenantId?: string;
  authToken?: string;
}

const ViewApplicationModal: React.FC<ViewApplicationModalProps> = ({
  t,
  isOpen,
  onClose,
  application,
  topInfoColumns,
  footerButtons,
  modalTitle,
  fileStoreId,
  tenantId,
  authToken,
}) => {
  if (!isOpen || !application) return null;

  const footer =
    footerButtons && footerButtons.length > 0 ? (
      <>
        {footerButtons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.onClick}
            disabled={btn.disabled}
            className={`px-6 py-2 rounded text-sm font-medium ${
              btn.variant === "primary"
                ? "bg-[#0F766E] text-white hover:bg-teal-700"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
            } ${btn.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {btn.label}
          </button>
        ))}
      </>
    ) : null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      maxWidth="max-w-[70%]"
      footer={footer}
    >
      <div className="flex flex-col p-6 bg-white h-[70vh] max-h-[70vh] overflow-hidden">
        {/* Top Info Cards */}
        {topInfoColumns && topInfoColumns?.length > 0 && (
          <div className="bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg p-5 mb-4 shrink-0 overflow-y-auto max-h-[40%]">
            <div
              className={`grid grid-cols-1 md:grid-cols-${Math.min(topInfoColumns.length, 4)} gap-6`}
            >
              {topInfoColumns.map((col, colIdx) => (
                <div
                  key={colIdx}
                  className={`flex flex-col ${
                    colIdx < topInfoColumns.length - 1
                      ? "border-r border-[#E0E0E0] md:pr-4"
                      : ""
                  }`}
                >
                  {col.map((item, itemIdx) => (
                    <React.Fragment key={itemIdx}>
                      <span className="text-[#64748B] text-lg mb-1">
                        {item.label}
                      </span>
                      <span className="text-[#0F172A] text-xl font-semibold">
                        {item.value}
                      </span>
                      {itemIdx < col.length - 1 && <div className="h-4"></div>}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejection Reason */}
        {application.status === "REJECTED" && application.judgeComments && (
          <div className="mb-4 p-4 rounded-md border border-red-200 bg-red-50 shrink-0">
            <h3 className="text-red-800 text-lg font-semibold mb-1">
              {t(ctcText.viewStatus.rejectionReason)}
            </h3>
            <p className="text-red-700 text-lg whitespace-pre-wrap">
              {application.judgeComments}
            </p>
          </div>
        )}

        {/* Handle Document Viewing */}
        {fileStoreId && (
          <div className="flex-1 overflow-hidden rounded-md border border-[#E0E0E0]">
            <DocViewWrapper
              fileStoreId={fileStoreId}
              tenantId={tenantId}
              authToken={authToken}
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ViewApplicationModal;
