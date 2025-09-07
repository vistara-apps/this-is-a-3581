import { loadStripe } from '@stripe/stripe-js'
import { AuthService } from './authService'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export class PaymentService {
  // Subscription plans configuration
  static PLANS = {
    premium: {
      id: 'premium',
      name: 'Premium Monthly',
      price: 4.99,
      interval: 'month',
      features: [
        'Video recording',
        'Cloud backup',
        'Enhanced scripting',
        'Priority support',
        'Advanced recording controls'
      ]
    },
    lifetime: {
      id: 'lifetime',
      name: 'Lifetime Access',
      price: 29.99,
      interval: 'one-time',
      features: [
        'All premium features',
        'Lifetime updates',
        'No recurring charges',
        'Priority support',
        'Early access to new features'
      ]
    }
  }

  // Create payment intent for one-time purchase
  static async createPaymentIntent(planId, userId) {
    try {
      const plan = this.PLANS[planId]
      if (!plan) throw new Error('Invalid plan selected')

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          planId,
          amount: Math.round(plan.price * 100), // Convert to cents
          currency: 'usd',
          userId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      return data.clientSecret
    } catch (error) {
      console.error('Create payment intent error:', error)
      throw error
    }
  }

  // Create subscription for recurring payments
  static async createSubscription(planId, userId, paymentMethodId) {
    try {
      const plan = this.PLANS[planId]
      if (!plan || plan.interval === 'one-time') {
        throw new Error('Invalid subscription plan')
      }

      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          planId,
          userId,
          paymentMethodId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create subscription')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Create subscription error:', error)
      throw error
    }
  }

  // Process payment with Stripe
  static async processPayment(clientSecret, paymentMethod) {
    try {
      const stripe = await stripePromise
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod
      })

      if (error) {
        throw new Error(error.message)
      }

      return paymentIntent
    } catch (error) {
      console.error('Process payment error:', error)
      throw error
    }
  }

  // Update user subscription after successful payment
  static async updateUserSubscription(userId, subscriptionTier, subscriptionData = {}) {
    try {
      await AuthService.updateUserProfile(userId, {
        subscription_tier: subscriptionTier,
        settings: {
          ...subscriptionData,
          subscription_updated_at: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Update user subscription error:', error)
      throw error
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          subscriptionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Cancel subscription error:', error)
      throw error
    }
  }

  // Get customer portal URL for subscription management
  static async getCustomerPortalUrl(customerId) {
    try {
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          customerId,
          returnUrl: window.location.origin
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get customer portal URL')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Get customer portal URL error:', error)
      throw error
    }
  }

  // Validate subscription status
  static async validateSubscription(userId) {
    try {
      const userProfile = await AuthService.getUserProfile(userId)
      
      if (!userProfile) {
        return { valid: false, tier: 'free' }
      }

      // Check if subscription is still active
      const subscriptionTier = userProfile.subscription_tier
      
      if (subscriptionTier === 'lifetime') {
        return { valid: true, tier: 'lifetime' }
      }

      if (subscriptionTier === 'premium') {
        // In a real implementation, you'd check with Stripe API
        // to verify the subscription is still active
        return { valid: true, tier: 'premium' }
      }

      return { valid: true, tier: 'free' }
    } catch (error) {
      console.error('Validate subscription error:', error)
      return { valid: false, tier: 'free' }
    }
  }

  // Helper to get auth token
  static async getAuthToken() {
    try {
      const session = await AuthService.getCurrentSession()
      return session?.access_token
    } catch (error) {
      console.error('Get auth token error:', error)
      return null
    }
  }

  // Format price for display
  static formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  // Check if user has premium features
  static hasPremiumFeatures(subscriptionTier) {
    return subscriptionTier === 'premium' || subscriptionTier === 'lifetime'
  }
}
