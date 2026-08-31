# MemoraAI — System Architecture

## 1. Overview

MemoraAI is a privacy-first intelligent cloud photo and memory management platform.

The system stores original media in object storage and keeps structured metadata, relationships, AI outputs, permissions, and vector embeddings in MongoDB Atlas. AI processing runs as a separate Python service so that the main Node.js API remains focused on application logic.

### Primary goals

- Secure photo and video upload and retrieval
- AI-powered semantic photo search
- Face grouping and people management
- Sensitive-document detection
- Smart photo cleanup
- Automatic event and memory generation
- AI photo assistant
- Clear ownership across a 4-member team

---

## 2. Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Framer Motion (optional)

### Application Backend
- Node.js
- Express.js
- JWT
- bcrypt
- Multer for controlled local/development uploads
- Socket.IO (optional for live processing status)

### AI Service
- Python
- Flask
- OpenCV
- Pillow
- NumPy
- scikit-learn
- YOLO / Ultralytics
- CLIP or equivalent image-text embedding model
- Face recognition/embedding model
- Tesseract or EasyOCR

### Data
- MongoDB Atlas
- MongoDB Atlas Vector Search

### Storage
- AWS S3

### Deployment
- Docker
- Vercel for frontend (recommended)
- AWS/Render for backend and AI service
- MongoDB Atlas
- AWS S3

---

## 3. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │     React Frontend  │
                         │   Vite + Tailwind   │
                         └──────────┬──────────┘
                                    │ HTTPS
                                    ▼
                         ┌─────────────────────┐
                         │  Node.js + Express  │
                         │      REST API       │
                         └──────┬──────┬────────┘
                                │      │
                   ┌────────────┘      └───────────────┐
                   ▼                                   ▼
          ┌─────────────────┐                  ┌──────────────┐
          │  MongoDB Atlas  │                  │    AWS S3    │
          │ metadata/search │                  │ original     │
          │ users/albums    │                  │ media/files  │
          │ embeddings      │                  │ thumbnails   │
          └────────┬────────┘                  └──────────────┘
                   │
                   │ AI jobs / internal HTTP
                   ▼
          ┌─────────────────────┐
          │  Python AI Service  │
          │        Flask        │
          └─────────┬───────────┘
                    │
          ┌─────────┼─────────┬──────────┐
          ▼         ▼         ▼          ▼
       CLIP/      YOLO      Face       OCR
      Embeddings  Objects   Pipeline   Pipeline
          │         │         │          │
          └─────────┴─────────┴──────────┘
                    │
                    ▼
             Structured AI results
                    │
                    ▼
              MongoDB Atlas
```

---

## 4. Core Components

### 4.1 Frontend

Responsibilities:
- Authentication UI
- Photo upload UI
- Gallery and album management
- Search
- People page
- Privacy alerts
- Cleanup suggestions
- Timeline and memories
- AI assistant
- Loading/error/empty states

The frontend must never access MongoDB or AWS credentials directly.

---

### 4.2 Node.js API

Responsibilities:
- Authentication and authorization
- User/profile APIs
- Photo and album APIs
- Signed upload/download URL generation
- Metadata management
- Search orchestration
- AI job creation
- Permissions
- Audit logging
- Rate limiting
- Admin APIs

---

### 4.3 MongoDB Atlas

Primary collections:

```text
users
photos
albums
faces
events
memories
ai_results
search_history
ai_jobs
notifications
audit_logs
family_groups
family_members
```

MongoDB should hold references and metadata, not large binary photo files.

---

### 4.4 AWS S3

S3 stores:
- Original photos
- Videos
- Generated thumbnails
- Optional generated memory media

Use private buckets. Media should be accessed using short-lived signed URLs or through a controlled backend delivery layer.

---

### 4.5 Python AI Service

The AI service exposes internal endpoints such as:

```text
POST /ai/analyze-image
POST /ai/create-embedding
POST /ai/detect-faces
POST /ai/privacy-scan
POST /ai/cleanup-score
POST /ai/detect-events
POST /ai/generate-caption
```

The service returns structured JSON. It does not own user authentication or permanent application data.

---

## 5. Upload and Processing Flow

```text
1. User selects media
2. Frontend requests upload permission
3. Backend validates user and file metadata
4. Backend generates S3 signed upload URL
5. Frontend uploads directly to S3
6. Backend records photo metadata
7. Backend creates AI processing job
8. AI service processes the image
9. AI results are validated
10. MongoDB is updated
11. Frontend receives completed status
```

### Important rule

AI processing must not run synchronously inside the upload request.

For MVP:
- MongoDB-backed job records are acceptable.

For scale:
- Add Redis + BullMQ or another queue.

---

## 6. Search Architecture

Natural-language search uses a hybrid strategy.

```text
User query
   ↓
