import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";
import type { ValidateUserInfo, AuthData } from "../../types";

const OTPModal = ({
  t,
  isOpen,
  onClose,
  onVerify,
  phoneNumber,
  tenantId,
  filingNumber,
  courtId,
  onValidateSuccess,
  onAuthDataReceived,
}: {
  t: (key: string) => string;
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  phoneNumber: string;
  tenantId: string;
  filingNumber: string;
  courtId: string;
  onValidateSuccess?: (data: ValidateUserInfo) => void;
  onAuthDataReceived?: (data: AuthData) => void;
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Reset OTP every time the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setOtp("");
      setErrorMsg("");
    }
  }, [isOpen]);

  // Auto-clear error after 4 seconds
  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(""), 4000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  const handleVerifyOtp = async () => {
    if (otp?.length !== 6) return;

    setIsVerifying(true);
    try {
      // Step 1: Verify OTP → get access_token + UserRequest
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: phoneNumber,
          password: otp,
          tenantId: tenantId,
          userType: "citizen",
          scope: "read",
          grant_type: "password",
        }),
      });

      if (!response?.ok) {
        setErrorMsg(t("INVALID_OTP"));
        return;
      }

      const authData = await response?.json();

      if (!authData?.access_token) {
        setErrorMsg(
          t("OTP_VERIFICATION_FAILED") ||
            "OTP verification failed. Please try again.",
        );
        return;
      }

      // Store auth data in parent state
      onAuthDataReceived?.({
        authToken: authData?.access_token,
        userInfo: authData?.UserRequest,
      });

      // Step 2: Call validate API with auth data
      const validateResponse = await fetch("/api/ctc/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RequestInfo: {
            apiId: "Dristi",
            authToken: authData?.access_token,
            msgId: `${Date.now()}|en_IN`,
            plainAccessRequest: {},
            userInfo: authData?.UserRequest,
          },
          mobileNumber: phoneNumber,
          filingNumber: filingNumber,
          tenantId: tenantId,
          courtId: courtId,
        }),
      });

      if (!validateResponse?.ok) {
        setErrorMsg(
          t("VALIDATION_FAILED") || "User validation failed. Please try again.",
        );
        return;
      }

      const validateData = await validateResponse?.json();

      if (validateData?.validateUserInfo) {
        onValidateSuccess?.(validateData?.validateUserInfo);
        onVerify();
        setTimeout(() => setOtp(""), 200);
      } else {
        setErrorMsg(
          t("VALIDATION_FAILED") || "User validation failed. Please try again.",
        );
      }
    } catch (err) {
      console.error("OTP verify/validate failed:", err);
      setErrorMsg(
        t("OTP_VERIFICATION_FAILED") ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const footer = (
    <>
      <button onClick={onClose} className={ctcStyles.otpBtnBack}>
        {t(ctcText.otpModal.goBack)}
      </button>
      <button
        onClick={handleVerifyOtp}
        disabled={otp.length !== 6 || isVerifying}
        className={`${ctcStyles.otpBtnSubmit} ${
          otp.length === 6 && !isVerifying
            ? ctcStyles.otpBtnSubmitActive
            : ctcStyles.otpBtnSubmitDisabled
        }`}
      >
        {isVerifying ? "Verifying..." : t(ctcText.otpModal.verify)}
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t(ctcText.otpModal.title)}
      footer={footer}
    >
      <div className={ctcStyles.otpBody}>
        <label className={ctcStyles.otpLabel}>
          {t(ctcText.otpModal.inputLabel)}
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
            setOtp(val);
            if (errorMsg) setErrorMsg("");
          }}
          placeholder={t(ctcText.otpModal.inputPlaceholder)}
          className={ctcStyles.otpInput}
        />
        {errorMsg && (
          <p className="text-red-600 text-sm mt-2 font-medium">{errorMsg}</p>
        )}
      </div>
    </BaseModal>
  );
};

export default OTPModal;
