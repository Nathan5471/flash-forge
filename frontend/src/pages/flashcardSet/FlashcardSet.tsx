import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFlashcardSet } from "../../utils/FlashcardAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import Flashcard from "../../components/flashcard/Flashcard";
import styles from "./FlashcardSet.module.css";

interface FlashcardSet {
  name: string;
  description: string;
  flashcards: { index: number; term: string; definition: string }[];
  creator: string;
  views: number;
}

function FlashcardSet() {
  const { setId } = useParams<{ setId: string }>();
  const [flashcardSet, setFlashcardSet] = useState<
    FlashcardSet | null | undefined // Null is for when the set is not found and undefined is the loading state
  >(undefined);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) {
      setFlashcardSet(null);
      setError("Flashcard set ID is missing");
      return;
    }

    const controller = new AbortController();

    const handleGetFlashcardSet = async () => {
      try {
        const data = await getFlashcardSet(setId, controller.signal);
        setFlashcardSet(data.flashcardSet);
      } catch (error: any) {
        if (error === "Axios request canceled") {
          return;
        }
        setFlashcardSet(null);
        const errorMessage =
          typeof error == "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unknown error occured";
        setError(errorMessage);
      }
    };
    handleGetFlashcardSet();

    return () => {
      controller.abort();
    };
  }, [setId]);

  const handlePrevious = () => {
    if (currentFlashcardIndex < 0) return;
    setCurrentFlashcardIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    if (currentFlashcardIndex >= flashcardSet?.flashcards.length! - 1) return;
    setCurrentFlashcardIndex((prevIndex) => prevIndex + 1);
  };

  if (flashcardSet === undefined) {
    return (
      <div className={styles.flashcardSetPage}>
        <Navbar />
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (flashcardSet === null) {
    return (
      <div className={styles.flashcardSetPage}>
        <Navbar />
        <div className={styles.errorBox}>
          <h2>Flashcard Set Not Found</h2>
          {error && <p className={styles.error}>{error}</p>}
          <Link to="/" className={styles.errorButton}>
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.flashcardSetPage}>
      <Navbar />
      <div className={styles.flashcardSetContainer}>
        <h1>{flashcardSet.name}</h1>
        <Flashcard
          flashcardData={flashcardSet.flashcards[currentFlashcardIndex]}
          className={styles.flashcard}
        />
        <div className={styles.flashcardNavigation}>
          <button
            disabled={currentFlashcardIndex <= 0}
            onClick={handlePrevious}
          >
            Previous
          </button>
          <p>
            {currentFlashcardIndex + 1}/{flashcardSet.flashcards.length}
          </p>
          <button
            disabled={
              currentFlashcardIndex >= flashcardSet.flashcards.length - 1
            }
            onClick={handleNext}
          >
            Next
          </button>
        </div>
        <div className={styles.flashcardSetText}>
          <p className={styles.description}>
            Description: {flashcardSet.description}
          </p>
          <p>Creator: {flashcardSet.creator}</p>
          <p>Views: {flashcardSet.views}</p>
        </div>
      </div>
    </div>
  );
}

export default FlashcardSet;
