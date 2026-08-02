import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { getFlashcardSet } from "../../utils/FlashcardAPIHandler";
import generateQuestions from "../../utils/generateQuestions";
import Navbar from "../../components/navbar/Navbar";
import TestSettings from "../../components/testSettings/TestSettings";
import MultipleChoiceQuestion from "../../components/testComponents/multipleChoiceQuestion/MultipleChoiceQuestion";
import WrittenQuestion from "../../components/testComponents/writtenQuestion/WrittenQuestion";
import TrueFalseQuestion from "../../components/testComponents/trueFalseQuestion/TrueFalseQuestion";
import MatchingQuestions from "../../components/testComponents/matchingQuestions/MatchingQuestions";
import UnansweredQuestionsPopup from "../../components/testComponents/unansweredQuestionsPopup/UnansweredQuestionsPopup";
import GradeChart from "../../components/testComponents/gradeChart/GradeChart";
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
  answers?: string[];
}

const handleShuffle = (answers: string[]) => {
  const shuffled = [...answers];
  var n = answers.length,
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

const generateAnswers = (
  correctAnswer: string,
  flashcards: { index: number; term: string; definition: string }[],
  count: number,
) => {
  let availableAnswers = flashcards.filter(
    (flashcard) => flashcard.definition !== correctAnswer,
  );
  const answers: string[] = [correctAnswer];
  while (answers.length < count && availableAnswers.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableAnswers.length);
    const randomAnswer = availableAnswers[randomIndex].definition;
    answers.push(randomAnswer);
    availableAnswers = availableAnswers.filter(
      (flashcard) => flashcard.definition !== randomAnswer,
    );
  }
  const shuffledAnswers = handleShuffle(answers);
  return shuffledAnswers;
};

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
  const [matchingQuestions, setMatchingQuestions] = useState<{
    questions: Question[];
    shuffledAnswers: string[];
  }>({ questions: [], shuffledAnswers: [] });
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionNumber: number]: { answer: string; isCorrect: boolean };
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const testContainerRef = useRef<HTMLDivElement | null>(null);

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
    setTestSettings(settings);
    setShowTestSettingOverlay(false);
    const generatedQuestions = generateQuestions(
      flashcardSetRef.current.flashcards,
      settings,
    );
    const mcQuestionsWithOtherAnswers = generatedQuestions
      .filter((question) => question.type === "multipleChoice")
      .map((question) => ({
        ...question,
        answers: generateAnswers(
          question.definition,
          flashcardSetRef.current!.flashcards,
          4,
        ),
      }));
    const tfQuestionsWithOtherAnswers = generatedQuestions
      .filter((question) => question.type === "trueFalse")
      .map((question) => ({
        ...question,
        answers: generateAnswers(
          question.definition,
          flashcardSetRef.current!.flashcards,
          2,
        ), // There is a 50/50 chance that the first answer is the correct answer or a random wrong answer. The first answer is used in the True/False question as the displayed answer.
      }));
    const mQuestions = generatedQuestions.filter(
      (question) => question.type === "matching",
    );
    const mShuffledAnswers = handleShuffle(
      mQuestions.map((question) => question.definition),
    );

    setMultipleChoiceQuestions(mcQuestionsWithOtherAnswers);
    setWrittenQuestions(
      generatedQuestions.filter((question) => question.type === "written"),
    );
    setTrueFalseQuestions(tfQuestionsWithOtherAnswers);
    setMatchingQuestions({
      questions: mQuestions,
      shuffledAnswers: mShuffledAnswers,
    });
  };

  const handleSelectAnswer = (
    questionNumber: number,
    answer: string,
    isCorrect: boolean,
  ) => {
    if (isSubmitted) return;
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [questionNumber]: { answer, isCorrect },
    }));
  };

  const checkForUnansweredQuestions = () => {
    if (isSubmitted) return;
    const answerCount = Object.entries(selectedAnswers).filter(
      ([_, { answer }]) => answer.trim() !== "",
    ).length;
    if (answerCount < testSettings.questionCount) {
      const unansweredCount = testSettings.questionCount - answerCount;
      openOverlay(
        <UnansweredQuestionsPopup
          unansweredCount={unansweredCount}
          handleSubmitTest={handleSubmitTest}
        />,
      );
      return;
    }
    handleSubmitTest();
  };

  const handleSubmitTest = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    if (testContainerRef.current) {
      testContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleResetTest = () => {
    if (!isSubmitted || !flashcardSetRef.current) return;
    setSelectedAnswers({});
    setIsSubmitted(false);
    setMultipleChoiceQuestions([]);
    setWrittenQuestions([]);
    setTrueFalseQuestions([]);
    setMatchingQuestions({ questions: [], shuffledAnswers: [] });
    setShowTestSettingOverlay(true);
    openOverlay(
      <TestSettings
        flashcardCount={flashcardSetRef.current!.flashcards.length}
        flashcardSetId={flashcardSetRef.current!.id}
        handleStartTest={handleStartTest}
      />,
    );
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
      <div className={styles.testContainer} ref={testContainerRef}>
        <h1>{flashcardSet.name} Test</h1>
        {isSubmitted && (
          <div className={styles.testResultsContainer}>
            <div className={styles.testResultsBox}>
              <h2>Test Completed!</h2>
              <p>
                You answered{" "}
                <span>
                  {
                    Object.entries(selectedAnswers).filter(
                      ([_, { isCorrect }]) => isCorrect,
                    ).length
                  }
                </span>{" "}
                out of <span>{testSettings.questionCount}</span> questions
                correctly!
              </p>
              <div className={styles.gradeChartContainer}>
                <GradeChart
                  correctAnswers={
                    Object.entries(selectedAnswers).filter(
                      ([_, { isCorrect }]) => isCorrect,
                    ).length
                  }
                  totalQuestions={testSettings.questionCount}
                />
                <p>
                  {Math.round(
                    (Object.entries(selectedAnswers).filter(
                      ([_, { isCorrect }]) => isCorrect,
                    ).length /
                      testSettings.questionCount) *
                      100,
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        )}
        {testSettings.multipleChoice && (
          <div className={styles.questionTypeContainer}>
            {multipleChoiceQuestions.map((question) => (
              <MultipleChoiceQuestion
                key={question.questionNumber}
                question={question}
                selectedAnswers={selectedAnswers}
                handleSelectAnswer={handleSelectAnswer}
                isSubmitted={isSubmitted}
              />
            ))}
          </div>
        )}
        {testSettings.written && (
          <div className={styles.questionTypeContainer}>
            {writtenQuestions.map((question) => (
              <WrittenQuestion
                question={question}
                selectedAnswers={selectedAnswers}
                handleSelectAnswer={handleSelectAnswer}
                isSubmitted={isSubmitted}
              />
            ))}
          </div>
        )}
        {testSettings.trueFalse && (
          <div className={styles.questionTypeContainer}>
            {trueFalseQuestions.map((question) => (
              <TrueFalseQuestion
                question={question}
                selectedAnswers={selectedAnswers}
                handleSelectAnswer={handleSelectAnswer}
                isSubmitted={isSubmitted}
              />
            ))}
          </div>
        )}
        {testSettings.matching && (
          <div className={styles.questionTypeContainer}>
            <MatchingQuestions
              questions={matchingQuestions.questions}
              shuffledAnswers={matchingQuestions.shuffledAnswers}
              selectedAnswers={selectedAnswers}
              handleSelectAnswer={handleSelectAnswer}
              isSubmitted={isSubmitted}
            />
          </div>
        )}
        <div className={styles.submitButtonContainer}>
          <button
            className={styles.submitButton}
            onClick={
              isSubmitted ? handleResetTest : checkForUnansweredQuestions
            }
          >
            {isSubmitted ? "Retake Test" : "Submit Test"}
          </button>
          <Link to={`/set/${flashcardSet.id}`} className={styles.closeButton}>
            Back to Set
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Test;
