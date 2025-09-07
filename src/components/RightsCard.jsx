import React, { useState } from 'react'
import { BookOpen, Lock, ChevronDown, ChevronUp } from 'lucide-react'

const RightsCard = ({ stateData, language, userSubscription, onUpgrade }) => {
  const [expandedSection, setExpandedSection] = useState(null)

  if (!stateData) return null

  const content = stateData.rightsContent[language] || stateData.rightsContent.en

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const isPremiumContent = (section) => {
    return section.premium && userSubscription === 'free'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-2">Your Rights in {stateData.name}</h2>
        <p className="text-gray-600">Essential information for police encounters</p>
      </div>

      {content.sections.map((section, index) => (
        <div key={index} className="card">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => !isPremiumContent(section) && toggleSection(index)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                section.type === 'traffic' ? 'bg-blue-100 text-blue-600' :
                section.type === 'search' ? 'bg-red-100 text-red-600' :
                section.type === 'arrest' ? 'bg-orange-100 text-orange-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-text">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.subtitle}</p>
              </div>
            </div>
            
            {isPremiumContent(section) ? (
              <button 
                onClick={onUpgrade}
                className="flex items-center space-x-1 px-3 py-1 bg-warning text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                <Lock className="w-4 h-4" />
                <span>Premium</span>
              </button>
            ) : (
              <div className="text-gray-400">
                {expandedSection === index ? <ChevronUp /> : <ChevronDown />}
              </div>
            )}
          </div>

          {expandedSection === index && !isPremiumContent(section) && (
            <div className="mt-4 pt-4 border-t border-border space-y-4">
              <div>
                <h4 className="font-medium text-accent mb-2">✓ What TO DO:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {section.whatToDo.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-accent mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-emergency mb-2">✗ What NOT to do:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {section.whatNotToDo.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emergency mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {section.keyPoints && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-text mb-2">📋 Key Legal Points:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {section.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-sm font-bold">!</span>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Important Reminder</h3>
            <p className="text-sm text-blue-800">
              This information is for educational purposes only and does not constitute legal advice. 
              Laws can change, and situations vary. Always remain calm and comply with lawful orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightsCard