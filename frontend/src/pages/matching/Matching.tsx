import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  postLeaderboardSubmission,
  getMatchingLeaderboardId,
  loadMatch,
  getLeaderboard,
} from "../../utils/MatchingAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import styles from "./Matching.module.css";

interface Flashcard {
  id: string;
  term: string;
  definition: string;
}

interface Entry {
  position: number;
  username: string;
  length: number;
}

const shuffleCards = (flashcards: Flashcard[]) => {
  const termCards = flashcards.map((flashcard, index) => ({
    key: index,
    id: flashcard.id,
    value: flashcard.term,
  }));
  const definitionCards = flashcards.map((flashcard, index) => ({
    key: index + flashcards.length,
    id: flashcard.id,
    value: flashcard.definition,
  }));
  const shuffled = [...termCards, ...definitionCards];
  var n = shuffled.length,
    t,
    i;
  while (n) {
    i = (Math.random() * n--) | 0;
    t = shuffled[n];
    shuffled[n] = shuffled[i];
    shuffled[i] = t;
  }
  return shuffled;
};

function Matching() {
  const { setId } = useParams<{ setId: string }>();
  const [leaderboardId, setLeaderboardId] = useState<string | null>(null);
  const [matchingData, setMatchingData] = useState<Flashcard[]>([]);
  const [shuffledCards, setShuffledCards] = useState<
    { key: number; id: string; value: string }[]
  >([]);
  const [selectedCards, setSelectedCards] = useState<
    { key: number; id: string; value: string }[]
  >([]);
  const [matchedFlashcardIds, setMatchedFlashcardIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<Entry[]>([]);
  const [currentState, setCurrentState] = useState<
    "loading" | "error" | "waiting" | "playing" | "finished"
  >("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) {
      setError("Flashcard set ID is missing");
      setCurrentState("error");
      return;
    }
    const controller = new AbortController();

    const fetchMatchData = async () => {
      try {
        const leaderboardIdResponse = await getMatchingLeaderboardId(
          setId,
          controller.signal,
        );
        setLeaderboardId(leaderboardIdResponse.id);
        const matchingDataResponse = await loadMatch(
          leaderboardIdResponse.id,
          controller.signal,
        );
        setMatchingData(matchingDataResponse.flashcards);
        setShuffledCards(shuffleCards(matchingDataResponse.flashcards));
        setCurrentState("waiting");
      } catch (error: any) {
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
    fetchMatchData();

    return () => {
      controller.abort();
    };
  }, [setId]);

  const startGame = () => {
    setStartTime(Date.now());
    setCurrentState("playing");
  };

  const checkMatch = (card: { key: number; id: string; value: string }) => {
    if (selectedCards.length === 0) {
      setSelectedCards([card]);
      return;
    }
    if (selectedCards.includes(card)) {
      setSelectedCards([]);
      return;
    }
    const [firstCard] = selectedCards;
    if (firstCard.id === card.id) {
      setMatchedFlashcardIds((prev) => [...prev, firstCard.id]);
    }
    setSelectedCards([]);
    if (matchedFlashcardIds.length + 1 === matchingData.length) {
      finishGame();
    }
  };

  const finishGame = async () => {
    if (leaderboardId === null || startTime === null) return;
    const endTime = Date.now();
    setEndTime(endTime);
    setCurrentState("finished");
    try {
      await postLeaderboardSubmission(leaderboardId, startTime, endTime);
      const leaderboardData = await getLeaderboard(leaderboardId);
      setLeaderboard(leaderboardData.leaderboard);
    } catch (error) {
      console.error("Error posting leaderboard submission:", error);
    }
  };

  const startNewGame = () => {
    setMatchedFlashcardIds([]);
    setSelectedCards([]);
    setShuffledCards(shuffleCards(matchingData));
    setStartTime(null);
    setEndTime(null);
    setCurrentState("waiting");
  };

  if (currentState === "loading") {
    return (
      <div className={styles.matchingPage}>
        <Navbar />
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (currentState === "error") {
    return (
      <div className={styles.matchingPage}>
        <Navbar />
        <div className={styles.errorContainer}>
          <div className={styles.errorBox}>
            <h2>Flashcard set not found or an error occurred</h2>
            <p>{error}</p>
            <Link to="/" className={styles.homeLink}>
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentState === "waiting") {
    return (
      <div className={styles.matchingPage}>
        <Navbar />
        <div className={styles.matchingContainer}>
          <div className={styles.matchingBox}>
            <h2>Matching Game</h2>
            <p>
              You will be given terms and definitions and you need to match them
              quickly to win!
            </p>
            <button className={styles.startButton} onClick={startGame}>
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentState === "finished") {
    return (
      <div className={styles.matchingPage}>
        <Navbar />
        <div className={styles.matchingContainer}>
          <div className={styles.resultsBox}>
            <div className={styles.leaderboard}>
              <h2>Leaderboard</h2>
              {leaderboard.length === 0 ? (
                <p>No entries yet.</p>
              ) : (
                <div className={styles.leaderboardEntries}>
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.position}
                      className={styles.leaderboardEntry}
                    >
                      {entry.position}. {entry.username} -{" "}
                      {Math.floor(entry.length / 1000)} seconds
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.results}>
              <h2>Game Over</h2>
              <p>
                You have matched all of the cards in{" "}
                <span>{Math.floor((endTime! - startTime!) / 1000)}</span>{" "}
                seconds!
              </p>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.playAgainButton}
                  onClick={startNewGame}
                >
                  Play Again
                </button>
                <Link to={`/set/${setId}`} className={styles.backToSetButton}>
                  Back to Set
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.matchingPage}>
      <Navbar />
      <div className={styles.matchingContainer}>
        <div className={styles.matchingGrid}>
          {shuffledCards.map((card) => (
            <button
              key={card.key}
              className={`${styles.matchingCard} ${selectedCards.some((c) => c.key === card.key) ? styles.selected : ""}`}
              onClick={() => checkMatch(card)}
              disabled={matchedFlashcardIds.includes(card.id)}
            >
              {card.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Matching;
