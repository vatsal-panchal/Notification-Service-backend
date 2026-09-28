# Notification Service Backend

A simple, robust Notification Service backend built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication**: User registration, login, and profile fetching with bcrypt password hashing and JWT authentication.
- **Notifications**: Create, retrieve, mark as read, and delete notifications.
- **Authorization**: Strict data isolation ensuring users can only create, view, update, and delete their own notifications.
- **Validation**: Input validation for all authentication and notification endpoints with clear 400 responses.
- **Error Handling**: Centralized error-handling middleware returning structured, consistent JSON error responses.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB & Mongoose
- JWT (`jsonwebtoken`)
- bcrypt
- dotenv

## Folder Structure

```text
src/
  config/
    db.ts
  controllers/
    auth.controller.ts
    notification.controller.ts
  middleware/
    auth.middleware.ts
    error.middleware.ts
  models/
    User.ts
    Notification.ts
  routes/
    auth.routes.ts
    notification.routes.ts
  utils/
    jwt.ts
  app.ts
  server.ts
```

## Local MongoDB Setup

Ensure MongoDB is installed and running locally on your machine at port 27017:

- Connection string: `mongodb://127.0.0.1:27017/notification_service`

To start MongoDB locally (depending on your OS):
- On Windows (Service): Start the MongoDB service from Services or run `mongod`.
- On Linux / macOS: `sudo systemctl start mongod` or `brew services start mongodb/brew/mongodb-community`.

## Installation

1. Clone or open the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## .env Setup

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Contents of `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notification_service
JWT_SECRET=your_secret_here
```

## npm Commands

- Run in development mode (with hot reloading via `ts-node-dev`):
  ```bash
  npm run dev
  ```
- Build TypeScript to JavaScript:
  ```bash
  npm run build
  ```
- Start production build:
  ```bash
  npm start
  ```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user and receive JWT | No |
| `GET` | `/api/auth/me` | Get current user's profile | Yes (Bearer Token) |

### Notification Routes

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/notifications` | Create a new notification | Yes (Bearer Token) |
| `GET` | `/api/notifications` | Get all notifications for current user | Yes (Bearer Token) |
| `GET` | `/api/notifications/:id` | Get notification by ID | Yes (Bearer Token) |
| `PATCH` | `/api/notifications/:id/read` | Mark notification as read | Yes (Bearer Token) |
| `DELETE` | `/api/notifications/:id` | Delete notification | Yes (Bearer Token) |

---

## Example Request Bodies & Responses

### 1. Register User
`POST /api/auth/register`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secretpassword"
}
```

Response (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65f02bc14a9c13b2c1a8e901",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-09-28T14:15:00.000Z",
      "updatedAt": "2026-09-28T14:15:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User
`POST /api/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "secretpassword"
}
```

Response (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65f02bc14a9c13b2c1a8e901",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-09-28T14:15:00.000Z",
      "updatedAt": "2026-09-28T14:15:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User Profile
`GET /api/auth/me`

Headers:
```text
Authorization: Bearer <token>
```

Response (`200 OK`):
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "65f02bc14a9c13b2c1a8e901",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-09-28T14:15:00.000Z",
      "updatedAt": "2026-09-28T14:15:00.000Z"
    }
  }
}
```

### 4. Create Notification
`POST /api/notifications`

Headers:
```text
Authorization: Bearer <token>
```

Request Body:
```json
{
  "title": "Welcome Email",
  "message": "Welcome to our notification service!",
  "type": "EMAIL"
}
```
*(type must be `EMAIL` or `IN_APP`)*

Response (`201 Created`):
```json
{
  "success": true,
  "message": "Notification created successfully",
  "data": {
    "notification": {
      "_id": "65f02c404a9c13b2c1a8e905",
      "user": "65f02bc14a9c13b2c1a8e901",
      "title": "Welcome Email",
      "message": "Welcome to our notification service!",
      "type": "EMAIL",
      "isRead": false,
      "createdAt": "2026-09-28T14:16:00.000Z",
      "updatedAt": "2026-09-28T14:16:00.000Z"
    }
  }
}
```

### 5. Get All Notifications
`GET /api/notifications`

Headers:
```text
Authorization: Bearer <token>
```

Response (`200 OK`):
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "_id": "65f02c404a9c13b2c1a8e905",
        "user": "65f02bc14a9c13b2c1a8e901",
        "title": "Welcome Email",
        "message": "Welcome to our notification service!",
        "type": "EMAIL",
        "isRead": false,
        "createdAt": "2026-09-28T14:16:00.000Z",
        "updatedAt": "2026-09-28T14:16:00.000Z"
      }
    ]
  }
}
```

### 6. Get Notification by ID
`GET /api/notifications/:id`

Headers:
```text
Authorization: Bearer <token>
```

Response (`200 OK`):
```json
{
  "success": true,
  "message": "Notification retrieved successfully",
  "data": {
    "notification": {
      "_id": "65f02c404a9c13b2c1a8e905",
      "user": "65f02bc14a9c13b2c1a8e901",
      "title": "Welcome Email",
      "message": "Welcome to our notification service!",
      "type": "EMAIL",
      "isRead": false,
      "createdAt": "2026-09-28T14:16:00.000Z",
      "updatedAt": "2026-09-28T14:16:00.000Z"
    }
  }
}
```

### 7. Mark Notification as Read
`PATCH /api/notifications/:id/read`

Headers:
```text
Authorization: Bearer <token>
```

Response (`200 OK`):
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "notification": {
      "_id": "65f02c404a9c13b2c1a8e905",
      "user": "65f02bc14a9c13b2c1a8e901",
      "title": "Welcome Email",
      "message": "Welcome to our notification service!",
      "type": "EMAIL",
      "isRead": true,
      "createdAt": "2026-09-28T14:16:00.000Z",
      "updatedAt": "2026-09-28T14:17:00.000Z"
    }
  }
}
```

### 8. Delete Notification
`DELETE /api/notifications/:id`

Headers:
```text
Authorization: Bearer <token>
```

Response (`200 OK`):
```json
{
  "success": true,
  "message": "Notification deleted successfully",
  "data": null
}
```
