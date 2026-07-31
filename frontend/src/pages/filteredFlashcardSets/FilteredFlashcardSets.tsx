import { useState, useEffect } from "react";
import {
  getRecentlyViewedFlashcardSets,
  getPopularFlashcardSets,
  getRecentlyCreatedFlashcardSets,
  getRecentlyEditedFlashcardSets,
} from "../../utils/FlashcardAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import FlashcardSetBox from "../../components/flashcardSetBox/FlashcardSetBox";
import styles from "./FilteredFlashcardSets.module.css";

interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  creator: string;
  views: number;
  flashcards: number;
}

function FilteredFlashcardSets({
  filter,
}: {
  filter:
    | "recently-viewed"
    | "popular"
    | "recently-created"
    | "recently-edited";
}) {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        let data;
        if (filter === "recently-viewed") {
          data = await getRecentlyViewedFlashcardSets({
            limit: 25,
            signal: controller.signal,
          });
        } else if (filter === "popular") {
          data = await getPopularFlashcardSets({
            limit: 25,
            signal: controller.signal,
          });
        } else if (filter === "recently-created") {
          data = await getRecentlyCreatedFlashcardSets({
            limit: 25,
            signal: controller.signal,
          });
        } else if (filter === "recently-edited") {
          data = await getRecentlyEditedFlashcardSets({
            limit: 25,
            signal: controller.signal,
          });
        }
        if (data) {
          setFlashcardSets(data.flashcardSets);
          setCanLoadMore(data.flashcardSets.length === 25);
          setOffset((prev) => prev + data.flashcardSets.length);
        }
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [filter]);

  const loadMore = async () => {
    if (!canLoadMore) return;
    let data: { flashcardSets: FlashcardSet[] } = { flashcardSets: [] };
    try {
      if (filter === "recently-viewed") {
        data = (await getRecentlyViewedFlashcardSets({
          limit: 25,
          offset,
        })) as { flashcardSets: FlashcardSet[] };
      } else if (filter === "popular") {
        data = (await getPopularFlashcardSets({
          limit: 25,
          offset,
        })) as { flashcardSets: FlashcardSet[] };
      } else if (filter === "recently-created") {
        data = (await getRecentlyCreatedFlashcardSets({
          limit: 25,
          offset,
        })) as { flashcardSets: FlashcardSet[] };
      } else if (filter === "recently-edited") {
        data = (await getRecentlyEditedFlashcardSets({
          limit: 25,
          offset,
        })) as { flashcardSets: FlashcardSet[] };
      }
      if (data) {
        setFlashcardSets((prev) => [...prev, ...data.flashcardSets]);
        setCanLoadMore(data.flashcardSets.length === 25);
        setOffset((prev) => prev + data.flashcardSets.length);
      }
    } catch (error) {
      console.error("Error loading more flashcard sets:", error);
    }
  };

  return (
    <div className={styles.filteredFlashcardSetsPage}>
      <Navbar />
      <div className={styles.filteredFlashcardSetsContainer}>
        <h1>
          {filter === "recently-viewed" && "Recently Viewed Flashcard Sets"}
          {filter === "popular" && "Most Popular Flashcard Sets"}
          {filter === "recently-created" && "Recently Created Flashcard Sets"}
          {filter === "recently-edited" && "Recently Edited Flashcard Sets"}
        </h1>
        {!canLoadMore && flashcardSets.length === 0 && (
          <p className={styles.noFlashcardsMessage}>No flashcard sets found!</p>
        )}
        <div className={styles.flashcardSetsGrid}>
          {flashcardSets.map((set) => (
            <FlashcardSetBox key={set.id} flashcardSet={set} />
          ))}
        </div>
        {canLoadMore && (
          <button className={styles.loadMoreButton} onClick={loadMore}>
            Load More
          </button>
        )}
        {!canLoadMore && flashcardSets.length > 0 && (
          <p className={styles.noFlashcardsMessage}>
            No more flashcard sets to load.
          </p>
        )}
      </div>
    </div>
  );
}

export default FilteredFlashcardSets;
