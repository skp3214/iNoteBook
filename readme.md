# 📝 iNotebook - Modern Note Management Application

<div align="center">


[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-blue?style=for-the-badge&logo=vercel)](https://inotebook-live.vercel.app/)
[![API](https://img.shields.io/badge/API-View%20Docs-green?style=for-the-badge&logo=swagger)](https://inotebook-api.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/skp3214/inotebook?style=for-the-badge&logo=github)](https://github.com/skp3214/inotebook)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

*A full-stack note management application built with the MERN stack, featuring secure authentication, real-time updates, and a modern UI.*

</div>

## 🚀 Overview

iNotebook is a comprehensive note management application that demonstrates modern web development practices with a completely decoupled architecture. The application features separate backend and frontend deployments, showcasing scalable microservices architecture patterns.

https://github.com/user-attachments/assets/afa0ee96-9d1d-4a46-b459-b64ad3e5dcdb


### ✨ Key Highlights

- **🔐 Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- **📱 Responsive Design** - Mobile-first approach with Bootstrap integration  
- **🌐 RESTful APIs** - Well-structured API endpoints with proper error handling
- **� Real-time Updates** - Dynamic note management with instant UI updates
- **🛡️ Security First** - Environment-based configuration and security best practices
- **📊 Clean Architecture** - Separation of concerns with DAO, Service, and Controller layers

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library with hooks and context API
- **Bootstrap** - Responsive CSS framework
- **React Router** - Client-side routing
- **Context API** - State management

### Backend  
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt.js** - Password hashing library

### DevOps & Deployment
- **Vercel** - Frontend and backend deployment
- **Environment Variables** - Secure configuration management
- **Git** - Version control with proper .gitignore setup

## 📸 Screenshots

<div align="center">

![Application Interface](https://github.com/user-attachments/assets/ef627bcb-67ca-4261-8fd3-d41d6b43785b)

*Clean and intuitive user interface for seamless note management*

</div>

## 🏗️ Project Architecture

```
inotebook/
│
├── 🖥️ backend/                 # Node.js/Express API Server
│   ├── 🎯 controller/          # Request handlers & business logic
│   ├── 🗄️ dao/                 # Data Access Objects  
│   ├── 🔒 middleware/          # Authentication & validation
│   ├── 📋 models/              # MongoDB/Mongoose schemas
│   ├── 🛣️ routes/              # API route definitions
│   ├── ⚙️ services/            # Business logic layer
│   ├── 🔧 .env                 # Environment variables
│   ├── 🌐 db.js                # Database connection
│   ├── 🚀 index.js             # Application entry point
│   └── 📦 package.json         # Dependencies & scripts
│
├── 🎨 frontend/                # React.js Client Application  
│   ├── 🧩 src/components/      # Reusable React components
│   ├── 🏪 src/context/         # Context API for state management
│   ├── 🎭 public/              # Static assets
│   ├── 🔧 .env                 # Frontend environment variables
│   └── 📦 package.json         # Dependencies & scripts
│
└── 📖 README.md               # Project documentation
```

## ⚡ Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control

### 🔧 Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/skp3214/inotebook.git
   cd inotebook/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file from template
   cp .env.example .env
   
   # Edit .env with your configuration
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   🎉 Backend server running on `http://localhost:5000`

### 🎨 Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your configuration  
   REACT_APP_API_BASE_URL=http://localhost:5000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   🎉 Frontend application running on `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration  
PORT=5000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Frontend (.env)
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

## 📋 API Endpoints

### 🔐 Authentication Routes
- `POST /api/auth/createuser` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/getuser` - Get user profile (Protected)

### 📝 Notes Routes  
- `GET /api/notes/fetchallnotes` - Get all user notes (Protected)
- `POST /api/notes/addnotes` - Create new note (Protected)
- `PUT /api/notes/updatenotes/:id` - Update existing note (Protected)
- `DELETE /api/notes/deletenotes/:id` - Delete note (Protected)

## 🎯 Features

### 👤 User Management
- **Secure Registration** - Email validation and password hashing
- **JWT Authentication** - Token-based session management
- **Protected Routes** - Middleware-based route protection

### 📝 Note Management
- **CRUD Operations** - Complete note lifecycle management
- **Tag System** - Organize notes with custom tags
- **Real-time Updates** - Instant UI synchronization
- **Responsive Design** - Mobile-friendly interface

### 🛡️ Security Features
- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure stateless authentication
- **Environment Variables** - Sensitive data protection
- **CORS Configuration** - Cross-origin request security
- **Input Validation** - Server-side data validation

## 🚀 Deployment

### Backend (Vercel)
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
```

### Frontend (Vercel)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CodeWithHarry** - Original inspiration and tutorial guidance
- **MongoDB** - Database technology
- **Vercel** - Hosting and deployment platform
- **React Community** - Excellent documentation and support

## 📞 Contact & Support

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-skp3214-black?style=for-the-badge&logo=github)](https://github.com/skp3214)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/yourprofile)

**Found this project helpful? Give it a ⭐ on GitHub!**

</div>

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/skp3214">skp3214</a></p>
  <p>© 2025 iNotebook. All rights reserved.</p>
</div>

