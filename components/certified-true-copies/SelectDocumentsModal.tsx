import React, { useState, useEffect } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";
import type { CaseBundleNode } from "../../types";

interface SelectDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Returns the selected node IDs */
  onSelect: (selectedDocs: string[]) => void;
  initialSelected?: string[];
  /** CaseBundleNode list from the API response */
  documents: CaseBundleNode[];
}

// ─── Component ───────────────────────────────────────────────────────────────

const SelectDocumentsModal: React.FC<SelectDocumentsModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialSelected = [],
  documents,
}) => {
  const { t } = useSafeTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [selectedDocs, setSelectedDocs] = useState<string[]>(initialSelected);

  // Sync internal state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDocs(initialSelected);

      // Auto-expand the first section by default
      const initial: Record<string, boolean> = {};
      documents?.forEach((node, i) => {
        if (node?.children && node?.children?.length > 0) {
          initial[node.id] = i === 0;
        }
      });
      setExpandedSections(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSection = (id: string) =>
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleDocSelection = (id: string) =>
    setSelectedDocs((prev) =>
      prev?.includes(id)
        ? prev?.filter((d) => d !== id)
        : [...(prev || []), id],
    );

  const handleSelect = () => {
    onSelect(selectedDocs);
    onClose();
  };

  // Filter helper — checks if a title matches the search query
  const matchesSearch = (title: string) =>
    title.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className={ctcStyles.modalOverlay}>
      <div className={ctcStyles.modalContainer}>
        {/* Header */}
        <div className={ctcStyles.modalHeader}>
          <h2 className={ctcStyles.modalHeaderTitle}>
            {t(ctcText.selectDocModal.title)}
          </h2>
          <button onClick={onClose} className={ctcStyles.modalCloseBtn}>
            {svgIcons.OtpCloseIcon()}
          </button>
        </div>

        {/* Body */}
        <div className={ctcStyles.modalBody}>
          {/* Left Sidebar */}
          <div className={ctcStyles.modalSidebar}>
            <div className={ctcStyles.modalSidebarHeader}>
              <h3 className={ctcStyles.modalSidebarTitle}>
                {t(ctcText.selectDocModal.sidebarTitle)}
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t(ctcText.selectDocModal.searchPlaceholder)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={ctcStyles.modalSearchInput}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-[20px] h-[20px] text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </div>

            <div className={ctcStyles.modalDocList}>
              {documents?.map((node, index) => {
                const hasChildren =
                  node?.children && node?.children?.length > 0;

                if (hasChildren) {
                  // ── Section with selectable children ──────────────
                  const filteredChildren =
                    node?.children?.filter((child) =>
                      matchesSearch(child?.title),
                    ) || [];

                  // Hide entire section if no children match search
                  if (searchQuery && filteredChildren?.length === 0)
                    return null;

                  return (
                    <div key={node.id} className={ctcStyles.modalSection}>
                      <button
                        onClick={() => toggleSection(node.id)}
                        className={ctcStyles.modalSectionBtn}
                      >
                        <span className={ctcStyles.modalSectionTitle}>
                          {`${index + 1}. ${node?.title}`}
                        </span>
                        {expandedSections[node.id]
                          ? svgIcons.UpArrowIcon({
                              fill: "#0F172A",
                              width: "20px",
                            })
                          : svgIcons.DownArrowIcon({
                              fill: "#0F172A",
                              width: "20px",
                            })}
                      </button>

                      {expandedSections[node.id] && (
                        <div className={ctcStyles.modalDocItems}>
                          {filteredChildren?.map((child) => (
                            <label
                              key={child?.id}
                              className={ctcStyles.modalDocLabel}
                            >
                              <input
                                type="checkbox"
                                checked={selectedDocs?.includes(child?.id)}
                                onChange={() => toggleDocSelection(child?.id)}
                                className={ctcStyles.modalDocCheckbox}
                              />
                              <span className={ctcStyles.modalDocText}>
                                {child?.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // ── Leaf node (no children) — render like a section ────
                if (searchQuery && !matchesSearch(node?.title)) return null;

                return (
                  <div key={node.id} className={ctcStyles.modalSection}>
                    <button
                      onClick={() => toggleSection(node.id)}
                      className={ctcStyles.modalSectionBtn}
                    >
                      <span className={ctcStyles.modalSectionTitle}>
                        {`${index + 1}. ${node?.title}`}
                      </span>
                      {expandedSections[node.id]
                        ? svgIcons.UpArrowIcon({
                            fill: "#0F172A",
                            width: "20px",
                          })
                        : svgIcons.DownArrowIcon({
                            fill: "#0F172A",
                            width: "20px",
                          })}
                    </button>

                    {expandedSections[node.id] && (
                      <div className={ctcStyles.modalDocItems}>
                        <label className={ctcStyles.modalDocLabel}>
                          <input
                            type="checkbox"
                            checked={selectedDocs?.includes(node?.id)}
                            onChange={() => toggleDocSelection(node?.id)}
                            className={ctcStyles.modalDocCheckbox}
                          />
                          <span className={ctcStyles.modalDocText}>
                            {node?.title}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Preview Area */}
          <div className={ctcStyles.modalPreviewArea}>
            <p className={ctcStyles.modalPreviewText}>
              {t(ctcText.selectDocModal.previewText)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={ctcStyles.modalFooter}>
          <button onClick={onClose} className={ctcStyles.modalBtnSecondary}>
            {t(ctcText.selectDocModal.goBack)}
          </button>
          <button
            onClick={handleSelect}
            disabled={selectedDocs.length === 0}
            className={`${ctcStyles.modalBtnPrimary} ${
              selectedDocs.length > 0
                ? ctcStyles.modalBtnPrimaryActive
                : ctcStyles.modalBtnPrimaryDisabled
            }`}
          >
            {selectedDocs?.length > 0
              ? `${t(ctcText?.selectDocModal?.selectDocBtn)} (${selectedDocs?.length})`
              : t(ctcText?.selectDocModal?.selectDocBtn)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDocumentsModal;
