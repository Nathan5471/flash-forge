import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import { Prisma } from "../generated/prisma/client";

export type AuthUser = Prisma.UserGetPayload<{
  include: {
    flashcardSets: { include: { creator: true; flashcards: true } };
    viewedFlashcardSets: {
      include: {
        flashcardSet: { include: { creator: true; flashcards: true } };
      };
    };
  };
}>;

const nonRequiredAuthenticate = async (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    return next();
  }
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        flashcardSets: { include: { creator: true, flashcards: true } },
        viewedFlashcardSets: {
          take: 10,
          orderBy: { viewedAt: "desc" },
          include: {
            flashcardSet: { include: { creator: true, flashcards: true } },
          },
        },
      },
    });
    if (!user) {
      res.clearCookie("token");
      req.user = null;
      return next();
    }
    req.user = user;
    return next();
  } catch (error) {
    res.clearCookie("token");
    req.user = null;
    return next();
  }
};

export default nonRequiredAuthenticate;
