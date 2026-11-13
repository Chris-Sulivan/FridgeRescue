import { getDaysLeft, getExpirationStatus, getExpirationLabel } from '../utils/expiration'
import './ExpirationAlert.css'

function ExpirationBadge({ expirationDate }) {
  const daysLeft = getDaysLeft(expirationDate)
  const status = getExpirationStatus(daysLeft)

  return (
    <span className={`expiration-badge expiration-badge--${status}`}>
      {getExpirationLabel(daysLeft)}
    </span>
  )
}

export default ExpirationBadge
