import React from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { ctcStyles } from "../../styles/certifiedCopyStyles";

interface FormActionsProps {
  /** Label for the left (secondary/destructive) button */
  secondaryLabel: string;
  onSecondary: () => void;

  /** Label for the right (primary/proceed) button */
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;

  /** Pass true to colour as a "next"-style button (light teal), false for "proceed" (dark teal) */
  primaryVariant?: "proceed" | "next";
}

const FormActions: React.FC<FormActionsProps> = ({
  secondaryLabel,
  onSecondary,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryVariant = "proceed",
}) => {
  const { t } = useSafeTranslation();

  const primaryActiveClass =
    primaryVariant === "next"
      ? ctcStyles.btnNextActive
      : ctcStyles.btnPrimaryActive;

  const primaryDisabledClass =
    primaryVariant === "next"
      ? ctcStyles.btnNextDisabled
      : ctcStyles.btnPrimaryDisabled;

  return (
    <>
      <div className={ctcStyles.divider} />
      <div className={ctcStyles.actionRow}>
        <button onClick={onSecondary} className={ctcStyles.btnSecondary}>
          {t(secondaryLabel)}
        </button>
        <button
          onClick={onPrimary}
          disabled={primaryDisabled}
          className={`${ctcStyles.btnPrimary} ${primaryDisabled ? primaryDisabledClass : primaryActiveClass}`}
        >
          {t(primaryLabel)}
        </button>
      </div>
    </>
  );
};

export default FormActions;
