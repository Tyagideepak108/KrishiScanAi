import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BarChart3, Gem, Target, Bug, Camera, TrendingUp, FileText, CheckCircle, AlertTriangle, Calendar, Globe, Trash2, Hand } from 'lucide-react'

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

    try {
      setUser(JSON.parse(userData))
      fetchReports(token)
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    }
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
        <div className="flex flex-col gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
              <Hand className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 flex-shrink-0" />
              <span className="break-words">Welcome, {user?.name}!</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600">Manage your scans and track crop health</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/scan"
              className="btn-primary px-4 sm:px-6 py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>New Scan</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:scale-105 transition-transform duration-300 animate-fade-up">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              <div className="text-2xl sm:text-3xl font-display font-bold text-green-600">
                {stats.totalScans}
              </div>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Total Scans</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:scale-105 transition-transform duration-300 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Gem className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              <div className="text-2xl sm:text-3xl font-display font-bold text-blue-600">
                {user?.plan?.toUpperCase()}
              </div>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Current Plan</div>
            <Link to="/pricing" className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block">
              Upgrade →
            </Link>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:scale-105 transition-transform duration-300 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
              <div className="text-2xl sm:text-3xl font-display font-bold text-purple-600">
                {stats.avgConfidence}%
              </div>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Avg Confidence</div>
            <div className="text-xs text-gray-500 mt-1">{stats.confidentScans} confident scans</div>
          </div>

          <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 hover:scale-105 transition-transform duration-300 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Bug className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
              <div className="text-2xl sm:text-3xl font-display font-bold text-amber-600">
                {stats.uniqueDiseases}
              </div>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Diseases Found</div>
            <div className="text-xs text-gray-500 mt-1">Unique types</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/scan" className="card hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Camera className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
              <div>
                <div className="text-lg sm:text-xl font-bold mb-1">New Scan</div>
                <div className="text-xs sm:text-sm opacity-90">Upload leaf photo</div>
              </div>
            </div>
          </Link>

          <Link to="/pricing" className="card hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Gem className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
              <div>
                <div className="text-lg sm:text-xl font-bold mb-1">Upgrade Plan</div>
                <div className="text-xs sm:text-sm opacity-90">Unlock unlimited scans</div>
              </div>
            </div>
          </Link>

          <div className="card hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 cursor-pointer">
            <div className="flex items-center gap-3 sm:gap-4">
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
              <div>
                <div className="text-lg sm:text-xl font-bold mb-1">View Analytics</div>
                <div className="text-xs sm:text-sm opacity-90">Coming soon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scan History */}
        <div className="card animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
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
              <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No scans yet</h3>
              <p className="text-gray-600 mb-6">Start your first scan to track crop health!</p>
              <Link to="/scan" className="btn-primary inline-flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Start Scanning
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
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {report.is_confident ? (
                          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                            {report.disease_name}
                          </h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getConfidenceColor(report.confidence)} inline-block w-fit`}>
                            {report.confidence.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                            <span className="capitalize break-words">{report.crop_type.replace('_', ' ')}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">{new Date(report.created_at).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{report.language === 'hi' ? 'Hindi' : 'English'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end sm:justify-start">
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold text-xs sm:text-sm flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Delete</span>
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
