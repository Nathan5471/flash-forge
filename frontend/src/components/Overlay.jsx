import { useOverlayContext } from "../contexts/OverlayContext";

export default function Overlay() {
    const { isOverlayOpen, overlayContent } = useOverlayContext();

    if (!isOverlayOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 w-screen h-screen">
            <div className="bg-surface-a1 p-6 rounded-lg text-white">
                {overlayContent}
            </div>
        </div>
    )
}