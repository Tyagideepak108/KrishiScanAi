import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Scanner() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cropType, setCropType] = useState('sugarcane')
  const [language, setLanguage] = useState('en')
  const [guestScans, setGuestScans] = useState(0)
  const [authScans, setAuthScans] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const scans = parseInt(localStorage.getItem('authScans') || '0')
      setAuthScans(scans)
    } else {
      const scans = parseInt(localStorage.getItem('guestScans') || '0')
      setGuestScans(scans)
    }
  }, [])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleScan = async () => {
    if (!image) return

    const token = localStorage.getItem('token')
    
    // Check guest scan limit (5 scans)
    if (!token) {
      const scans = parseInt(localStorage.getItem('guestScans') || '0')
      if (scans >= 5) {
        alert('🔒 You have reached the free scan limit (5 scans). Please login to continue!')
        navigate('/pricing')
        return
      }
    } else {
      // Check authenticated user scan limit (10 scans)
      const authScans = parseInt(localStorage.getItem('authScans') || '0')
      if (authScans >= 10) {
        alert('🔒 You have reached the free plan limit (10 scans). Upgrade to Pro for unlimited scans!')
        navigate('/pricing')
        return
      }
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', image)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://krishiscanai-production.up.railway.app'
      
      // Use authenticated endpoint if logged in, else guest
      const endpoint = token 
        ? `/api/predict/?crop_type=${cropType}&lang=${language}`
        : `/api/predict/guest?crop_type=${cropType}&lang=${language}`
      
      const headers = {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` })
      }
      
      const response = await axios.post(
        `${apiUrl}${endpoint}`,
        formData,
        { headers }
      )
      
      // Increment scan count
      if (!token) {
        const newCount = guestScans + 1
        localStorage.setItem('guestScans', newCount.toString())
        setGuestScans(newCount)
      } else {
        const newCount = authScans + 1
        localStorage.setItem('authScans', newCount.toString())
        setAuthScans(newCount)
      }
      
      navigate('/result', { state: { result: response.data } })
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Failed to scan'))
    } finally {
      setLoading(false)
    }
  }

  const isLoggedIn = !!localStorage.getItem('token')
  const currentScans = isLoggedIn ? authScans : guestScans
  const maxScans = isLoggedIn ? 10 : 5
  const scanPercentage = (currentScans / maxScans) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            AI Scanner
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            📸 Scan Your Crop
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a clear photo of the affected leaf for instant AI-powered diagnosis
          </p>
          
          {/* Scan Counter */}
          <div className="mt-6 inline-block">
            {!isLoggedIn ? (
              <div className="bg-yellow-50 border-2 border-yellow-200 px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎯</span>
                  <div className="text-left">
                    <div className="text-sm text-yellow-600 font-semibold">Guest Scans</div>
                    <div className="text-2xl font-bold text-yellow-800">{guestScans}/5 used</div>
                  </div>
                </div>
                <div className="w-48 bg-yellow-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-yellow-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${scanPercentage}%` }}
                  ></div>
                </div>
                {guestScans >= 3 && (
                  <div className="mt-2 text-xs text-yellow-700 font-medium">
                    ⚠️ Only {5 - guestScans} scans remaining
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 border-2 border-blue-200 px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💎</span>
                  <div className="text-left">
                    <div className="text-sm text-blue-600 font-semibold">Free Plan</div>
                    <div className="text-2xl font-bold text-blue-800">{authScans}/10 scans</div>
                  </div>
                </div>
                <div className="w-48 bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${scanPercentage}%` }}
                  ></div>
                </div>
                {authScans >= 7 && (
                  <div className="mt-2 text-xs text-blue-700 font-medium">
                    ⚠️ Only {10 - authScans} scans remaining
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Settings */}
          <div className="space-y-6 animate-fade-up">
            {/* Crop Type Selection */}
            <div className="card">
              <label className="label flex items-center gap-2 mb-4">
                <span className="text-xl">🌾</span>
                <span>Select Crop Type</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCropType('sugarcane')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    cropType === 'sugarcane'
                      ? 'border-green-600 bg-green-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">🌾</div>
                  <div className="font-bold text-gray-900">Sugarcane</div>
                  <div className="text-xs text-gray-500 mt-1">12 diseases</div>
                </button>
                <button
                  onClick={() => setCropType('other_crops')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    cropType === 'other_crops'
                      ? 'border-green-600 bg-green-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">🌽</div>
                  <div className="font-bold text-gray-900">Other Crops</div>
                  <div className="text-xs text-gray-500 mt-1">15 diseases</div>
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div className="card">
              <label className="label flex items-center gap-2 mb-4">
                <span className="text-xl">🌐</span>
                <span>Language / भाषा</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    language === 'en'
                      ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">🇬🇧</div>
                  <div className="font-bold text-gray-900">English</div>
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    language === 'hi'
                      ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">🇮🇳</div>
                  <div className="font-bold text-gray-900">हिंदी</div>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Tips for Best Results
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Take photo in good natural lighting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Focus clearly on the affected area</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Avoid blurry or dark images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Scan one leaf at a time</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="card">
              <label className="label flex items-center gap-2 mb-4">
                <span className="text-xl">📷</span>
                <span>Upload Image</span>
              </label>
              
              {!preview ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center w-full h-96 border-3 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-green-500 bg-green-50 scale-105'
                      : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="text-center p-6">
                    <div className="text-7xl mb-4 animate-pulse">📷</div>
                    <p className="text-xl font-bold text-gray-700 mb-2">
                      {dragActive ? 'Drop image here' : 'Click or drag to upload'}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                    <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Choose File
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-96 object-cover rounded-2xl shadow-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-2xl flex items-center justify-center">
                    <button
                      onClick={() => {
                        setImage(null)
                        setPreview(null)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-semibold flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Scan Button */}
            <button
              onClick={handleScan}
              disabled={!image || loading}
              className={`w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                !image || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-xl hover:shadow-2xl hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🚀</span>
                  <span>Scan Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scanner
