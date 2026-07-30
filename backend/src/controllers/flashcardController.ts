import prisma from "../prisma/client";
import type { AuthUser } from "../middleware/authenticate";

export const createFlashcardSet = async (req: any, res: any) => {
  const { name, description, flashcards } = req.body as {
    name: string;
    description: string;
    flashcards: { index: number; term: string; definition: string }[];
  };
  const user = req.user as AuthUser;

  try {
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        name,
        description,
        flashcards: {
          create: flashcards.map((flashcard) => ({
            index: flashcard.index,
            term: flashcard.term,
            definition: flashcard.definition,
          })),
        },
        creatorId: user.id,
      },
    });
    return res.status(201).json({
      message: "Flashcard set created successfully",
      id: flashcardSet.id,
    });
  } catch (error) {
    console.error("Error creating flashcard set:", error);
    return res.status(500).json({ message: "Failed to create flashcard set" });
  }
};

export const getFlashcardSet = async (req: any, res: any) => {
  const { setId } = req.params as { setId: string };
  const user = req.user as AuthUser | null;

  try {
    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id: setId },
      include: {
        flashcards: true,
        creator: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    });
    if (!flashcardSet) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }
    if (user) {
      await prisma.flashcardView.upsert({
        where: {
          flashcardSetId_userId: {
            flashcardSetId: flashcardSet.id,
            userId: user.id,
          },
        },
        update: {
          viewedAt: new Date(),
        },
        create: {
          flashcardSetId: flashcardSet.id,
          userId: user.id,
        },
      });
    }
    const sortedFlashcards = flashcardSet.flashcards.sort(
      (a, b) => a.index - b.index,
    );
    const responseFlashcardSet = {
      id: flashcardSet.id,
      name: flashcardSet.name,
      description: flashcardSet.description,
      flashcards: sortedFlashcards.map((card) => ({
        index: card.index,
        term: card.term,
        definition: card.definition,
      })),
      creator: flashcardSet.creator.username,
      views: flashcardSet._count.views,
    };
    return res.status(200).json({
      message: "Flashcard set fetched successfully",
      flashcardSet: responseFlashcardSet,
    });
  } catch (error) {
    console.error("Error fetching flashcard set:", error);
    return res.status(500).json({ message: "Failed to fetch flashcard set" });
  }
};
