import React, { useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';

export default function ImportFlashcards({ importFlashcards }) {
    const { closeOverlay } = useOverlayContext();
    const [importText, setImportText] = useState('');
    const [importBetweenSelected, setImportBetweenSelected] = useState('\t'); // Default is four spaces
    const [importBetween, setImportBetween] = useState('\t'); // Between question and answer
    const [importBetweenRowsSelected, setImportBetweenRowsSelected] = useState('\n'); // Default is newline
    const [importBetweenRows, setImportBetweenRows] = useState('\n'); // Between rows

    const handleImportText = (e) => {
        e.preventDefault();
        const lines = importText.split(importBetweenRows.replace(/\\n/g, '\n').replace(/\\t/g, '\t')); // Handle custom newline and tab input
        console.log(lines);
        const flashcards = lines.map(line => {
            console.log(line.split(importBetween.replace(/\\n/g, '\n').replace(/\\t/g, '\t')));
            const [question, answer] = line.split(importBetween.replace(/\\n/g, '\n').replace(/\\t/g, '\t'));
            return { question: question.trim(), answer: answer.trim() };
        })
        flashcards.filter(flashcard => flashcard.question && flashcard.answer);
        importFlashcards(flashcards);
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl text-primary-a0 font-bold mb-4 text-center">Import Flashcards</h1>
            <form onSubmit={handleImportText} className="flex flex-col items-center">
                <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder={"Question1" + importBetween.replace(/\\n/g, '\n').replace(/\\t/g, '\t') + "Answer1" + importBetweenRows.replace(/\\n/g, '\n').replace(/\\t/g, '\t') + "Question2" + importBetween.replace(/\\n/g, '\n').replace(/\\t/g, '\t') + "Answer2"}
                    className="mb-4 p-2 bg-surface-a2 rounded w-144 h-48"
                    required
                />
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-col w-[calc(50%)] mr-2">
                        <h2 className="text-lg">Between questions and answsers:</h2>
                        <label className="text-pretty">
                            <input
                                type="radio"
                                value={'\t'}
                                checked={importBetweenSelected === '\t'}
                                onChange={(e) => {
                                    setImportBetweenSelected(e.target.value);
                                    setImportBetween(e.target.value);
                                }}
                                className="mr-2 accent-primary-a0"
                            />
                            Tab
                        </label>
                        <label className="text-pretty">
                            <input
                                type="radio"
                                value=","
                                checked={importBetweenSelected === ','}
                                onChange={(e) => {
                                    setImportBetweenSelected(e.target.value);
                                    setImportBetween(e.target.value);
                                }}
                                className="mr-2 accent-primary-a0"
                            />
                            Comma
                        </label>
                        <label className="text-pretty">
                            <input
                                type="radio"
                                value="other"
                                checked={importBetweenSelected === 'other'}
                                onChange={(e) => {
                                    setImportBetweenSelected(e.target.value);
                                    setImportBetween('-');
                                }}
                                className="mr-2 accent-primary-a0"
                            />
                            Other:
                        </label>
                        {importBetweenSelected === 'other' && (
                            <input
                                type="text"
                                value={importBetween}
                                onChange={(e) => setImportBetween(e.target.value)}
                                placeholder="Enter custom separator"
                                className="mt-2 p-1 bg-surface-a2 rounded w-full"
                            />
                        )}
                    </div>
                    <div className="flex flex-col w-[calc(50%)]">
                        <h2 className="text-lg">Between rows:</h2>
                        <label className="text-pretty">
                            <input
                                type="radio"
                                value={'\n'}
                                checked={importBetweenRowsSelected === '\n'}
                                onChange={(e) => {
                                    setImportBetweenRowsSelected(e.target.value);
                                    setImportBetweenRows(e.target.value);
                                }}
                                className="mr-2 accent-primary-a0"
                            />
                            Newline
                        </label>
                        <label className="text-pretty">
                            <input
                                type="radio"
                                value=";"
                                checked={importBetweenRowsSelected === ';'}
                                onChange={(e) => {
                                    setImportBetweenRowsSelected(e.target.value);
                                    setImportBetweenRows(e.target.value);
                                }}
                                className="mr-2 accent-primary-a0"
                            />
                            Semicolon
                        </label>
                        <label className="text-pretty">
                            <input
                                type="radio"
                                value="other"
                                checked={importBetweenRowsSelected === 'other'}
                                onChange={(e) => {
                                    setImportBetweenRowsSelected(e.target.value);
                                    setImportBetweenRows('\\n\\n');
                                }}
                                className="mr-2 accent-primary-a0"
                            />
                            Other:
                        </label>
                        {importBetweenRowsSelected === 'other' && (
                            <input
                                type="text"
                                value={importBetweenRows}
                                onChange={(e) => setImportBetweenRows(e.target.value)}
                                placeholder="Enter custom row separator"
                                className="mt-2 p-1 bg-surface-a2 rounded w-full"
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-row mt-4 w-full">
                    <button
                        type="submit"
                        className="bg-primary-a0 hover:bg-primary-a1 text-white py-2 px-4 rounded-lg mr-2 w-[calc(50%)]"
                    >
                        Import
                    </button>
                    <button
                        type="button"
                        onClick={closeOverlay}
                        className="bg-surface-a2 hover:bg-surface-a3 text-white py-2 px-4 rounded-lg w-[calc(50%)]"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
