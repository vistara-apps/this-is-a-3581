import React, { useState } from 'react'
import { Copy, Volume2, Lock, Check } from 'lucide-react'

const ScriptedResponses = ({ stateData, language, userSubscription, onUpgrade }) => {
  const [copiedText, setCopiedText] = useState('')

  if (!stateData) return null

  const scripts = stateData.scripts[language] || stateData.scripts.en

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(''), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const isPremiumScript = (script) => {
    return script.premium && userSubscription === 'free'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-2">What to Say</h2>
        <p className="text-gray-600">Pre-written responses for common situations</p>
      </div>

      {scripts.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h3 className="text-lg font-semibold text-text border-b border-border pb-2">
            {category.name}
          </h3>
          
          {category.scripts.map((script, scriptIndex) => (
            <div key={scriptIndex} className={`card ${isPremiumScript(script) ? 'opacity-75' : ''}`}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-text mb-1">{script.situation}</h4>
                    <p className="text-sm text-gray-600 mb-3">{script.description}</p>
                  </div>
                  
                  {isPremiumScript(script) && (
                    <button 
                      onClick={onUpgrade}
                      className="flex items-center space-x-1 px-3 py-1 bg-warning text-white rounded-lg text-sm hover:opacity-90 transition-opacity ml-3"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Premium</span>
                    </button>
                  )}
                </div>

                {!isPremiumScript(script) && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-text font-medium mb-2">"{script.text}"</p>
                      {script.note && (
                        <p className="text-xs text-gray-600 italic">Note: {script.note}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(script.text)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        {copiedText === script.text ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-sm">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => speakText(script.text)}
                        className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm">Listen</span>
                      </button>

                      <span className={`text-xs px-2 py-1 rounded-full ${
                        script.tone === 'polite' ? 'bg-green-100 text-green-700' :
                        script.tone === 'firm' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {script.tone}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-sm font-bold">💡</span>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Usage Tips</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Practice these phrases beforehand</li>
              <li>• Speak clearly and calmly</li>
              <li>• Don't argue or become confrontational</li>
              <li>• Use these as starting points - adapt as needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScriptedResponses