import { Link } from 'react-router-dom'
import { useState } from 'react'

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    period: 'forever',
    highlight: false,
    features: [
      '10 scans per month',
      'Basic disease detection',
      'Hindi + English support',
      'Guest access (5 scans)',
      'Community support'
    ],
    cta: 'Get Started',
    link: '/login',
  },
  {
    name: 'Pro',
    price: { monthly: 199, yearly: 1990 },
    period: 'per month',
    highlight: true,
    badge: '⭐ Most Popular',
    features: [
      'Unlimited scans',
      'Advanced AI detection (95%+ accuracy)',
      'Scan history & analytics',
      'PDF reports download',
      'Priority support',
      'Batch upload (5 images)',
      '7-day free trial'
    ],
    cta: 'Start Free Trial',
    link: '/login',
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', yearly: 'Custom' },
    period: 'contact us',
    highlight: false,
    features: [
      'Everything in Pro',
      'Custom ML model training',
      'API access for integration',
      'Multi-user (5+ seats)',
      'Dedicated account manager',
      'White-label solution',
      'On-premise deployment option'
    ],
    cta: 'Contact Sales',
    link: '/login',
  },
]

const FAQS = [
  {
    q: 'Can I upgrade or downgrade anytime?',
    a: 'Yes! You can change your plan anytime. Upgrades take effect immediately, and downgrades apply at the end of your billing cycle. No questions asked.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods via Razorpay: UPI, Credit/Debit cards, Net Banking, and digital wallets. All transactions are secure and encrypted.'
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes! Get a 7-day free trial when you sign up for Pro. No credit card required. Cancel anytime during the trial period without any charges.'
  },
  {
    q: 'How accurate is the AI detection?',
    a: 'Our AI models achieve 95%+ accuracy, trained on over 50,000+ real crop images. We continuously improve our models with new data and farmer feedback.'
  },
  {
    q: 'What happens after my free scans run out?',
    a: 'Free users get 10 scans per month. Once exhausted, you can upgrade to Pro for unlimited scans or wait until next month for the quota to reset.'
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with Pro, contact us within 30 days for a full refund.'
  },
]

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null)

  const getPrice = (plan) => {
    if (typeof plan.price[billingCycle] === 'number') {
      return billingCycle === 'yearly'
        ? `₹${Math.floor(plan.price.yearly / 12)}`
        : `₹${plan.price.monthly}`
    }
    return plan.price[billingCycle]
  }

  const getSavings = (plan) => {
    if (billingCycle === 'yearly' && typeof plan.price.yearly === 'number') {
      const monthlyCost = plan.price.monthly * 12
      const savings = Math.round(((monthlyCost - plan.price.yearly) / monthlyCost) * 100)
      return savings
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-20">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-up px-4">
          <div className="inline-block bg-green-100 text-green-700 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4">
            Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your farming needs. No hidden charges. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-up px-4" style={{ animationDelay: '0.1s' }}>
          <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-7 bg-green-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Yearly
          </span>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
            Save 20%
          </span>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-20 px-4">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative flex flex-col bg-white rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-up ${
                plan.highlight
                  ? 'border-green-500 shadow-xl md:scale-105'
                  : 'border-gray-200 shadow-lg'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-4 sm:mb-6">
                <h3 className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-display text-4xl sm:text-5xl font-bold text-gray-900">
                    {getPrice(plan)}
                  </span>
                  {typeof plan.price[billingCycle] === 'number' && plan.price[billingCycle] > 0 && (
                    <span className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
                      /{billingCycle === 'monthly' ? 'month' : 'month'}
                    </span>
                  )}
                </div>
                {billingCycle === 'yearly' && getSavings(plan) > 0 && (
                  <p className="text-green-600 text-sm font-semibold">
                    Save {getSavings(plan)}% with yearly billing
                  </p>
                )}
                {plan.price[billingCycle] === 0 && (
                  <p className="text-gray-500 text-sm">Free forever</p>
                )}
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/coming-soon"
                className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-bold text-center transition-all duration-300 text-sm sm:text-base ${
                  plan.highlight
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Compare Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 sm:p-10 text-center text-white mb-12 sm:mb-20 shadow-xl animate-fade-up mx-4">
          <p className="text-green-100 text-xs sm:text-sm mb-2">Not sure which plan?</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Start free. Upgrade when ready.</h2>
          <p className="text-green-100 mb-4 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Try our free plan with 10 scans per month. No credit card required.
          </p>
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Try Free Scan
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Everything you need to know about our pricing</p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</h3>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-gray-600 leading-relaxed text-sm sm:text-base">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 sm:mt-16 animate-fade-up px-4">
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Still have questions?</p>
          <a
            href="mailto:support@krishiscan.com"
            className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition text-sm sm:text-base"
          >
            Contact our support team
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}