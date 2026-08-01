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

function TrueFalseQuestion({
  question,
  selectedAnswers,
  handleSelectAnswer,
  isSubmitted,
}: TrueFalseQuestionProps) {
  if (question.type !== "trueFalse" || !question.answers) {
    throw new Error(
      `Invalid question type: ${question.type}. Expected "trueFalse".`,
    );
  }

  const handleAnswerSelect = (answer: string) => {
    if (isSubmitted || !question.answers) return;
    handleSelectAnswer(
      question.questionNumber,
      answer,
      answer === "true"
        ? question.definition === question.answers[0]
        : question.definition !== question.answers[0],
    );
  };

  return (
    <div className={styles.trueFalseQuestionContainer}>
      <h2>
        {question.questionNumber}. {question.term}
      </h2>
      <p>Answer: {question.answers[0]} (Is this true or false?)</p>
      <div className={styles.answersGrid}>
        <button
          className={`${styles.answerButton} ${!isSubmitted && selectedAnswers[question.questionNumber]?.answer === "true" ? styles.selectedAnswer : ""} ${isSubmitted && question.answers[0] === question.definition ? styles.correctAnswer : ""} ${isSubmitted && selectedAnswers[question.questionNumber]?.answer === "true" && question.answers[0] !== question.definition ? styles.incorrectAnswer : ""}`}
          onClick={() => handleAnswerSelect("true")}
          disabled={isSubmitted}
        >
          True
        </button>
        <button
          className={`${styles.answerButton} ${!isSubmitted && selectedAnswers[question.questionNumber]?.answer === "false" ? styles.selectedAnswer : ""} ${isSubmitted && question.answers[0] !== question.definition ? styles.correctAnswer : ""} ${isSubmitted && selectedAnswers[question.questionNumber]?.answer === "false" && question.answers[0] !== question.definition ? styles.incorrectAnswer : ""}`}
          onClick={() => handleAnswerSelect("false")}
          disabled={isSubmitted}
        >
          False
        </button>
      </div>
    </div>
  );
}

export default TrueFalseQuestion;
