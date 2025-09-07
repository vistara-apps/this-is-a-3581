import { supabase } from '../lib/supabase'
import { AuthService } from './authService'

export class EmergencyService {
  // Send emergency alert to trusted contacts
  static async sendEmergencyAlert(alertData = {}) {
    try {
      const user = await AuthService.getCurrentUser()
      if (!user) throw new Error('User not authenticated')

      const userProfile = await AuthService.getUserProfile(user.id)
      if (!userProfile) throw new Error('User profile not found')

      // Get current location
      const location = await this.getCurrentLocation()
      
      // Prepare alert data
      const alert = {
        user_id: user.id,
        location: location,
        contacts_notified: [],
        status: 'sending',
        ...alertData
      }

      // Save alert to database
      const { data: alertRecord, error } = await supabase
        .from('alerts')
        .insert([alert])
        .select()

      if (error) throw error

      // Send notifications to trusted contacts
      const trustedContacts = userProfile.trusted_contacts || []
      const notificationResults = await this.notifyTrustedContacts(
        trustedContacts,
        {
          alertId: alertRecord[0].id,
          userEmail: userProfile.email,
          location: location,
          timestamp: new Date().toISOString(),
          message: alertData.message || 'Emergency alert activated'
        }
      )

      // Update alert with notification results
      await supabase
        .from('alerts')
        .update({
          contacts_notified: notificationResults,
          status: notificationResults.length > 0 ? 'sent' : 'failed'
        })
        .eq('id', alertRecord[0].id)

      return {
        success: true,
        alertId: alertRecord[0].id,
        contactsNotified: notificationResults.length,
        location: location
      }
    } catch (error) {
      console.error('Send emergency alert error:', error)
      throw error
    }
  }

