import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import CreateFlashcardSet from "./pages/createFlashcardSet/CreateFlashcardSet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<CreateFlashcardSet />} />
      </Routes>
    </Router>
  );
}

export default App;
