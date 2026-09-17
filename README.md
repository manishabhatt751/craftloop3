# CraftLoop

> Connect skills, discover talent, create opportunities.

CraftLoop is a full-stack platform featuring a rich client-side experience for creators and learners, backed by a Node.js / Express and MongoDB (Mongoose) backend.

---

## 📁 Project Architecture

```text
craftloop3/
├── package.json              # Root workspaces & orchestration scripts
├── .gitignore                # Root gitignore
├── README.md                 # Project documentation
├── client/                   # Frontend Application (React 19 + Vite 8 + Tailwind CSS v4)
│   ├── .env.example          # Frontend environment variables template
│   ├── index.html            # Vite HTML entry
│   ├── vite.config.js        # Vite build config with /api proxy to backend
│   └── src/
│       ├── Components/       # Reusable components & layouts (Creator & Viewer layouts)
│       ├── pages/            # 32 UI pages (Dashboard, Explore, Courses, Chat, etc.)
│       ├── services/         # API abstraction client (api.js)
│       └── style.css         # Tailwind & custom CSS styling
└── server/                   # Backend Application (Express 5 + MongoDB / Mongoose)
    ├── .env                  # Backend local env (ignored by git)
    ├── .env.example          # Backend environment variables template
    ├── server.js             # Express server entry point
    ├── config/               # Database connection (Mongoose / MongoDB)
    ├── controllers/          # Request handlers & logic (health, etc.)
    ├── middleware/           # Centralized 404 & error handling
    ├── models/               # Mongoose schemas (User, Project, Course, CommunityPost, Message)
    └── routes/               # Modular API routes (/api/health, /api/...)
```

---

## 🚀 Quick Start

### 1. Install All Dependencies

To install dependencies for root, frontend (`client`), and backend (`server`) in one step:

```bash
npm run install:all
```

Or install individually:

```bash
# Frontend dependencies
cd client && npm install

# Backend dependencies
cd server && npm install
```

### 2. Environment Setup

#### Backend
Update `server/.env` with your MongoDB connection string (Local or Atlas):
```env
PORT=5000
NODE_ENV=development

# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/craftloop

# Or MongoDB Atlas Cloud:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/craftloop?retryWrites=true&w=majority

JWT_SECRET=your_jwt_secret_key
```

#### Frontend
Optionally copy `client/.env.example` to `client/.env`:
```bash
cp client/.env.example client/.env
```
Default `VITE_API_BASE_URL=/api` uses the Vite development proxy configured to route to `http://localhost:5000`.

---

## 🏃 Running the Application

### Option A: Run Both Together (Recommended)
From the root directory:
```bash
npm run dev
```
This runs both the Express backend (`http://localhost:5000`) and the Vite frontend (`http://localhost:5173`) concurrently with labeled logs.

### Option B: Run Independently

- **Frontend Only:**
  ```bash
  npm run client
  # Or: cd client && npm run dev
  ```
  Accessible at: `http://localhost:5173`

- **Backend Only:**
  ```bash
  npm run server
  # Or: cd server && npm run dev
  ```
  Accessible at: `http://localhost:5000`

---

## 🛠️ Build & Production

- **Build Frontend:**
  ```bash
  npm run build
  ```
  Output generated in `client/dist/`.

- **Start Production Server:**
  ```bash
  npm run start
  ```
