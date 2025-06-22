import { useOverlayContext } from "../../contexts/OverlayContext";
import GradeChart from "./GradeChart";

export default function GradePopup({ id, grade, questionCount, correctAnswerCount }) {
    const { closeOverlay } = useOverlayContext();

    const handleClose = () => {
        window.location.href = `/set/${id}`;
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl mb-4 text-center">Test Completed!</h1>
            <p className="text-lg mb-4 text-center">You answers {correctAnswerCount} out of {questionCount} questions correctly!</p>
            <div className="flex flex-col items-center mb-4">
                <GradeChart grade={grade} />
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 py-2" onClick={handleClose}>Close</button>
        </div>
    )
}