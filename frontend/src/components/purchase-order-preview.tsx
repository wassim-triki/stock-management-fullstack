"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FileDown, Send } from "lucide-react";
import { toast } from "./ui/use-toast";
import { ApiSuccessResponse } from "@/lib/types";
import { fetchPurchaseOrderPdf, sendPurchaseOrder } from "@/api/purchase-order";
import config from "@/lib/config";
import { useRouter } from "next/navigation";
import Loading from "@/app/(main)/dashboard/loading";

type PdfPreviewerProps = {
  filename: string;
  id: string;
};

const PurchaseOrderPreview = ({ filename, id }: PdfPreviewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPdfPreview = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/api/purchase-orders/${id}/print`,
          {
            headers: {
              "Content-Type": "application/pdf",
            },
            credentials: "include",
          },
        );

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
  }, [id]);
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

  const handleSend = async () => {
    try {
      setSending(true);
      const response = await sendPurchaseOrder(id); // Call the injected send action
      toast({
        variant: "success",
        title: "Done!",
        description: response.message,
      });
      router.push("/dashboard/purchase-orders");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Failed to send",
      });
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
            <Button
              className="flex w-full gap-2 md:w-min"
              variant="outline"
              onClick={handleDownload}
            >
              <FileDown className="h-4 w-4" />
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
        <Loading />
      )}
    </>
  );
};

export default PurchaseOrderPreview;
