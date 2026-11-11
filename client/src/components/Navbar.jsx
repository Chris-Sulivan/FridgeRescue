import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '16px', padding: '16px' }}>
      <strong>FridgeRescue</strong>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/fridge">My Fridge</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/register">Register</NavLink>
    </nav>
  )
}

export default Navbar
