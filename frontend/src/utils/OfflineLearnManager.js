import { getDownloadedFlashcardSet } from "./DownloadManager";

export const checkIfLearnSessionExists = (flashcardSetId) => {
    try {
        const flashcardSet = getDownloadedFlashcardSet(flashcardSetId);
        if (!flashcardSet) {
            throw new Error('Flashcard set not found');
        }
        const learnSession = localStorage.getItem(`learn-${flashcardSetId}`);
        if (!learnSession) {
            return false;
        }
        return learnSession._id;
    } catch (error) {
        console.error('Error checking learn session:', error);
        return false;
    }
}

export const createLearnSession = (flashcardSetId, settings) => {
    try {
        if (!flashcardSetId || !settings) {
            throw new Error('Flashcard set ID and settings are required');
        }
        const flashcardSet = getDownloadedFlashcardSet(flashcardSetId);
        if (!flashcardSet) {
            throw new Error('Flashcard set not found');
        }
        if (checkIfLearnSessionExists(flashcardSetId)) {
            throw new Error('Learn session already exists for this flashcard set');
        }
        let questions = [];
        let trueFalseAmount = settings.trueFalseAmount;
        let multipleChoiceAmount = settings.multipleChoiceAmount;
        let writtenAmount = settings.writtenAmount;
        for (let i = 0; i < Math.max(trueFalseAmount, multipleChoiceAmount, writtenAmount); i++) {
            if (trueFalseAmount > 0) {
                const shuffledFlashcards = [...flashcardSet.flashCards].sort(() => Math.random() - 0.5);
                for (const flashcard of shuffledFlashcards) {
                    questions.push({
                        order: questions.length,
                        flashcard: flashcard._id,
                        questionType: 'trueFalse'
                    })
                }
                trueFalseAmount--;
            }
            if (multipleChoiceAmount > 0) {
                const shuffledFlashcards = [...flashcardSet.flashCards].sort(() => Math.random() - 0.5);
                for (const flashcard of shuffledFlashcards) {
                    questions.push({
                        order: questions.length,
                        flashcard: flashcard._id,
                        questionType: 'multipleChoice'
                    })
                }
                multipleChoiceAmount--;
            }
            if (writtenAmount > 0) {
                const shuffledFlashcards = [...flashcardSet.flashCards].sort(() => Math.random() - 0.5);
                for (const flashcard of shuffledFlashcards) {
                    questions.push({
                        order: questions.length,
                        flashcard: flashcard._id,
                        questionType: 'written'
                    })
                }
                writtenAmount--;
            }
        }
        const learnSession = {
            _id: `learn-${flashcardSetId}`,
            flashcardSet: flashcardSetId,
            settings: settings,
            questions: questions,
            createdAt: new Date()
        }
        localStorage.setItem(`learn-${flashcardSetId}`, JSON.stringify(learnSession));
        return learnSession;
    } catch (error) {
        console.error('Error creating learn session:', error);
        return null;
    }
}

export const getLearnSession = (flashcardSetId) => {
    try {
        if (!flashcardSetId) {
            throw new Error('Flashcard set ID is required');
        }
        const learnSession = localStorage.getItem(`learn-${flashcardSetId}`);
        if (!learnSession) {
            throw new Error('Learn session not found for this flashcard set');
        }
        return JSON.parse(learnSession);
    } catch (error) {
        console.error('Error retrieving learn session:', error);
        return null;
    }
}

export const deleteLearnSession = (flashcardSetId) => {
    try {
        if (!flashcardSetId) {
            throw new Error('Flashcard set ID is required');
        }
        if (!checkIfLearnSessionExists(flashcardSetId)) {
            throw new Error('Learn session does not exist for this flashcard set');
        }
        localStorage.removeItem(`learn-${flashcardSetId}`);
        return true;
    }  catch (error) {
        console.error('Error deleting learn session:', error);
        return false;
    }
}

export const generateLearnSession = (flashcardSetId) => {
    try {
        if (!flashcardSetId) {
            throw new Error('Flashcard set ID is required');
        }
        const learnSession = getLearnSession(flashcardSetId);
        if (!learnSession) {
            throw new Error('Learn session not found for this flashcard set');
        }
        const settings = learnSession.settings;
        const flashcardSet = getDownloadedFlashcardSet(flashcardSetId);
        if (!flashcardSet) {
            throw new Error('Flashcard set not found');
        }
        const questions = [...learnSession.questions].sort((a, b) => a.order - b.order);
        const populatedQuestions = questions[0, [settings.amountPerSession]].map(question => {
            const flashcard = flashcardSet.flashCards.find(flashcard => flashcard._id === question.flashcard);
            if (!flashcard) {
                throw new Error('Flashcard not found in flashcard set');
            }
            return {
                ...question,
                flashcard: {
                    question: flashcard.question,
                }
            }
        })
        return { questions: populatedQuestions };
    } catch (error) {
        console.error('Error generating learn session:', error);
        return null;
    }
}

export const checkAnswer = (id, order, answer) => {
    try {
        if (!id || !order || !answer) {
            throw new Error('ID, order, and answer are required');
        }
        const learnSession = getLearnSession(id);
        if (!learnSession) {
            throw new Error('Learn session not found');
        }
        const question = learnSession.questions.find(question => question.order.toString() === order);
        if (!question) {
            throw new Error('Question not found in learn session');
        }
        const flashcardSet = getDownloadedFlashcardSet(learnSession.flashcardSet);
        if (!flashcardSet) {
            throw new Error('Flashcard set not found');
        }
        const flashcard = flashcardSet.flashCards.find(flashcard => flashcard._id === question.flashcard);
        if (!flashcard) {
            throw new Error('Flashcard not found in flashcard set');
        }
        const isCorrect = flashcard.answer.toLowerCase() === answer.toLowerCase()
        if (isCorrect) {
            learnSession.questions = learnSession.questions.filter(question => question.order.toString() !== order);
            localStorage.setItem(`learn-${id}`, JSON.stringify(learnSession));
        }
        return { isCorrect, flashcard };
    } catch (error) {
        console.error('Error checking answer:', error);
        return { isCorrect: false, flashcard: null };
    }
}