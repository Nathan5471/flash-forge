/*
  Warnings:

  - A unique constraint covering the columns `[flashcardSetId,userId]` on the table `FlashcardView` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FlashcardView_flashcardSetId_userId_key" ON "FlashcardView"("flashcardSetId", "userId");
