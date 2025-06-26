const internalGetFlashcardSet = (flashcardSetId) => {
    const flashcardSetData = localStorage.getItem(`flashcardSet-${flashcardSetId}`);
    if (!flashcardSetData) {
        return null;
    }
    return JSON.parse(flashcardSetData);
}

const internalGetLearnSession = (id) => {
    const learnSessionData = localStorage.getItem(id);
    if (!learnSessionData) {
        return null;
    }
    return JSON.parse(learnSessionData);
}

export const checkIfLearnSessionExists = async (flashcardSetId) => {
    try {
        const flashcardSet = JSON.parse(localStorage.getItem(`flashcardSet-${flashcardSetId}`));
        if (!flashcardSet) {
            return Promise.reject({ message: 'Flashcard set not found'})
        }
        const learnSession = JSON.parse(localStorage.getItem(`learn-${flashcardSetId}`));
        if (!learnSession) {
            return { learnSessionId: null };
        }
        return { learnSessionId: learnSession._id };
    } catch (error) {
        console.error('Error checking learn session:', error);
        return Promise.reject({ message: 'Internal server error' });
    }
}

export const createLearnSession = async (flashcardSetId, settings) => {
    try {
        if (!flashcardSetId || !settings) {
            return Promise.reject({ message: 'Flashcard set ID and settings are required' });
        }
        const flashcardSet = internalGetFlashcardSet(flashcardSetId);
        if (!flashcardSet) {
            return Promise.reject({ message: 'Flashcard set not found' });
        }
        if (await checkIfLearnSessionExists(flashcardSetId)) {
            return Promise.reject({ message: 'Learn session already exists for this flashcard set' });
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
        return { learnSessionId: learnSession._id };
    } catch (error) {
        console.error('Error creating learn session:', error);
        return Promise.reject({ message: 'Internal server error' });
    }
}

export const getLearnSession = async (id) => {
    try {
        if (!id) {
            return Promise.reject({ message: 'ID is required' });
        }
        const learnSession = localStorage.getItem(id);
        if (!learnSession) {
            return Promise.reject({ message: 'Learn session not found' });
        }
        return JSON.parse(learnSession);
    } catch (error) {
        console.error('Error retrieving learn session:', error);
        return Promise.reject({ message: 'Interal server error' });
    }
}

export const deleteLearnSession = async (id) => {
    try {
        if (!id) {
            return Promise.reject({ message: 'ID is required' });
        }
        localStorage.removeItem(id);
        return true;
    }  catch (error) {
        console.error('Error deleting learn session:', error);
        return Promise.reject({ message: 'Internal server error' });
    }
}

export const generateLearnSession = async (id) => {
    try {
        if (!id) {
            return Promise.reject({ message: 'ID is required' });
        }
        const learnSession = internalGetLearnSession(id);
        if (!learnSession) {
            return Promise.reject({ message: 'Learn session not found' });
        }
        const settings = learnSession.settings;
        const flashcardSet = internalGetFlashcardSet(learnSession.flashcardSet);
        if (!flashcardSet) {
            return Promise.reject({ message: 'Flashcard set not found' });
        }
        const questions = [...learnSession.questions].sort((a, b) => a.order - b.order);
        const populatedQuestions = questions.splice(0, settings.amountPerSession).map(question => {
            const flashcard = flashcardSet.flashCards.find(flashcard => flashcard._id === question.flashcard);
            return {
                ...question,
                flashcard: flashcard
            }
        })
        return { questions: populatedQuestions };
    } catch (error) {
        console.error('Error generating learn session:', error);
        return Promise.reject({ message: 'Internal server error' });
    }
}

export const checkAnswer = (id, order, answer) => {
    try {
        if (!id || order === undefined || !answer) {
            return Promise.reject({ message: 'ID, order, and answer are required' });
        }
        const learnSession = internalGetLearnSession(id);
        if (!learnSession) {
            return Promise.reject({ message: 'Learn session not found' });
        }
        const question = learnSession.questions.find(question => question.order === order);
        if (!question) {
            return Promise.reject({ message: 'Question not found in learn session' });
        }
        const flashcardSet = internalGetFlashcardSet(learnSession.flashcardSet);
        if (!flashcardSet) {
            return Promise.reject({ message: 'Flashcard set not found' });
        }
        const flashcard = flashcardSet.flashCards.find(flashcard => flashcard._id === question.flashcard);
        if (!flashcard) {
            return Promise.reject({ message: 'Flashcard not found' });
        }
        const isCorrect = flashcard.answer.toLowerCase() === answer.toLowerCase()
        if (isCorrect) {
            learnSession.questions = learnSession.questions.filter(question => question.order.toString() !== order);
            localStorage.setItem(`learn-${id}`, JSON.stringify(learnSession));
        }
        return { isCorrect, correctAnswer: flashcard.answer };
    } catch (error) {
        console.error('Error checking answer:', error);
        return Promise.reject({ message: 'Internal server error' });
    }
}