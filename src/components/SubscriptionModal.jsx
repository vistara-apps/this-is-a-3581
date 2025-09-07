import React from 'react'
import { X, Check, Crown, Star } from 'lucide-react'

const SubscriptionModal = ({ onClose, onSubscribe }) => {
  const features = {
    free: [
      'Basic rights information',
      'Audio recording',
      '1 trusted contact',
      'Basic scripted responses'
    ],
    premium: [
      'All free features',
      'Video recording',
      'Unlimited trusted contacts',
      'Advanced scripted responses',
      'Cloud backup',
      'Real-time location sharing',
      'Legal updates notifications'
    ],
    lifetime: [
      'All premium features',
      'Lifetime access',
      'No recurring payments',
      'Priority support',
      'Early access to new features'
    ]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text">Choose Your Plan</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Plan */}
            <div className="border border-border rounded-lg p-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-text">Free</h3>
                <div className="text-2xl font-bold text-text mt-2">$0</div>
                <div className="text-sm text-gray-600">Forever</div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onSubscribe('free')}
                className="w-full btn-secondary"
              >
                Current Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-primary rounded-lg p-4 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-text">Premium</h3>
                </div>
                <div className="text-2xl font-bold text-text mt-2">$4.99</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onSubscribe('premium')}
                className="w-full btn-primary"
              >
                Subscribe Now
              </button>
            </div>

            {/* Lifetime Plan */}
            <div className="border border-border rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-5 h-5 text-warning" />
                  <h3 className="text-lg font-semibold text-text">Lifetime</h3>
                </div>
                <div className="text-2xl font-bold text-text mt-2">$29.99</div>
                <div className="text-sm text-gray-600">One-time payment</div>
                <div className="text-xs text-green-600 mt-1">Save $30/year</div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {features.lifetime.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onSubscribe('lifetime')}
                className="w-full bg-warning text-white px-lg py-md rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Buy Lifetime
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              All plans include 7-day free trial • Cancel anytime
            </p>
            <p className="text-xs text-gray-500">
              Secure payment processing by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal