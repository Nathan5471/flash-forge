import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { getFlashcardSet } from "../../utils/FlashcardAPIHandler";
import generateQuestions from "../../utils/generateQuestions";
import Navbar from "../../components/navbar/Navbar";
import TestSettings from "../../components/testSettings/TestSettings";
import styles from "./Test.module.css";

interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  creator: string;
  flashcards: { index: number; term: string; definition: string }[];
  views: number;
}

interface TestSettingsValues {
  questionCount: number;
  multipleChoice: boolean;
  written: boolean;
  trueFalse: boolean;
  matching: boolean;
}

interface Question {
  type: "multipleChoice" | "written" | "trueFalse" | "matching";
  term: string;
  definition: string;
  questionNumber: number;
}

function Test() {
  const { setId } = useParams<{ setId: string }>();
  const { openOverlay } = useOverlay();
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const flashcardSetRef = useRef<FlashcardSet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTestSettingOverlay, setShowTestSettingOverlay] = useState(true);
  const [testSettings, setTestSettings] = useState<{
    questionCount: number;
    multipleChoice: boolean;
    written: boolean;
    trueFalse: boolean;
    matching: boolean;
  }>({
    questionCount: 10,
    multipleChoice: true,
    written: true,
    trueFalse: true,
    matching: true,
  });
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<
    Question[]
  >([]);
  const [writtenQuestions, setWrittenQuestions] = useState<Question[]>([]);
  const [trueFalseQuestions, setTrueFalseQuestions] = useState<Question[]>([]);
  const [matchingQuestions, setMatchingQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!setId) {
      setFlashcardSet(null);
      setError("No set ID provided.");
      return;
    }
    const controller = new AbortController();

    const fetchFlashcardSet = async () => {
      try {
        const data = await getFlashcardSet(setId, controller.signal);
        setFlashcardSet(data.flashcardSet);
        flashcardSetRef.current = data.flashcardSet;
        openOverlay(
          <TestSettings
            flashcardCount={data.flashcardSet.flashcards.length}
            flashcardSetId={data.flashcardSet.id}
            handleStartTest={handleStartTest}
          />,
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
        setShowTestSettingOverlay(false);
      }
    };
    fetchFlashcardSet();

    return () => {
      controller.abort();
    };
  }, [setId]);

  const handleStartTest = (settings: TestSettingsValues) => {
    if (!flashcardSetRef.current) {
      return;
    }
    console.log("Starting Test");
    setTestSettings(settings);
    setShowTestSettingOverlay(false);
    const generatedQuestions = generateQuestions(
      flashcardSetRef.current.flashcards,
      settings,
    );
    setMultipleChoiceQuestions(
      generatedQuestions.filter(
        (question) => question.type === "multipleChoice",
      ),
    );
    setWrittenQuestions(
      generatedQuestions.filter((question) => question.type === "written"),
    );
    setTrueFalseQuestions(
      generatedQuestions.filter((question) => question.type === "trueFalse"),
    );
    setMatchingQuestions(
      generatedQuestions.filter((question) => question.type === "matching"),
    );
    console.log("Generated Questions:", generatedQuestions);
  };

  if (showTestSettingOverlay) {
    return (
      <div className={styles.testPage}>
        <Navbar />
      </div>
    );
  }

  if (!flashcardSet) {
    return (
      <div className={styles.testPage}>
        <Navbar />
        <div className={styles.errorContainer}>
          <div className={styles.errorBox}>
            <h1>Flashcard set not found or an error occurred</h1>
            {error && <p>{error}</p>}
            <Link to="/" className={styles.errorLink}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.testPage}>
      <Navbar />
      <div className={styles.testContainer}>
        <h1>{flashcardSet.name} Test</h1>
        {testSettings.multipleChoice && (
          <div className={styles.questionTypeContainer}>
            {multipleChoiceQuestions.map((question) => (
              <>
                {question.questionNumber}. {question.term} -{" "}
                {question.definition}
              </>
            ))}
          </div>
        )}
        {testSettings.written && (
          <div className={styles.questionTypeContainer}>
            {writtenQuestions.map((question) => (
              <>
                {question.questionNumber}. {question.term} -{" "}
                {question.definition}
              </>
            ))}
          </div>
        )}
        {testSettings.trueFalse && (
          <div className={styles.questionTypeContainer}>
            {trueFalseQuestions.map((question) => (
              <>
                {question.questionNumber}. {question.term} -{" "}
                {question.definition}
              </>
            ))}
          </div>
        )}
        {testSettings.matching && (
          <div className={styles.questionTypeContainer}>
            {matchingQuestions.map((question) => (
              <>
                {question.questionNumber}. {question.term} -{" "}
                {question.definition}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;
