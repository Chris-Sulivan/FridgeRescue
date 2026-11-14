import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { ErrorMessage } from '../components/Feedback'
import { useAuth } from '../context/auth-context'
import '../components/FoodForm.css'
import './AuthForm.css'

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from || '/dashboard'

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to={destination} replace />

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    // Clear this field's error as soon as the user edits it
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    const foundErrors = validate(values)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) return

    setSubmitting(true)
    try {
      await login({ email: values.email.trim(), password: values.password })
      navigate(destination, { replace: true })
    } catch (err) {
      setApiError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form className="food-form auth-form" onSubmit={handleSubmit} noValidate>
      <img src="/logo.svg" alt="FridgeRescue" className="auth-form__logo" />
      <h1 className="auth-form__title">Welcome back</h1>
      <p className="auth-form__subtitle">Log in to see what is in your fridge.</p>

      <ErrorMessage message={apiError} />

      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />

      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Logging in…' : 'Log in'}
      </button>

      <p className="auth-form__footer">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  )
}

export default Login
