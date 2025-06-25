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

export const getDownloadedFlashcardSet = async (id) => {
    try {
        if (!isFlashcardSetDownloaded(id)) {
            return Promise.reject({ message: 'Flashcard set not downloaded' });
        }
        const flashcardSet = localStorage.getItem(`flashcardSet-${id}`);
        return JSON.parse(flashcardSet);
    } catch (error) {
        console.error('Error getting downloaded flashcard set:', error);
        return Promise.reject({ message: 'Error retrieving flashcard set' });
    }
}

export const getDownloadedFlashcardSets = async () => {
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
        if (!flashcardSets || flashcardSets.length === 0) {
            return Promise.reject({ message: 'No downloaded flashcard sets found' });
        }
        return flashcardSets;
    } catch (error) {
        console.error('Error getting downloaded flashcard sets:', error);
        return Promise.reject({ message: 'Error retrieving flashcard sets' });
    }
}

export const deleteDownloadedFlashcardSet = async (id) => {
    try {
        if (!isFlashcardSetDownloaded(id)) {
            return Promise.reject({ message: 'Flashcard set not downloaded' });
        }
        localStorage.removeItem(`flashcardSet-${id}`);
    } catch (error) {
        console.error('Error deleting downloaded flashcard set:', error);
        return Promise.reject({ message: 'Error deleting flashcard set' });
    }
}

export const getUserDownloadedFlashcardSets = async (userId) => {
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
        if (!flashcardSets || flashcardSets.length === 0) {
            return Promise.reject({ message: 'No downloaded flashcard sets found for this user' });
        }
        return flashcardSets.filter(set => set !== null);
    } catch (error) {
        console.error('Error getting user downloaded flashcard sets:', error);
        return Promise.reject({ message: 'Error retrieving user flashcard sets' });
    }
}

export const searchDownloadedFlashcardSets = async (query) => {
    try {
        const flashcardSets = await getDownloadedFlashcardSets().map(set => set.data);
        if (!flashcardSets || flashcardSets.length === 0) {
            return Promise.reject({ message: 'No downloaded flashcard sets available' });
        }
        const fuseOptions = {
            keys: [{ name: 'title', weight: 0.7 }, { name: 'description', weight: 0.3 }],
            includedScore: true,
            threshold: 0.3,
        };
        const fuseInstance = new fuse(flashcardSets, fuseOptions);
        const results = fuseInstance.search(query);
        if (results.length === 0) {
            return Promise.reject({ message: 'No flashcard sets found for the given query' });
        }
        const sortedResults = results.sort((a, b) => b.score - a.score);
        return sortedResults.map(result => ({
            id: result.item._id,
            data: result.item
        }));
    } catch (error) {
        console.error('Error searching downloaded flashcard sets:', error);
        return Promise.reject({ message: 'Error searching flashcard sets' });
    }
}

const getCurrentLocalIndex = async () => {
    try {
        const index = localStorage.getItem('currentLocalIndex');
        return index ? parseInt(index, 10) : 0;
    } catch (error) {
        console.error('Error getting current local index:', error);
        return 0;
    }
}

export const createOfflineFlashcardSet = async (flashcardSetData) => {
    try {
        const { title, description, flashcards } = flashcardSetData;
        const currentIndex = await getCurrentLocalIndex();
        if (!title || !description || !flashcards || flashcards.length === 0) {
            return Promise.reject({ message: 'All fields are required to create a flashcard set' });
        }
        const newFlashcardSet = {
            _id: `local-${currentIndex}`,
            title,
            description,
            flashCards: flashcards.map((card, index) => ({ ...card, _id: `${currentIndex}-${index}` })),
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
        return Promise.reject({ message: 'Error creating flashcard set' });
    }
}

export const createOfflineClone = async (id, newTitle) => {
    try {
        const flashcardSet = await getDownloadedFlashcardSet(id);
        if (!flashcardSet) {
            return Promise.reject({ message: 'Flashcard set not found' });
        }
        const newFlashcardSetData = {
            title: newTitle,
            description: flashcardSet.description,
            flashCards: flashcardSet.flashCards.map(card => ({ ...card })),
        }
        const newFlashcardSet = await createOfflineFlashcardSet(newFlashcardSetData);
        return newFlashcardSet;
    } catch (error) {
        console.error('Error creating offline clone of flashcard set:', error);
        return Promise.reject({ message: 'Error creating offline clone' });
    }
}

export const editOfflineFlashcardSet = async (id, updatedData) => {
    try {
        const { title, description, flashcards } = updatedData;
        if (!title || !description || !flashcards || flashcards.length === 0) {
            return Promise.reject({ message: 'All fields are required to edit a flashcard set' });
        }
        const newFlashcardSet = await getDownloadedFlashcardSet(id);
        if (!newFlashcardSet) {
            return Promise.reject({ message: 'Flashcard set not found' });
        }
        if (!newFlashcardSet._id.startsWith('local-')) {
            return Promise.reject({ message: 'Flashcards need to be local-only to be edited' });
        }
        newFlashcardSet.title = title;
        newFlashcardSet.description = description;
        newFlashcardSet.flashCards = flashcards.map(card => ({ ...card }));
        newFlashcardSet.lastEdited = new Date();
        localStorage.setItem(`flashcardSet-${id}`, JSON.stringify(newFlashcardSet));
        return newFlashcardSet;
    } catch (error) {
        console.error('Error editing offline flashcard set:', error);
        return Promise.reject({ message: 'Error editing flashcard set' });
    }
}

export const getRandomFlashcards = async (id, amount, exludedId) => {
    try {
        const flashcardSet = await getDownloadedFlashcardSet(id);
        if (!flashcardSet || !flashcardSet.flashCards || flashcardSet.flashCards.length === 0) {
            return Promise.reject({ message: 'No flashcards available in this set' });
        }
        const flashcards = flashcardSet.flashCards.filter(flashcard => flashcard._id !== exludedId);
        if (flashcards.length === 0) {
            return Promise.reject({ message: 'No flashcards available after exclusion' });
        }
        const shuffledFlashcards = flashcards.sort(() => Math.random() - 0.5);
        return shuffledFlashcards.slice(0, parseInt(amount, 10));
    } catch (error) {
        console.error('Error getting random flashcards:', error);
        return Promise.reject({ message: 'Error retrieving random flashcards' });
    }
}