import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [sessionExists, setSessionExists] = useState<boolean | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
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
          console.log("Session exists, fetching questions...");
          const learnSessionQuestions = await getLearnSession(
            sessionExistsCheck.learnSessionId,
            controller.signal,
          );
          setQuestions(learnSessionQuestions.questions);
          return;
        }
        console.log("Open overlay");
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
    }
  };

  return <div></div>;
}

export default LearnSession;
