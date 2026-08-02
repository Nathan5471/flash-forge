-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('multipleChoice', 'trueFalse', 'written');

-- CreateTable
CREATE TABLE "LearnSessionQuestion" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "QuestionType" NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "learnSessionId" TEXT NOT NULL,

    CONSTRAINT "LearnSessionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnSession" (
    "id" TEXT NOT NULL,
    "amountPerSession" INTEGER NOT NULL,
    "multipleChoiceAmount" INTEGER NOT NULL,
    "trueFalseAmount" INTEGER NOT NULL,
    "writtenAmount" INTEGER NOT NULL,
    "flashcardSetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LearnSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearnSession_flashcardSetId_userId_key" ON "LearnSession"("flashcardSetId", "userId");

-- AddForeignKey
ALTER TABLE "LearnSessionQuestion" ADD CONSTRAINT "LearnSessionQuestion_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnSessionQuestion" ADD CONSTRAINT "LearnSessionQuestion_learnSessionId_fkey" FOREIGN KEY ("learnSessionId") REFERENCES "LearnSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnSession" ADD CONSTRAINT "LearnSession_flashcardSetId_fkey" FOREIGN KEY ("flashcardSetId") REFERENCES "FlashcardSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnSession" ADD CONSTRAINT "LearnSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
