import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Mail, ArrowLeft, Zap, Shield, Smile } from 'lucide-react'

export default function ComingSoon() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [funnyIndex, setFunnyIndex] = useState(0)

  const funnyMessages = [
     "रेजरपे को समझा रहे हैं कि किसान का पैसा कितना कीमती है...",
    "आपका क्रेडिट कार्ड हमारे पास सुरक्षित है... जैसे आपकी फसल!",
    "सब्सक्रिप्शन लेना मतलब भविष्य में निवेश - जैसे खेत में खाद!",
    "प्रो प्लान = असीमित स्कैन = शून्य चिंता!",
    "अभी भुगतान प्रणाली तैयार हो रही है... जैसे बुवाई से पहले खेत!",
    "हम किसानों की मेहनत समझते हैं - इसलिए बेहतरीन डील्स बना रहे हैं!",
    "रेजरपे से भी ज़्यादा सुरक्षित है हमारा पेमेंट गेटवे!",
    "आपके पैसे जल्द ही स्वीकार किए जाएंगे, कृपया धैर्य रखें!"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setFunnyIndex((prev) => (prev + 1) % funnyMessages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 sm:px-8 py-12 sm:py-16 text-center text-white relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10">
              {/* Farmer Emoji Animation */}
              <div className="text-7xl sm:text-8xl mb-4 animate-bounce">
                👨‍🌾
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
                Coming Soon! 
              </h1>

              <p className="text-lg sm:text-xl text-green-100 mb-2">
                Premium Plans will be in the working...
              </p>

              <p className="text-base sm:text-lg text-green-50 font-semibold">
                निश्चिंत रहें, आपके पैसे जल्द ही लिए जाएंगे!
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-12 sm:py-16">
            {/* Funny Message Carousel */}
            <div className="mb-12 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl">
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0"></span>
                <div className="flex-1">
                  <p className="text-sm sm:text-base text-gray-600 font-medium mb-2">
                    Funny Farmer Says:
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 min-h-12 transition-all duration-500">
                    {funnyMessages[funnyIndex]}
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-gray-900">Unlimited Scans</h3>
                </div>
                <p className="text-sm text-gray-600">
                  जितनी बार चाहें स्कैन करें, बिना किसी रोक-टोक के!
                </p>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Secure Payment</h3>
                </div>
                <p className="text-sm text-gray-600">
                  रेजरपे से भी ज़्यादा सुरक्षित और भरोसेमंद!
                </p>
              </div>

              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Smile className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Priority Support</h3>
                </div>
                <p className="text-sm text-gray-600">
                  हमारी टीम 24/7 आपकी सहायता के लिए तैयार है।
                </p>
              </div>

              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-bold text-gray-900">PDF Reports</h3>
                </div>
                <p className="text-sm text-gray-600">
                  अपनी फसल की स्वास्थ्य रिपोर्ट आसानी से डाउनलोड करें।
                </p>
              </div>
            </div>

            {/* Funny Timeline */}
            <div className="mb-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <span>⏳</span>
                <span>What will you Get in Premimum :</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-900">Razorpay Integration</p>
                    <p className="text-sm text-gray-600">Secure payment gateway setup</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-900">Subscription Management</p>
                    <p className="text-sm text-gray-600">Easy plan upgrades aur downgrades</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-900">Invoice System</p>
                    <p className="text-sm text-gray-600">Automatic invoices aur receipts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-900">Launch Party! 🎉</p>
                    <p className="text-sm text-gray-600">Special launch discounts aur offers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mb-8">
              <h3 className="font-bold text-lg text-gray-900 mb-4 text-center">
                Notify Me When Ready ! 📬
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Mail className="w-5 h-5" />
                  <span>Notify Me</span>
                </button>
              </form>

              {submitted && (
                <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center animate-fade-in">
                  <p className="text-green-700 font-semibold">
                    ✅ Thankyou , You will Get Email in Your Inbox Soon... 🎉
                  </p>
                </div>
              )}
            </div>

            {/* Funny Footer */}
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-dashed border-green-300 rounded-xl">
              <p className="text-sm sm:text-base text-gray-700 mb-2">
                <span className="font-bold">Pro Tip:</span>  जब तक पेमेंट सिस्टम चालू नहीं होता, तब तक फ्री प्लान का आनंद लें। 
                लॉन्च के समय आपको सबसे पहले विशेष ऑफर मिलेगा!
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 sm:px-8 py-6 border-t-2 border-gray-200 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/scan"
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-center"
            >
              Scan with Free Plan 📸
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3 bg-white text-green-600 border-2 border-green-600 font-bold rounded-lg hover:bg-green-50 transition text-center"
            >
              Check Pricing 💰
            </Link>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border-2 border-green-200 shadow-md">
            <p className="text-sm text-gray-600">
              <span className="font-bold">Did You Know?</span> प्रीमियम प्लान लेने वाले किसानों को "क्रॉप किंग" का विशेष खिताब दिया जाएगा।
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border-2 border-blue-200 shadow-md">
            <p className="text-sm text-gray-600">
              <span className="font-bold">Fun Fact:</span> हमारा सिस्टम इतना सुरक्षित है कि बैंक भी इसके दीवाने हैं। 🏦
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
