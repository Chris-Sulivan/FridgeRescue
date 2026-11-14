import { Link } from 'react-router-dom'
import { getDaysLeft, getExpirationStatus } from '../utils/expiration'
import { formatDate, formatQuantity } from '../utils/format'
import ExpirationBadge from './ExpirationBadge'
import './FoodCard.css'

// One item in My Fridge. The left border color shows fresh / expiring / expired.
function FoodCard({ food, confirming, busy, onAskDelete, onCancelDelete, onConfirmDelete }) {
  const status = getExpirationStatus(getDaysLeft(food.expirationDate))

  return (
    <article className={`food-card food-card--${status}`}>
      <div className="food-card__head">
        <h3 className="food-card__name">{food.name}</h3>
        <ExpirationBadge expirationDate={food.expirationDate} />
      </div>

      <dl className="food-card__details">
        <div>
          <dt>Quantity</dt>
          <dd>{formatQuantity(food.quantity, food.unit)}</dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{food.category}</dd>
        </div>
        <div>
          <dt>Expires</dt>
          <dd>{formatDate(food.expirationDate)}</dd>
        </div>
        {food.shelf !== '' && (
          <div>
            <dt>Shelf</dt>
            <dd>{food.shelf}</dd>
          </div>
        )}
      </dl>

      {confirming ? (
        <div className="food-card__actions" role="group" aria-label={`Confirm deleting ${food.name}`}>
          <span className="food-card__confirm">Delete {food.name}?</span>
          <button type="button" className="button button--danger button--small" onClick={onConfirmDelete} disabled={busy}>
            {busy ? 'Deleting…' : 'Yes, delete'}
          </button>
          <button type="button" className="button button--secondary button--small" onClick={onCancelDelete} disabled={busy}>
            Keep
          </button>
        </div>
      ) : (
        <div className="food-card__actions">
          <Link to={`/foods/${food.id}/edit`} className="button button--secondary button--small" aria-label={`Edit ${food.name}`}>
            Edit
          </Link>
          <button type="button" className="button button--danger button--small" onClick={onAskDelete} aria-label={`Delete ${food.name}`}>
            Delete
          </button>
        </div>
      )}
    </article>
  )
}

export default FoodCard
