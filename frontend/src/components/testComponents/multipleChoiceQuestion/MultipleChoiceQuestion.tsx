import { useState, useEffect } from "react";
import styles from "./MultipleChoiceQuestion.module.css";

interface Question {
  type: "multipleChoice" | "written" | "trueFalse" | "matching";
  term: string;
  definition: string;
  questionNumber: number;
  answers?: string[];
}

interface MultipleChoiceQuestionProps {
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

function MultipleChoiceQuestion({
  question,
  globalSubmittedAnswers,
  handleSubmitAnswer,
  isSubmitted,
}: MultipleChoiceQuestionProps) {
  if (question.type !== "multipleChoice" || !question.answers) {
    throw new Error(
      `Invalid question type: ${question.type}. Expected "multipleChoice".`,
    );
  }

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    globalSubmittedAnswers[question.questionNumber]?.answer || null,
  );

  useEffect(() => {
    if (!isSubmitted) return;
  });

  const handleAnswerSelect = (answer: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(answer);
  };

  return (
    <div className={styles.multipleChoiceQuestionContainer}>
      <h2>
        {question.questionNumber}. {question.term}
      </h2>
      <div className={styles.answersGrid}>
        {question.answers.map((answer, index) => (
          <button
            key={index}
            className={`${styles.answerButton} ${!isSubmitted && selectedAnswer === answer ? styles.selectedAnswer : ""} ${isSubmitted && answer === question.definition ? styles.correctAnswer : ""} ${isSubmitted && selectedAnswer === answer && answer !== question.definition ? styles.incorrectAnswer : ""}`}
            onClick={() => handleAnswerSelect(answer)}
            disabled={isSubmitted}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MultipleChoiceQuestion;
