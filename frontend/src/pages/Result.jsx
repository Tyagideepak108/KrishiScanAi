import { useLocation, Link } from 'react-router-dom'
import { useState } from 'react'

function Result() {
  const location = useLocation()
  const result = location.state?.result
  const [activeTab, setActiveTab] = useState('organic')

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center card max-w-md animate-fade-in">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">Please scan a crop image first</p>
          <Link to="/scan" className="btn-primary inline-block">
            📸 Go to Scanner
          </Link>
        </div>
      </div>
    )
  }

  const { predicted_class, confidence, disease_info, is_confident, top3 } = result
  const diseaseData = disease_info || {}

  const getConfidenceColor = () => {
    if (confidence >= 80) return 'text-green-600 bg-green-100 border-green-300'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-300'
    return 'text-red-600 bg-red-100 border-red-300'
  }

  const getConfidenceIcon = () => {
    if (confidence >= 80) return '✅'
    if (confidence >= 60) return '⚠️'
    return '❌'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Card */}
        <div className="card mb-8 animate-fade-in">
          <div className="text-center">
            {/* Confidence Icon */}
            <div className="text-7xl mb-4 animate-pulse">
              {getConfidenceIcon()}
            </div>

            {/* Disease Name */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 px-4">
              {diseaseData.disease_name || predicted_class || 'Unknown Disease'}
            </h1>

            {/* Confidence Badge */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap px-4">
              <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 font-bold text-base sm:text-lg ${getConfidenceColor()}`}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{confidence.toFixed(1)}% Confidence</span>
              </div>

              {!is_confident && (
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-yellow-50 border-2 border-yellow-300 text-yellow-700 text-xs sm:text-sm font-semibold">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Low Confidence - Please retake photo</span>
                  <span className="sm:hidden">Low Confidence</span>
                </div>
              )}
            </div>

            {/* Cause */}
            {diseaseData.cause && (
              <div className="mt-4 sm:mt-6 bg-gray-50 border-2 border-gray-200 rounded-xl p-3 sm:p-4 mx-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">🔬</span>
                  <div className="text-left flex-1">
                    <div className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Cause</div>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{diseaseData.cause}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top 3 Predictions */}
        {top3 && top3.length > 0 && (
          <div className="card mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>Top 3 Predictions</span>
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {top3.map((pred, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full font-bold text-xs sm:text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{pred.disease}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-green-600 text-sm sm:text-base">{pred.confidence.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Treatment Tabs */}
        {(diseaseData.organic_treatment?.length > 0 || diseaseData.chemical_treatment?.length > 0 || diseaseData.preventive_measures?.length > 0) && (
          <div className="card animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <span>💊</span>
              <span>Treatment & Prevention</span>
            </h2>

            {/* Tab Buttons */}
            <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {diseaseData.organic_treatment?.length > 0 && (
                <button
                  onClick={() => setActiveTab('organic')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-base ${
                    activeTab === 'organic'
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🌱 Organic Treatment
                </button>
              )}
              {diseaseData.chemical_treatment?.length > 0 && (
                <button
                  onClick={() => setActiveTab('chemical')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-base ${
                    activeTab === 'chemical'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💊 Chemical Treatment
                </button>
              )}
              {diseaseData.preventive_measures?.length > 0 && (
                <button
                  onClick={() => setActiveTab('prevention')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-base ${
                    activeTab === 'prevention'
                      ? 'bg-amber-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🛡️ Prevention
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'organic' && diseaseData.organic_treatment?.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-bold text-green-900 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <span>🌱</span>
                    <span>Organic Treatment Methods</span>
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {diseaseData.organic_treatment.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-green-900 text-sm sm:text-base">
                        <span className="text-green-600 mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'chemical' && diseaseData.chemical_treatment?.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-bold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <span>💊</span>
                    <span>Chemical Treatment Methods</span>
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {diseaseData.chemical_treatment.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-blue-900 text-sm sm:text-base">
                        <span className="text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'prevention' && diseaseData.preventive_measures?.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-bold text-amber-900 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <span>🛡️</span>
                    <span>Preventive Measures</span>
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {diseaseData.preventive_measures.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-amber-900 text-sm sm:text-base">
                        <span className="text-amber-600 mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Info Available */}
        {(!diseaseData.organic_treatment || diseaseData.organic_treatment.length === 0) && 
         (!diseaseData.chemical_treatment || diseaseData.chemical_treatment.length === 0) && 
         (!diseaseData.preventive_measures || diseaseData.preventive_measures.length === 0) && (
          <div className="card mb-8 bg-yellow-50 border-2 border-yellow-200 text-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-yellow-900 mb-2">Limited Information Available</h3>
            <p className="text-yellow-800">
              Detailed treatment information is not available for this disease. Please consult an agricultural expert.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Link
            to="/scan"
            className="btn-primary text-center py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2"
          >
            <span>📸</span>
            <span>Scan Another Crop</span>
          </Link>
          <Link
            to="/dashboard"
            className="btn-secondary text-center py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2"
          >
            <span>📊</span>
            <span>View Dashboard</span>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-4 sm:p-6 text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-start gap-2 sm:gap-3 text-left">
            <span className="text-2xl sm:text-3xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-bold text-yellow-900 mb-2 text-sm sm:text-base">Important Disclaimer</h3>
              <p className="text-xs sm:text-sm text-yellow-800 leading-relaxed">
                This is an AI-based prediction and should be used as a preliminary diagnosis tool. 
                For accurate diagnosis and treatment, please consult with a qualified agricultural expert or plant pathologist. 
                Always follow local agricultural guidelines and regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result
