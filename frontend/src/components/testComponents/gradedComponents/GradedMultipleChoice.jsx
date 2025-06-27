export default function GradedMultipleChoice({ question, selectedAnswer }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-surface-a1 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{question.questionNumber}. {question.question}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                {question.answerChoices.map((answer, index) => (
                    <div
                        key={index}
                        className={`w-full p-2 rounded-lg text-left ${answer === question.answer && 'bg-green-500'} ${(selectedAnswer.selectedAnswer === answer && !selectedAnswer.isCorrect) && 'bg-red-500'} ${(selectedAnswer.selectedAnswer !== answer && answer !== question.answer) && 'bg-surface-a2'}`}
                    >{answer}</div>
                ))}
            </div>
        </div>
    )
}