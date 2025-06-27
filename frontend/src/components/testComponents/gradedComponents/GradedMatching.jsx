export default function GradedMatching({ questions, selectedAnswers }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">Matching Questions</h2>
            <div className="flex flex-col mb-4 w-full">
                {questions.map((question, index) => (
                    <div key={index} className="flex flex-col p-4 bg-gray-800  rounded-lg mb-2">
                        <div className="flex flex-row items-center justify-between">
                            <span className="text-lg">{question.questionNumber}. {question.question}</span>
                            <div
                                className={`p-2 rounded-lg ${selectedAnswers[question.questionNumber].isCorrect ? 'bg-green-500' : 'bg-red-500'} w-[calc(35%)]`}
                            >{selectedAnswers[question.questionNumber].selectedAnswer || 'No answer selected'}</div>
                        </div>
                        { !selectedAnswers[question.questionNumber].isCorrect && (
                            <p className="text-center text-lg mt-2">The correct answer is {question.answer}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}