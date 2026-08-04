import express from "express";
import {
  postLeaderboardSubmission,
  getMatchingLeaderboardId,
  loadMatch,
} from "../controllers/matchingController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/submission/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { startTime, endTime } = req.body as {
    startTime: string;
    endTime: string;
  };

  if (!id) {
    return res.status(400).json({ message: "Missing matching leaderboard id" });
  }

  if (!startTime || !endTime) {
    return res.status(400).json({ message: "Missing start time or end time" });
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return res
      .status(400)
      .json({ message: "Start time must be before end time" });
  }

  await postLeaderboardSubmission(req, res);
});

router.get(
  "/matching-id/:flashcardSetId",
  authenticate,
  async (req: any, res: any) => {
    const { flashcardSetId } = req.params as { flashcardSetId: string };

    if (!flashcardSetId) {
      return res.status(400).json({ message: "Missing flashcard set id" });
    }

    await getMatchingLeaderboardId(req, res);
  },
);

router.get("/match/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Missing matching leaderboard id" });
  }

  await loadMatch(req, res);
});

router.get("/leaderboard/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Missing matching leaderboard id" });
  }
});

export default router;
