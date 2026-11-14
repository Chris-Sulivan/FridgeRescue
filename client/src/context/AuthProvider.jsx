import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/services'
import { getToken, setToken, UNAUTHORIZED_EVENT } from '../api/http'
import { AuthContext } from './auth-context'

const USER_KEY = 'fridgerescue-user'

function readStoredUser() {
  try {
    return getToken() ? JSON.parse(localStorage.getItem(USER_KEY)) : null
  } catch {
    return null
  }
}

function storeUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch {
    // Ignore blocked storage
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const startSession = useCallback(({ token, user: account }) => {
    setToken(token)
    storeUser(account)
    setUser(account)
  }, [])

  const login = useCallback(async (credentials) => startSession(await authApi.login(credentials)), [startSession])
  const register = useCallback(async (details) => startSession(await authApi.register(details)), [startSession])

  const logout = useCallback(() => {
    setToken(null)
    storeUser(null)
    setUser(null)
  }, [])

  // The API said the token is expired or invalid
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout)
  }, [logout])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
