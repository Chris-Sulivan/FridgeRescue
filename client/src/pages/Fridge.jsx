import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import { ErrorMessage, Spinner } from '../components/Feedback'
import { foodApi, lookupApi } from '../api/services'
import { useAuth } from '../context/auth-context'
import useAsync from '../hooks/useAsync'
import { getDaysLeft } from '../utils/expiration'
import './Fridge.css'

function Fridge() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [confirmId, setConfirmId] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const loadFridge = useCallback(async () => {
    const [categories, foods] = await Promise.all([
      lookupApi.categories(user.id),
      foodApi.list(user.id),
    ])
    return { categories, foods }
  }, [user.id])

  const { status, data, error, reload, setData } = useAsync(loadFridge)

  const foods = useMemo(() => data?.foods ?? [], [data])

  // Most urgent first, then apply the category filter
  const visibleFoods = useMemo(() => {
    const sorted = [...foods].sort((a, b) => getDaysLeft(a.expirationDate) - getDaysLeft(b.expirationDate))
    return filter === 'all' ? sorted : sorted.filter((food) => food.categoryId === filter)
  }, [foods, filter])

  // Only offer filters for categories that have items
  const filterOptions = useMemo(() => {
    const used = new Set(foods.map((food) => food.categoryId))
    return (data?.categories ?? []).filter((category) => used.has(category.id))
  }, [foods, data])

  async function handleDelete(food) {
    setBusyId(food.id)
    setActionError('')
    try {
      await foodApi.remove(food.id)
      setData((current) => ({ ...current, foods: current.foods.filter((item) => item.id !== food.id) }))
      setConfirmId(null)
      if (filter !== 'all' && !foods.some((item) => item.id !== food.id && item.categoryId === filter)) {
        setFilter('all')
      }
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="fridge-page">
      <div className="fridge-page__head">
        <div>
          <h1>My Fridge</h1>
          {status === 'ready' && (
            <p className="fridge-page__count">
              {foods.length} {foods.length === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>
        <Link to="/foods/new" className="button">+ Add food</Link>
      </div>

      {status === 'loading' && <Spinner label="Loading your fridge…" />}
      {status === 'error' && <ErrorMessage message={error} onRetry={reload} />}
      <ErrorMessage message={actionError} />

      {status === 'ready' && foods.length === 0 && (
        <div className="fridge-page__empty">
          <h2>Your fridge is empty</h2>
          <p>Add your first item to start tracking expiration dates.</p>
          <Link to="/foods/new" className="button">+ Add food</Link>
        </div>
      )}

      {status === 'ready' && foods.length > 0 && (
        <>
          <div className="fridge-page__filters" role="group" aria-label="Filter by category">
            <button
              type="button"
              className="fridge-page__chip"
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {filterOptions.map((category) => (
              <button
                key={category.id}
                type="button"
                className="fridge-page__chip"
                aria-pressed={filter === category.id}
                onClick={() => setFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="fridge-page__grid">
            {visibleFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                confirming={confirmId === food.id}
                busy={busyId === food.id}
                onAskDelete={() => setConfirmId(food.id)}
                onCancelDelete={() => setConfirmId(null)}
                onConfirmDelete={() => handleDelete(food)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Fridge
