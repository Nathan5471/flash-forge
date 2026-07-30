import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <div className={styles.navbarContainer}>
      <Link to="/" className={styles.navbarLogo}>
        Flash Forge
      </Link>
    </div>
  );
}

export default Navbar;
