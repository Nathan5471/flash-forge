import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { OverlayProvider }  from './contexts/OverlayContext.jsx'
import Overlay from './components/Overlay.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Settings from './pages/Settings.jsx'
import AuthenticatedRoute from './utils/AuthenticatedRoute.jsx'

function App() {
  return (
    <OverlayProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route element={<AuthenticatedRoute />}>
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
      <Overlay />
    </OverlayProvider>
    
  )
}

export default App
