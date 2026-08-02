import prisma from "../prisma/client";
import type { AuthUser } from "../middleware/authenticate";
import generateLearnSessionQuestions from "../utils/generateLearnSessionQuestions";

export const startLearnSession = async (req: any, res: any) => {
  const user = req.user as AuthUser;
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

  try {
    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id: setId },
      include: { flashcards: true },
    });
    if (!flashcardSet) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }
    const learnSession = await prisma.learnSession.findUnique({
      where: {
        flashcardSetId_userId: {
          userId: user.id,
          flashcardSetId: setId,
        },
      },
    });
    if (learnSession) {
      return res.status(400).json({
        message: "Learn session already exists for this user and set",
      });
    }
    const questions = generateLearnSessionQuestions(
      multipleChoiceAmount,
      trueFalseAmount,
      writtenAmount,
      flashcardSet,
    );

    const newLearnSession = await prisma.learnSession.create({
      data: {
        amountPerSession,
        multipleChoiceAmount,
        trueFalseAmount,
        writtenAmount,
        flashcardSetId: setId,
        userId: user.id,
        learnSessionQuestions: {
          create: questions.map((question, index) => ({
            order: index,
            type: question.type as "multipleChoice" | "trueFalse" | "written",
            flashcard: {
              connect: { id: question.flashcardId },
            },
          })),
        },
      },
    });
    return res.status(201).json({
      message: "Learn session started",
      learnSessionId: newLearnSession.id,
    });
  } catch (error) {
    console.error("Error starting learn session:", error);
    return res.status(500).json({ message: "Failed to start learn session" });
  }
};

export const checkLearnSessionAnswer = async (req: any, res: any) => {
  const user = req.user as AuthUser;
  const { sessionId } = req.params;
  const { questionOrder, answer } = req.body as {
    questionOrder: number;
    answer: string;
  };

  try {
    const learnSession = await prisma.learnSession.findUnique({
      where: { id: sessionId },
      include: {
        learnSessionQuestions: {
          include: { flashcard: true },
        },
      },
    });
    if (!learnSession) {
      return res.status(404).json({ message: "Learn session not found" });
    }
    if (learnSession.userId !== user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const question = learnSession.learnSessionQuestions.find(
      (question) => question.order === questionOrder,
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const isCorrect = question.flashcard.definition === answer;
    if (isCorrect) {
      await prisma.learnSessionQuestion.delete({
        where: { id: question.id },
      });
    }
    return res.status(200).json({
      message: "Answer checked successfully",
      isCorrect,
    });
  } catch (error) {
    console.error("Error checking learn session answer:", error);
    return res.status(500).json({ message: "Failed to check answer" });
  }
};

export const checkLearnSessionExists = async (req: any, res: any) => {
  const user = req.user as AuthUser;
  const { setId } = req.params;

  try {
    const learnSession = await prisma.learnSession.findUnique({
      where: {
        flashcardSetId_userId: {
          userId: user.id,
          flashcardSetId: setId,
        },
      },
      include: {
        learnSessionQuestions: true,
      },
    });
    if (learnSession && learnSession.learnSessionQuestions.length === 0) {
      await prisma.learnSession.delete({
        where: { id: learnSession.id },
      });
      return res.status(200).json({ exists: false });
    }
    if (learnSession) {
      return res
        .status(200)
        .json({ exists: true, learnSessionId: learnSession.id });
    }
    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking if learn session exists:", error);
    return res
      .status(500)
      .json({ message: "Failed to check if learn session exists" });
  }
};
