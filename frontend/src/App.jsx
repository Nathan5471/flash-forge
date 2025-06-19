import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { OverlayProvider }  from './contexts/OverlayContext.jsx'
import Overlay from './components/Overlay.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import FlashcardSet from './pages/FlashcardSet.jsx'
import Search from './pages/Search.jsx'
import Settings from './pages/Settings.jsx'
import Create from './pages/Create.jsx'
import AuthenticatedRoute from './utils/AuthenticatedRoute.jsx'

function App() {
  return (
    <OverlayProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/set/:id" element={<FlashcardSet />} />
          <Route path="/search/:searchTerm" element={<Search />} />
          <Route element={<AuthenticatedRoute />}>
            <Route path="/settings" element={<Settings />} />
            <Route path="/create" element={<Create />} />
          </Route>
        </Routes>
      </Router>
      <Overlay />
    </OverlayProvider>
    
  )
}

export default App
