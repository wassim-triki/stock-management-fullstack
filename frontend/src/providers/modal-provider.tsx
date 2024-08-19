// ModalContext.tsx
"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { createContext, useState, useContext, ReactNode, FC } from "react";
import { createPortal } from "react-dom";

interface ModalContextType {
  showModal: (onConfirm: () => void, options?: ModalOptions) => void;
  closeModal: () => void;
}

export interface ModalOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  const [options, setOptions] = useState<ModalOptions>({
    title: "Are you sure?",
    description: "This action cannot be undone.",
    confirmText: "Confirm",
    cancelText: "Cancel",
  });
  const [loading, setLoading] = useState(false);

  const showModal = (confirmCallback: () => void, opts?: ModalOptions) => {
    setOnConfirm(() => confirmCallback);
    if (opts) {
      setOptions({ ...options, ...opts });
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOnConfirm(null);
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      setLoading(true);
      try {
        // Await the result of the confirm callback, in case it's a Promise
        await Promise.resolve(onConfirm());
      } catch (error) {
        console.error("Error during confirmation:", error);
      } finally {
        setLoading(false);
        closeModal();
      }
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {isOpen &&
        createPortal(
          <AlertModal
            options={options}
            isOpen={isOpen}
            onClose={closeModal}
            onConfirm={handleConfirm}
            loading={loading}
          />,
          document.getElementById("portal-root") as HTMLElement,
        )}
    </ModalContext.Provider>
  );
};

// Custom hook to use modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
