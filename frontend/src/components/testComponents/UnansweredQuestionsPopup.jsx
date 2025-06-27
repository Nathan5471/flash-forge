import { useOverlayContext } from "../../contexts/OverlayContext";

export default function UnansweredQuestionsPopup({ amount, onClose }) {
    const { closeOverlay } = useOverlayContext();

    const handleClose = () => {
        closeOverlay();
        onClose();
    }

    const handleCancel = () => {
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl text-primary-a0 font-bold mb-4 text-center">Unanswered Questions</h1>
            <p className="text-lg mb-4 text-center">You have <span className="text-xl text-primary-a0 font-bold">{amount}</span> unanswered questions, are you sure you want to submit?</p>
            <div className="flex flex-row w-full justify-between">
                <button onClick={handleClose} className="bg-primary-a0 hover:bg-primary-a1 py-2 px-6 rounded-lg mr-2 w-[calc(50%)]">Submit</button>
                <button onClick={handleCancel} className="bg-primary-a0 hover:bg-primary-a1 py-2 px-6 rounded-lg w-[calc(50%)]">Cancel</button>
            </div>
        </div>
    )
}