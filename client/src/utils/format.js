// "1 pc", "5 pcs", "500 g"
export function formatQuantity(quantity, unit) {
  if ((unit === 'pcs' || unit === 'pieces') && Number(quantity) === 1) return '1 pc'
  return `${quantity} ${unit}`
}

// "Nov 20, 2026" from "2026-11-20"
export function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
