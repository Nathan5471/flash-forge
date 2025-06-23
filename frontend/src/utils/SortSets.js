const sortByTitle = (sets, ascending) => {
    return [...sets].sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return ascending ? -1 : 1;
        if (titleA > titleB) return ascending ? 1 : -1;
        return 0;
    });
}

const sortByDate = (sets, ascending) => {
    return [...sets].sort((a, b) => {
        const dateA = new Date(a.lastEdited);
        const dateB = new Date(b.lastEdited);
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

const sortByFlashcardsCount = (sets, ascending) => {
    return [...sets].sort((a, b) => {
        const countA = a.flashCards.length;
        const countB = b.flashCards.length;
        return ascending ? countA - countB : countB - countA;
    });
}

export default function sortSets(sets, sortBy, ascending) {
    switch (sortBy) {
        case 'title':
            return sortByTitle(sets, ascending);
        case 'date':
            return sortByDate(sets, ascending);
        case 'flashcardCount':
            return sortByFlashcardsCount(sets, ascending);
        default:
            return sets;
    }
}
