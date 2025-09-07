import React, { useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import { statesData } from '../data/statesData'

const StateSelector = ({ onStateSelect }) => {
  const [searchQuery, setSearchQuery] = useState('')
  
  const states = Object.keys(statesData).map(code => ({
    code,
    name: statesData[code].name
  }))
  
  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use reverse geocoding
          // For demo, just select California
          onStateSelect('CA')
        },
        (error) => {
          alert('Unable to detect location. Please select your state manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text mb-2">Welcome to Know Your Rights</h1>
          <p className="text-gray-600">Select your state to get specific legal information</p>
        </div>

        {/* Auto-detect location */}
        <button
          onClick={handleLocationDetect}
          className="w-full flex items-center justify-center space-x-2 btn-primary mb-6"
        >
          <MapPin className="w-5 h-5" />
          <span>Auto-detect my location</span>
        </button>

        <div className="text-center text-gray-500 mb-6">or</div>

        {/* Search states */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for your state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* States list */}
        <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
          {filteredStates.map((state) => (
            <button
              key={state.code}
              onClick={() => onStateSelect(state.code)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-border last:border-b-0"
            >
              <div className="font-medium text-text">{state.name}</div>
              <div className="text-sm text-gray-500">{state.code}</div>
            </button>
          ))}
        </div>

        {filteredStates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No states found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )
}

const Shield = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

export default StateSelector