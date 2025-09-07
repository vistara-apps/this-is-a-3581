import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import StateSelector from './components/StateSelector'
import RightsCard from './components/RightsCard'
import ScriptedResponses from './components/ScriptedResponses'
import RecordingControls from './components/RecordingControls'
import EmergencyAlert from './components/EmergencyAlert'
import SubscriptionModalNew from './components/SubscriptionModalNew'
import AuthModal from './components/auth/AuthModal'
import { statesData } from './data/statesData'
import { useAppStore } from './store/appStore'

function App() {
  const {
    selectedState,
    currentLanguage,
    activeView,
    isRecording,
    subscriptionTier,
    showSubscriptionModal,
    isAuthenticated,
    isLoading,
    setSelectedState,
    setCurrentLanguage,
    setActiveView,
    setIsRecording,
    setShowSubscriptionModal,
    initializeApp
  } = useAppStore()

  const [showAuthModal, setShowAuthModal] = React.useState(false)

  // Initialize app on mount
  useEffect(() => {
    initializeApp()
  }, [initializeApp])

  // Initialize with user's location if available
  useEffect(() => {
    if (!selectedState && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use a geocoding service to determine the state
          // For now, we'll just set a default state
          setSelectedState('CA') // Default to California
        },
        (error) => {
          console.log('Location access denied or unavailable')
          setSelectedState('CA') // Default to California
        }
      )
    } else if (!selectedState) {
      setSelectedState('CA') // Default to California
    }
  }, [selectedState, setSelectedState])

  const handleSubscribe = (plan) => {
    setShowSubscriptionModal(false)
    // Payment processing is handled in the SubscriptionModal component
  }

  const handleAuthRequired = () => {
    setShowAuthModal(true)
  }

  const handleStateSelect = (state) => {
    setSelectedState(state)
  }

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language)
  }

  const currentStateData = selectedState ? statesData[selectedState] : null

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text">Loading Know Your Rights Navigator...</p>
        </div>
      </div>
    )
  }

  // Show state selector if no state is selected
  if (!selectedState) {
    return (
      <div className="min-h-screen bg-bg">
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          userSubscription={subscriptionTier}
          onUpgrade={() => setShowSubscriptionModal(true)}
          onAuthRequired={handleAuthRequired}
          isAuthenticated={isAuthenticated}
        />
        <StateSelector onStateSelect={handleStateSelect} />
        
        {/* Modals */}
        {showSubscriptionModal && (
          <SubscriptionModalNew
            onClose={() => setShowSubscriptionModal(false)}
            onSubscribe={handleSubscribe}
          />
        )}
        
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
        
        <Toaster position="top-right" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        userSubscription={subscriptionTier}
        onUpgrade={() => setShowSubscriptionModal(true)}
        onAuthRequired={handleAuthRequired}
        isAuthenticated={isAuthenticated}
      />
      
      <main className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-surface rounded-lg p-1">
          {[
            { id: 'rights', label: 'Rights Card', icon: '📋' },
            { id: 'scripts', label: 'Scripts', icon: '💬' },
            { id: 'emergency', label: 'Emergency', icon: '🚨' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                activeView === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content based on active view */}
        <div className="space-y-6">
          {activeView === 'rights' && currentStateData && (
            <RightsCard 
              stateData={currentStateData}
              language={currentLanguage}
            />
          )}
          
          {activeView === 'scripts' && currentStateData && (
            <ScriptedResponses 
              stateData={currentStateData}
              language={currentLanguage}
              userSubscription={subscriptionTier}
              onUpgrade={() => setShowSubscriptionModal(true)}
            />
          )}
          
          {activeView === 'emergency' && (
            <EmergencyAlert 
              userSubscription={subscriptionTier}
              onUpgrade={() => setShowSubscriptionModal(true)}
              onAuthRequired={handleAuthRequired}
              isAuthenticated={isAuthenticated}
            />
          )}

          {/* Recording Controls - Always visible */}
          <RecordingControls 
            isRecording={isRecording}
            onStartRecording={() => setIsRecording(true)}
            onStopRecording={() => setIsRecording(false)}
            userSubscription={subscriptionTier}
            onUpgrade={() => setShowSubscriptionModal(true)}
            onAuthRequired={handleAuthRequired}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* State Selector Button */}
        <div className="fixed bottom-6 left-6">
          <button
            onClick={() => setSelectedState(null)}
            className="bg-surface shadow-card rounded-full p-3 hover:shadow-lg transition-shadow"
          >
            <span className="text-2xl">📍</span>
          </button>
        </div>
      </main>

      {/* Modals */}
      {showSubscriptionModal && (
        <SubscriptionModalNew
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
        />
      )}
      
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  )
}

export default App
