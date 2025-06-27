import React, { useEffect, useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';

export default function ExportFlashcards({ flashcardSetData }) {
    const { closeOverlay } = useOverlayContext();
    const [exportText, setExportText] = useState('');
    const [exportBetweenSelected, setExportBetweenSelected] = useState('\t'); // Default is four spaces
    const [exportBetween, setExportBetween] = useState('\t'); // Between question and answer
    const [exportBetweenRowsSelected, setExportBetweenRowsSelected] = useState('\n'); // Default is newline
    const [exportBetweenRows, setExportBetweenRows] = useState('\n'); // Between rows

    useEffect(() => {
        const flashcards = flashcardSetData.flashCards.map(flashcard => {
            return `${flashcard.question}${exportBetween.replace(/\\n/g, '\n').replace(/\\t/g, '\t')}${flashcard.answer}`; // Handle custom newline and tab input
        })
        setExportText(flashcards.join(exportBetweenRows.replace(/\\n/g, '\n').replace(/\\t/g, '\t')));
    }, [flashcardSetData, exportBetween, exportBetweenRows]);

    const handleCopy = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(exportText)
    }

    const handleClose = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl text-primary-a0 font-bold text-center mb-4">Export Flashcards</h1>
            <textarea
                value={exportText}
                readOnly
                className="mb-4 p-2 bg-surface-a2 rounded w-144 h-48"
            />
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col w-[calc(50%)]">
                    <h2 className="text-lg">Between questions and answers:</h2>
                    <label className="text-pretty">
                        <input
                            type="radio"
                            value={'\t'}
                            checked={exportBetweenSelected === '\t'}
                            onChange={(e) => {
                                setExportBetweenSelected(e.target.value);
                                setExportBetween(e.target.value);
                            }}
                            className="mr-2 accent-primary-a0"
                        />
                        Tab
                    </label>
                    <label className="text-pretty">
                        <input
                            type="radio"
                            value=","
                            checked={exportBetweenSelected === ','}
                            onChange={(e) => {
                                setExportBetweenSelected(e.target.value);
                                setExportBetween(e.target.value);
                            }}
                            className="mr-2 accent-primary-a0"
                        />
                        Comma
                    </label>
                    <label className="text-pretty accent-primary-a0">
                        <input
                            type="radio"
                            value="other"
                            checked={exportBetweenSelected === 'other'}
                            onChange={(e) => {
                                setExportBetweenSelected(e.target.value);
                                setExportBetween('-');
                            }}
                            className="mr-2"
                        />
                        Other
                    </label>
                    {exportBetweenSelected === 'other' && (
                        <input
                            type="text"
                            value={exportBetween}
                            onChange={(e) => setExportBetween(e.target.value)}
                            className="mt-2 p-1 bg-surface-a2 rounded mr-1"
                            placeholder="Enter custom separator"
                        />
                    )}
                </div>
                <div className="flex flex-col w-[calc(50%)]">
                    <h2 className="text-lg">Between rows:</h2>
                    <label className="text-pretty">
                        <input
                            type="radio"
                            value={'\n'}
                            checked={exportBetweenRowsSelected === '\n'}
                            onChange={(e) => {
                                setExportBetweenRowsSelected(e.target.value);
                                setExportBetweenRows(e.target.value);
                            }}
                            className="mr-2 accent-primary-a0"
                        />
                        Newline
                    </label>
                    <label className="text-pretty">
                        <input
                            type="radio"
                            value=";"
                            checked={exportBetweenRowsSelected === ';'}
                            onChange={(e) => {
                                setExportBetweenRowsSelected(e.target.value);
                                setExportBetweenRows(e.target.value);
                            }}
                            className="mr-2 accent-primary-a0"
                        />
                        Semicolon
                    </label>
                    <label className="text-pretty">
                        <input
                            type="radio"
                            value="other"
                            checked={exportBetweenRowsSelected === 'other'}
                            onChange={(e) => {
                                setExportBetweenRowsSelected(e.target.value);
                                setExportBetweenRows('\\n\\n');
                            }}
                            className="mr-2 accent-primary-a0"
                        />
                        Other:
                    </label>
                    {exportBetweenRowsSelected === 'other' && (
                        <input
                            type="text"
                            value={exportBetweenRows}
                            onChange={(e) => setExportBetweenRows(e.target.value)}
                            className="mt-2 p-1 bg-surface-a2 rounded"
                            placeholder="Enter custom separator"
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-row justify-between mt-4">
                <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-[calc(50%)]"
                    onClick={handleCopy}
                >Copy</button>
                <button
                    className="bg-surface-a2 p-2 rounded-lg hover:bg-surface-a3 w-[calc(50%)] ml-2"
                    onClick={handleClose}
                >Close</button>
            </div>
        </div>
    )
}