import { useState } from "react";
import styles from "./WrittenQuestion.module.css";

interface Question {
  type: "multipleChoice" | "written" | "trueFalse" | "matching";
  term: string;
  definition: string;
  questionNumber: number;
}

interface WrittenQuestionProps {
  question: Question;
  isSubmitted: boolean;
}

function WrittenQuestion({ question, isSubmitted }: WrittenQuestionProps) {
  if (question.type !== "written") {
    throw new Error(
      `Invalid question type: ${question.type}. Expected "written".`,
    );
  }

  const [userAnswer, setUserAnswer] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitted) return;
    setUserAnswer(e.target.value);
  };

  return (
    <div className={styles.writtenQuestionContainer}>
      <h2>
        {question.questionNumber}. {question.term}
      </h2>
      <input
        type="text"
        value={userAnswer}
        onChange={handleInputChange}
        disabled={isSubmitted}
        className={`${styles.answerInput} ${isSubmitted && userAnswer.trim().toLowerCase() === question.definition.trim().toLowerCase() ? styles.correctAnswer : ""} ${isSubmitted && userAnswer.trim().toLowerCase() !== question.definition.trim().toLowerCase() ? styles.incorrectAnswer : ""}`}
      />
      {isSubmitted &&
        userAnswer.trim().toLowerCase() !==
          question.definition.trim().toLowerCase() && (
          <p className={styles.correctAnswerText}>
            The correct answer is <span>{question.definition}</span>
          </p>
        )}
    </div>
  );
}

export default WrittenQuestion;
