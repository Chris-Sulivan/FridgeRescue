import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <span className="navbar__brand">FridgeRescue</span>

      <nav className="navbar__links" aria-label="Main">
        <NavLink to="/dashboard" className="navbar__pill">Home</NavLink>
        <NavLink to="/fridge" className="navbar__pill">My Fridge</NavLink>
        <span className="navbar__pill navbar__pill--soon">
          Recipes <span className="navbar__tag">soon</span>
        </span>
      </nav>

      <div className="navbar__account">
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </div>
    </header>
  )
}

export default Navbar
