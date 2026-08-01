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

function MultipleChoiceQuestion({
  question,
  selectedAnswers,
  handleSelectAnswer,
  isSubmitted,
}: MultipleChoiceQuestionProps) {
  if (question.type !== "multipleChoice" || !question.answers) {
    throw new Error(
      `Invalid question type: ${question.type}. Expected "multipleChoice".`,
    );
  }

  const handleAnswerSelect = (answer: string) => {
    if (isSubmitted) return;
    handleSelectAnswer(
      question.questionNumber,
      answer,
      answer === question.definition,
    );
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
            className={`${styles.answerButton} ${!isSubmitted && selectedAnswers[question.questionNumber]?.answer === answer ? styles.selectedAnswer : ""} ${isSubmitted && answer === question.definition ? styles.correctAnswer : ""} ${isSubmitted && selectedAnswers[question.questionNumber]?.answer === answer && answer !== question.definition ? styles.incorrectAnswer : ""}`}
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
