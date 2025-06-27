export default function GradedTrueFalse({ question, selectedAnswer }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{question.questionNumber}. {question.question}</h2>
            <p className="mb-4 text-lg">Answer: {question.answerChoice} (Is this true of false?)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                <button
                    className={`w-full p-2 rounded-lg text-left ${question.answerChoice === question.answer && 'bg-green-500'} ${(question.answerChoice !== question.answer && selectedAnswer.selectedAnswer === true) && 'bg-red-500'} ${(selectedAnswer.selectedAnswer !== true && question.answerChoice !== question.answer) && 'bg-gray-800'}`}
                >True</button>
                <button
                    className={`w-full p-2 rounded-lg text-left ${question.answerChoice !== question.answer && 'bg-green-500'} ${(question.answerChoice === question.answer && selectedAnswer.selectedAnswer === false) && 'bg-red-500'} ${(selectedAnswer.selectedAnswer !== false && question.answerChoice === question.answer) && 'bg-gray-800'}`}
                >False</button>
            </div>
        </div>
    )
}