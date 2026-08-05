import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useOverlay } from "../../contexts/OverlayContext";
import { getFlashcardSet } from "../../utils/FlashcardAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import Flashcard from "../../components/flashcard/Flashcard";
import FlashcardSettings from "../../components/flashcardSettings/FlashcardSettings";
import { FaShuffle, FaGear } from "react-icons/fa6";
import styles from "./FlashcardFullscreen.module.css";

interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  flashcards: { index: number; term: string; definition: string }[];
  creator: string;
  views: number;
}

function FlashcardFullscreen() {
  const { setId } = useParams<{ setId: string }>();
  const { user } = useAuth();
  const { openOverlay } = useOverlay();
  const [flashcardSet, setFlashcardSet] = useState<
    FlashcardSet | null | undefined
  >(undefined);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledFlashcards, setShuffledFlashcards] = useState<
    { index: number; term: string; definition: string }[]
  >([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [flashcardFront, setFlashcardFront] = useState<"term" | "definition">(
    "term",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) {
      setFlashcardSet(null);
      setError("Flashcard set ID is missing");
      return;
    }
    const controller = new AbortController();
    setError(null);

    const handleGetFlashcardSet = async () => {
      try {
        const data = await getFlashcardSet(setId, controller.signal);
        setFlashcardSet(data.flashcardSet);
        setShuffledFlashcards(data.flashcardSet.flashcards);
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

  useEffect(() => {
    if (!flashcardSet) return;
    if (isShuffled) {
      handleShuffle();
      return;
    }
    setShuffledFlashcards(flashcardSet.flashcards);
    setCurrentFlashcardIndex(0);
  }, [flashcardSet, isShuffled]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePreviousRef.current();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNextRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlePrevious = () => {
    if (currentFlashcardIndex <= 0) return;
    setCurrentFlashcardIndex((prevIndex) => prevIndex - 1);
  };
  const handlePreviousRef = useRef(handlePrevious);

  const handleNext = () => {
    if (currentFlashcardIndex >= shuffledFlashcards.length - 1) return;
    setCurrentFlashcardIndex((prevIndex) => prevIndex + 1);
  };
  const handleNextRef = useRef(handleNext);

  useEffect(() => {
    handlePreviousRef.current = handlePrevious;
    handleNextRef.current = handleNext;
  }, [handlePrevious, handleNext]);

  const handleShuffle = () => {
    if (!flashcardSet) return;
    const shuffled = [...flashcardSet.flashcards];
    var n = flashcardSet.flashcards.length,
      t,
      i;
    while (n) {
      i = (Math.random() * n--) | 0;
      t = shuffled[n];
      shuffled[n] = shuffled[i];
      shuffled[i] = t;
    }
    setShuffledFlashcards(shuffled);
    setCurrentFlashcardIndex(0);
  };

  const handleOpenSettings = () => {
    if (!flashcardSet) return;
    openOverlay(
      <FlashcardSettings
        initialFlashcardFront={flashcardFront}
        setFlashcardFront={setFlashcardFront}
        isCreator={user?.username === flashcardSet.creator}
      />,
    );
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
          flashcardData={
            flashcardFront === "term"
              ? shuffledFlashcards[currentFlashcardIndex]
              : {
                  ...shuffledFlashcards[currentFlashcardIndex],
                  term: shuffledFlashcards[currentFlashcardIndex].definition,
                  definition: shuffledFlashcards[currentFlashcardIndex].term,
                }
          }
          className={styles.flashcard}
        />
        <div className={styles.flashcardControls}>
          <div className={styles.shuffleContainer}>
            <button
              className={`${styles.shuffleButton} ${isShuffled ? styles.shuffleButtonActive : ""}`}
              onClick={() => setIsShuffled((prev) => !prev)}
            >
              <FaShuffle />
            </button>
          </div>
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
          <button
            className={styles.settingsButton}
            onClick={handleOpenSettings}
          >
            <FaGear />
          </button>
        </div>
        <div className={styles.flashcardSetBackContainer}>
          <Link
            to={`/set/${flashcardSet.id}`}
            className={styles.flashcardSetBackLink}
          >
            Back to Set
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FlashcardFullscreen;
