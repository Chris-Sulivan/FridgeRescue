import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Fridge from './pages/Fridge'
import AddFood from './pages/AddFood'
import EditFood from './pages/EditFood'

function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '16px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Everything below needs a logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fridge" element={<Fridge />} />
            <Route path="/foods/new" element={<AddFood />} />
            <Route path="/foods/:id/edit" element={<EditFood />} />
          </Route>

          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </main>
    </>
  )
}

export default App
