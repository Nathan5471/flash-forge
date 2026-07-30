import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFlashcardSet } from "../../utils/FlashcardAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import styles from "./CreateFlashcardSet.module.css";

function CreateFlashcardSet() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [flashcards, setFlashcards] = useState<
    { index: number; term: string; definition: string }[]
  >([{ index: 0, term: "", definition: "" }]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddFlashcard = () => {
    setFlashcards((prevFlashcards) => [
      ...prevFlashcards,
      { index: prevFlashcards.length, term: "", definition: "" },
    ]);
  };

  const handleRemoveFlashcard = (index: number) => {
    setFlashcards((prevFlashcards) => {
      if (prevFlashcards.length === 1) {
        return [{ index: 0, term: "", definition: "" }];
      }
      const updatedFlashcards = prevFlashcards.filter((_, i) => i !== index);
      return updatedFlashcards.map((card, i) => ({ ...card, index: i }));
    });
  };

  const handleFlashcardChange = (
    index: number,
    term: string,
    definition: string,
  ) => {
    setFlashcards((prevFlashcards) => {
      const updatedFlashcards = [...prevFlashcards];
      updatedFlashcards[index] = { index, term, definition };
      return updatedFlashcards;
    });
  };

  const handleCreateFlashcardSet = async () => {
    try {
      const response = (await createFlashcardSet(
        name,
        description,
        flashcards,
      )) as { message: string; id: string };
      navigate(`/set/${response.id}`);
    } catch (error) {
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

  return (
    <div className={styles.createFlashcardSetContainer}>
      <Navbar />
    </div>
  );
}

export default CreateFlashcardSet;
