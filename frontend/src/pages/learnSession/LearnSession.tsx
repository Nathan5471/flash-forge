import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { getFlashcardSet } from "../../utils/FlashcardAPIHandler";
import {
  checkLearnSessionAnswer,
  checkIfLearnSessionExists,
  checkCanContinueLearnSession,
  getLearnSession,
  endLearnSession,
} from "../../utils/LearnSessionAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import StartLearnSession from "../../components/startLearnSession/StartLearnSession";
import styles from "./LearnSession.module.css";

interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  flashcards: {
    index: number;
    term: string;
    definition: string;
  };
  creator: string;
  views: number;
}

interface Question {
  order: number;
  type: "multipleChoice" | "trueFalse" | "written";
  definition: string;
}

function LearnSession() {
  const { setId } = useParams<{ setId: string }>();
  const { openOverlay } = useOverlay();
  const [state, setState] = useState<
    "loading" | "error" | "overlay" | "active" | "startNextRound"
  >("loading");
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [sessionExists, setSessionExists] = useState<boolean | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [anotherRound, setAnotherRound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) {
      setError("No set ID provided");
      return;
    }
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const setData = await getFlashcardSet(setId, controller.signal);
        setFlashcardSet(setData.flashcardSet);
        const sessionExistsCheck = await checkIfLearnSessionExists(
          setId,
          controller.signal,
        );
        setSessionExists(sessionExistsCheck.exists);
        if (sessionExistsCheck.exists) {
          const learnSessionQuestions = await getLearnSession(
            sessionExistsCheck.learnSessionId,
            controller.signal,
          );
          setQuestions(learnSessionQuestions.questions);
          setState("active");
          return;
        }
        setState("overlay");
        openOverlay(
          <StartLearnSession
            setId={setId}
            onSessionStarted={handleSessionStarted}
          />,
          false,
        );
      } catch (error: any) {
        if (error === "Axios request canceled") {
          return;
        }
        const errorMessage =
          typeof error == "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unknown error occured";
        setError(errorMessage);
        setState("error");
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [setId]);

  const handleSessionStarted = async (sessionId: string) => {
    try {
      const learnSessionQuestions = await getLearnSession(sessionId);
      setQuestions(learnSessionQuestions.questions);
      setState("active");
    } catch (error: any) {
      if (error === "Axios request canceled") {
        return;
      }
      const errorMessage =
        typeof error == "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occured";
      setError(errorMessage);
      setState("error");
    }
  };

  if (state === "loading") {
    return (
      <div className={styles.learnSessionPage}>
        <Navbar />
        <div className={styles.learnSessionContainer}>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  if (state === "overlay") {
    return (
      <div className={styles.learnSessionPage}>
        <Navbar />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={styles.learnSessionPage}>
        <Navbar />
        <div className={styles.learnSessionContainer}>
          <div className={styles.errorBox}>
            <h2>Session not found or error occurred</h2>
            <p>{error}</p>
            <Link to={"/"} className={styles.homeButton}>
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (state === "startNextRound") {
    return (
      <div className={styles.learnSessionPage}>
        <Navbar />
        <div className={styles.learnSessionContainer}>
          <div className={styles.startNextRoundBox}>
            <h2>{anotherRound ? "Start Next Round" : "Start New Session"}</h2>
            <p>
              {anotherRound
                ? "You have completed all of the sessions in this round."
                : "You have completed this learning session!"}
            </p>
            <div className={styles.buttonContainer}>
              <button className={styles.startNextRoundButton}>
                {anotherRound ? "Next Round" : "New Session"}
              </button>
              <Link to={`/sets/${setId}`} className={styles.backToSetButton}>
                Return to Set
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.learnSessionPage}>
      <Navbar />
      <div className={styles.learnSessionContainer}></div>
    </div>
  );
}

export default LearnSession;
