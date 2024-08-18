// PdfPreviewer.tsx (Client-Side Component)

"use client";

import { useEffect, useState } from "react";

type PdfPreviewerProps = {
  endpoint: string;
};

const PdfPreviewer = ({ endpoint }: PdfPreviewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfPreview = async () => {
      const response = await fetch(`${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const pdfBlob = await response.blob();
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(blobUrl);
    };

    fetchPdfPreview();

    // Cleanup the Blob URL when the component is unmounted
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [endpoint]);

  return pdfUrl ? (
    <iframe
      src={pdfUrl}
      width="100%"
      height="500px"
      title="PDF Preview"
    ></iframe>
  ) : (
    <p>Loading PDF...</p>
  );
};

export default PdfPreviewer;
