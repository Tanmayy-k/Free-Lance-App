
=======
# NextGig — Freelancing Platform

A modern, full-stack freelancing platform connecting clients with world-class freelancers. Built with the MERN stack.

## 🚀 Tech Stack

- **Frontend**: React, React Router v6, CSS Variables, Socket.IO Client
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO, bcrypt, dotenv
- **Deployment**: Vercel (frontend) + Render (backend) + MongoDB Atlas

---

## 📂 Project Structure

```
Free-Lance-App/
├── client/          # React frontend
│   ├── src/
│   │   ├── api.js           # Central axios instance
│   │   ├── context/         # Global state (GeneralContext)
│   │   ├── pages/           # Route-level components
│   │   │   ├── freelancer/  # Freelancer dashboard, projects, bids
│   │   │   ├── client/      # Client dashboard, post projects, review
│   │   │   └── admin/       # Admin overview, users, projects
│   │   ├── components/      # Navbar, Login, Register
│   │   └── styles/          # Page-specific CSS
│   └── vercel.json          # Vercel SPA routing
└── server/          # Express backend
    ├── index.js             # Routes, MongoDB connection, server
    ├── Schema.js            # Mongoose models
    ├── SocketHandler.js     # Socket.IO chat events
    └── .env.example         # Environment variable template
```

---

## ⚙️ Local Development

### 1. Clone & Install

```bash
git clone <repo-url>
cd Free-Lance-App

# Backend
cd server && npm install
cp .env.example .env   # Fill in your values

# Frontend
cd ../client && npm install
cp .env.example .env   # Fill in your values
```

### 2. Start Services

```bash
# Terminal 1 — Backend
cd server && npm start

# Terminal 2 — Frontend
cd client && npm start
```

---

## 🌍 Deployment

### Backend → Render

1. Connect your GitHub repo to [render.com](https://render.com)
2. Create a **Web Service** pointing to the `server/` directory
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node index.js`
5. Add environment variables from `server/.env.example`

### Frontend → Vercel

1. Connect your GitHub repo to [vercel.com](https://vercel.com)
2. Set **Root Directory**: `client`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `build`
5. Add `REACT_APP_API_URL` = your Render backend URL

### Database → MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string and set as `MONGO_URI` in Render environment variables
3. Whitelist `0.0.0.0/0` in Network Access for Render

---

## 🔑 Environment Variables

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 6001) |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_ORIGIN` | Frontend URL for CORS |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend API base URL |

---

## 🛣️ API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |
| GET | `/fetch-freelancer/:id` | Get freelancer profile |
| POST | `/update-freelancer` | Update freelancer profile |
| GET | `/fetch-projects` | Get all projects |
| GET | `/fetch-project/:id` | Get single project |
| POST | `/new-project` | Create new project |
| POST | `/make-bid` | Submit a bid |
| GET | `/fetch-applications` | Get all applications |
| GET | `/approve-application/:id` | Approve a bid |
| GET | `/reject-application/:id` | Reject a bid |
| POST | `/submit-project` | Submit completed work |
| GET | `/approve-submission/:id` | Approve submitted work |
| GET | `/reject-submission/:id` | Reject submitted work |
| GET | `/fetch-users` | Get all users (admin) |
| GET | `/fetch-chats/:id` | Get project chat messages |

---

## 🎯 Features

- **Authentication**: JWT-less session via localStorage (username, email, userId, usertype)
- **Role-based Access**: Freelancer / Client / Admin dashboards
- **Real-time Chat**: Socket.IO messaging per project room
- **Bid System**: Freelancers submit proposals; clients approve/reject
- **Project Workflow**: Post → Bid → Assign → Submit → Review → Complete
- **Admin Panel**: View all users, projects, and applications

---

© 2024 NextGig. All rights reserved.
>>>>>>> d5bb65e (Redesign NextGig and prepare for deployment)
