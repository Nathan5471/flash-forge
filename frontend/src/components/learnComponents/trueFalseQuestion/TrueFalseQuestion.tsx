import styles from "./TrueFalseQuestion.module.css";

interface Question {
  order: number;
  type: "multipleChoice" | "trueFalse" | "written";
  question: string;
  answerOptions?: string[];
}

interface TrueFalseQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  wrongAnswer: string | null;
  onAnswerSelected: (selectedAnswer: string) => void;
  onAnswerSubmitted: () => void;
  nextQuestion: () => void;
  handleResetSession: () => void;
}

function TrueFalseQuestion({
  question,
  selectedAnswer,
  wrongAnswer,
  onAnswerSelected,
  onAnswerSubmitted,
  nextQuestion,
  handleResetSession,
}: TrueFalseQuestionProps) {
  if (question.type !== "trueFalse" || !question.answerOptions) {
    throw new Error(
      "Invalid question type or missing answer choices for TrueFalseQuestion component.",
    );
  }

  return (
    <div className={styles.trueFalseContainer}>
      <h2>{question.question}</h2>
      <p>Answer: {question.answerOptions[0]} (True/False?)</p>
      <div className={styles.answerOptions}>
        <button
          className={`${selectedAnswer === "True" && !wrongAnswer ? styles.selected : ""} ${wrongAnswer && selectedAnswer === "True" ? styles.wrong : ""} ${wrongAnswer === question.answerOptions[0] ? styles.correct : ""}`}
          onClick={() => onAnswerSelected("True")}
          disabled={wrongAnswer !== null}
        >
          True
        </button>
        <button
          className={`${selectedAnswer === "False" && !wrongAnswer ? styles.selected : ""} ${wrongAnswer && selectedAnswer === "False" ? styles.wrong : ""} ${wrongAnswer !== question.answerOptions[0] && wrongAnswer !== null ? styles.correct : ""}`}
          onClick={() => onAnswerSelected("False")}
          disabled={wrongAnswer !== null}
        >
          False
        </button>
      </div>
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

export default TrueFalseQuestion;
