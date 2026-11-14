import './Feedback.css'

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner__circle" />
      <span>{label}</span>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="error-message" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="button button--secondary button--small" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
