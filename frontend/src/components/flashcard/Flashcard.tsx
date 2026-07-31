import { useEffect, useState } from "react";
import styles from "./Flashcard.module.css";

interface FlashcardData {
  index: number;
  term: string;
  definition: string;
}

function Flashcard({
  flashcardData,
  canFlip = true,
  className = "",
}: {
  flashcardData: FlashcardData;
  canFlip?: boolean;
  className?: string;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);

  useEffect(() => {
    if (!canFlip) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [canFlip]);

  useEffect(() => {
    setDisableTransition(true);
    setIsFlipped(false);

    const timer = setTimeout(() => {
      setDisableTransition(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [flashcardData.index]);

  return (
    <div
      className={`${styles.flashcardContainer} ${className}`}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className={`${styles.inner} ${disableTransition ? styles.noTransition : ""} ${isFlipped ? styles.isFlipped : ""}`}
      >
        <div className={styles.front}>{flashcardData.term}</div>
        <div className={`${styles.front} ${styles.back}`}>
          {flashcardData.definition}
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
