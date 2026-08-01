import styles from "./MatchingQuestions.module.css";

interface Question {
  type: "multipleChoice" | "written" | "trueFalse" | "matching";
  term: string;
  definition: string;
  questionNumber: number;
}

interface MatchingQuestionsProps {
  questions: Question[];
  shuffledAnswers: string[];
  selectedAnswers: {
    [questionNumber: number]: { answer: string; isCorrect: boolean };
  };
  handleSelectAnswer: (
    questionNumber: number,
    answer: string,
    isCorrect: boolean,
  ) => void;
  isSubmitted: boolean;
}

function MatchingQuestions({
  questions,
  shuffledAnswers,
  selectedAnswers,
  handleSelectAnswer,
  isSubmitted,
}: MatchingQuestionsProps) {
  if (questions.some((question) => question.type !== "matching")) {
    throw new Error(
      `Invalid question type found. Expected all questions to be of type "matching".`,
    );
  }

  const handleAnswerSelect = (questionNumber: number, answer: string) => {
    if (isSubmitted) return;
    handleSelectAnswer(
      questionNumber,
      answer,
      answer ===
        questions.find((q) => q.questionNumber === questionNumber)?.definition,
    );
  };

  return (
    <div className={styles.matchingQuestionsContainer}>
      <h2>Matching Questions</h2>
      {questions.map((question) => (
        <div key={question.questionNumber} className={styles.matchingQuestion}>
          <div
            key={question.questionNumber}
            className={styles.matchingQuestionRow}
          >
            <p>
              {question.questionNumber}. {question.term}
            </p>
            <select
              value={selectedAnswers[question.questionNumber]?.answer || ""}
              onChange={(e) => {
                handleAnswerSelect(question.questionNumber, e.target.value);
              }}
              className={`${isSubmitted && selectedAnswers[question.questionNumber]?.answer === question.definition ? styles.correctAnswer : ""} ${isSubmitted && selectedAnswers[question.questionNumber]?.answer !== question.definition ? styles.incorrectAnswer : ""}`}
              disabled={isSubmitted}
            >
              <option value="" disabled>
                {isSubmitted ? "No answer selected" : "Select an answer"}
              </option>
              {shuffledAnswers.map((answer, index) => (
                <option key={index} value={answer}>
                  {answer}
                </option>
              ))}
            </select>
          </div>
          {isSubmitted &&
            selectedAnswers[question.questionNumber]?.answer !==
              question.definition && (
              <p className={styles.correctAnswerText}>
                The correct answer is <span>{question.definition}</span>
              </p>
            )}
        </div>
      ))}
    </div>
  );
}

export default MatchingQuestions;
