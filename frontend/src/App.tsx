import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import CreateFlashcardSet from "./pages/createFlashcardSet/CreateFlashcardSet";

function App() {
  const { user, getUser } = useAuth();

  useEffect(() => {
    if (user === undefined) {
      getUser();
    }
  }, [user, getUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<AuthenticatedRoute />}>
          <Route path="/create" element={<CreateFlashcardSet />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
