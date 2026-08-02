import { useOverlay } from "../../contexts/OverlayContext";
import style from "./Overlay.module.css";

function Overlay() {
  const {
    isOverlayOpen,
    overlayContent,
    canCloseWithClickOutside,
    closeOverlay,
  } = useOverlay();

  if (!isOverlayOpen) return null;

  return (
    <div
      className={style.overlayContainer}
      onClick={canCloseWithClickOutside ? closeOverlay : undefined}
    >
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
