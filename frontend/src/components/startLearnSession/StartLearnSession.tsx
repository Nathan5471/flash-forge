import { useState } from "react";
import { useOverlay } from "../../contexts/OverlayContext";
import { startLearnSession } from "../../utils/LearnSessionAPIHandler";
import styles from "./StartLearnSession.module.css";

interface StartLearnSessionProps {
  setId: string;
  onSessionStarted: (sessionId: string) => void;
}

function StartLearnSession({
  setId,
  onSessionStarted,
}: StartLearnSessionProps) {
  const { closeOverlay } = useOverlay();
  const [amountPerSession, setAmountPerSession] = useState<number>(10);
  const [multipleChoiceAmount, setMultipleChoiceAmount] = useState<number>(1);
  const [trueFalseAmount, setTrueFalseAmount] = useState<number>(0);
  const [writtenAmount, setWrittenAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async () => {
    if (
      amountPerSession <= 0 ||
      multipleChoiceAmount + trueFalseAmount + writtenAmount <= 0
    ) {
      setError("Invalid session settings");
      return;
    }
    try {
      const response = await startLearnSession(
        setId,
        amountPerSession,
        multipleChoiceAmount,
        trueFalseAmount,
        writtenAmount,
      );
      onSessionStarted(response.learnSessionId);
      closeOverlay();
    } catch (error: any) {
      if (error === "Axios request canceled") return;
      const errorMessage =
        typeof error == "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occured";
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.learnSessionContainer}>
      <h2>Start Learn Session</h2>
      <p>Amount Per Session:</p>
      <input
        type="number"
        value={amountPerSession}
        onChange={(e) => setAmountPerSession(Number(e.target.value))}
        min={1}
      />
      <p>Multiple Choice Round Amount:</p>
      <input
        type="number"
        value={multipleChoiceAmount}
        onChange={(e) => setMultipleChoiceAmount(Number(e.target.value))}
        min={0}
      />
      <p>True/False Round Amount:</p>
      <input
        type="number"
        value={trueFalseAmount}
        onChange={(e) => setTrueFalseAmount(Number(e.target.value))}
        min={0}
      />
      <p>Written Round Amount:</p>
      <input
        type="number"
        value={writtenAmount}
        onChange={(e) => setWrittenAmount(Number(e.target.value))}
        min={0}
      />
      {error && <p className={styles.error}>{error}</p>}
      <button onClick={handleStartSession}>Start Session</button>
    </div>
  );
}

export default StartLearnSession;