  // Get current location
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve({ error: 'Geolocation not supported' })
        return
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          })
        },
        (error) => {
          console.warn('Geolocation error:', error)
          resolve({
            error: error.message,
            timestamp: new Date().toISOString()
          })
        },
        options
      )
    })
  }

  // Notify trusted contacts via multiple channels
  static async notifyTrustedContacts(contacts, alertData) {
    const notificationResults = []

    for (const contact of contacts) {
      try {
        const result = await this.notifyContact(contact, alertData)
        notificationResults.push({
          contact: contact,
          status: result.success ? 'sent' : 'failed',
          method: result.method,
          timestamp: new Date().toISOString(),
          error: result.error || null
        })
      } catch (error) {
        notificationResults.push({
          contact: contact,
          status: 'failed',
          method: 'unknown',
          timestamp: new Date().toISOString(),
          error: error.message
        })
      }
    }

    return notificationResults
  }

  // Notify individual contact
  static async notifyContact(contact, alertData) {
    try {
      // Try multiple notification methods
      const methods = ['sms', 'email', 'push']
      
      for (const method of methods) {
        try {
          const result = await this.sendNotification(method, contact, alertData)
          if (result.success) {
            return { success: true, method: method }
          }
        } catch (error) {
          console.warn(`Failed to send ${method} notification:`, error)
          continue
        }
      }

      return { success: false, error: 'All notification methods failed' }
    } catch (error) {
      console.error('Notify contact error:', error)
      return { success: false, error: error.message }
    }
  }

  // Send notification via specific method
  static async sendNotification(method, contact, alertData) {
    switch (method) {
      case 'sms':
        return await this.sendSMS(contact, alertData)
      case 'email':
        return await this.sendEmail(contact, alertData)
      case 'push':
        return await this.sendPushNotification(contact, alertData)
      default:
        throw new Error(`Unsupported notification method: ${method}`)
    }
  }

  // Send SMS notification
  static async sendSMS(contact, alertData) {
    try {
      if (!contact.phone) {
        throw new Error('No phone number provided')
      }

      const message = this.formatSMSMessage(alertData)
      
      // This would integrate with a service like Twilio
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          to: contact.phone,
          message: message
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send SMS')
      }

      return { success: true }
    } catch (error) {
      console.error('Send SMS error:', error)
      return { success: false, error: error.message }
    }
  }

  // Send email notification
  static async sendEmail(contact, alertData) {
    try {
      if (!contact.email) {
        throw new Error('No email address provided')
      }

      const emailContent = this.formatEmailMessage(alertData)
      
      // This would integrate with a service like SendGrid or use Supabase Edge Functions
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          to: contact.email,
          subject: 'Emergency Alert - Know Your Rights Navigator',
          html: emailContent.html,
          text: emailContent.text
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      return { success: true }
    } catch (error) {
      console.error('Send email error:', error)
      return { success: false, error: error.message }
    }
  }

  // Send push notification
  static async sendPushNotification(contact, alertData) {
    try {
      // This would integrate with a push notification service
      const response = await fetch('/api/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          userId: contact.userId,
          title: 'Emergency Alert',
          body: `${alertData.userEmail} has activated an emergency alert`,
          data: {
            alertId: alertData.alertId,
            location: alertData.location,
            timestamp: alertData.timestamp
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send push notification')
      }

      return { success: true }
    } catch (error) {
      console.error('Send push notification error:', error)
      return { success: false, error: error.message }
    }
  }

  // Format SMS message
  static formatSMSMessage(alertData) {
    const locationText = alertData.location.latitude 
      ? `Location: https://maps.google.com/?q=${alertData.location.latitude},${alertData.location.longitude}`
      : 'Location: Not available'

    return `EMERGENCY ALERT from ${alertData.userEmail}

${alertData.message}

${locationText}

Time: ${new Date(alertData.timestamp).toLocaleString()}

This is an automated message from Know Your Rights Navigator.`
  }

  // Format email message
  static formatEmailMessage(alertData) {
    const locationText = alertData.location.latitude 
      ? `<a href="https://maps.google.com/?q=${alertData.location.latitude},${alertData.location.longitude}">View Location on Map</a>`
      : 'Location: Not available'

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚨 EMERGENCY ALERT</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p><strong>From:</strong> ${alertData.userEmail}</p>
          <p><strong>Time:</strong> ${new Date(alertData.timestamp).toLocaleString()}</p>
          <p><strong>Message:</strong> ${alertData.message}</p>
          <p><strong>Location:</strong> ${locationText}</p>
        </div>
        
        <div style="padding: 20px; font-size: 12px; color: #666;">
          <p>This is an automated emergency alert from Know Your Rights Navigator.</p>
          <p>If this is a genuine emergency, please contact local authorities immediately.</p>
        </div>
      </div>
    `

    const text = `EMERGENCY ALERT from ${alertData.userEmail}

${alertData.message}

Time: ${new Date(alertData.timestamp).toLocaleString()}
${alertData.location.latitude ? `Location: https://maps.google.com/?q=${alertData.location.latitude},${alertData.location.longitude}` : 'Location: Not available'}

This is an automated message from Know Your Rights Navigator.`

    return { html, text }
  }

  // Get user's alert history
  static async getUserAlerts(userId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get user alerts error:', error)
      throw error
    }
  }

  // Update trusted contacts
  static async updateTrustedContacts(userId, contacts) {
    try {
      await AuthService.updateUserProfile(userId, {
        trusted_contacts: contacts
      })

      return { success: true }
    } catch (error) {
      console.error('Update trusted contacts error:', error)
      throw error
    }
  }

  // Validate contact information
  static validateContact(contact) {
    const errors = []

    if (!contact.name || contact.name.trim().length === 0) {
      errors.push('Name is required')
    }

    if (!contact.email && !contact.phone) {
      errors.push('Either email or phone number is required')
    }

    if (contact.email && !this.isValidEmail(contact.email)) {
      errors.push('Invalid email address')
    }

    if (contact.phone && !this.isValidPhone(contact.phone)) {
      errors.push('Invalid phone number')
    }

    return {
      valid: errors.length === 0,
      errors: errors
    }
  }

  // Helper methods
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  }

  static async getAuthToken() {
    try {
      const session = await AuthService.getCurrentSession()
      return session?.access_token
    } catch (error) {
      console.error('Get auth token error:', error)
      return null
    }
  }
}
