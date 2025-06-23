import fuse from 'fuse.js';
import { getFlashcardSet, getLastEditTime } from './FlashcardAPIHandler';

export const isFlashcardSetDownloaded = (id) => {
    try {
        const flashcardSet = localStorage.getItem(`flashcardSet-${id}`);
        return flashcardSet !== null;
    } catch (error) {
        console.error('Error checking if flashcard set is downloaded:', error);
        return false;
    }
}

export const downloadFlashcardSet = async (id) => {
    try {
        if (isFlashcardSetDownloaded(id)) {
            return;
        }
        const flashcardSet = await getFlashcardSet(id);
        if (!flashcardSet) {
            return;
        }
        localStorage.setItem(`flashcardSet-${id}`, JSON.stringify(flashcardSet));
    } catch (error) {
        console.error('Error downloading flashcard set:', error);
    }
}

export const syncFlashcardSet = async (id) => {
    try {
        if (!isFlashcardSetDownloaded(id)) {
            await downloadFlashcardSet(id);
            return;
        }
        const lastEditTime = await getLastEditTime(id);
        const storedFlashcardSet = JSON.parse(localStorage.getItem(`flashcardSet-${id}`));
        if (new Date(lastEditTime) > new Date(storedFlashcardSet.lastEdited)) {
            const updatedFlashcardSet = await getFlashcardSet(id);
            if (updatedFlashcardSet) {
                localStorage.setItem(`flashcardSet-${id}`, JSON.stringify(updatedFlashcardSet));
            }
        }
    } catch (error) {
        console.error('Error syncing flashcard set:', error);
    }
}

export const getDownloadedFlashcardSet = (id) => {
    try {
        if (!isFlashcardSetDownloaded(id)) {
            return null;
        }
        const flashcardSet = localStorage.getItem(`flashcardSet-${id}`);
        return JSON.parse(flashcardSet);
    } catch (error) {
        console.error('Error getting downloaded flashcard set:', error);
        return null;
    }
}

export const getDownloadedFlashcardSets = () => {
    try {
        const keys = Object.keys(localStorage);
        const flashcardSets = keys
            .filter(key => key.startsWith('flashcardSet-'))
            .map(key => {
                const id = key.split('flashcardSet-')[1];
                return {
                    id,
                    data: JSON.parse(localStorage.getItem(key))
                }
            })
        return flashcardSets;
    } catch (error) {
        console.error('Error getting downloaded flashcard sets:', error);
        return [];
    }
}

export const deleteDownloadedFlashcardSet = (id) => {
    try {
        if (!isFlashcardSetDownloaded(id)) {
            return;
        }
        localStorage.removeItem(`flashcardSet-${id}`);
    } catch (error) {
        console.error('Error deleting downloaded flashcard set:', error);
    }
}

export const getUserDownloadedFlashcardSets = (userId) => {
    try {
        const keys = Object.keys(localStorage);
        const flashcardSets = keys
            .filter(key => key.startsWith('flashcardSet-'))
            .map(key => {
                const id = key.split('flashcardSet-')[1];
                const flashcardSet = JSON.parse(localStorage.getItem(key));
                if (flashcardSet.userId && flashcardSet.userId._id === userId) {
                    return {
                        id,
                        data: flashcardSet
                    }
                } else {
                    return null;
                }
            })
        return flashcardSets.filter(set => set !== null);
    } catch (error) {
        console.error('Error getting user downloaded flashcard sets:', error);
        return [];
    }
}

export const searchDownloadedFlashcardSets = (query) => {
    try {
        const flashcardSets = getDownloadedFlashcardSets().map(set => set.data);
        const fuseOptions = {
            keys: [{ name: 'title', weight: 0.7 }, { name: 'description', weight: 0.3 }],
            includedScore: true,
            threshold: 0.3,
        };
        const fuseInstance = new fuse(flashcardSets, fuseOptions);
        const results = fuseInstance.search(query);
        const sortedResults = results.sort((a, b) => b.score - a.score);
        return sortedResults.map(result => ({
            id: result.item._id,
            data: result.item
        }));
    } catch (error) {
        console.error('Error searching downloaded flashcard sets:', error);
        return [];
    }
}

const getCurrentLocalIndex = () => {
    try {
        const index = localStorage.getItem('currentLocalIndex');
        return index ? parseInt(index, 10) : 0;
    } catch (error) {
        console.error('Error getting current local index:', error);
        return 0;
    }
}

export const createOfflineFlashcardSet = (flashcardSetData) => {
    try {
        const { title, description, flashCards } = flashcardSetData;
        const currentIndex = getCurrentLocalIndex();
        if (!title || !description || !flashCards || flashCards.length === 0) {
            throw new Error('Invalid flashcard set data');
        }
        const newFlashcardSet = {
            _id: `local-${currentIndex}`,
            title,
            description,
            flashCards,
            userId: {
                _id: 'local-user',
                username: 'Local User'
            },
            lastEdited: new Date(),
            createdAt: new Date()
        }
        localStorage.setItem(`flashcardSet-local-${currentIndex}`, JSON.stringify(newFlashcardSet));
        localStorage.setItem('currentLocalIndex', (currentIndex + 1).toString());
        return newFlashcardSet;
    } catch (error) {
        console.error('Error creating offline flashcard set:', error);
        return null;
    }
}

export const createOfflineClone = (id, newTitle) => {
    try {
        const flashcardSet = getDownloadedFlashcardSet(id);
        if (!flashcardSet) {
            throw new Error('Flashcard set not found');
        }
        const newFlashcardSetData = {
            title: newTitle,
            description: flashcardSet.description,
            flashCards: flashcardSet.flashCards.map(card => ({ ...card })),
        }
        const newFlashcardSet = createOfflineFlashcardSet(newFlashcardSetData);
        return newFlashcardSet;
    } catch (error) {
        console.error('Error creating offline clone of flashcard set:', error);
        return null;
    }
}