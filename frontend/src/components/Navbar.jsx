import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'

function Navbar() {
  const { t } = useTranslation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('authScans')
    window.location.href = '/'
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-display font-bold text-green-600 hover:text-green-700 transition flex items-center gap-2">
            <span>🌿</span>
            <span>KrishiScan</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/scan" className="text-gray-700 hover:text-green-600 transition font-medium">
              {t('nav.scan')}
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-green-600 transition font-medium">
              {t('nav.pricing')}
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition font-medium">
                  {t('nav.dashboard')}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                    👤 {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-green-600 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-green-600 transition font-medium py-2"
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/scan" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-green-600 transition font-medium py-2"
              >
                {t('nav.scan')}
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-green-600 transition font-medium py-2"
              >
                {t('nav.pricing')}
              </Link>
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-green-600 transition font-medium py-2"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
                    👤 {user?.name}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm text-left"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-center"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
