import { useState, useEffect } from 'react'
import { getUser, isLoggedIn, logout as doLogout } from '../api/auth'

export function useAuth() {
  const [user, setUser]       = useState(getUser())
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())

  useEffect(() => {
    setUser(getUser())
    setLoggedIn(isLoggedIn())
  }, [])

  const logout = () => {
    doLogout()
    setUser(null)
    setLoggedIn(false)
  }

  const refreshUser = () => {
    setUser(getUser())
    setLoggedIn(isLoggedIn())
  }

  return { user, loggedIn, logout, refreshUser }
}