import { createContext, useContext, useState } from "react";

interface OverlayContextType {
  isOverlayOpen: boolean;
  overlayContent: React.ReactNode | null;
  canCloseWithClickOutside: boolean;
  openOverlay: (content: React.ReactNode, canClose?: boolean) => void;
  closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayContent, setOverlayContent] = useState<React.ReactNode | null>(
    null,
  );
  const [canCloseWithClickOutside, setCanCloseWithClickOutside] =
    useState(true);

  const openOverlay = (content: React.ReactNode, canClose: boolean = true) => {
    setOverlayContent(content);
    setIsOverlayOpen(true);
    setCanCloseWithClickOutside(canClose);
  };

  const closeOverlay = () => {
    setOverlayContent(null);
    setIsOverlayOpen(false);
    setCanCloseWithClickOutside(true);
  };

  const contextValue = {
    isOverlayOpen,
    overlayContent,
    canCloseWithClickOutside,
    openOverlay,
    closeOverlay,
  };

  return (
    <OverlayContext.Provider value={contextValue}>
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = (): OverlayContextType => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
};
