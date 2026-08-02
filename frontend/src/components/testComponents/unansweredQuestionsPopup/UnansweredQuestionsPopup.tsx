import { useOverlay } from "../../../contexts/OverlayContext";
import styles from "./UnansweredQuestionsPopup.module.css";

interface UnansweredQuestionsPopupProps {
  unansweredCount: number;
  handleSubmitTest: () => void;
}

function UnansweredQuestionsPopup({
  unansweredCount,
  handleSubmitTest,
}: UnansweredQuestionsPopupProps) {
  const { closeOverlay } = useOverlay();

  const handleSubmit = () => {
    handleSubmitTest();
    closeOverlay();
  };

  return (
    <div className={styles.unansweredQuestionsPopupContainer}>
      <h2>Unanswered Questions</h2>
      <p>
        You have <span>{unansweredCount}</span> unanswered questions. Are you
        sure you want to submit?
      </p>
      <div className={styles.buttonContainer}>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={closeOverlay}>Cancel</button>
      </div>
    </div>
  );
}

export default UnansweredQuestionsPopup;
