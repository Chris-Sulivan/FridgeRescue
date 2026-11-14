import { useCallback } from 'react'
import ExpirationAlert from '../components/ExpirationAlert'
import FridgeDoor from '../components/FridgeDoor'
import { ErrorMessage, Spinner } from '../components/Feedback'
import { foodApi } from '../api/services'
import { useAuth } from '../context/auth-context'
import useAsync from '../hooks/useAsync'
import { summarizeFoods } from '../utils/summary'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const loadFoods = useCallback(() => foodApi.list(user.id), [user.id])
  const { status, data: foods, error, reload } = useAsync(loadFoods)

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Home</h1>

      {status === 'loading' && <Spinner label="Loading your fridge…" />}
      {status === 'error' && <ErrorMessage message={error} onRetry={reload} />}

      {status === 'ready' && (
        <>
          <FridgeDoor summary={summarizeFoods(foods)} />
          <ExpirationAlert items={foods} />
        </>
      )}
    </div>
  )
}

export default Dashboard
