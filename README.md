# 🧠 PixMind (PixMind)

> **Privacy-First Intelligent Cloud Photo & Memory Management Platform**
> 
> Not just storing photos, but understanding your memories.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router, Axios, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express v5, Mongoose v9, JWT, bcrypt, Zod, Nodemailer |
| **AI Service** | Python, Flask, YOLO, CLIP, InsightFace, EasyOCR, PyTorch |
| **Database** | MongoDB Atlas (data + vector search) |
| **Storage** | AWS S3 (photos/media) |

---

## 📁 Project Structure

```
PixMind/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/ui/   # Reusable UI components (Button, Input)
│   │   ├── layouts/         # AuthLayout
│   │   ├── pages/Auth/      # Login, Signup, VerifyOTP
│   │   ├── services/        # API service (Axios)
│   │   ├── App.jsx          # Routes
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── backend/                 # Node.js + Express API
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # authController.js
│   ├── middleware/           # auth.js (JWT), validate.js (Zod)
│   ├── models/              # User.js
│   ├── routes/              # auth.js
│   ├── utils/               # mailer.js (OTP emails)
│   ├── server.js            # Entry point
│   ├── .env.example         # ⬅️ Copy this to .env and fill your creds
│   └── package.json
│
├── ai-service/              # Python AI service (WIP)
│   ├── requirements.txt
│   └── venv/
│
├── prd.md                   # Product Requirements Document
├── architecture.md          # System Architecture
├── design.md                # UI/UX Design Guidelines
├── security.md              # Security Standards
├── rules.md                 # Development Rules
├── review.md                # Code Review Guidelines
├── PROGRESS.md              # 📊 Project progress tracker
└── .gitignore
```

---

## ⚡ Quick Setup (For Teammates)

### Prerequisites
- **Node.js** v18+ → [Download](https://nodejs.org/)
- **Git** → [Download](https://git-scm.com/)
- **MongoDB Atlas** account (free tier) → [Sign up](https://www.mongodb.com/atlas)
- **Gmail App Password** for OTP → [Guide](https://support.google.com/accounts/answer/185833)

### 1. Clone the repo
```bash
git clone https://github.com/KajalNautiyal/PixMind.git
cd PixMind
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your credentials:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/PixMind
JWT_SECRET=your_random_secret_string
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

Start backend:
```bash
npm run dev
```
✅ Server runs on `http://localhost:5000`

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
✅ App runs on `http://localhost:5173`

---

## 🔐 Auth Flow

```
Register → OTP sent to email → Verify OTP → Account active → Login → JWT token
```

### API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Register + send OTP | Public |
| POST | `/api/v1/auth/verify-otp` | Verify email OTP | Public |
| POST | `/api/v1/auth/resend-otp` | Resend OTP | Public |
| POST | `/api/v1/auth/login` | Login (get JWT) | Public |
| GET | `/api/v1/auth/me` | Get profile | 🔒 JWT |
| GET | `/api/v1/health` | Health check | Public |

### Security Features
- ✅ bcrypt password hashing (12 salt rounds)
- ✅ JWT authentication with expiry
- ✅ Email domain whitelist (gmail, yahoo, outlook, etc.)
- ✅ Strong password enforcement
- ✅ Rate limiting (10 auth/15min, 5 OTP/5min)
- ✅ Zod input validation
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ OTP expiry (10 minutes)

---

## 👥 Team Ownership

| Member | Domain |
|---|---|
| **Member 1** | Core Platform & Cloud Storage — Authentication, Image Upload, AWS S3 Integration, Album Management |
| **Member 2** | AI-Powered Image Understanding — Image Embeddings, Semantic Search, Object Detection, Image Captioning |
| **Member 3** | Computer Vision & Privacy — Face Recognition, Face Grouping, Privacy Protection, Sensitive Content Detection |
| **Member 4** | Photo Management & Optimization — Duplicate Detection, Image Optimization, Photo Metadata Extraction & Management |

---

## 📋 Release Roadmap

| Release | Features | Status |
|---|---|---|
| **0.1** | Auth + Upload + Gallery | 🟡 Auth done, Upload/Gallery pending |
| **0.2** | Albums + Metadata + AI Indexing | ⬜ Not started |
| **0.3** | Semantic Search | ⬜ Not started |
| **0.4** | Face/Privacy/Cleanup | ⬜ Not started |
| **0.5** | Memory + AI Assistant | ⬜ Not started |
| **1.0** | Hardening + Testing + Deployment | ⬜ Not started |

---

## 📄 Documentation

- [PRD](prd.md) — Product Requirements
- [Architecture](architecture.md) — System Design
- [Design](design.md) — UI/UX Guidelines
- [Security](security.md) — Security Standards
- [Progress](PROGRESS.md) — Current Progress Tracker

---

## ⚠️ Important Notes

1. **NEVER commit `.env` files** — they contain passwords and API keys
2. **Always use `.env.example`** as template for your local `.env`
3. **MongoDB Atlas** → Add your IP in Network Access (or use `0.0.0.0/0` for team access)
4. **Gmail App Password** → Each teammate needs their own, OR share one team Gmail
