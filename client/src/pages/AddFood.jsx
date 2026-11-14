import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FoodForm from '../components/FoodForm'
import { ErrorMessage, Spinner } from '../components/Feedback'
import { foodApi, lookupApi } from '../api/services'
import { useAuth } from '../context/auth-context'
import useAsync from '../hooks/useAsync'

function AddFood() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const loadLookups = useCallback(async () => {
    const [categories, units] = await Promise.all([
      lookupApi.categories(user.id),
      lookupApi.units(user.id),
    ])
    return { categories, units }
  }, [user.id])

  const { status, data, error, reload } = useAsync(loadLookups)

  async function handleSave(food) {
    setSaving(true)
    setSaveError('')
    try {
      await foodApi.create(food, user.id)
      navigate('/fridge')
    } catch (err) {
      setSaveError(err.message)
      setSaving(false)
    }
  }

  if (status === 'loading') return <Spinner label="Loading form…" />
  if (status === 'error') return <ErrorMessage message={error} onRetry={reload} />

  return (
    <FoodForm
      categories={data.categories}
      units={data.units}
      onSave={handleSave}
      onCancel={() => navigate('/fridge')}
      saving={saving}
      error={saveError}
    />
  )
}

export default AddFood
