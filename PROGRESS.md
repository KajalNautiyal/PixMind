# PixMind (PixMind) — Project Progress Tracker

> **Last Updated:** 2026-09-07

> **Purpose:** This file maintains project progress across all chat sessions and team members.

---

## 🏗️ Project Overview

* **Name:** PixMind
* **Type:** Privacy-First Intelligent Cloud Photo & Memory Management Platform
* **Team Size:** 4 Members
* **Tech Stack:**
  * Frontend: React + Vite + Tailwind CSS
  * Backend: Node.js + Express.js
  * AI Service: Python + Flask
  * Database: MongoDB Atlas
  * Storage: AWS S3 (Future Phase)

---

# ✅ Completed Work

## 📄 Documentation (100% Done)

* [x] PRD (`prd.md`)
* [x] Architecture (`architecture.md`)
* [x] Design (`design.md`)
* [x] Security (`security.md`)
* [x] Review (`review.md`)
* [x] Rules (`rules.md`)

## 🎨 Frontend Setup (Scaffolding Done)
- [x] Vite + React project initialized
- [x] Dependencies installed: React Router, Axios, Framer Motion, Lucide React, Recharts, Zod
- [x] Tailwind CSS v4 configured
- [x] Basic routing setup (`App.jsx`)

## 🔐 Frontend — Auth UI (Done + Connected to Backend)
- [x] `AuthLayout.jsx` — Shared layout for login/signup with branding
- [x] `Login.jsx` — Login page connected to backend API, email domain validation
- [x] `Signup.jsx` — Signup page connected to backend API, email domain validation, password strength meter
- [x] `VerifyOTP.jsx` — 6-digit OTP verification page with auto-focus, paste, resend countdown
- [x] `ForgotPassword.jsx` & `ResetPassword.jsx` — Password recovery flow
- [x] `Button.jsx` — Reusable button component
- [x] `Input.jsx` — Reusable input component with error display
- [x] `services/api.js` — Axios API service with JWT token interceptor and 401 auto-logout

## ⚙️ Backend — Auth API (Done + Secured)
- [x] Express server (`server.js`) with Helmet, CORS, error handling
- [x] MongoDB Atlas connection (`config/db.js`)
- [x] User model with OTP fields, password hashing (`models/User.js`)
- [x] Auth controller — register, verify-otp, resend-otp, login, getMe (`controllers/authController.js`)
- [x] JWT middleware (`middleware/auth.js`)
- [x] Zod validation middleware — email domain + password strength (`middleware/validate.js`)
- [x] Rate limiting on auth routes (10 per 15 min, 5 OTP per 5 min)
- [x] Email OTP sending via Gmail Nodemailer (`utils/mailer.js`)
- [x] Auth routes with validation + rate limiting (`routes/auth.js`)
- [x] `.env` / `.env.example` for team credential management

## 🛡️ Security (Done)
- [x] `.gitignore` at root + backend — .env, node_modules, test scripts protected
- [x] No hardcoded credentials in source code
- [x] Frontend API URL uses environment variable (`VITE_API_URL`)
- [x] Backend validates email domains (only gmail, yahoo, outlook, etc.)
- [x] Backend enforces strong passwords (uppercase, lowercase, number, special char, 8+ chars)
- [x] Rate limiting prevents brute force attacks
- [x] JWT tokens with expiry
- [x] Passwords hashed with bcrypt (salt rounds: 12)
- [x] OTP codes not returned in API responses
- [x] OTP expiry (10 minutes)
- [x] **Strict Frontend Route Protection**: Verifies token via API, redirects and clears storage if tampered.
- [x] **Global 401 Auto-Logout**: Gracefully handles session expiry via Axios interceptor.
- [x] **IDOR Prevention**: Hardened photo fetching/deletion to strict `req.userId` checks.

## 🧠 AI Service Setup (Phase 0 - Done)
- [x] `requirements.txt` (Flask, OpenCV, YOLO, CLIP, InsightFace, EasyOCR, PyTorch)
- [x] Python venv created
- [x] Flask app setup (`ai-service/app.py`)
- [x] Config file (`ai-service/config.py`)
- [x] Health check endpoint working

