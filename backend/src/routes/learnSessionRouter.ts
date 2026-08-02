import { Router } from "express";
import authenticate from "../middleware/authenticate";
import {
  startLearnSession,
  checkLearnSessionAnswer,
  checkLearnSessionExists,
} from "../controllers/learnSessionController";

const router = Router();

router.post("/start", authenticate, async (req: any, res: any) => {
  const {
    setId,
    amountPerSession,
    multipleChoiceAmount,
    trueFalseAmount,
    writtenAmount,
  } = req.body as {
    setId: string;
    amountPerSession: number;
    multipleChoiceAmount: number;
    trueFalseAmount: number;
    writtenAmount: number;
  };

  if (!setId) {
    return res.status(400).json({ message: "Set ID is required" });
  }

  if (
    !amountPerSession ||
    !multipleChoiceAmount ||
    !trueFalseAmount ||
    !writtenAmount
  ) {
    return res.status(400).json({ message: "Session settings are required" });
  }

  await startLearnSession(req, res);
});

router.post("/check/:sessionId", authenticate, async (req: any, res: any) => {
  const { sessionId } = req.params;
  const { questionOrder, answer } = req.body as {
    questionOrder: number;
    answer: string;
  };

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }

  if (!questionOrder || !answer) {
    return res.status(400).json({ message: "Question info is required" });
  }

  await checkLearnSessionAnswer(req, res);
});

router.get("/flashcard/:setId", authenticate, async (req: any, res: any) => {
  const { setId } = req.params;

  if (!setId) {
    return res.status(400).json({ message: "Set ID is required" });
  }

  await checkLearnSessionExists(req, res);
});

router.get("/:sessionId", authenticate, async (req: any, res: any) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }

  // Get session
});

export default router;
