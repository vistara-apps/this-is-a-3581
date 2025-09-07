import React, { useState } from 'react'
import { X, Crown, Check, CreditCard, Loader } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { PaymentService } from '../services/paymentService'
import toast from 'react-hot-toast'

const SubscriptionModal = ({ onClose, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [isProcessing, setIsProcessing] = useState(false)
  const { user, isAuthenticated, upgradeSubscription, updateSubscriptionTier } = useAppStore()

  const plans = PaymentService.PLANS

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe')
      return
    }

    setIsProcessing(true)
    
    try {
      // For demo purposes, we'll simulate the payment process
      // In a real implementation, you would integrate with Stripe Elements
      
      const result = await upgradeSubscription(selectedPlan)
      
      if (result.success) {
        // Simulate successful payment
        await updateSubscriptionTier(selectedPlan)
        toast.success(`Successfully upgraded to ${plans[selectedPlan].name}!`)
        onSubscribe(selectedPlan)
        onClose()
      } else {
        toast.error(result.error || 'Payment failed')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('An error occurred during payment')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl shadow-modal max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-warning" />
            <h2 className="text-xl font-semibold text-text">Upgrade Your Account</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Unlock premium features and get the most out of Know Your Rights Navigator
            </p>
          </div>

          {/* Authentication Notice */}
          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                Please sign in to subscribe to a premium plan.
              </p>
            </div>
          )}

          {/* Plan Selection */}
          <div className="space-y-4 mb-6">
            {Object.entries(plans).map(([planId, plan]) => (
              <div
                key={planId}
                onClick={() => !isProcessing && setSelectedPlan(planId)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPlan === planId
                    ? 'border-primary bg-blue-50'
                    : 'border-border hover:border-gray-300'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-text">{plan.name}</h3>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-primary">
                        {PaymentService.formatPrice(plan.price)}
                      </span>
                      <span className="text-gray-600">
                        {plan.interval === 'month' ? '/month' : plan.interval}
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === planId
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {selectedPlan === planId && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {planId === 'lifetime' && (
                  <div className="mt-3 p-2 bg-accent bg-opacity-10 rounded-lg">
                    <p className="text-xs text-accent font-medium">
                      🎉 Best Value - Save over 80% compared to monthly!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={!isAuthenticated || isProcessing}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>
                  {isAuthenticated 
                    ? `Subscribe to ${plans[selectedPlan].name}` 
                    : 'Sign in to Subscribe'
                  }
                </span>
              </>
            )}
          </button>

          {/* Features Comparison */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-text mb-3">What you get with Premium:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Audio Recording</span>
                <span className="text-accent font-medium">Free & Premium</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Video Recording</span>
                <span className="text-primary font-medium">Premium Only</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cloud Backup</span>
                <span className="text-primary font-medium">Premium Only</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Enhanced Scripts</span>
                <span className="text-primary font-medium">Premium Only</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Priority Support</span>
                <span className="text-primary font-medium">Premium Only</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Secure payment processing powered by Stripe. Cancel anytime.
            </p>
            {isAuthenticated && (
              <p className="text-xs text-gray-500 mt-1">
                You can manage your subscription in your account settings.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal
