import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getRecentlyViewedFlashcardSets,
  getRecentlyCreatedFlashcardSets,
  getRecentlyEditedFlashcardSets,
} from "../../utils/FlashcardAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import FlashcardSetBox from "../../components/flashcardSetBox/FlashcardSetBox";
import styles from "./Home.module.css";

interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  creator: string;
  views: number;
  flashcards: number;
}

function Home() {
  const { user } = useAuth();
  const [recentlyViewed, setRecentlyViewed] = useState<FlashcardSet[]>([]);
  const [recentlyCreated, setRecentlyCreated] = useState<FlashcardSet[]>([]);
  const [recentlyEdited, setRecentlyEdited] = useState<FlashcardSet[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const controller = new AbortController();
      try {
        if (user) {
          const viewed = await getRecentlyViewedFlashcardSets({
            signal: controller.signal,
          });
          setRecentlyViewed(viewed.flashcardSets);
        }
        const created = await getRecentlyCreatedFlashcardSets({
          signal: controller.signal,
        });
        setRecentlyCreated(created.flashcardSets);
        const edited = await getRecentlyEditedFlashcardSets({
          signal: controller.signal,
        });
        setRecentlyEdited(edited.flashcardSets);
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className={styles.homePage}>
      <Navbar />
      <div className={styles.homeContainer}>
        {user && <h2>Welcome, {user.username}!</h2>}
        {user && recentlyViewed.length > 0 && (
          <>
            <h3>Recently Viewed Flashcard Sets</h3>
            <div className={styles.flashcardRow}>
              {recentlyViewed.map((set) => (
                <FlashcardSetBox key={set.id} flashcardSet={set} />
              ))}
            </div>
          </>
        )}
        <h3>Recently Created Flashcard Sets</h3>
        {recentlyCreated.length > 0 ? (
          <div className={styles.flashcardRow}>
            {recentlyCreated.map((set) => (
              <FlashcardSetBox key={set.id} flashcardSet={set} />
            ))}
          </div>
        ) : (
          <p className={styles.noFlashcardsMessage}>
            No recently created flashcard sets found.
          </p>
        )}
        <h3>Recently Edited Flashcard Sets</h3>
        {recentlyEdited.length > 0 ? (
          <div className={styles.flashcardRow}>
            {recentlyEdited.map((set) => (
              <FlashcardSetBox key={set.id} flashcardSet={set} />
            ))}
          </div>
        ) : (
          <p className={styles.noFlashcardsMessage}>
            No recently edited flashcard sets found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
