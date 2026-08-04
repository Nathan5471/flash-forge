/*
  Warnings:

  - Added the required column `length` to the `MatchingLeaderboardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchingLeaderboardEntry" ADD COLUMN     "length" INTEGER NOT NULL;
