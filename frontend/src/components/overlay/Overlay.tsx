import { useOverlay } from "../../contexts/OverlayContext";
import style from "./Overlay.module.css";

function Overlay() {
  const { isOverlayOpen, overlayContent, closeOverlay } = useOverlay();

  if (!isOverlayOpen) return null;

  return (
    <div className={style.overlayContainer} onClick={closeOverlay}>
      <div
        className={style.overlayBackground}
        onClick={(e) => e.stopPropagation()}
      >
        {overlayContent}
      </div>
    </div>
  );
}

export default Overlay;
