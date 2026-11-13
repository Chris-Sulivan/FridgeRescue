// Sample data until the backend API is ready.
// Dates are relative to today so every status color shows up.
function daysFromToday(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const sampleFoods = [
  { id: 1, name: 'Milk', category: 'Dairy', quantity: 1, unit: 'pieces', shelf: 1, expirationDate: daysFromToday(2) },
  { id: 2, name: 'Eggs', category: 'Dairy', quantity: 6, unit: 'pieces', shelf: 2, expirationDate: daysFromToday(8) },
  { id: 3, name: 'Strawberries', category: 'Fruits', quantity: 5, unit: 'pieces', shelf: 3, expirationDate: daysFromToday(-2) },
  { id: 4, name: 'Yogurt', category: 'Dairy', quantity: 2, unit: 'pieces', shelf: 1, expirationDate: daysFromToday(0) },
  { id: 5, name: 'Chicken', category: 'Meat', quantity: 500, unit: 'g', shelf: 3, expirationDate: daysFromToday(3) },
]

export default sampleFoods
