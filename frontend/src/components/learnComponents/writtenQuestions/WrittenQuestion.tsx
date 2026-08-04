import styles from "./WrittenQuestion.module.css";

interface Question {
  order: number;
  type: "multipleChoice" | "trueFalse" | "written";
  question: string;
}

interface WrittenQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  wrongAnswer: string | null;
  onAnswerSelected: (selectedAnswer: string) => void;
  onAnswerSubmitted: () => void;
  nextQuestion: () => void;
  handleResetSession: () => void;
}

function WrittenQuestion({
  question,
  selectedAnswer,
  wrongAnswer,
  onAnswerSelected,
  onAnswerSubmitted,
  nextQuestion,
  handleResetSession,
}: WrittenQuestionProps) {
  if (question.type !== "written") {
    throw new Error(
      "Invalid question type for WrittenQuestion component. Expected 'written'.",
    );
  }

  return (
    <div className={styles.writtenContainer}>
      <h2>{question.question}</h2>
      <input
        type="text"
        value={selectedAnswer || ""}
        onChange={(e) => onAnswerSelected(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && selectedAnswer !== null) {
            e.preventDefault();
            wrongAnswer ? nextQuestion() : onAnswerSubmitted();
          }
        }}
        placeholder="Type your answer here..."
        className={wrongAnswer !== null ? styles.wrongAnswer : ""}
        disabled={wrongAnswer !== null}
      />
      {wrongAnswer && (
        <p className={styles.wrongAnswerText}>
          The correct answer was <span>{wrongAnswer}</span>
        </p>
      )}
      <div className={styles.submitContainer}>
        <button
          onClick={wrongAnswer ? nextQuestion : onAnswerSubmitted}
          className={styles.submitButton}
          disabled={selectedAnswer === null}
        >
          {wrongAnswer ? "Next" : "Submit"}
        </button>
        <button onClick={handleResetSession} className={styles.resetButton}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default WrittenQuestion;
