# Know Your Rights Navigator

A mobile-first web application that provides concise, state-specific legal information and recording tools for individuals interacting with law enforcement.

## 🚀 Features

### Core Features
- **State-Specific Rights Cards**: Mobile-optimized guides with 'what to do', 'what not to say', and key legal points for each US state
- **Scripted Responses**: Pre-written, legally sound phrases in English and Spanish to help navigate police interactions
- **Quick Record Button**: Immediate audio/video recording capabilities with cloud storage
- **Emergency Alert**: Instant alerts to trusted contacts with real-time location sharing
- **Content Management**: Backend system for legal experts to update state-specific information

### Premium Features
- **Video Recording**: High-quality video recording (free users get audio only)
- **Cloud Backup**: Secure, encrypted storage of recordings via IPFS
- **Enhanced Scripting**: AI-powered, context-aware response suggestions
- **Priority Support**: Direct access to legal experts and priority customer support
- **Advanced Recording Controls**: Multiple recording formats, quality settings, and editing tools

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for responsive, mobile-first styling
- **Zustand** for state management
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend & Services
- **Supabase** for database, authentication, and real-time features
- **Stripe** for payment processing and subscription management
- **Pinata IPFS** for decentralized, secure file storage
- **OpenAI API** for AI-powered content generation and translation
- **Privy** for privacy-first user data handling

### Security & Privacy
- **End-to-end encryption** for premium recordings
- **Local-first data storage** with optional cloud sync
- **Privacy-focused design** with minimal data collection
- **Secure authentication** via Supabase Auth

## 📱 Business Model

### Subscription Tiers
- **Free**: Basic rights information, audio recording, 1 trusted contact
- **Premium Monthly ($4.99/month)**: Video recording, cloud backup, unlimited contacts, enhanced features
- **Lifetime Access ($29.99)**: All premium features with no recurring charges

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Stripe account (for payments)
- Pinata account (for IPFS storage)
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-3581.git
   cd this-is-a-3581
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys and configuration:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

   # Pinata IPFS Configuration
   VITE_PINATA_JWT=your-pinata-jwt-token

   # OpenAI Configuration (optional)
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

4. **Set up Supabase database**
   
   Run the following SQL in your Supabase SQL editor to create the required tables:
   
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'lifetime')),
     preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
     trusted_contacts JSONB DEFAULT '[]',
     settings JSONB DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Legal content table
   CREATE TABLE legal_content (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     content_id TEXT NOT NULL,
     state TEXT NOT NULL,
     type TEXT NOT NULL CHECK (type IN ('traffic', 'search', 'arrest', 'general')),
     title TEXT NOT NULL,
     body JSONB NOT NULL,
     script JSONB,
     language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es')),
     version INTEGER DEFAULT 1,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(content_id, state, type, language)
   );

   -- Recordings table
   CREATE TABLE recordings (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     file_path TEXT,
     duration INTEGER,
     metadata JSONB DEFAULT '{}',
     encrypted BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Alerts table
   CREATE TABLE alerts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     location JSONB,
     contacts_notified JSONB DEFAULT '[]',
     status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to `http://localhost:5173` in your browser

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── Header.jsx      # Main navigation header
│   ├── RightsCard.jsx  # State-specific rights display
│   ├── ScriptedResponses.jsx  # Response templates
│   ├── RecordingControls.jsx  # Recording interface
│   ├── EmergencyAlert.jsx     # Emergency contact system
│   └── SubscriptionModal.jsx  # Payment and subscription
├── services/           # API and business logic
│   ├── authService.js  # Authentication handling
│   ├── paymentService.js      # Stripe integration
│   ├── recordingService.js    # Media recording & storage
│   └── emergencyService.js    # Emergency alerts
├── store/              # State management
│   └── appStore.js     # Zustand store
├── data/               # Static data and content
│   └── statesData.js   # State-specific legal information
├── lib/                # Utility libraries
│   └── supabase.js     # Supabase client configuration
└── App.jsx            # Main application component
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Development Notes
- The app uses a mobile-first responsive design
- State management is handled via Zustand for simplicity
- Authentication is managed through Supabase Auth
- File uploads use both Supabase Storage (free tier) and Pinata IPFS (premium)
- Payment processing is handled via Stripe with webhook support

## 🚀 Deployment

### Production Checklist
1. Set up production Supabase project
2. Configure Stripe webhooks for subscription management
3. Set up Pinata IPFS for file storage
4. Configure environment variables for production
5. Set up CI/CD pipeline (GitHub Actions recommended)
6. Configure domain and SSL certificates
7. Set up monitoring and error tracking

### Environment Variables for Production
Ensure all environment variables are properly configured in your deployment platform:
- Supabase URL and keys
- Stripe publishable and secret keys
- Pinata JWT token
- OpenAI API key (if using AI features)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@knowyourrightsnavigator.com or create an issue in this repository.

## 🔒 Privacy & Security

This application is designed with privacy and security as core principles:
- Minimal data collection
- End-to-end encryption for sensitive recordings
- Local-first data storage with optional cloud sync
- No tracking or analytics without explicit consent
- Regular security audits and updates

---

**⚠️ Legal Disclaimer**: This application provides general legal information and should not be considered as legal advice. Always consult with a qualified attorney for specific legal situations.
