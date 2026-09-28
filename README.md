# Notification Service Backend

A simple, lightweight, and robust Notification Service REST API built with Node.js, Express, TypeScript, and MongoDB.

---

## Features

- **Authentication**: Register, login, and fetch user profile with bcrypt password hashing and JWT.
- **Notifications CRUD**: Create, read, mark as read, and delete notifications.
- **Strict Authorization**: Users can only create, view, update, and delete their own notifications.
- **Input Validation**: Request validation for all inputs with descriptive 400 Bad Request messages.
- **Centralized Error Handling**: Unified and consistent JSON response structure across the application.
- **Clean TypeScript Architecture**: Strongly-typed code without over-engineering or unnecessary abstractions.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB via Mongoose
- **Security and Auth**: JWT (jsonwebtoken), bcrypt
- **Configuration**: dotenv

---

## Folder Structure

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
│   │   └── jwt.ts                  # JWT sign and verify utilities
│   ├── app.ts                      # Express app configuration
│   └── server.ts                   # Application entry point
├── .env.example                    # Sample environment variables
├── .gitignore                      # Git ignored files
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB installed and running locally on port 27017

### 2. Installation
Clone or open the repository, then install dependencies:
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
JWT_SECRET=your_secret_here
```

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Runs the server in development mode with hot reloading |
| `npm run build` | Compiles TypeScript code to `./dist` |
| `npm start` | Runs the compiled production code from `./dist` |

---

## API Reference

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user and receive JWT | No |
| GET | `/api/auth/me` | Fetch logged-in user profile | Yes (Bearer Token) |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/notifications` | Create a notification (EMAIL or IN_APP) | Yes (Bearer Token) |
| GET | `/api/notifications` | Get all notifications for current user | Yes (Bearer Token) |
| GET | `/api/notifications/:id` | Get single notification by ID | Yes (Bearer Token) |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read | Yes (Bearer Token) |
| DELETE | `/api/notifications/:id` | Delete a notification | Yes (Bearer Token) |

---

## Request and Response Examples

### Register User
Endpoint: `POST /api/auth/register`

Request Body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "mypassword123"
}
```

Response (`201 Created`):
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

### Login User
Endpoint: `POST /api/auth/login`

Request Body:
```json
{
  "email": "jane@example.com",
  "password": "mypassword123"
}
```

Response (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
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
Endpoint: `POST /api/notifications`  
Header: `Authorization: Bearer <token>`

Request Body:
```json
{
  "title": "Order Shipped",
  "message": "Your package is on its way",
  "type": "IN_APP"
}
```

Response (`201 Created`):
```json
{
  "success": true,
  "message": "Notification created successfully",
  "data": {
    "notification": {
      "_id": "670f5e420e21a8a9c3d4e5f8",
      "user": "670f5e1f0e21a8a9c3d4e5f6",
      "title": "Order Shipped",
      "message": "Your package is on its way",
      "type": "IN_APP",
      "isRead": false,
      "createdAt": "2026-09-28T14:22:00.000Z",
      "updatedAt": "2026-09-28T14:22:00.000Z"
    }
  }
}
```

---

### Standard Error Response
When input validation fails or a resource is not found:
```json
{
  "success": false,
  "message": "Notification not found"
}
```

---

## Security and Data Isolation

- Passwords are hashed using bcrypt with 10 salt rounds.
- Passwords are automatically excluded from API responses.
- All notification operations enforce ownership checks based on the authenticated user ID.
- Centralized error handler prevents stack trace leakage in API responses.
