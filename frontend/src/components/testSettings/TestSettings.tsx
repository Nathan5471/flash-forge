import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { FaCheck } from "react-icons/fa";
import styles from "./TestSettings.module.css";

interface TestSettingsProps {
  flashcardCount: number;
  flashcardSetId: string;
  handleStartTest: (settings: TestSettingsValues) => void;
}

interface TestSettingsValues {
  questionCount: number;
  multipleChoice: boolean;
  written: boolean;
  trueFalse: boolean;
  matching: boolean;
}

function TestSettings({
  flashcardCount,
  flashcardSetId,
  handleStartTest,
}: TestSettingsProps) {
  const navigate = useNavigate();
  const { closeOverlay } = useOverlay();
  const [questionCount, setQuestionCount] = useState(
    10 > flashcardCount ? flashcardCount : 10,
  );
  const [multipleChoice, setMultipleChoice] = useState(true);
  const [written, setWritten] = useState(false);
  const [trueFalse, setTrueFalse] = useState(false);
  const [matching, setMatching] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleStartTest({
      questionCount,
      multipleChoice,
      written,
      trueFalse,
      matching,
    });
    closeOverlay();
  };

  const handleCancel = () => {
    closeOverlay();
    navigate(`/set/${flashcardSetId}`);
  };

  return (
    <form className={styles.testSettingsForm} onSubmit={handleSubmit}>
      <h1>Test Settings</h1>
      <label htmlFor="questionCount">
        Question Count (max {flashcardCount}):
      </label>
      <input
        type="number"
        id="questionCount"
        name="questionCount"
        min={1}
        max={flashcardCount}
        value={questionCount}
        onChange={(e) => setQuestionCount(Number(e.target.value))}
      />
      <h2>Question Types:</h2>
      <label htmlFor="multipleChoice" className={styles.checkboxLabel}>
        <input
          type="checkbox"
          id="multipleChoice"
          name="multipleChoice"
          checked={multipleChoice}
          onChange={(e) => setMultipleChoice(e.target.checked)}
          className={styles.checkbox}
        />
        <FaCheck className={styles.check} />
        Multiple Choice
      </label>
      <label htmlFor="written" className={styles.checkboxLabel}>
        <input
          type="checkbox"
          id="written"
          name="written"
          checked={written}
          onChange={(e) => setWritten(e.target.checked)}
          className={styles.checkbox}
        />
        <FaCheck className={styles.check} />
        Written
      </label>
      <label htmlFor="trueFalse" className={styles.checkboxLabel}>
        <input
          type="checkbox"
          id="trueFalse"
          name="trueFalse"
          checked={trueFalse}
          onChange={(e) => setTrueFalse(e.target.checked)}
          className={styles.checkbox}
        />
        <FaCheck className={styles.check} />
        True/False
      </label>
      <label htmlFor="matching" className={styles.checkboxLabel}>
        <input
          type="checkbox"
          id="matching"
          name="matching"
          checked={matching}
          onChange={(e) => setMatching(e.target.checked)}
          className={styles.checkbox}
        />
        <FaCheck className={styles.check} />
        Matching
      </label>
      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.startButton}>
          Start Test
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TestSettings;
