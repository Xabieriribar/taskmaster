# TaskMaster - Project Management Application

A full-stack project management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication (register, login, profile management)
- Project management (create, read, update, delete)
- Task management within projects
- Dashboard with statistics and recent activities
- Responsive design for all screen sizes

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/taskmaster.git
cd taskmaster
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Configuration

1. Server Configuration:
   - Copy `.env.example` to `.env` in the server directory
   - Update the environment variables:
     ```
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     CLIENT_URL=http://localhost:3000
     ```

2. Client Configuration:
   - Copy `.env.example` to `.env` in the client directory
   - Update the environment variables:
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```

## Running the Application

1. Start the server:
```bash
cd server
npm start
```

2. In a new terminal, start the client:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Project Endpoints

- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create a new project
- GET `/api/projects/:id` - Get project by ID
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### Task Endpoints

- GET `/api/projects/:id/tasks` - Get all tasks for a project
- POST `/api/projects/:id/tasks` - Create a new task
- PUT `/api/projects/:id/tasks/:taskId` - Update task
- DELETE `/api/projects/:id/tasks/:taskId` - Delete task

## Security

- JWT authentication
- Password hashing
- CORS protection
- Environment variables for sensitive data
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 