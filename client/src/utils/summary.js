import { getDaysLeft, getExpirationStatus } from './expiration'

// Counts items for the dashboard magnets.
// Uses the same rules as the colors on the cards (green / yellow / red),
// so "Expires today" counts as Expired, not Expiring.
export function summarizeFoods(foods) {
  const summary = { total: foods.length, fresh: 0, expiring: 0, expired: 0 }

  foods.forEach((food) => {
    const status = getExpirationStatus(getDaysLeft(food.expirationDate))
    if (status === 'red') summary.expired += 1
    else if (status === 'yellow') summary.expiring += 1
    else summary.fresh += 1
  })

  return summary
}
