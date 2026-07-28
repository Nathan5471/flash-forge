import express from "express";
import { signup, login } from "../controllers/authController";
import authenticate from "../middleware/authenticate";
import type { AuthUser } from "../middleware/authenticate";

const router = express.Router();

router.post("/signup", async (req: any, res: any) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  await signup(req, res);
});

router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  await login(req, res);
});

router.get("/me", authenticate, async (req: any, res: any) => {
  const user = req.user as AuthUser;

  return res.status(200).json({
    message: "Authenticated",
    user: {
      id: user.id,
      username: user.username,
      flashcardSets: user.flashcardSets.map((set: any) => ({
        id: set.id,
        name: set.name,
        description: set.description,
        creator: set.creator.username,
        flashcards: set.flashcards.length,
      })),
      viewedFlashcardSets: user.viewedFlashcardSets.map((set: any) => ({
        id: set.id,
        name: set.name,
        description: set.description,
        creator: set.creator.username,
        flashcards: set.flashcards.length,
      })),
    },
  });
});

export default router;
