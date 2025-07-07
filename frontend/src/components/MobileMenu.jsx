import { useOverlayContext } from "../contexts/OverlayContext";
import { useNavigate } from "react-router-dom";

export default function MobileMenu({ isOffline = false }) {
    const navigate = useNavigate();
    const { closeOverlay } = useOverlayContext();

    const handleNavigate = (e, path) => {
        e.preventDefault();
        closeOverlay();
        navigate(`/${isOffline ? 'downloads' : ''}${path}`);
    }

    const handleClose = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col items-center justify-center w-80 p-4">
            <button
                className="bg-surface-a3 hover:bg-surface-a4 p-2 rounded-lg w-full mb-2"
                onClick={(e) => handleNavigate(e, '/create')}
            >Create</button>
            
            <button
                className="bg-surface-a3 hover:bg-surface-a4 p-2 rounded-lg w-full"
                onClick={handleClose}
            >Close</button>
        </div>
    )
}