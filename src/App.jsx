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

  // Initialize with user's location if available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd geocode this to get the state
          // For now, default to California as example
          setSelectedState('CA')
        },
        () => {
          // If location access denied, show state selector
          console.log('Location access denied')
        }
      )
    }
  }, [])

  const handleStateSelect = (state) => {
    setSelectedState(state)
  }

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language)
  }

  const handleSubscriptionUpgrade = (tier) => {
    setUserSubscription(tier)
    setShowSubscriptionModal(false)
  }

  const currentStateData = selectedState ? statesData[selectedState] : null

  if (!selectedState) {
    return (
      <div className="min-h-screen bg-bg">
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          userSubscription={userSubscription}
          onUpgrade={() => setShowSubscriptionModal(true)}
        />
        <StateSelector onStateSelect={handleStateSelect} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        userSubscription={userSubscription}
        onUpgrade={() => setShowSubscriptionModal(true)}
        selectedState={selectedState}
        onStateChange={() => setSelectedState(null)}
      />
      
      {/* Navigation Tabs */}
      <div className="sticky top-16 bg-surface border-b border-border z-10">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveView('rights')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeView === 'rights' 
                  ? 'bg-primary text-white' 
                  : 'text-text hover:bg-gray-100'
              }`}
            >
              Know Your Rights
            </button>
            <button
              onClick={() => setActiveView('scripts')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeView === 'scripts' 
                  ? 'bg-primary text-white' 
                  : 'text-text hover:bg-gray-100'
              }`}
            >
              What to Say
            </button>
            <button
              onClick={() => setActiveView('emergency')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeView === 'emergency' 
                  ? 'bg-emergency text-white' 
                  : 'text-text hover:bg-gray-100'
              }`}
            >
              Emergency
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-screen-lg mx-auto px-4 py-6 pb-24">
        {activeView === 'rights' && (
          <RightsCard 
            stateData={currentStateData}
            language={currentLanguage}
            userSubscription={userSubscription}
            onUpgrade={() => setShowSubscriptionModal(true)}
          />
        )}
        
        {activeView === 'scripts' && (
          <ScriptedResponses 
            stateData={currentStateData}
            language={currentLanguage}
            userSubscription={userSubscription}
            onUpgrade={() => setShowSubscriptionModal(true)}
          />
        )}
        
        {activeView === 'emergency' && (
          <EmergencyAlert 
            userSubscription={userSubscription}
            onUpgrade={() => setShowSubscriptionModal(true)}
          />
        )}
      </main>

      {/* Fixed Recording Controls */}
      <RecordingControls 
        isRecording={isRecording}
        onToggleRecording={setIsRecording}
        userSubscription={userSubscription}
        onUpgrade={() => setShowSubscriptionModal(true)}
      />

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal 
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscriptionUpgrade}
        />
      )}
    </div>
  )
}

export default App
