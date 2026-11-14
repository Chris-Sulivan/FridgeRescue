import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import './Navbar.css'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link to={isAuthenticated ? '/dashboard' : '/login'} className="navbar__brand" aria-label="FridgeRescue home">
        <img src="/logo.svg" alt="FridgeRescue" className="navbar__logo" />
      </Link>

      {isAuthenticated && (
        <nav className="navbar__links" aria-label="Main">
          <NavLink to="/dashboard" className="navbar__pill">Home</NavLink>
          <NavLink to="/fridge" className="navbar__pill">My Fridge</NavLink>
          <span className="navbar__pill navbar__pill--soon">
            Recipes <span className="navbar__tag">soon</span>
          </span>
        </nav>
      )}

      <div className="navbar__account">
        {isAuthenticated ? (
          <>
            <span className="navbar__user">Hi, {user?.name}</span>
            <button type="button" className="button button--secondary button--small" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
