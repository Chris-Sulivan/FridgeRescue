import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { ErrorMessage } from '../components/Feedback'
import { useAuth } from '../context/auth-context'
import '../components/FoodForm.css'
import './AuthForm.css'

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

// Same rules as the server (authController.js) so users get the message before sending
function validate({ name, email, password, confirmPassword }) {
  const errors = {}

  if (!name.trim()) errors.name = 'Name is required.'
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'

  if (!email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.'

  if (!password) errors.password = 'Password is required.'
  else if (password.length < 8) errors.password = 'Use at least 8 characters.'

  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.'

  return errors
}

function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

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
      await register({ name: values.name.trim(), email: values.email.trim(), password: values.password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setApiError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form className="food-form auth-form" onSubmit={handleSubmit} noValidate>
      <img src="/logo.svg" alt="FridgeRescue" className="auth-form__logo" />
      <h1 className="auth-form__title">Create your account</h1>
      <p className="auth-form__subtitle">Start tracking your food and waste less.</p>

      <ErrorMessage message={apiError} />

      <FormField label="Name" name="name" type="text" autoComplete="name" value={values.name} onChange={handleChange} error={errors.name} />
      <FormField label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
      <FormField label="Password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={handleChange} error={errors.password} />
      <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Create account'}
      </button>

      <p className="auth-form__footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  )
}

export default Register
