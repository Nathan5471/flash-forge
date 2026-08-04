-- CreateTable
CREATE TABLE "MatchingLeaderboardEntry" (
    "id" TEXT NOT NULL,
    "matchingLeaderboardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "MatchingLeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchingLeaderboard" (
    "id" TEXT NOT NULL,
    "flashcardSetId" TEXT NOT NULL,

    CONSTRAINT "MatchingLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchingLeaderboardEntry_matchingLeaderboardId_userId_key" ON "MatchingLeaderboardEntry"("matchingLeaderboardId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchingLeaderboard_flashcardSetId_key" ON "MatchingLeaderboard"("flashcardSetId");

-- AddForeignKey
ALTER TABLE "MatchingLeaderboardEntry" ADD CONSTRAINT "MatchingLeaderboardEntry_matchingLeaderboardId_fkey" FOREIGN KEY ("matchingLeaderboardId") REFERENCES "MatchingLeaderboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingLeaderboardEntry" ADD CONSTRAINT "MatchingLeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingLeaderboard" ADD CONSTRAINT "MatchingLeaderboard_flashcardSetId_fkey" FOREIGN KEY ("flashcardSetId") REFERENCES "FlashcardSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
