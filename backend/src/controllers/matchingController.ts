import prisma from "../prisma/client";
import type { AuthUser } from "../middleware/authenticate";

export const postLeaderboardSubmission = async (req: any, res: any) => {
  const user = req.user as AuthUser;
  const { id } = req.params as { id: string };
  const { startTime, endTime } = req.body as {
    startTime: string;
    endTime: string;
  };

  try {
    const leaderboard = await prisma.matchingLeaderboard.findUnique({
      where: { id },
      include: { matchingLeaderboardEntries: true },
    });
    if (!leaderboard) {
      return res
        .status(404)
        .json({ message: "Matching leaderboard not found" });
    }
    const length = new Date(endTime).getTime() - new Date(startTime).getTime();
    await prisma.matchingLeaderboardEntry.upsert({
      where: {
        matchingLeaderboardId_userId: {
          matchingLeaderboardId: leaderboard.id,
          userId: user.id,
        },
      },
      update: {
        length,
      },
      create: {
        matchingLeaderboardId: leaderboard.id,
        userId: user.id,
        length,
      },
    });

    return res.status(200).json({ message: "Leaderboard submission posted" });
  } catch (error) {
    console.error("Error posting leaderboard submission:", error);
    return res
      .status(500)
      .json({ message: "Failed to post leaderboard submission" });
  }
};

export const getMatchingLeaderboardId = async (req: any, res: any) => {
  const { flashcardSetId } = req.params as { flashcardSetId: string };

  try {
    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id: flashcardSetId },
    });
    if (!flashcardSet) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }
    let leaderboard = await prisma.matchingLeaderboard.findUnique({
      where: { flashcardSetId },
    });
    if (!leaderboard) {
      leaderboard = await prisma.matchingLeaderboard.create({
        data: { flashcardSetId },
      });
    }
    return res.status(200).json({ id: leaderboard.id });
  } catch (error) {
    console.error("Error retrieving matching leaderboard:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve matching leaderboard" });
  }
};

export const loadMatch = async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  try {
    const leaderboard = await prisma.matchingLeaderboard.findUnique({
      where: { id },
      include: {
        flashcardSet: {
          include: {
            flashcards: true,
          },
        },
      },
    });
    if (!leaderboard) {
      return res
        .status(404)
        .json({ message: "Matching leaderboard not found" });
    }
    const flashcards = leaderboard.flashcardSet.flashcards;
    const chosenFlashcards = [];
    while (chosenFlashcards.length < 6 && flashcards.length > 0) {
      const randomIndex = Math.floor(Math.random() * flashcards.length);
      chosenFlashcards.push(flashcards[randomIndex]);
      flashcards.splice(randomIndex, 1);
    }
    const flashcardData = chosenFlashcards.map((flashcard) => ({
      id: flashcard.id,
      term: flashcard.term,
      definition: flashcard.definition,
    }));
    return res.status(200).json({ flashcards: flashcardData });
  } catch (error) {
    console.error("Error loading match:", error);
    return res.status(500).json({ message: "Failed to load match" });
  }
};

export const getLeaderboard = async (req: any, res: any) => {
  const user = req.user as AuthUser;
  const { id } = req.params as { id: string };

  try {
    const leaderboard = await prisma.matchingLeaderboard.findUnique({
      where: { id },
      include: {
        matchingLeaderboardEntries: {
          orderBy: { length: "asc" },
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    if (!leaderboard) {
      return res
        .status(404)
        .json({ message: "Matching leaderboard not found" });
    }
    const leaderboardEntries = leaderboard.matchingLeaderboardEntries.map(
      (entry, index) => ({
        position: index + 1,
        username: entry.user.username,
        length: entry.length,
      }),
    );
    const selectedEntries = leaderboardEntries.filter(
      (entry, index) => index < 10 || entry.username === user.username,
    );
    return res.status(200).json({ leaderboard: selectedEntries });
  } catch (error) {
    console.error("Error retrieving leaderboard:", error);
    return res.status(500).json({ message: "Failed to retrieve leaderboard" });
  }
};
