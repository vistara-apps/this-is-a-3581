import React from 'react'
import { Shield, Globe, Settings, Crown } from 'lucide-react'

const Header = ({ 
  currentLanguage, 
  onLanguageChange, 
  userSubscription, 
  onUpgrade,
  selectedState,
  onStateChange 
}) => {
  return (
    <header className="sticky top-0 bg-surface border-b border-border z-20">
      <div className="max-w-screen-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-text">Know Your Rights</h1>
              {selectedState && (
                <button 
                  onClick={onStateChange}
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  {selectedState} • Change State
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <button
              onClick={() => onLanguageChange(currentLanguage === 'en' ? 'es' : 'en')}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-border hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentLanguage === 'en' ? 'EN' : 'ES'}
              </span>
            </button>

            {/* Subscription Status */}
            <button
              onClick={onUpgrade}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                userSubscription === 'free' 
                  ? 'bg-warning text-white hover:opacity-90' 
                  : 'bg-accent text-white'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">
                {userSubscription === 'free' ? 'Upgrade' : 
                 userSubscription === 'premium' ? 'Premium' : 'Lifetime'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header