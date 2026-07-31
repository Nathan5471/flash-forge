import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Navbar.module.css";

function Navbar() {
  const { user } = useAuth();

  return (
    <div className={styles.navbarContainer}>
      <Link to="/" className={styles.navbarLogo}>
        Flash Forge
      </Link>
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
