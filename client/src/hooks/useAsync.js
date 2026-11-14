import { useCallback, useEffect, useState } from 'react'

// Runs an async function when the component mounts (and when fn changes).
// Returns { status: 'loading' | 'ready' | 'error', data, error, reload, setData }.
// Wrap fn in useCallback so it only changes when its inputs change.
function useAsync(fn) {
  const [state, setState] = useState({ status: 'loading', data: null, error: '' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false

    fn()
      .then((data) => {
        if (!ignore) setState({ status: 'ready', data, error: '' })
      })
      .catch((err) => {
        if (!ignore) setState({ status: 'error', data: null, error: err.message || 'Something went wrong.' })
      })

    return () => {
      ignore = true
    }
  }, [fn, attempt])

  const reload = useCallback(() => {
    setState((current) => ({ ...current, status: 'loading', error: '' }))
    setAttempt((count) => count + 1)
  }, [])

  const setData = useCallback((update) => {
    setState((current) => ({
      ...current,
      data: typeof update === 'function' ? update(current.data) : update,
    }))
  }, [])

  return { ...state, reload, setData }
}

export default useAsync
