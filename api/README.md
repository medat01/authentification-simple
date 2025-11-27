# Authentication API

RESTful API for user authentication built with Express.js, MySQL, and JWT.

## Features

- User registration with email and password
- User login with JWT token generation
- User profile retrieval
- Password hashing with bcrypt
- Input validation
- Error handling middleware
- CORS support for mobile app
- JWT-based authentication

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Navigate to the API directory:
```bash
cd api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=auth_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

5. Create the MySQL database:
```sql
CREATE DATABASE auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. The database schema will be automatically created when you start the server.

## Running the API

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
  - Body: `{ "email": "user@example.com", "password": "password123", "full_name": "John Doe" }`
  - Returns: JWT token and user data

- `POST /auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: JWT token and user data

- `POST /auth/logout` - Logout user
  - Returns: Success message

### User Profile

- `GET /users/me` - Get current user profile (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Returns: User profile data

- `PUT /users/me` - Update user profile (optional)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "full_name": "New Name", "email": "newemail@example.com" }`

- `PATCH /users/password` - Change password (optional)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "current_password": "oldpass", "new_password": "newpass123" }`

## Testing

Run tests:
```bash
npm test
```

The test suite includes:
- User registration (success and failure cases)
- User login (success and failure cases)
- Protected route access (with and without token)

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens expire after 24 hours
- Input validation on all endpoints
- SQL injection protection via parameterized queries
- CORS configured for mobile app origin
- Error messages don't expose sensitive information

## Database Schema

```sql
users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Architecture

- **Routes**: `/routes/auth.js` and `/routes/users.js`
- **Middleware**: Authentication (`/middleware/auth.js`) and error handling (`/middleware/errorHandler.js`)
- **Database**: MySQL connection pool (`/config/database.js`)
- **Validation**: express-validator for input validation

## Technical Choices

### JWT Authentication
- Stateless authentication suitable for mobile apps
- Token expiration set to 24 hours
- Token stored client-side (mobile app)

### Password Security
- bcrypt with 10 salt rounds
- Minimum password length: 8 characters
- Passwords never logged or returned in responses

### Error Handling
- Centralized error handling middleware
- Consistent error response format
- Proper HTTP status codes

## Limitations and Future Improvements

- No token refresh mechanism (tokens expire after 24h)
- No rate limiting (could be added for production)
- No email verification
- No password reset functionality
- No token blacklisting (logout is client-side only)
- Could add role-based access control
- Could implement refresh tokens for better UX

