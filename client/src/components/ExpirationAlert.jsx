import { getDaysLeft, getExpirationStatus } from '../utils/expiration'
import ExpirationBadge from './ExpirationBadge'
import './ExpirationAlert.css'

function ExpirationAlert({ items = [] }) {
  // Keep only yellow and red items, most urgent first
  const alerts = items
    .map((item) => ({ ...item, daysLeft: getDaysLeft(item.expirationDate) }))
    .filter((item) => getExpirationStatus(item.daysLeft) !== 'green')
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const expiredCount = alerts.filter((item) => item.daysLeft < 0).length

  return (
    <section className="expiration-alert">
      <h2>Use first</h2>

      {alerts.length === 0 && <p>Nothing is expiring soon.</p>}

      {expiredCount > 0 && (
        <p className="expiration-alert__warning" role="alert">
          {expiredCount === 1
            ? '1 item has expired. Check it before eating.'
            : `${expiredCount} items have expired. Check them before eating.`}
        </p>
      )}

      <ul className="expiration-alert__list">
        {alerts.map((item) => (
          <li key={item.id} className="expiration-alert__item">
            <span>
              <strong>{item.name}</strong> · {item.category} · {item.quantity} {item.unit}
            </span>
            <ExpirationBadge expirationDate={item.expirationDate} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ExpirationAlert
