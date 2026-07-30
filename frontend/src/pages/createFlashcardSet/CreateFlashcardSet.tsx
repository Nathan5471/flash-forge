import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFlashcardSet } from "../../utils/FlashcardAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./CreateFlashcardSet.module.css";

function CreateFlashcardSet() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [flashcards, setFlashcards] = useState<
    { term: string; definition: string }[]
  >([{ term: "", definition: "" }]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddFlashcard = () => {
    setFlashcards((prevFlashcards) => [
      ...prevFlashcards,
      { term: "", definition: "" },
    ]);
  };

  const handleRemoveFlashcard = (index: number) => {
    setFlashcards((prevFlashcards) => {
      if (prevFlashcards.length === 1) {
        return [{ term: "", definition: "" }];
      }
      const updatedFlashcards = prevFlashcards.filter((_, i) => i !== index);
      return updatedFlashcards.map((card, i) => ({ ...card, index: i }));
    });
  };

  const handleFlashcardChange = (
    index: number,
    option: "term" | "definition",
    value: string,
  ) => {
    setFlashcards((prevFlashcards) => {
      const updatedFlashcards = [...prevFlashcards];
      updatedFlashcards[index] = {
        ...updatedFlashcards[index],
        [option]: value,
      };
      return updatedFlashcards;
    });
  };

  const handleCreateFlashcardSet = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setError(null);
    try {
      const response = (await createFlashcardSet(
        name,
        description,
        flashcards.map((flashcard, index) => ({
          index,
          term: flashcard.term,
          definition: flashcard.definition,
        })),
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
    <div className={styles.createFlashcardSetPage}>
      <Navbar />
      <div className={styles.createFlashcardSetContainer}>
        <form
          className={styles.createFlashcardSetForm}
          onSubmit={handleCreateFlashcardSet}
        >
          <h1>Create Flashcard Set</h1>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <h2>Flashcards</h2>
          {flashcards.map((flashcard, index) => (
            <div key={index} className={styles.flashcardContainer}>
              <p>{index + 1}</p>
              <input
                type="text"
                id="term"
                name="term"
                placeholder="Term"
                value={flashcard.term}
                onChange={(e) =>
                  handleFlashcardChange(index, "term", e.target.value)
                }
                required
              />
              <input
                type="text"
                id="definition"
                name="definition"
                placeholder="Definition"
                value={flashcard.definition}
                onChange={(e) =>
                  handleFlashcardChange(index, "definition", e.target.value)
                }
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveFlashcard(index)}
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddFlashcard}
            className={styles.addFlashcardButton}
          >
            Add Flashcard
          </button>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Create Flashcard Set</button>
        </form>
      </div>
    </div>
  );
}

export default CreateFlashcardSet;
