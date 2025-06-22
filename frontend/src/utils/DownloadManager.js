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