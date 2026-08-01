import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { IoSearch } from "react-icons/io5";
import styles from "./Navbar.module.css";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(
    useParams<{ query?: string }>().query || "",
  );

  return (
    <div className={styles.navbarContainer}>
      <Link to="/" className={styles.navbarLogo}>
        Flash Forge
      </Link>
      <div className={styles.navbarSearchContainer}>
        <input
          type="text"
          placeholder="Search flashcard sets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim() !== "") {
              navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
        />
        <button
          onClick={() => {
            if (searchQuery.trim() !== "") {
              navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
        >
          <IoSearch className={styles.navbarSearchIcon} />
        </button>
      </div>
      <div className={styles.navbarContainerRight}>
        {user === null && (
          <Link to="/login" className={styles.navbarLink}>
            Login
          </Link>
        )}
        {user && (
          <Link to={`/user/${user.username}`} className={styles.navbarLink}>
            My Sets
          </Link>
        )}
        {user && (
          <Link to="/create" className={styles.navbarLink}>
            Create
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
