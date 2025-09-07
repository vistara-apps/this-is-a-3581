import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthService } from '../services/authService'
import { PaymentService } from '../services/paymentService'
import { RecordingService } from '../services/recordingService'
import { EmergencyService } from '../services/emergencyService'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,

      // App state
      selectedState: null,
      currentLanguage: 'en',
      activeView: 'rights',
      
      // Recording state
      isRecording: false,
      recordingType: 'audio',
      recordings: [],
      
      // Subscription state
      subscriptionTier: 'free',
      showSubscriptionModal: false,
      
      // Emergency state
      trustedContacts: [],
      emergencyAlerts: [],

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setUserProfile: (userProfile) => set({ 
        userProfile,
        subscriptionTier: userProfile?.subscription_tier || 'free',
        trustedContacts: userProfile?.trusted_contacts || []
      }),

      setSelectedState: (state) => set({ selectedState: state }),
      
      setCurrentLanguage: (language) => set({ currentLanguage: language }),
      
      setActiveView: (view) => set({ activeView: view }),
      
      setIsRecording: (isRecording) => set({ isRecording }),
      
      setRecordingType: (recordingType) => set({ recordingType }),
      
      setShowSubscriptionModal: (show) => set({ showSubscriptionModal: show }),

      // Auth actions
      signIn: async (email, password) => {
        set({ isLoading: true })
        try {
          const { user, session } = await AuthService.signIn(email, password)
          const userProfile = await AuthService.getUserProfile(user.id)
          
          set({ 
            user, 
            userProfile,
            isAuthenticated: true,
            subscriptionTier: userProfile?.subscription_tier || 'free',
            trustedContacts: userProfile?.trusted_contacts || [],
            isLoading: false 
          })
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      signUp: async (email, password, userData = {}) => {
        set({ isLoading: true })
        try {
          const { user, session } = await AuthService.signUp(email, password, userData)
          const userProfile = await AuthService.getUserProfile(user.id)
          
          set({ 
            user, 
            userProfile,
            isAuthenticated: true,
            subscriptionTier: 'free',
            trustedContacts: [],
            isLoading: false 
          })
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      signOut: async () => {
        try {
          await AuthService.signOut()
          set({ 
            user: null, 
            userProfile: null,
            isAuthenticated: false,
            subscriptionTier: 'free',
            trustedContacts: [],
            recordings: [],
            emergencyAlerts: []
          })
          return { success: true }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      // Subscription actions
      upgradeSubscription: async (planId) => {
        const { user } = get()
        if (!user) throw new Error('User not authenticated')

        try {
          const clientSecret = await PaymentService.createPaymentIntent(planId, user.id)
          return { success: true, clientSecret }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      updateSubscriptionTier: async (tier) => {
        const { user } = get()
        if (!user) return

        try {
          await PaymentService.updateUserSubscription(user.id, tier)
          set({ subscriptionTier: tier })
          
          // Update user profile
          const userProfile = await AuthService.getUserProfile(user.id)
          set({ userProfile })
          
          return { success: true }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      // Recording actions
      startRecording: async (options = {}) => {
        try {
          const result = await RecordingService.startRecording({
            video: get().recordingType === 'video',
            audio: true,
            ...options
          })
          
          set({ isRecording: true })
          return { success: true, ...result }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      stopRecording: async () => {
        try {
          const recordingData = await RecordingService.stopRecording()
          set({ isRecording: false })
          
          // Save recording if user is authenticated
          const { user } = get()
          if (user) {
            const saveResult = await RecordingService.saveRecording(recordingData)
            if (saveResult.success) {
              // Refresh recordings list
              get().loadUserRecordings()
            }
          }
          
          return { success: true, recordingData }
        } catch (error) {
          set({ isRecording: false })
          return { success: false, error: error.message }
        }
      },

      loadUserRecordings: async () => {
        const { user } = get()
        if (!user) return

        try {
          const recordings = await RecordingService.getUserRecordings(user.id)
          set({ recordings })
          return { success: true, recordings }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      deleteRecording: async (recordingId) => {
        const { user } = get()
        if (!user) return

        try {
          await RecordingService.deleteRecording(recordingId, user.id)
          
          // Remove from local state
          const { recordings } = get()
          set({ recordings: recordings.filter(r => r.id !== recordingId) })
          
          return { success: true }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      // Emergency actions
      sendEmergencyAlert: async (message = '') => {
        const { user } = get()
        if (!user) throw new Error('User not authenticated')

        try {
          const result = await EmergencyService.sendEmergencyAlert({ message })
          
          // Refresh alerts list
          get().loadEmergencyAlerts()
          
          return result
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      updateTrustedContacts: async (contacts) => {
        const { user } = get()
        if (!user) return

        try {
          await EmergencyService.updateTrustedContacts(user.id, contacts)
          set({ trustedContacts: contacts })
          
          // Update user profile
          const userProfile = await AuthService.getUserProfile(user.id)
          set({ userProfile })
          
          return { success: true }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      loadEmergencyAlerts: async () => {
        const { user } = get()
        if (!user) return

        try {
          const alerts = await EmergencyService.getUserAlerts(user.id)
          set({ emergencyAlerts: alerts })
          return { success: true, alerts }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      // Utility actions
      initializeApp: async () => {
        set({ isLoading: true })
        
        try {
          // Check for existing session
          const user = await AuthService.getCurrentUser()
          
          if (user) {
            const userProfile = await AuthService.getUserProfile(user.id)
            set({ 
              user, 
              userProfile,
              isAuthenticated: true,
              subscriptionTier: userProfile?.subscription_tier || 'free',
              trustedContacts: userProfile?.trusted_contacts || []
            })

            // Load user data
            await Promise.all([
              get().loadUserRecordings(),
              get().loadEmergencyAlerts()
            ])
          }
        } catch (error) {
          console.error('Initialize app error:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      // Reset app state
      resetApp: () => {
        set({
          user: null,
          userProfile: null,
          isAuthenticated: false,
          selectedState: null,
          currentLanguage: 'en',
          activeView: 'rights',
          isRecording: false,
          recordingType: 'audio',
          recordings: [],
          subscriptionTier: 'free',
          showSubscriptionModal: false,
          trustedContacts: [],
          emergencyAlerts: [],
          isLoading: false
        })
      }
    }),
    {
      name: 'know-your-rights-storage',
      partialize: (state) => ({
        selectedState: state.selectedState,
        currentLanguage: state.currentLanguage,
        recordingType: state.recordingType
      })
    }
  )
)
