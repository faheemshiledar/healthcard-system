# 🚑 MedCard — Smart Emergency Health Card

A full-stack, production-grade emergency health card web application. First responders can scan a QR code to instantly access critical patient medical data — no login, no app needed.

---

## ✨ Features

### Core
- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing
- 👤 **Full Health Profile** — Blood group, allergies, conditions, medications, organ donor, DNR
- ⚡ **QR Code Generation** — Unique per-user QR code linking to public emergency page
- 📱 **Emergency Public Page** — No login required. Works on any device.
- 📞 **One-tap Call Buttons** — Instantly call emergency contacts
- 🚨 **SOS Alert System** — Mock SMS + hook for Twilio integration
- 📍 **GPS Location Logging** — Captures location on each QR scan
- 📊 **Scan History Dashboard** — See every scan with device, browser, timestamp, location
- 🔒 **Privacy Controls** — Toggle what shows publicly

### UI/UX
- 🎨 Dark medical theme with crimson emergency accents
- 📐 Mobile-responsive card-based layout
- ⚡ Smooth animations and transitions
- 🖨️ Printable emergency card with embedded QR

---

## 🗂️ Project Structure

```
emergency-health-card/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── models/
│   │   └── User.js              # Mongoose schema (health data)
│   ├── routes/
│   │   ├── auth.js              # register, login, /me, refresh-qr
│   │   ├── profile.js           # CRUD health profile, contacts, scan logs
│   │   ├── emergency.js         # Public emergency page data + SOS
│   │   └── scan.js              # QR scan timestamp logging
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Sidebar + mobile nav
│   │   │   └── TagInput.jsx     # Reusable tag/chip input
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Marketing homepage
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProfilePage.jsx  # Full health data editor
│   │   │   ├── QRCardPage.jsx   # QR code + printable card
│   │   │   ├── EmergencyPage.jsx # Public emergency page
│   │   │   └── ScanLogsPage.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and install

```bash
git clone <your-repo-url>
cd emergency-health-card
```

### 2. Set up Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emergency_health_card
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
# API running at http://localhost:5000
```

### 3. Set up Frontend

```bash
cd ../frontend
npm install
npm run dev
# App running at http://localhost:5173
```

Open http://localhost:5173 — register, fill profile, and your QR code is live!

---

## 🗄️ Database Guide (MongoDB)

### Option A: Local MongoDB
Install MongoDB Community: https://www.mongodb.com/try/download/community

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Verify
mongosh
```

Set in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/emergency_health_card
```

### Option B: MongoDB Atlas (Cloud — Recommended for Production)

1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a database user
4. Whitelist your IP (or `0.0.0.0/0` for all)
5. Click "Connect" → "Connect your application"
6. Copy the URI: `mongodb+srv://user:pass@cluster.mongodb.net/emergency_health_card`

Set in `.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/emergency_health_card
```

### Database Schema Overview

**User collection** stores everything:
- Auth: `email`, `password` (bcrypt hashed), `publicId`, `qrToken`
- Profile: `firstName`, `lastName`, `dateOfBirth`, `gender`, `profilePhoto`
- Medical: `bloodGroup`, `allergies[]`, `conditions[]`, `medications[]`, `organDonor`, `dnrOrder`
- Medical network: `primaryPhysician`, `insuranceProvider`, `insurancePolicyNumber`
- Contacts: `emergencyContacts[]` with name, relationship, phone, email, isPrimary
- Analytics: `scanLogs[]`, `scanCount`, `lastScanned`
- Settings: `isProfilePublic`, `showInsurance`, `sosAlertEnabled`

---

## ☁️ Hosting Guide

### Backend: Render.com (Free Tier)

1. Push code to GitHub
2. Go to render.com → New → Web Service
3. Connect GitHub repo
4. Set:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
5. Add environment variables from `.env`
6. Deploy!

**Alternative:** Railway.app, Fly.io, Heroku

### Frontend: Vercel (Free Tier)

1. Go to vercel.com → New Project
2. Import GitHub repo
3. Set:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
5. Deploy!

**Important:** Update `vite.config.js` proxy for production:
```js
// For production, replace the proxy with:
// In frontend/src/services/api.js:
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
```

**Alternative:** Netlify

### Docker Compose (Self-hosted)

```yaml
# docker-compose.yml
version: '3.8'
services:
  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/emergency_health_card
      JWT_SECRET: your_secret_here
      FRONTEND_URL: http://localhost:5173
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

---

## 🔧 Adding Real SMS (Twilio)

1. Sign up at twilio.com
2. Get Account SID, Auth Token, and a phone number
3. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

4. Install: `npm install twilio`

5. Uncomment the Twilio block in `backend/routes/emergency.js`:
```js
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
for (const contact of user.emergencyContacts) {
  await twilioClient.messages.create({
    body: sosMessage,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: contact.phone,
  });
}
```

---

## 🔒 Security Checklist

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens with expiry
- ✅ Helmet.js security headers
- ✅ Rate limiting (100 req/15min general, 20 req/15min auth)
- ✅ CORS restricted to frontend URL
- ✅ No email/password exposed on public emergency page
- ✅ SOS rate limited (once per 5 minutes)
- ✅ Environment variables for all secrets
- ✅ Input validation on all routes
- ⬜ Add HTTPS (handled by Render/Vercel automatically)
- ⬜ Add email verification (optional enhancement)
- ⬜ Add 2FA (optional enhancement)

---

## 🌱 Scalability & Future Enhancements

### Phase 2
- 📧 Email verification & password reset
- 🌐 Multi-language support (i18n)
- 🔔 Push notifications for scan alerts
- 📱 Progressive Web App (PWA) — add to home screen
- 🏥 Hospital/clinic admin portal
- 👨‍👩‍👧 Family account management

### Phase 3
- 🤖 AI-powered drug interaction warnings
- 📈 Health timeline / medical history
- 🔗 EHR (Electronic Health Records) integration
- 🏷️ NFC chip support alongside QR
- 📊 Analytics dashboard for clinics

---

## 📡 API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login, get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/refresh-qr` | ✅ | Regenerate QR token |
| GET | `/api/profile` | ✅ | Get full profile |
| PUT | `/api/profile` | ✅ | Update profile |
| POST | `/api/profile/emergency-contacts` | ✅ | Add contact |
| DELETE | `/api/profile/emergency-contacts/:id` | ✅ | Remove contact |
| GET | `/api/profile/scan-logs` | ✅ | Get scan history |
| GET | `/api/emergency/:qrToken` | - | Public emergency data |
| POST | `/api/emergency/:qrToken/sos` | - | Trigger SOS alert |
| POST | `/api/scan/:qrToken` | - | Log a QR scan |

---

## 🙏 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP | Axios |
| QR Code | qrcode.react |
| Notifications | react-hot-toast |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Security | Helmet + express-rate-limit |

---

Made with ❤️ for emergency preparedness
