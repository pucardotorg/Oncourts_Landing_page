import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PDFConfig {
  scale: number;
  format: string;
  quality: number;
  filename: string;
  loading: {
    text: string;
    subtext: string;
  };
}

export const downloadAsPDF = async (
  pdfConfig: PDFConfig,
  modalContentRef: React.RefObject<HTMLDivElement>
) => {
  if (!modalContentRef.current) return;

  // Create loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.className =
    "fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-[9999]";

  try {
    // Show loading message with configurable text
    loadingDiv.innerHTML = `
        <div class="bg-white border-2 p-6 rounded-lg shadow-xl flex flex-col items-center justify-center space-y-4 animate-pulse">
          <svg class="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div class="text-gray-700 font-medium">${pdfConfig.loading.text}</div>
          <div class="text-gray-500 text-sm">${pdfConfig.loading.subtext}</div>
        </div>
      `;
    document.body.appendChild(loadingDiv);

    const modalContent = modalContentRef.current;

    // Save original styles to restore later
    const originalStyles = {
      height: modalContent.style.height,
      maxHeight: modalContent.style.maxHeight,
      overflow: modalContent.style.overflow,
      position: modalContent.style.position,
      documentOverflow: document.body.style.overflow,
    };

    try {
      // Modify styles to capture full content
      document.body.style.overflow = "hidden";
      modalContent.style.height = "auto";
      modalContent.style.maxHeight = "none";
      modalContent.style.overflow = "visible";

      // Get content dimensions
      const scrollHeight = modalContent.scrollHeight;
      const scrollWidth = modalContent.scrollWidth;

      // Capture the content with configurable scale
      const canvas = await html2canvas(modalContent, {
        scale: pdfConfig.scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowHeight: scrollHeight,
        windowWidth: scrollWidth,
        height: scrollHeight,
        width: scrollWidth,
        scrollY: 0,
        scrollX: 0,
      });

      // Create PDF with configurable format
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: pdfConfig.format,
      });

      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = pdfWidth / canvas.width;
      const totalPdfHeight = canvas.height * ratio;
      const pageCount = Math.ceil(totalPdfHeight / pdfHeight);

      // Add each segment to its own page
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate the portion of the image to use for this page
        const sourceY = (i * pdfHeight) / ratio;
        const sourceHeight = Math.min(
          pdfHeight / ratio,
          canvas.height - sourceY
        );

        // Create a temporary canvas for this page segment
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;

        // Draw just the portion needed for this page
        const ctx = tempCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, // sx
            sourceY, // sy
            canvas.width, // sWidth
            sourceHeight, // sHeight
            0, // dx
            0, // dy
            tempCanvas.width, // dWidth
            tempCanvas.height // dHeight
          );

          // Add to PDF with configurable quality
          pdf.addImage({
            imageData: tempCanvas.toDataURL("image/jpeg", pdfConfig.quality),
            format: "JPEG",
            x: 0,
            y: 0,
            width: pdfWidth,
            height: sourceHeight * ratio,
            compression: "FAST",
          });
        }
      }

      // Save with configurable filename
      pdf.save(pdfConfig.filename);
    } finally {
      // Always restore original styles
      modalContent.style.height = originalStyles.height;
      modalContent.style.maxHeight = originalStyles.maxHeight;
      modalContent.style.overflow = originalStyles.overflow;
      modalContent.style.position = originalStyles.position;
      document.body.style.overflow = originalStyles.documentOverflow;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    // Always remove loading indicator
    if (document.body.contains(loadingDiv)) {
      document.body.removeChild(loadingDiv);
    }
  }
};
