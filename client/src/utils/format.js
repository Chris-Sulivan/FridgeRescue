// "1 piece", "5 pieces", "500 g"
export function formatQuantity(quantity, unit) {
  if (unit === 'pieces' && Number(quantity) === 1) return '1 piece'
  return `${quantity} ${unit}`
}
