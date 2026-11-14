// The API returns Mongo documents. The UI uses the shape from sampleFoods.js:
// { id, name, category, quantity, unit, shelf, expirationDate: 'YYYY-MM-DD' }
// plus categoryId / unitId so the edit form can preselect the dropdowns.
export function normalizeFood(doc) {
  const category = doc.category && typeof doc.category === 'object' ? doc.category : null
  const unit = doc.unit && typeof doc.unit === 'object' ? doc.unit : null

  return {
    id: doc._id,
    name: doc.name,
    category: category?.name ?? '',
    categoryId: category?._id ?? doc.category ?? '',
    quantity: doc.quantity,
    unit: unit?.name ?? '',
    unitId: unit?._id ?? doc.unit ?? '',
    shelf: doc.shelf ?? '',
    expirationDate: String(doc.expirationDate).slice(0, 10),
    userId: doc.userId,
  }
}

export function normalizeOption(doc) {
  return { id: doc._id, name: doc.name, userId: doc.userId ?? null }
}
