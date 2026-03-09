import React from "react";
import BaseModal from "./BaseModal";
import { ctcStyles } from "../../styles/certifiedCopyStyles";
import { CtcApplication } from "../../types";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import DocViewWrapper from "./DocViewWrapper";

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
    isOpen: boolean;
    onClose: () => void;
    application: CtcApplication | null;
    topInfoColumns?: TopInfoItem[][];
    footerButtons?: FooterButton[];
    modalTitle?: string;
    fileStoreId?: string;
    tenantId?: string;
    authToken?: string;
}

const ViewApplicationModal: React.FC<ViewApplicationModalProps> = ({
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
    const { t } = useSafeTranslation();
    if (!isOpen || !application) return null;

    // Format the application date for the centered text and filing date fallback if needed
    let formattedDate = "-";
    if (application?.auditDetails?.createdTime) {
        formattedDate = new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(application.auditDetails.createdTime)).replace(/\//g, "-");
    }

    const footer = footerButtons && footerButtons.length > 0 ? (
        <>
            {footerButtons.map((btn, index) => (
                <button
                    key={index}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    className={`px-6 py-2 rounded text-sm font-medium ${btn.variant === "primary"
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
            title={modalTitle || t("VIEW_APPLICATION")}
            maxWidth="max-w-[800px]"
            footer={footer}
        >
            <div className="p-6 bg-white overflow-y-auto max-h-[70vh]">
                {/* Top Info Cards */}
                {topInfoColumns && topInfoColumns?.length > 0 && (
                    <div className="bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg p-5 mb-8">
                        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(topInfoColumns.length, 4)} gap-6`}>
                            {topInfoColumns.map((col, colIdx) => (
                                <div
                                    key={colIdx}
                                    className={`flex flex-col ${colIdx < topInfoColumns.length - 1 ? "border-r border-[#E0E0E0] md:pr-4" : ""
                                        }`}
                                >
                                    {col.map((item, itemIdx) => (
                                        <React.Fragment key={itemIdx}>
                                            <span className="text-[#888888] text-xs font-semibold mb-1 uppercase">
                                                {item.label}
                                            </span>
                                            <span className="text-[#333333] text-[15px] font-bold">
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

                {/* Handle Document Viewing */}
                {fileStoreId && (
                    <div className="mt-4">
                        <DocViewWrapper fileStoreId={fileStoreId} tenantId={tenantId} authToken={authToken} />
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default ViewApplicationModal;
