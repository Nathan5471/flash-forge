import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { getFlashcardSet } from "../../utils/FlashcardAPIHandler";
import TestSettings from "../../components/testSettings/TestSettings";
import styles from "./Test.module.css";

interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  creator: string;
  flashcards: { id: string; question: string; answer: string }[];
  views: number;
}

interface TestSettingsValues {
  questionCount: number;
  multipleChoice: boolean;
  written: boolean;
  trueFalse: boolean;
  matching: boolean;
}

function Test() {
  const { setId } = useParams<{ setId: string }>();
  const { openOverlay } = useOverlay();
  const [flashcardSet, setFlashcardSet] = useState<
    FlashcardSet | null | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);
  const [showTestSettingOverlay, setShowTestSettingOverlay] = useState(true);
  const [testSettings, setTestSettings] = useState<{
    questionCount: number;
    multipleChoice: boolean;
    written: boolean;
    trueFalse: boolean;
    matching: boolean;
  }>({
    questionCount: 10,
    multipleChoice: true,
    written: true,
    trueFalse: true,
    matching: true,
  });

  useEffect(() => {
    if (!setId) {
      setFlashcardSet(null);
      setError("No set ID provided.");
      return;
    }
    const controller = new AbortController();

    const fetchFlashcardSet = async () => {
      try {
        const data = await getFlashcardSet(setId, controller.signal);
        setFlashcardSet(data.flashcardSet);
        openOverlay(
          <TestSettings
            flashcardCount={data.flashcardSet.flashcards.length}
            flashcardSetId={data.flashcardSet.id}
            handleStartTest={handleStartTest}
          />,
        );
      } catch (error: any) {
        if (error === "Axios request canceled") {
          return;
        }
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
    fetchFlashcardSet();

    return () => {
      controller.abort();
    };
  }, [setId]);

  const handleStartTest = (settings: TestSettingsValues) => {
    setTestSettings(settings);
    setShowTestSettingOverlay(false);
  };

  return <div></div>;
}

export default Test;
