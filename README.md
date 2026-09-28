# 📬 Notification Service Backend

A clean, lightweight, and robust Notification Service REST API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## ✨ Features

- **🔐 Secure Authentication**: Register, login, and fetch user profile with bcrypt password hashing and JWT.
- **📩 Notifications CRUD**: Create, read, mark as read, and delete notifications.
- **🛡️ Strict Authorization**: Users can only create, view, update, and delete their own notifications.
- **✔️ Input Validation**: Simple and effective request validation with descriptive `400 Bad Request` messages.
- **⚠️ Centralized Error Handling**: Unified and consistent JSON response structure across the application.
- **📦 Clean TypeScript Architecture**: Strongly-typed code without over-engineering or unnecessary abstractions.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Security & Auth**: [JWT (jsonwebtoken)](https://jwt.io/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Environment**: [dotenv](https://github.com/motdotla/dotenv)

---

## 📁 Folder Structure

```text
notification-service/
├── src/
│   ├── config/
│   │   └── db.ts                   # MongoDB connection logic
│   ├── controllers/
│   │   ├── auth.controller.ts      # Authentication handlers (register, login, me)
│   │   └── notification.controller.ts # Notification CRUD handlers
│   ├── middleware/
│   │   ├── auth.middleware.ts      # JWT verification middleware
│   │   └── error.middleware.ts     # Global error handling middleware
│   ├── models/
│   │   ├── User.ts                 # Mongoose User model
│   │   └── Notification.ts         # Mongoose Notification model
│   ├── routes/
│   │   ├── auth.routes.ts          # Auth route endpoints
│   │   └── notification.routes.ts  # Notification route endpoints
│   ├── utils/
│   │   └── jwt.ts                  # JWT sign & verify utilities
│   ├── app.ts                      # Express app configuration
│   └── server.ts                   # Application entry point
├── .env.example                    # Sample environment variables
├── .gitignore                      # Git ignored files
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on default port `27017`

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root folder based on `.env.example`:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notification_service
JWT_SECRET=your_super_secret_jwt_key
```

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Runs the server in development mode with hot reloading |
| `npm run build` | Compiles TypeScript code to `./dist` |
| `npm start` | Runs the compiled production code from `./dist` |

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### 🔑 Authentication

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login user & obtain JWT | ❌ |
| `GET` | `/auth/me` | Fetch logged-in user profile | 🔒 Bearer |

### 🔔 Notifications

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/notifications` | Create a new notification (`EMAIL` \| `IN_APP`) | 🔒 Bearer |
| `GET` | `/notifications` | Get all notifications for current user | 🔒 Bearer |
| `GET` | `/notifications/:id` | Get single notification by ID | 🔒 Bearer |
| `PATCH` | `/notifications/:id/read` | Mark a notification as read | 🔒 Bearer |
| `DELETE` | `/notifications/:id` | Delete a notification | 🔒 Bearer |

---

## 🧪 Request & Response Examples

### Register User
**Request:**
`POST /api/auth/register`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "mypassword123"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "670f5e1f0e21a8a9c3d4e5f6",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-09-28T14:20:00.000Z",
      "updatedAt": "2026-09-28T14:20:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Create Notification
**Header:** `Authorization: Bearer <token>`  
**Request:**
`POST /api/notifications`
```json
{
  "title": "Order Shipped",
  "message": "Your package is on its way!",
  "type": "IN_APP"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Notification created successfully",
  "data": {
    "notification": {
      "_id": "670f5e420e21a8a9c3d4e5f8",
      "user": "670f5e1f0e21a8a9c3d4e5f6",
      "title": "Order Shipped",
      "message": "Your package is on its way!",
      "type": "IN_APP",
      "isRead": false,
      "createdAt": "2026-09-28T14:22:00.000Z",
      "updatedAt": "2026-09-28T14:22:00.000Z"
    }
  }
}
```

---

### Standard Error Response Example
If input is invalid or a notification is not found:
```json
{
  "success": false,
  "message": "Notification not found"
}
```

---

## 🔒 Security & Data Privacy

- Passwords are encrypted using **bcrypt** (salt rounds = 10).
- Passwords are removed from responses by default.
- Users can only access notifications linked to their own account.
- Centralized error handler protects internal stack traces from leaking.
