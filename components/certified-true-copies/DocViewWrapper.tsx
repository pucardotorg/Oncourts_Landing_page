import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  useEffect(() => {
    let objectUrl: string | null = null;
    let mounted = true;
    const controller = new AbortController();

    const fetchDoc = async () => {
      if (!fileStoreId) return;
      setIsLoading(true);
      try {
        const uri = `/api/getFileByFileStoreId?tenantId=${tenantId || "kl"}&fileStoreId=${fileStoreId}`;
        const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};
        const response = await fetch(uri, {
          method: "GET",
          headers,
          signal: controller.signal
        });
        if (response.status === 200) {
          const fetched = await response.blob();
          if (mounted) {
            objectUrl = URL.createObjectURL(fetched);
            setFileUrl(objectUrl);
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError" && mounted) {
          console.error("DocViewWrapper fetch error:", err);
        }
      } finally {
        if (mounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    if (blob) {
      objectUrl = URL.createObjectURL(blob);
      setFileUrl(objectUrl);
    } else {
      fetchDoc();
    }

    return () => {
      mounted = false;
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileStoreId, tenantId, authToken, blob]);
  // Track container width correctly, accommodating modal animations
  useEffect(() => {
    let mounted = true;

    const updateWidth = () => {
      if (!mounted) return;
      if (containerRef.current) {
        // Subtract a tiny margin to prevent horizontal scrollbars
        setContainerWidth(Math.floor(containerRef.current.clientWidth - 4));
      }
    };

    // Calculate immediately
    updateWidth();

    // Re-calculate at various intervals while modal animations finish
    const t1 = setTimeout(updateWidth, 100);
    const t2 = setTimeout(updateWidth, 300);
    const t3 = setTimeout(updateWidth, 600);

    // Watch for window resizes
    window.addEventListener("resize", updateWidth);

    return () => {
      mounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!fileUrl) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center bg-gray-50 hide-scrollbar"
    >
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        className="flex flex-col items-center w-full"
        loading={
          <div className="flex justify-center items-center w-full h-[500px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        }
        error={
          <div className="flex justify-center items-center w-full h-[500px] text-red-500">
            Failed to load PDF.
          </div>
        }
      >
        {Array.from({ length: numPages }, (_, index) => (
          <div key={index} className="mb-4 shadow-sm bg-white flex justify-center max-w-full">
            <Page
              pageNumber={index + 1}
              width={containerWidth}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="max-w-full"
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default DocViewWrapper;
