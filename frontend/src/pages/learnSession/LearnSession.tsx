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
import MultipleChoiceQuestion from "../../components/learnComponents/multipleChoiceQuestion/MultipleChoiceQuestion";
import TrueFalseQuestion from "../../components/learnComponents/trueFalseQuestion/TrueFalseQuestion";
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
  question: string;
  answerOptions?: string[];
}

function LearnSession() {
  const { setId } = useParams<{ setId: string }>();
  const { openOverlay } = useOverlay();
  const [state, setState] = useState<
    "loading" | "error" | "overlay" | "active" | "startNextRound"
  >("loading");
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [sessionExists, setSessionExists] = useState<boolean | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [anotherRound, setAnotherRound] = useState<boolean>(false);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
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
          setSessionId(sessionExistsCheck.learnSessionId);
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
      setSessionId(sessionId);
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

  const handleCheckAnswer = async () => {
    if (!sessionId || !selectedAnswer) return;
    const currentQuestion = questions[questionIndex];
    try {
      let submittedAnswer = selectedAnswer;
      if (currentQuestion.type === "trueFalse") {
        submittedAnswer =
          selectedAnswer === "True"
            ? currentQuestion.answerOptions![0]
            : currentQuestion.answerOptions![1];
      }
      const isCorrect = await checkLearnSessionAnswer(
        sessionId,
        currentQuestion.order,
        submittedAnswer,
      );
      if (!isCorrect.isCorrect) {
        setWrongAnswer(isCorrect.correctAnswer);
        return;
      }
      setSelectedAnswer(null);
      setWrongAnswer(null);
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(questionIndex + 1);
      } else {
        const canContinue = await checkCanContinueLearnSession(sessionId);
        if (canContinue.canContinue) {
          setAnotherRound(true);
        } else {
          setAnotherRound(false);
        }
        setState("startNextRound");
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const handleNextQuestion = async () => {
    setSelectedAnswer(null);
    setWrongAnswer(null);
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      const canContinue = await checkCanContinueLearnSession(sessionId!);
      if (canContinue.canContinue) {
        setAnotherRound(true);
      } else {
        setAnotherRound(false);
      }
      setState("startNextRound");
    }
  };

  const handleStartNextRound = async () => {
    if (!sessionId) return;
    try {
      const learnSessionQuestions = await getLearnSession(sessionId);
      setQuestions(learnSessionQuestions.questions);
      setQuestionIndex(0);
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

  const handleStartNewSession = async () => {
    if (!setId) return;
    try {
      if (sessionId) {
        await endLearnSession(sessionId).catch(); // Ignore error incase session has already ended
      }
      openOverlay(
        <StartLearnSession
          setId={setId}
          onSessionStarted={handleSessionStarted}
        />,
        false,
      );
      setState("overlay");
    } catch (error) {
      console.error("Error ending learn session:", error);
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
              <button
                className={styles.startNextRoundButton}
                onClick={handleStartNextRound}
              >
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
      <div className={styles.learnSessionContainer}>
        {questions[questionIndex].type === "multipleChoice" && (
          <MultipleChoiceQuestion
            question={questions[questionIndex]}
            selectedAnswer={selectedAnswer}
            wrongAnswer={wrongAnswer}
            onAnswerSelected={(answer: string) => setSelectedAnswer(answer)}
            nextQuestion={handleNextQuestion}
            onAnswerSubmitted={handleCheckAnswer}
            handleResetSession={handleStartNewSession}
          />
        )}
        {questions[questionIndex].type === "trueFalse" && (
          <TrueFalseQuestion
            question={questions[questionIndex]}
            selectedAnswer={selectedAnswer}
            wrongAnswer={wrongAnswer}
            onAnswerSelected={(answer: string) => setSelectedAnswer(answer)}
            nextQuestion={handleNextQuestion}
            onAnswerSubmitted={handleCheckAnswer}
            handleResetSession={handleStartNewSession}
          />
        )}
      </div>
    </div>
  );
}

export default LearnSession;
