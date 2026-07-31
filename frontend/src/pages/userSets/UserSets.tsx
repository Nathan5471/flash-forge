import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getFlashcardSetsByUsername } from "../../utils/FlashcardAPIHandler";
import Navbar from "../../components/navbar/Navbar";
import FlashcardSetBox from "../../components/flashcardSetBox/FlashcardSetBox";
import styles from "./UserSets.module.css";

interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  creator: string;
  views: number;
  flashcards: number;
}

function UserSets() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [userFlashcardSets, setUserFlashcardSets] = useState<FlashcardSet[]>(
    [],
  );
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();
    setError(null);

    const fetchUserFlashcardSets = async () => {
      try {
        const data = await getFlashcardSetsByUsername(username, {
          limit: 25,
          signal: controller.signal,
        });
        setUserFlashcardSets(data.flashcardSets);
        setCanLoadMore(data.flashcardSets.length === 25);
        setOffset(data.flashcardSets.length);
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
    fetchUserFlashcardSets();

    return () => {
      controller.abort();
    };
  }, [username]);

  const loadMore = async () => {
    if (!username || !canLoadMore) return;
    setError(null);

    try {
      const data = await getFlashcardSetsByUsername(username, {
        limit: 25,
        offset,
      });
      setUserFlashcardSets((prev) => [...prev, ...data.flashcardSets]);
      setCanLoadMore(data.flashcardSets.length === 25);
      setOffset((prev) => prev + data.flashcardSets.length);
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

  if (!username) {
    navigate("/");
    return null;
  }

  if (error) {
    return (
      <div className={styles.userSetsPage}>
        <Navbar />
        <div className={styles.errorContainer}>
          <div className={styles.errorBox}>
            <h2>Username not found or error occurred</h2>
            <p>{error}</p>
            <Link to={"/"} className={styles.errorLink}>
              Go back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userSetsPage}>
      <Navbar />
      <div className={styles.userSetsContainer}>
        <h2>{username}'s Flashcard Sets</h2>
        {userFlashcardSets.length === 0 ? (
          <p className={styles.noFlashcardsMessage}>
            User has not created any flashcard sets yet.
          </p>
        ) : (
          <>
            <div className={styles.flashcardSetsGrid}>
              {userFlashcardSets.map((set) => (
                <FlashcardSetBox key={set.id} flashcardSet={set} />
              ))}
            </div>
            {canLoadMore && (
              <button className={styles.loadMoreButton} onClick={loadMore}>
                Load More
              </button>
            )}
            {!canLoadMore && (
              <p className={styles.noFlashcardsMessage}>
                No more flashcard sets to load.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserSets;
