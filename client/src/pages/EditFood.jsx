import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FoodForm from '../components/FoodForm'
import { ErrorMessage, Spinner } from '../components/Feedback'
import { foodApi, lookupApi } from '../api/services'
import { useAuth } from '../context/auth-context'
import useAsync from '../hooks/useAsync'

function EditFood() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const loadEditData = useCallback(async () => {
    const [categories, units, food] = await Promise.all([
      lookupApi.categories(user.id),
      lookupApi.units(user.id),
      foodApi.get(id),
    ])
    return { categories, units, food }
  }, [user.id, id])

  const { status, data, error, reload } = useAsync(loadEditData)

  async function handleSave(updatedFood) {
    setSaving(true)
    setSaveError('')
    try {
      await foodApi.update(id, updatedFood)
      navigate('/fridge')
    } catch (err) {
      setSaveError(err.message)
      setSaving(false)
    }
  }

  if (status === 'loading') return <Spinner label="Loading item…" />

  if (status === 'error') {
    return (
      <div>
        <ErrorMessage message={error} onRetry={reload} />
        <p><Link to="/fridge">Back to My Fridge</Link></p>
      </div>
    )
  }

  return (
    <FoodForm
      initialValues={data.food}
      categories={data.categories}
      units={data.units}
      onSave={handleSave}
      onCancel={() => navigate('/fridge')}
      saving={saving}
      error={saveError}
    />
  )
}

export default EditFood
