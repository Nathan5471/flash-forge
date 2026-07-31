import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import FilteredFlashcardSets from "./pages/filteredFlashcardSets/FilteredFlashcardSets";
import FlashcardSet from "./pages/flashcardSet/FlashcardSet";
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/popular"
          element={<FilteredFlashcardSets filter="popular" />}
        />
        <Route
          path="/recently-created"
          element={<FilteredFlashcardSets filter="recently-created" />}
        />
        <Route
          path="/recently-edited"
          element={<FilteredFlashcardSets filter="recently-edited" />}
        />
        <Route path="/set/:setId" element={<FlashcardSet />} />
        <Route element={<AuthenticatedRoute />}>
          <Route path="/create" element={<CreateFlashcardSet />} />
          <Route
            path="/recently-viewed"
            element={<FilteredFlashcardSets filter="recently-viewed" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
