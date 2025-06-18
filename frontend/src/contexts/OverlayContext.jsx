import {createContext, useState, useContext} from 'react';

const OverlayContext = createContext();

export const useOverlayContext = () => {
    return useContext(OverlayContext);
}

export const OverlayProvider = ({children}) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [overlayContent, setOverlayContent] = useState(null);

    const openOverlay = (content) => {
        setOverlayContent(content);
        setIsOverlayOpen(true);
    }

    const closeOverlay = () => {
        setIsOverlayOpen(false);
        setOverlayContent(null);
    }

    const contextValue = {
        isOverlayOpen,
        overlayContent,
        openOverlay,
        closeOverlay
    }

    return <OverlayContext.Provider value={contextValue}>
        {children}
    </OverlayContext.Provider>
}