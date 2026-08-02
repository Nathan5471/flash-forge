import styles from "./WrittenQuestion.module.css";

interface Question {
  type: "multipleChoice" | "written" | "trueFalse" | "matching";
  term: string;
  definition: string;
  questionNumber: number;
}

interface WrittenQuestionProps {
  question: Question;
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

function WrittenQuestion({
  question,
  selectedAnswers,
  handleSelectAnswer,
  isSubmitted,
}: WrittenQuestionProps) {
  if (question.type !== "written") {
    throw new Error(
      `Invalid question type: ${question.type}. Expected "written".`,
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitted) return;
    handleSelectAnswer(
      question.questionNumber,
      e.target.value,
      e.target.value.trim().toLowerCase() ===
        question.definition.trim().toLowerCase(),
    );
  };

  return (
    <div className={styles.writtenQuestionContainer}>
      <h2>
        {question.questionNumber}. {question.term}
      </h2>
      <input
        type="text"
        value={
          selectedAnswers[question.questionNumber]?.answer ||
          (isSubmitted ? "No answer submitted" : "")
        }
        onChange={handleInputChange}
        disabled={isSubmitted}
        className={`${styles.answerInput} ${isSubmitted && selectedAnswers[question.questionNumber]?.answer.trim().toLowerCase() === question.definition.trim().toLowerCase() ? styles.correctAnswer : ""} ${isSubmitted && selectedAnswers[question.questionNumber]?.answer.trim().toLowerCase() !== question.definition.trim().toLowerCase() ? styles.incorrectAnswer : ""}`}
      />
      {isSubmitted &&
        selectedAnswers[question.questionNumber]?.answer
          .trim()
          .toLowerCase() !== question.definition.trim().toLowerCase() && (
          <p className={styles.correctAnswerText}>
            The correct answer is <span>{question.definition}</span>
          </p>
        )}
    </div>
  );
}

export default WrittenQuestion;
