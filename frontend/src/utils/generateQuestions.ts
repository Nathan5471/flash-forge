interface Flashcard {
  index: number;
  term: string;
  definition: string;
}

interface TestSettingsValues {
  questionCount: number;
  multipleChoice: boolean;
  written: boolean;
  trueFalse: boolean;
  matching: boolean;
}

interface Question {
  type: "multipleChoice" | "written" | "trueFalse" | "matching";
  term: string;
  definition: string;
  questionNumber: number;
}

const handleShuffle = (flashcards: Flashcard[]) => {
  const shuffled = [...flashcards];
  var n = flashcards.length,
    t,
    i;
  while (n) {
    i = (Math.random() * n--) | 0;
    t = shuffled[n];
    shuffled[n] = shuffled[i];
    shuffled[i] = t;
  }
  return shuffled;
};

const generateQuestions = (
  flashcards: Flashcard[],
  settings: TestSettingsValues,
) => {
  const { questionCount, multipleChoice, written, trueFalse, matching } =
    settings;
  const availableQuestionTypes: Question["type"][] = [];
  if (multipleChoice) availableQuestionTypes.push("multipleChoice");
  if (written) availableQuestionTypes.push("written");
  if (trueFalse) availableQuestionTypes.push("trueFalse");
  if (matching) availableQuestionTypes.push("matching");
  const questions: Question[] = [];
  const shuffledFlashcards = handleShuffle(flashcards);

  for (let i = 0; i < questionCount; i++) {
    const questionType =
      availableQuestionTypes[i % availableQuestionTypes.length];
    const flashcard = shuffledFlashcards[i];
    questions.push({
      type: questionType as Question["type"],
      term: flashcard.term,
      definition: flashcard.definition,
      questionNumber: 1,
    });
  }

  const sortedQuestions = questions.sort(
    (a, b) =>
      availableQuestionTypes.indexOf(a.type) -
      availableQuestionTypes.indexOf(b.type),
  );
  const questionsWithNumbers = sortedQuestions.map((question, index) => ({
    ...question,
    questionNumber: index + 1,
  }));
  return questionsWithNumbers;
};

export default generateQuestions;
