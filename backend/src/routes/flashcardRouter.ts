import express from "express";
import authenticate from "../middleware/authenticate";
import nonRequiredAuthenticate from "../middleware/nonRequiredAuthenticate";
import {
  createFlashcardSet,
  getFlashcardSet,
} from "../controllers/flashcardController";

const router = express.Router();

router.post("/create", authenticate, async (req: any, res: any) => {
  const { name, description, cards } = req.body as {
    name: string;
    description: string;
    cards: { index: number; term: string; definition: string }[];
  };

  for (const card of cards) {
    if (!card.index || typeof card.index !== "number" || card.index < 0) {
      return res.status(400).json({ message: "Invalid card index" });
    }
    if (
      !card.term ||
      typeof card.term !== "string" ||
      card.term.trim() === ""
    ) {
      return res.status(400).json({ message: "Invalid card term" });
    }
    if (
      !card.definition ||
      typeof card.definition !== "string" ||
      card.definition.trim() === ""
    ) {
      return res.status(400).json({ message: "Invalid card definition" });
    }
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

export default router;
