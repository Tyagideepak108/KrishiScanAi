import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalScans: 0,
    confidentScans: 0,
    avgConfidence: 0,
    uniqueDiseases: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      navigate('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchReports(token)
  }, [navigate])

  const fetchReports = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://krishiscanai-production.up.railway.app'
      const response = await axios.get(`${apiUrl}/api/reports/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const reportsData = response.data
      setReports(reportsData)

      // Calculate stats
      const totalScans = reportsData.length
      const confidentScans = reportsData.filter(r => r.is_confident).length
      const avgConf = totalScans > 0 
        ? reportsData.reduce((sum, r) => sum + r.confidence, 0) / totalScans 
        : 0
      const uniqueDiseases = new Set(reportsData.map(r => r.disease_name)).size

      setStats({
        totalScans,
        confidentScans,
        avgConfidence: avgConf.toFixed(1),
        uniqueDiseases
      })
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('authScans')
    window.location.href = '/'
  }

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this scan report?')) return

    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'https://krishiscanai-production.up.railway.app'
      await axios.delete(`${apiUrl}/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Refresh reports
      fetchReports(token)
    } catch (error) {
      alert('Failed to delete report')
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-2">
              👋 Welcome, {user?.name}!
            </h1>
            <p className="text-lg text-gray-600">Manage your scans and track crop health</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/scan"
              className="btn-primary px-6 py-3"
            >
              📸 New Scan
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold shadow-lg"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:scale-105 transition-transform duration-300 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📊</div>
              <div className="text-3xl font-display font-bold text-green-600">
                {stats.totalScans}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700">Total Scans</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:scale-105 transition-transform duration-300 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">💎</div>
              <div className="text-3xl font-display font-bold text-blue-600">
                {user?.plan?.toUpperCase()}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700">Current Plan</div>
            <Link to="/pricing" className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block">
              Upgrade →
            </Link>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:scale-105 transition-transform duration-300 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🎯</div>
              <div className="text-3xl font-display font-bold text-purple-600">
                {stats.avgConfidence}%
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700">Avg Confidence</div>
            <div className="text-xs text-gray-500 mt-1">{stats.confidentScans} confident scans</div>
          </div>

          <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 hover:scale-105 transition-transform duration-300 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🦠</div>
              <div className="text-3xl font-display font-bold text-amber-600">
                {stats.uniqueDiseases}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700">Diseases Found</div>
            <div className="text-xs text-gray-500 mt-1">Unique types</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/scan" className="card hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <div className="flex items-center gap-4">
              <div className="text-5xl">📸</div>
              <div>
                <div className="text-xl font-bold mb-1">New Scan</div>
                <div className="text-sm opacity-90">Upload leaf photo</div>
              </div>
            </div>
          </Link>

          <Link to="/pricing" className="card hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center gap-4">
              <div className="text-5xl">💎</div>
              <div>
                <div className="text-xl font-bold mb-1">Upgrade Plan</div>
                <div className="text-sm opacity-90">Unlock unlimited scans</div>
              </div>
            </div>
          </Link>

          <div className="card hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="text-5xl">📈</div>
              <div>
                <div className="text-xl font-bold mb-1">View Analytics</div>
                <div className="text-sm opacity-90">Coming soon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scan History */}
        <div className="card animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
              <span>📋</span>
              <span>Scan History</span>
            </h2>
            {reports.length > 0 && (
              <span className="text-sm text-gray-500">
                {reports.length} total scans
              </span>
            )}
          </div>
          
          {reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-4">🌾</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No scans yet</h3>
              <p className="text-gray-600 mb-6">Start your first scan to track crop health!</p>
              <Link to="/scan" className="btn-primary inline-block">
                📸 Start Scanning
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div
                  key={report.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">
                        {report.is_confident ? '✅' : '⚠️'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {report.disease_name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceColor(report.confidence)}`}>
                            {report.confidence.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span>🌾</span>
                            <span className="capitalize">{report.crop_type.replace('_', ' ')}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📅</span>
                            <span>{new Date(report.created_at).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>{report.language === 'hi' ? '🇮🇳' : '🇬🇧'}</span>
                            <span>{report.language === 'hi' ? 'Hindi' : 'English'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
