import prisma from "../prisma/client";
import fuse from "fuse.js";
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

export const searchFlashcardSets = async (req: any, res: any) => {
  const { query, limit, offset } = req.query as {
    query: string;
    limit?: string;
    offset?: string;
  };

  try {
    const flashcardSets = await prisma.flashcardSet.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    if (!flashcardSets || flashcardSets.length === 0) {
      return res.status(404).json({ message: "No flashcard sets found" });
    }

    const fuseOptions = {
      keys: [
        { name: "name", weight: 0.7 },
        { name: "description", weight: 0.3 },
      ],
      includeScore: true,
      threshold: 0.3,
    };
    const fuseInstance = new fuse(flashcardSets, fuseOptions);
    const results = fuseInstance.search(query);
    if (results.length === 0) {
      return res.status(404).json({ message: "No flashcard sets found" });
    }
    const sortedResults = results.sort((a, b) => a.score! - b.score!);
    const selectedResults = sortedResults.slice(
      offset ? parseInt(offset) : 0,
      limit ? parseInt(limit) : 10,
    );
    if (selectedResults.length === 0) {
      return res.status(404).json({ message: "No flashcard sets found" });
    }
    const responseFlashcardSets = await Promise.all(
      selectedResults.map(async (result) => {
        const flashcardSet = await prisma.flashcardSet.findUnique({
          where: { id: result.item.id },
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
        if (!flashcardSet) {
          return null;
        }
        return {
          id: flashcardSet.id,
          name: flashcardSet.name,
          description: flashcardSet.description,
          creator: flashcardSet.creator.username,
          views: flashcardSet._count.views,
          flashcards: flashcardSet._count.flashcards,
        };
      }),
    );
    const filteredFlashcardSets = responseFlashcardSets.filter(
      (set) => set !== null,
    );
    return res.status(200).json({
      message: "Flashcard sets searched successfully",
      flashcardSets: filteredFlashcardSets,
    });
  } catch (error) {
    console.error("Error searching flashcard sets:", error);
    return res.status(500).json({ message: "Failed to search flashcard sets" });
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

export const getCreatedFlashcardSets = async (req: any, res: any) => {
  const user = req.user as AuthUser;
  const { limit, offset } = req.query as { limit?: string; offset?: string };

  try {
    const createdFlashcardSets = await prisma.flashcardSet.findMany({
      where: { creatorId: user.id },
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
    const responseFlashcardSets = createdFlashcardSets.map((set) => ({
      id: set.id,
      name: set.name,
      description: set.description,
      creator: set.creator.username,
      views: set._count.views,
      flashcards: set._count.flashcards,
    }));
    return res.status(200).json({
      message: "Created flashcard sets fetched successfully",
      flashcardSets: responseFlashcardSets,
    });
  } catch (error) {
    console.error("Error fetching created flashcard sets:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch created flashcard sets" });
  }
};

export const getFlashcardSetsByUsername = async (req: any, res: any) => {
  const { username } = req.params as { username: string };
  const { limit, offset } = req.query as { limit?: string; offset?: string };

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const flashcardSets = await prisma.flashcardSet.findMany({
      where: { creatorId: user.id },
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
    const responseFlashcardSets = flashcardSets.map((set) => ({
      id: set.id,
      name: set.name,
      description: set.description,
      creator: set.creator.username,
      views: set._count.views,
      flashcards: set._count.flashcards,
    }));
    return res.status(200).json({
      message: "Flashcard sets fetched successfully",
      flashcardSets: responseFlashcardSets,
    });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return res
      .status(500)
      .json({ message: "Failed to flashcard sets by username" });
  }
};

export const getPopularFlashcardSets = async (req: any, res: any) => {
  const { limit, offset } = req.query as { limit?: string; offset?: string };

  try {
    const popularFlashcardSets = await prisma.flashcardSet.findMany({
      orderBy: { views: { _count: "desc" } },
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
    const responseFlashcardSets = popularFlashcardSets.map((set) => ({
      id: set.id,
      name: set.name,
      description: set.description,
      creator: set.creator.username,
      views: set._count.views,
      flashcards: set._count.flashcards,
    }));
    return res.status(200).json({
      message: "Popular flashcard sets fetched successfully",
      flashcardSets: responseFlashcardSets,
    });
  } catch (error) {
    console.error("Error fetching popular flashcard sets:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch popular flashcard sets" });
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
