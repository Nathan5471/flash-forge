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

export const getRecentlyViewedFlashcardSets = async (req: any, res: any) => {
  const user = req.user as AuthUser;
  const { limit, offset } = req.query as { limit?: string; offset?: string };

  try {
    const recentlyViewed = await prisma.flashcardView.findMany({
      where: { userId: user.id },
      orderBy: { viewedAt: "desc" },
      take: limit ? parseInt(limit) : 10,
      skip: offset ? parseInt(offset) : 0,
      include: {
        flashcardSet: {
          include: {
            creator: {
              select: {
                username: true,
              },
            },
            _count: {
              select: {
                views: true,
                flashcards: true,
              },
            },
          },
        },
      },
    });
    const responseFlashcardSets = recentlyViewed.map((view) => ({
      id: view.flashcardSet.id,
      name: view.flashcardSet.name,
      description: view.flashcardSet.description,
      creator: view.flashcardSet.creator.username,
      views: view.flashcardSet._count.views,
      flashcards: view.flashcardSet._count.flashcards,
    }));
    return res.status(200).json({
      message: "Recently viewed flashcard sets fetched successfully",
      flashcardSets: responseFlashcardSets,
    });
  } catch (error) {
    console.error("Error fetching recently viewed flashcard sets:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch recently viewed flashcard sets" });
  }
};

export const getRecentlyCreatedFlashcardSets = async (req: any, res: any) => {
  const { limit, offset } = req.query as { limit?: string; offset?: string };

  try {
    const recentlyCreated = await prisma.flashcardSet.findMany({
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : 10,
      skip: offset ? parseInt(offset) : 0,
      include: {
        creator: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            views: true,
            flashcards: true,
          },
        },
      },
    });
    const responseFlashcardSets = recentlyCreated.map((set) => ({
      id: set.id,
      name: set.name,
      description: set.description,
      creator: set.creator.username,
      views: set._count.views,
      flashcards: set._count.flashcards,
    }));
    return res.status(200).json({
      message: "Recently created flashcard sets fetched successfully",
      flashcardSets: responseFlashcardSets,
    });
  } catch (error) {
    console.error("Error fetching recently created flashcard sets:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch recently created flashcard sets" });
  }
};

export const getRecentlyEditedFlashcardSets = async (req: any, res: any) => {
  const { limit, offset } = req.query as { limit?: string; offset?: string };

  try {
    const recentlyEdited = await prisma.flashcardSet.findMany({
      orderBy: { editedAt: "desc" },
      take: limit ? parseInt(limit) : 10,
      skip: offset ? parseInt(offset) : 0,
      include: {
        creator: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            views: true,
            flashcards: true,
          },
        },
      },
    });
    const responseFlashcardSets = recentlyEdited.map((set) => ({
      id: set.id,
      name: set.name,
      description: set.description,
      creator: set.creator.username,
      views: set._count.views,
      flashcards: set._count.flashcards,
    }));
    return res.status(200).json({
      message: "Recently edited flashcard sets fetched successfully",
      flashcardSets: responseFlashcardSets,
    });
  } catch (error) {
    console.error("Error fetching recently edited flashcard sets:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch recently edited flashcard sets" });
  }
};
