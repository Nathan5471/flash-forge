import { useState } from "react";
import { useOverlay } from "../../contexts/OverlayContext";
import styles from "./FlashcardSettings.module.css";

function FlashcardSettings({
  initialFlashcardFront,
  setFlashcardFront,
  isCreator,
}: {
  initialFlashcardFront: "term" | "definition";
  setFlashcardFront: React.Dispatch<
    React.SetStateAction<"term" | "definition">
  >;
  isCreator: boolean;
}) {
  const { closeOverlay } = useOverlay();
  const [flashcardFront, setLocalFlashcardFront] = useState(
    initialFlashcardFront,
  );

  return (
    <div className={styles.flashcardSettingsContainer}>
      <h1>Flashcard Set Settings</h1>
      <div className={styles.frontSetting}>
        <label htmlFor="front-select">Front:</label>
        <select
          id="front-select"
          value={flashcardFront}
          onChange={(e) => {
            setFlashcardFront(e.target.value as "term" | "definition");
            setLocalFlashcardFront(e.target.value as "term" | "definition");
          }}
        >
          <option value="term">Term</option>
          <option value="definition">Definition</option>
        </select>
      </div>
      <button className={styles.settingsButton}>Export Flashcards</button>
      <button className={styles.settingsButton}>Clone Flashcard Set</button>
      {isCreator && (
        <button className={styles.settingsButton}>Edit Flashcard Set</button>
      )}
      {isCreator && (
        <button className={styles.deleteButton}>Delete Flashcard Set</button>
      )}
      <button className={styles.closeButton} onClick={() => closeOverlay()}>
        Close
      </button>
    </div>
  );
}

export default FlashcardSettings;
