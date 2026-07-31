import express from "express";
import authenticate from "../middleware/authenticate";
import nonRequiredAuthenticate from "../middleware/nonRequiredAuthenticate";
import {
  createFlashcardSet,
  getFlashcardSet,
  getRecentlyViewedFlashcardSets,
  getCreatedFlashcardSets,
  getFlashcardSetsByUsername,
  getPopularFlashcardSets,
  getRecentlyCreatedFlashcardSets,
  getRecentlyEditedFlashcardSets,
} from "../controllers/flashcardController";

const router = express.Router();

router.post("/create", authenticate, async (req: any, res: any) => {
  const { name, description, flashcards } = req.body as {
    name: string;
    description: string;
    flashcards: { index: number; term: string; definition: string }[];
  };

  for (const flashcard of flashcards) {
    if (
      flashcard.index === null ||
      flashcard.index === undefined ||
      typeof flashcard.index !== "number" ||
      flashcard.index < 0
    ) {
      return res.status(400).json({ message: "Invalid card index" });
    }
    if (
      !flashcard.term ||
      typeof flashcard.term !== "string" ||
      flashcard.term.trim() === ""
    ) {
      return res.status(400).json({ message: "Invalid card term" });
    }
    if (
      !flashcard.definition ||
      typeof flashcard.definition !== "string" ||
      flashcard.definition.trim() === ""
    ) {
      return res.status(400).json({ message: "Invalid card definition" });
    }
  }

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }

  await createFlashcardSet(req, res);
});

router.get(
  "/set/:setId",
  nonRequiredAuthenticate,
  async (req: any, res: any) => {
    const { setId } = req.params as { setId: string };

    if (!setId) {
      return res.status(400).json({ message: "setId is required" });
    }

    await getFlashcardSet(req, res);
  },
);

router.get("/recently-viewed", authenticate, getRecentlyViewedFlashcardSets);

router.get("/created", authenticate, getCreatedFlashcardSets);

router.get("/user/:username", async (req: any, res: any) => {
  const { username } = req.params as { username: string };

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  await getFlashcardSetsByUsername(req, res);
});

router.get("/popular", getPopularFlashcardSets);

router.get("/recently-created", getRecentlyCreatedFlashcardSets);

router.get("/recently-edited", getRecentlyEditedFlashcardSets);

export default router;
