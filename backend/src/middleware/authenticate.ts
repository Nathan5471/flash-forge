import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import { Prisma } from "../../generated/prisma";

export type AuthUser = Prisma.UserGetPayload<{
  include: {
    flashcardSets: { include: { creator: true; flashcards: true } };
    viewedFlashcardSets: { include: { creator: true; flashcards: true } };
  };
}>;

const authenticate = async (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        flashcardSets: { include: { creator: true, flashcards: true } },
        viewedFlashcardSets: { include: { creator: true, flashcards: true } },
      },
    });
    if (!user) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    return next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authenticate;
