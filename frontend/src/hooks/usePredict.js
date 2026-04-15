import { useState } from 'react'
import { predictDisease, predictGuest } from '../api/predict'
import { isLoggedIn } from '../api/auth'

export function usePredict() {
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const predict = async (file, cropType, lang = 'en') => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const fn = isLoggedIn() ? predictDisease : predictGuest
      const res = await fn(formData, cropType, lang)
      setResult(res.data)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Prediction failed. Please try again.'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setResult(null); setError(null) }

  return { predict, result, loading, error, reset }
}