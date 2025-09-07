import React, { useState, useEffect } from 'react'
import { AlertTriangle, Users, MapPin, Phone, Send, Plus, X, Lock } from 'lucide-react'

const EmergencyAlert = ({ userSubscription, onUpgrade }) => {
  const [trustedContacts, setTrustedContacts] = useState([
    { id: 1, name: 'Emergency Contact', phone: '+1 (555) 123-4567', email: 'emergency@example.com' }
  ])
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' })
  const [alertSent, setAlertSent] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          console.error('Location error:', error)
        }
      )
    }
  }, [])

  const addContact = () => {
    if (newContact.name && (newContact.phone || newContact.email)) {
      setTrustedContacts([
        ...trustedContacts,
        { ...newContact, id: Date.now() }
      ])
      setNewContact({ name: '', phone: '', email: '' })
      setIsAddingContact(false)
    }
  }

  const removeContact = (id) => {
    setTrustedContacts(trustedContacts.filter(contact => contact.id !== id))
  }

  const sendEmergencyAlert = () => {
    if (userSubscription === 'free' && trustedContacts.length > 1) {
      onUpgrade()
      return
    }

    // Simulate sending alert
    setAlertSent(true)
    
    // In a real app, this would:
    // 1. Send SMS/email to trusted contacts
    // 2. Include current location
    // 3. Optionally include live recording link
    // 4. Store alert in database
    
    setTimeout(() => setAlertSent(false), 3000)
  }

  const call911 = () => {
    window.open('tel:911', '_self')
  }

  const shareLocation = () => {
    if (currentLocation) {
      const locationUrl = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
      if (navigator.share) {
        navigator.share({
          title: 'My Current Location - Emergency',
          text: 'I am in an emergency situation. This is my current location.',
          url: locationUrl
        })
      } else {
        navigator.clipboard.writeText(locationUrl)
        alert('Location copied to clipboard')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-emergency mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text mb-2">Emergency Tools</h2>
        <p className="text-gray-600">Quick access to emergency functions and trusted contacts</p>
      </div>

      {/* Emergency Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={call911}
          className="btn-emergency flex items-center justify-center space-x-2 h-16 text-lg"
        >
          <Phone className="w-6 h-6" />
          <span>Call 911</span>
        </button>

        <button
          onClick={sendEmergencyAlert}
          className={`flex items-center justify-center space-x-2 h-16 text-lg transition-colors ${
            alertSent 
              ? 'bg-green-500 text-white' 
              : 'btn-emergency'
          }`}
        >
          <Send className="w-6 h-6" />
          <span>{alertSent ? 'Alert Sent!' : 'Alert Contacts'}</span>
        </button>
      </div>

      {/* Location Sharing */}
      <div className="card">
        <h3 className="font-semibold text-text mb-3 flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Location Sharing</span>
        </h3>
        
        {currentLocation ? (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Current Location:</p>
              <p className="font-mono text-sm">
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500">
                Accuracy: ±{Math.round(currentLocation.accuracy)}m
              </p>
            </div>
            
            <button
              onClick={shareLocation}
              className="btn-secondary w-full"
            >
              Share My Location
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Getting your location...</p>
        )}
      </div>

      {/* Trusted Contacts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Trusted Contacts</span>
          </h3>
          
          <button
            onClick={() => setIsAddingContact(true)}
            className="flex items-center space-x-1 px-3 py-1 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="space-y-3">
          {trustedContacts.map((contact, index) => (
            <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-text">{contact.name}</div>
                <div className="text-sm text-gray-600">
                  {contact.phone && <div>{contact.phone}</div>}
                  {contact.email && <div>{contact.email}</div>}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {userSubscription === 'free' && index > 0 && (
                  <Lock className="w-4 h-4 text-warning" />
                )}
                <button
                  onClick={() => removeContact(contact.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {userSubscription === 'free' && trustedContacts.length > 1 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <Lock className="w-4 h-4 inline mr-1" />
              Free plan includes 1 trusted contact. Upgrade for unlimited contacts.
            </p>
          </div>
        )}

        {/* Add Contact Form */}
        {isAddingContact && (
          <div className="mt-4 p-4 border border-border rounded-lg">
            <h4 className="font-medium text-text mb-3">Add Trusted Contact</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Contact Name"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="flex space-x-3">
                <button
                  onClick={addContact}
                  className="btn-primary flex-1"
                >
                  Add Contact
                </button>
                <button
                  onClick={() => setIsAddingContact(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Tips */}
      <div className="card bg-red-50 border-red-200">
        <h3 className="font-semibold text-red-900 mb-3">Emergency Guidelines</h3>
        <ul className="text-sm text-red-800 space-y-2">
          <li>• Stay calm and follow officer instructions</li>
          <li>• Keep your hands visible at all times</li>
          <li>• Don't make sudden movements</li>
          <li>• State that you're recording (if legal in your state)</li>
          <li>• Ask "Am I free to leave?" if unsure</li>
          <li>• Contact a lawyer as soon as possible</li>
        </ul>
      </div>
    </div>
  )
}

export default EmergencyAlert