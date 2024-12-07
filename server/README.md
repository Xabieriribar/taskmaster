# TaskMaster API Server

This is the backend server for the TaskMaster application, a professional task management system built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Project management (CRUD operations)
- Task management within projects
- Task filtering and sorting
- Input validation and error handling
- Security best practices implementation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Setup Instructions

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration values.

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Projects
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create new project
- GET `/api/projects/:id` - Get single project
- PATCH `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### Tasks
- GET `/api/tasks?project=:projectId` - Get tasks (with optional filters)
- POST `/api/tasks` - Create new task
- PATCH `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Frontend application URL (for CORS)

## Testing

Run the test suite:
```bash
npm test
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation and sanitization
- MongoDB injection prevention
- CORS protection
- Rate limiting (in production)

## Production Deployment

1. Set environment variables for production
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 