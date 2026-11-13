const MS_PER_DAY = 24 * 60 * 60 * 1000

// Turns "2026-11-20" into a date at midnight, local time
function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// How many days until the food expires (negative = already expired)
export function getDaysLeft(dateString) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((parseDate(dateString) - today) / MS_PER_DAY)
}

// Green: more than 3 days. Yellow: 1 to 3 days. Red: today or expired.
export function getExpirationStatus(daysLeft) {
  if (daysLeft > 3) return 'green'
  if (daysLeft >= 1) return 'yellow'
  return 'red'
}

// The text shown to the user
export function getExpirationLabel(daysLeft) {
  if (daysLeft < -1) return `Expired ${Math.abs(daysLeft)} days ago`
  if (daysLeft === -1) return 'Expired 1 day ago'
  if (daysLeft === 0) return 'Expires today'
  if (daysLeft === 1) return '1 day left'
  return `${daysLeft} days left`
}
