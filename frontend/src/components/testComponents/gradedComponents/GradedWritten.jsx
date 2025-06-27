export default function GradedWritten({ question, selectedAnswer }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-surface-a1 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{question.questionNumber}. {question.question}</h2>
            <input
                type="text"
                value={selectedAnswer.selectedAnswer || 'No answer submitted'}
                readOnly
                disabled
                className={`w-full p-2 rounded-lg ${selectedAnswer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
            />
            { !selectedAnswer.isCorrect && (
                <p className="text-lg mt-2">The correct answer is: <span className="text-primary-a3 font-bold">{question.answer}</span></p>
            )}
        </div>
    )
}