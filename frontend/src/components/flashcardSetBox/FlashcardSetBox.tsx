import { Link } from "react-router-dom";
import styles from "./FlashcardSetBox.module.css";

interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  creator: string;
  views: number;
  flashcards: number;
}

function FlashcardSetBox({ flashcardSet }: { flashcardSet: FlashcardSet }) {
  return (
    <Link to={`/set/${flashcardSet.id}`} className={styles.flashcardSetBox}>
      <h4>{flashcardSet.name}</h4>
      <p className={styles.flashcardSetDescription}>
        {flashcardSet.description}
      </p>
      <div className={styles.flashcardSetStats}>
        <span>{flashcardSet.views} views</span>
        <span>{flashcardSet.flashcards} flashcards</span>
      </div>
      <p className={styles.flashcardSetCreator}>By {flashcardSet.creator}</p>
    </Link>
  );
}

export default FlashcardSetBox;
