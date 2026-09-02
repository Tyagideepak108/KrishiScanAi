import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    language: 'en'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://krishiscanai-production-5d07.up.railway.app'
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData

      const response = await axios.post(`${apiUrl}${endpoint}`, payload)
      
      // Validate response
      if (!response.data || !response.data.access_token) {
        throw new Error('Invalid response from server')
      }
      
      // Save token and user info
      const token = response.data.access_token
      const userData = {
        id: response.data.user_id || response.data.id || '',
        name: response.data.name || 'User',
        email: response.data.email || formData.email,
        plan: response.data.plan || 'free'
      }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      // Reset auth scans counter for new registration
      if (!isLogin) {
        localStorage.setItem('authScans', '0')
      }

      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event('authChange'))

      // Use navigate instead of window.location.href for smooth transition
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 300)
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.response?.data?.detail || err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            {isLogin ? '👋 Welcome Back' : '🌱 Join KrishiScan'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Login to access your dashboard' : 'Create account to get started'}
          </p>
        </div>

        {/* Form Card */}
        <div className="card animate-fade-up">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-white text-green-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-white text-green-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2 animate-fade-in">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (Register only) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="label">
                  <span className="flex items-center gap-2">
                    <span>👤</span>
                    <span>Full Name</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="label">
                <span className="flex items-center gap-2">
                  <span>📧</span>
                  <span>Email Address</span>
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Password</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              )}
            </div>

            {/* Phone (Register only) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="label">
                  <span className="flex items-center gap-2">
                    <span>📱</span>
                    <span>Phone Number (Optional)</span>
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            )}

            {/* Language (Register only) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="label">
                  <span className="flex items-center gap-2">
                    <span>🌐</span>
                    <span>Preferred Language</span>
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: 'en' })}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      formData.language === 'en'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🇬🇧</div>
                    <div className="text-sm font-semibold">English</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: 'hi' })}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      formData.language === 'hi'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🇮🇳</div>
                    <div className="text-sm font-semibold">हिंदी</div>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? '🚀 Login' : '✨ Create Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Guest Option */}
          <Link
            to="/scan"
            className="block text-center py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300"
          >
            Continue as Guest →
          </Link>
        </div>

        {/* Benefits (Register only) */}
        {!isLogin && (
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 animate-fade-in">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span>Account Benefits</span>
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Save scan history and track crop health</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Get 10 free scans per month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Access detailed treatment recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Personalized disease alerts</span>
              </li>
            </ul>
          </div>
        )}

        {/* Trust Badge */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Your data is secure and encrypted</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
