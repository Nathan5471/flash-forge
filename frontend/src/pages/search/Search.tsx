import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { searchFlashcardSets } from "../../utils/FlashcardAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import FlashcardSetBox from "../../components/flashcardSetBox/FlashcardSetBox";
import styles from "./Search.module.css";

interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  creator: string;
  views: number;
  flashcards: number;
}

function Search() {
  const { query } = useParams<{ query: string }>();
  const [searchResults, setSearchResults] = useState<FlashcardSet[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();

    const fetchSearchResults = async () => {
      try {
        const results = await searchFlashcardSets(query, {
          limit: 25,
          signal: controller.signal,
        });
        setSearchResults(results.flashcardSets);
        setCanLoadMore(results.flashcardSets.length === 25);
        setOffset(results.flashcardSets.length);
      } catch (error: unknown) {
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
    fetchSearchResults();

    return () => {
      controller.abort();
    };
  }, [query]);

  const loadMore = async () => {
    if (!query || !canLoadMore) return;

    try {
      const results = await searchFlashcardSets(query, {
        limit: 25,
        offset,
      });
      setSearchResults((prevResults) => [
        ...prevResults,
        ...results.flashcardSets,
      ]);
      setCanLoadMore(results.flashcardSets.length === 25);
      setOffset((prevOffset) => prevOffset + results.flashcardSets.length);
    } catch (error) {
      setCanLoadMore(false);
    }
  };

  return (
    <div className={styles.searchPage}>
      <Navbar />
      <div className={styles.searchPageContainer}>
        <h1>Search Results for "{query}"</h1>
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorBox}>
              <h3>No result found or an error occured</h3>
              <p>{error}</p>
              <Link to="/" className={styles.errorBoxLink}>
                Back to Home
              </Link>
            </div>
          </div>
        )}
        {!error && searchResults.length > 0 && (
          <div className={styles.searchResultsGrid}>
            {searchResults.map((set) => (
              <FlashcardSetBox key={set.id} flashcardSet={set} />
            ))}
          </div>
        )}
        {!error && !canLoadMore && (
          <p className={styles.noMoreResultsMessage}>
            No more results to load.
          </p>
        )}
        {!error && canLoadMore && (
          <button className={styles.loadMoreButton} onClick={loadMore}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;
