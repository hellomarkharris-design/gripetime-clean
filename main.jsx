
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Create from './pages/Create.jsx'
import Respond from './pages/Respond.jsx'
import Gripes from './pages/Gripes.jsx'
import Leaderboards from './pages/Leaderboards.jsx'
import Auth from './pages/Auth.jsx'
import Admin from './pages/Admin.jsx'
import './styles.css'

function Shell(){
  return (
    <BrowserRouter>
      <header className="wrap">
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/create">Create</NavLink>
          <NavLink to="/respond">Respond</NavLink>
          <NavLink to="/gripes">Gripes</NavLink>
          <NavLink to="/leaderboards">Leaderboards</NavLink>
          <NavLink to="/auth">Account</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create" element={<Create/>} />
          <Route path="/respond" element={<Respond/>} />
          <Route path="/gripes" element={<Gripes/>} />
          <Route path="/leaderboards" element={<Leaderboards/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/gripe/:id" element={<Home/>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Shell/>)
