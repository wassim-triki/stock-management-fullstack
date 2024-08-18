// PdfPreviewer.tsx (Client-Side Component)

"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import config from "@/lib/config";
import { toast } from "./ui/use-toast";
import { ApiSuccessResponse } from "@/lib/types";

type PdfPreviewerProps = {
  endpoint: string;
  filename: string;
  sendEndpoint: string;
};

const PdfPreviewer = ({
  endpoint,
  filename,
  sendEndpoint,
}: PdfPreviewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null); // Store the blob for downloading
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchPdfPreview = async () => {
      try {
        const response = await fetch(`${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const blob = await response.blob();
        setPdfBlob(blob); // Store blob for download
        const blobUrl = URL.createObjectURL(blob);
        setPdfUrl(blobUrl);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdfPreview();

    // Cleanup the Blob URL when the component is unmounted
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [endpoint]);

  const handleDownload = () => {
    if (pdfBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = filename; // Set the custom filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM
    }
  };

  const sendPdf = async (url: string): Promise<ApiSuccessResponse> => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return res.json() as Promise<ApiSuccessResponse>;
  };

  const handleSend = async () => {
    try {
      setSending(true);
      const response = await sendPdf(sendEndpoint);
      toast({
        variant: "success",
        title: "Done!",
        description: response.message,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {pdfUrl ? (
        <>
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            title="PDF Preview"
          ></iframe>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload} className="">
              Download PDF
            </Button>
            <Button
              className="flex w-full gap-2 md:w-min"
              type="button"
              loading={sending}
              onClick={handleSend}
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </>
      ) : (
        <p>Loading PDF...</p>
      )}
    </>
  );
};

export default PdfPreviewer;
