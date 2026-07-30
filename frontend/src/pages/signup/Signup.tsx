import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css";
import { signup } from "../../utils/AuthAPIHandler";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(username, password);
      navigate("/"); // Signup auto logs you in as well
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
    <div className={styles.signupContainer}>
      <form className={styles.signupForm} onSubmit={handleSignup}>
        <h1>Sign Up</h1>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
        {error && <p className={styles.error}>{error}</p>}
        <p>
          Already have an account?{" "}
          <Link to="/login" className={styles.signupFormLink}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