## 🔒 Privacy Vault & AI Scanner (Phase 1 - Done)
- [x] EasyOCR integration (`ai-service/privacy_scanner.py`)
- [x] `/ai/privacy-scan` endpoint
- [x] Privacy Node.js model + routes + controller
- [x] Photo model update (`isPrivate` and `isDismissed` fields)
- [x] Privacy Vault frontend page with Glassmorphism
- [x] Auto-scan on photo upload
- [x] "Move to Vault" / "Dismiss" actions
- [x] Private photos hidden from gallery
- [x] Photo Lightbox with Next/Prev keyboard & button navigation
- [x] Lightbox AI suggestion integration
- [x] 4-digit Vault PIN protection system (Auto-lock on tab switch)

## 📸 Photo Management & Optimization (Done)

### Backend
* [x] Photo Model (`Photo.js`).
* [x] Multer Configuration for Local Uploads.
* [x] Single Image Upload API.
* [x] Multiple Image Upload API.
* [x] File Type Validation.
* [x] File Size Validation.
* [x] Local Upload Storage (`backend/uploads`).

### Metadata Extraction
* [x] Integrated **Sharp**.
* [x] Extracted Image Width.
* [x] Extracted Image Height.
* [x] Stored MIME Type.
* [x] Stored File Size.

### Duplicate Detection
* [x] Integrated **MD5 File Hashing**.
* [x] Detect duplicate images during upload.
* [x] Skip uploading duplicate photos.
* [x] Return duplicate photo names in API response.
* [x] Smart Cleanup card shows duplicate photo count.

### Frontend
* [x] Created `PhotoManager.jsx`.
* [x] Connected Photo Gallery with Backend API.
* [x] Display uploaded photos.
* [x] Display image metadata.
* [x] Display Duplicate badge on duplicate photos.
* [x] Dashboard Recent Uploads connected with backend.


---

# 🚧 Remaining Work (MVP)

## Photo Management
* [ ] Smart Cleanup (Delete duplicate photos with one click).
* [ ] Image Optimization using Sharp.
* [ ] Photo Metadata Management (Camera, Location, Date).
* [ ] Download Photo.
* [ ] Delete Photo.

## Albums
* [ ] Album List Page.
* [ ] Create Album.
* [ ] Edit Album.
* [ ] Delete Album.
* [ ] Add Photos to Album.

---

# 📋 Future Releases
### Release 0.2: Albums + Metadata + AI Indexing
### Release 0.3: Semantic Search
### Release 0.4: Face/Privacy/Cleanup
### Release 0.5: AI Memory Assistant

---

# 🔑 Key Decisions
1. React + Vite frontend.
2. Tailwind CSS v4.
3. Express v5 backend.
4. MongoDB Atlas database.
5. Separate Python Flask AI service.
6. JWT Authentication.
7. OTP Verification using Nodemailer.
8. MD5 Hashing for duplicate image detection.
9. Sharp for metadata extraction and image optimization.
10. Local uploads for MVP, AWS S3 in future releases.

---

# 📝 Session Log

### Session — 2026-09-07 (Merged Branches)
- Merged Privacy Vault and Photo Management features successfully. Both teammate's duplicate detection and AI vault scanning now run side-by-side in harmony.

### Session — 2026-09-05 (Member 4)
- **Photo Management & Optimization**: Implemented multiple photo upload using Multer, image metadata extraction using Sharp, duplicate photo detection using MD5 hashing. Created Photo Gallery (`PhotoManager.jsx`) and added Smart Cleanup dashboard card.

### Session — 2026-09-05 (Member 3)
- **Phase 0 & 1 Completed**: Built the Python AI service using Flask and integrated EasyOCR for privacy scanning.
- **Privacy Vault**: Created the Privacy Vault UI with "Active Alerts" and "Secured Vault" tabs.
- **AI Auto-Scan**: Backend now automatically scans uploaded photos for sensitive data (Aadhaar, PAN, Cards).
- **Security**: Added a highly secure 4-digit PIN system that locks the vault instantly when navigating away.
- **Lightbox**: Implemented a sleek full-screen image viewer with Left/Right navigation and an intelligent AI "Move to Secure Vault" suggestion panel.

### Session — 2026-09-02
- UI redesign for Landing, Auth and Dashboard. Added GuestRoute and ProtectedRoute improvements.

### Session — 2026-08-31
- Created initial project structure. Completed authentication backend and frontend. Connected MongoDB Atlas. Setup Upload Modal and Initial Security measures.
