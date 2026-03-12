import React, { useState, useEffect, useCallback } from "react";

interface DocViewWrapperProps {
  fileStoreId?: string;
  tenantId?: string;
  authToken?: string;
  blob?: Blob;
}

const DocViewWrapper: React.FC<DocViewWrapperProps> = ({
  fileStoreId,
  tenantId,
  authToken,
  blob,
}) => {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const fetchDoc = useCallback(async () => {
    if (!fileStoreId) return;
    try {
      const uri = `/api/getFileByFileStoreId?tenantId=${tenantId || "kl"}&fileStoreId=${fileStoreId}`;
      const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};
      const response = await fetch(uri, { method: "GET", headers });
      if (response.status === 200) {
        const fetched = await response.blob();
        const url = URL.createObjectURL(fetched);
        setIframeUrl(`${url}#toolbar=0&navpanes=0&scrollbar=0`);
      }
    } catch (err) {
      console.error("DocViewWrapper fetch error:", err);
    }
  }, [fileStoreId, tenantId, authToken]);

  // Use blob directly if provided, otherwise fetch via fileStoreId
  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setIframeUrl(`${url}#toolbar=0&navpanes=0&scrollbar=0`);
      return () => URL.revokeObjectURL(url);
    } else {
      fetchDoc();
    }
  }, [blob, fetchDoc]);

  if (!iframeUrl) return null;

  return (
    <iframe
      src={iframeUrl}
      title="Document Preview"
      style={{
        width: "100%",
        height: "500px",
        border: "none",
        display: "block",
      }}
    />
  );
};

export default DocViewWrapper;
