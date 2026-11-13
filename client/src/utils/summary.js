import { getDaysLeft } from './expiration'

// Counts items for the dashboard magnets
export function summarizeFoods(foods) {
  const summary = { total: foods.length, fresh: 0, expiring: 0, expired: 0 }

  foods.forEach((food) => {
    const daysLeft = getDaysLeft(food.expirationDate)
    if (daysLeft < 0) summary.expired += 1
    else if (daysLeft <= 3) summary.expiring += 1
    else summary.fresh += 1
  })

  return summary
}
