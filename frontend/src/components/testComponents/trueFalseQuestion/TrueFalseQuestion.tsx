import { useState } from "react";
import styles from "./TrueFalseQuesiton.module.css";

interface Question {
  type: "multipleChoice" | "written" | "trueFalse" | "matching";
  term: string;
  definition: string;
  questionNumber: number;
  answers?: string[];
}

interface TrueFalseQuestionProps {
  question: Question;
  globalSubmittedAnswers: {
    [questionNumber: number]: { answer: string; isCorrect: boolean };
  };
  handleSubmitAnswer: (
    questionNumber: number,
    answer: string,
    isCorrect: boolean,
  ) => void;
  isSubmitted: boolean;
}

function TrueFalseQuestion({
  question,
  globalSubmittedAnswers,
  handleSubmitAnswer,
  isSubmitted,
}: TrueFalseQuestionProps) {
  if (question.type !== "trueFalse" || !question.answers) {
    throw new Error(
      `Invalid question type: ${question.type}. Expected "trueFalse".`,
    );
  }

  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(
    globalSubmittedAnswers[question.questionNumber]?.answer === "true"
      ? true
      : globalSubmittedAnswers[question.questionNumber]?.answer === "false"
        ? false
        : null,
  );

  const handleAnswerSelect = (answer: boolean) => {
    if (isSubmitted) return;
    setSelectedAnswer(answer);
  };

  return (
    <div className={styles.trueFalseQuestionContainer}>
      <h2>
        {question.questionNumber}. {question.term}
      </h2>
      <p>Answer: {question.answers[0]} (Is this true or false?)</p>
      <div className={styles.answersGrid}>
        <button
          className={`${styles.answerButton} ${!isSubmitted && selectedAnswer === true ? styles.selectedAnswer : ""} ${isSubmitted && question.answers[0] === question.definition ? styles.correctAnswer : ""} ${isSubmitted && selectedAnswer === true && question.answers[0] !== question.definition ? styles.incorrectAnswer : ""}`}
          onClick={() => handleAnswerSelect(true)}
          disabled={isSubmitted}
        >
          True
        </button>
        <button
          className={`${styles.answerButton} ${!isSubmitted && selectedAnswer === false ? styles.selectedAnswer : ""} ${isSubmitted && question.answers[0] !== question.definition ? styles.correctAnswer : ""} ${isSubmitted && selectedAnswer === false && question.answers[0] !== question.definition ? styles.incorrectAnswer : ""}`}
          onClick={() => handleAnswerSelect(false)}
          disabled={isSubmitted}
        >
          False
        </button>
      </div>
    </div>
  );
}

export default TrueFalseQuestion;
