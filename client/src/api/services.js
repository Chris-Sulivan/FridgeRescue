// All backend calls live here. Pages and components never call fetch directly.
import { request } from './http'
import { normalizeFood, normalizeOption } from './normalize'

export const authApi = {
  login: (credentials) => request('/api/auth/login', { method: 'POST', body: credentials }),
  register: (details) => request('/api/auth/register', { method: 'POST', body: details }),
}

// Default categories/units have userId null. Custom ones belong to one user.
const visibleTo = (userId) => (option) => !option.userId || option.userId === userId

export const lookupApi = {
  async categories(userId) {
    const docs = await request('/api/categories')
    return docs.map(normalizeOption).filter(visibleTo(userId))
  },
  async units(userId) {
    const docs = await request('/api/units')
    return docs.map(normalizeOption).filter(visibleTo(userId))
  },
}

// Form values -> request body. category and unit are sent as IDs.
function toBody(values, userId) {
  const body = {
    name: values.name,
    category: values.categoryId,
    quantity: Number(values.quantity),
    unit: values.unitId,
    expirationDate: values.expirationDate,
  }
  if (values.shelf !== '' && values.shelf != null) body.shelf = Number(values.shelf)
  if (userId) body.userId = userId
  return body
}

export const foodApi = {
  async list(userId) {
    const docs = await request('/api/fooditems')
    // TEMPORARY: the API does not filter by user yet, so keep only this user's items.
    // Remove this filter once GET /api/fooditems is scoped to the logged-in user on the server.
    return docs.filter((doc) => String(doc.userId) === String(userId)).map(normalizeFood)
  },
  async get(id) {
    return normalizeFood(await request(`/api/fooditems/${id}`))
  },
  async create(values, userId) {
    return normalizeFood(await request('/api/fooditems', { method: 'POST', body: toBody(values, userId) }))
  },
  async update(id, values) {
    return normalizeFood(await request(`/api/fooditems/${id}`, { method: 'PUT', body: toBody(values) }))
  },
  remove: (id) => request(`/api/fooditems/${id}`, { method: 'DELETE' }),
}
