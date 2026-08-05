import { Prisma, Flashcard } from "../generated/prisma/client";

type FlashcardSet = Prisma.FlashcardSetGetPayload<{
  include: { flashcards: true };
}>;

const shuffleFlashcards = (flashcards: Flashcard[]) => {
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

const generateLearnSessionQuestions = (
  multipleChoiceSessionAmount: number,
  trueFalseSessionAmount: number,
  writtenSessionAmount: number,
  flashcardSet: FlashcardSet,
) => {
  const questions: { type: string; flashcardId: string }[] = [];

  for (let i = 0; i < multipleChoiceSessionAmount; i++) {
    const shuffledFlashcards = shuffleFlashcards(flashcardSet.flashcards);
    for (const flashcard of shuffledFlashcards) {
      questions.push({ type: "multipleChoice", flashcardId: flashcard.id });
    }
  }
  for (let i = 0; i < trueFalseSessionAmount; i++) {
    const shuffledFlashcards = shuffleFlashcards(flashcardSet.flashcards);
    for (const flashcard of shuffledFlashcards) {
      questions.push({ type: "trueFalse", flashcardId: flashcard.id });
    }
  }
  for (let i = 0; i < writtenSessionAmount; i++) {
    const shuffledFlashcards = shuffleFlashcards(flashcardSet.flashcards);
    for (const flashcard of shuffledFlashcards) {
      questions.push({ type: "written", flashcardId: flashcard.id });
    }
  }

  return questions;
};

export default generateLearnSessionQuestions;
