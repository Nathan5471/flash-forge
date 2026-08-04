import { useState } from "react";
import styles from "./MultipleChoiceQuestion.module.css";

interface Question {
  order: number;
  type: "multipleChoice" | "trueFalse" | "written";
  question: string;
  answerOptions?: string[];
}

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  wrongAnswer: string | null;
  onAnswerSelected: (selectedAnswer: string) => void;
  onAnswerSubmitted: (selectedAnswer: string) => void;
  nextQuestion: () => void;
  handleResetSession: () => void;
}

function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  wrongAnswer,
  onAnswerSelected,
  onAnswerSubmitted,
  nextQuestion,
  handleResetSession,
}: MultipleChoiceQuestionProps) {
  if (question.type !== "multipleChoice" || !question.answerOptions) {
    console.log(question);
    throw new Error(
      "Invalid question type or missing answer choices for MultipleChoiceQuestion component.",
    );
  }

  return (
    <div className={styles.multipleChoiceContainer}>
      <h2>{question.question}</h2>
      <div className={styles.answerOptions}>
        {question.answerOptions.map((answerOption, index) => (
          <button
            key={index}
            className={`${selectedAnswer === answerOption && !wrongAnswer ? styles.selected : ""} ${wrongAnswer && selectedAnswer === answerOption ? styles.wrong : ""} ${wrongAnswer === answerOption ? styles.correct : ""}`}
            onClick={() => onAnswerSelected(answerOption)}
            disabled={wrongAnswer !== null}
          >
            {answerOption}
          </button>
        ))}
      </div>
      <div className={styles.submitContainer}>
        <button
          onClick={
            wrongAnswer
              ? nextQuestion
              : () => {
                  if (selectedAnswer) {
                    onAnswerSubmitted(selectedAnswer);
                  }
                }
          }
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

export default MultipleChoiceQuestion;