Query interpretation
   ↓
Text embedding
   ↓
Vector search
   +
Metadata filters
   ↓
Optional keyword/field matching
   ↓
Ranking
   ↓
Result cards
```

Examples:

```text
"photos with my dog"
"my Goa sunset photos"
"photos from December 2025"
"red shirt pictures"
"college event photos"
```

Do not rely on vector similarity alone. Combine semantic relevance with structured filters such as userId, date range, album, people, location, and privacy state.

---

## 7. Face Recognition Architecture

```text
Photo
 ↓
Face detection
 ↓
Face crop/alignment
 ↓
Embedding generation
 ↓
Similarity matching / clustering
 ↓
Unknown person group
 ↓
User labels group
```

The system should treat recognition as probabilistic.

Store:
- embedding
- confidence
- model version
- group/person ID
- photo ID

Allow the user to correct a person label.

---

## 8. Privacy Guardian Architecture

```text
Image
 ↓
OCR/document classifier
 ↓
Sensitive type detection
 ↓
Confidence score
 ↓
Privacy finding
 ↓
User recommendation
```

Possible findings:
- Aadhaar
- PAN
- Passport
- Driving licence
- Credit/debit card
- Cheque
- Other sensitive documents

The system must not delete or move sensitive files without user confirmation.

---

## 9. Event and Memory Architecture

Event detection combines:
- Timestamp
- GPS metadata
- Visual similarity
- Semantic embeddings
- Detected objects
- Faces
- User labels

```text
Photos
 ↓
Feature extraction
 ↓
Similarity + time/location grouping
 ↓
Candidate event
 ↓
Confidence score
 ↓
User confirmation/editing
 ↓
Memory
```

Memory generation then uses selected photos and structured event metadata to create:
- title
- summary
- captions
- timeline
- optional story

---

## 10. API Design

Use versioned REST APIs.

```text
/api/v1/auth
/api/v1/users
/api/v1/photos
/api/v1/albums
/api/v1/search
/api/v1/faces
/api/v1/privacy
/api/v1/cleanup
/api/v1/events
/api/v1/memories
/api/v1/assistant
/api/v1/admin
```

Return consistent response shapes:

```json
{
  "success": true,
  "data": {},
  "message": "Request completed",
  "error": null,
  "requestId": "..."
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "message": "Invalid file type",
  "error": {
    "code": "INVALID_FILE_TYPE"
  },
  "requestId": "..."
}
```

---

## 11. Team Ownership

### Member 1 — Core Platform & Cloud
- Auth
- Users
- Upload
- S3
- Albums
- Media lifecycle

### Member 2 — AI Semantic Search
- Embeddings
- Semantic search
- Object detection
- Captions
- Search ranking

### Member 3 — Computer Vision & Privacy
- Face recognition
- People grouping
- Privacy Guardian
- Smart cleanup

### Member 4 — Memory Intelligence
- Event clustering
- Timeline
- Memory generation
- AI assistant

Every member owns frontend + backend + data + testing for their domain.

---

## 12. Cross-Cutting Concerns

All members share:
- Git workflow
- API contracts
- Error handling conventions
- Security standards
- Testing
- Documentation
- Deployment
- Final integration

---

## 13. Future Scalability

Later, the project can evolve from:

```text
React → Node → MongoDB/S3 → Python AI
```

to:

```text
React
  ↓
API Gateway
  ↓
Application Services
  ↓
Queue
  ├── AI Workers
  ├── Media Workers
  └── Memory Workers
  ↓
MongoDB + S3
```

Redis/BullMQ should be introduced only when asynchronous processing volume justifies it.
