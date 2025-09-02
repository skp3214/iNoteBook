# 📝 iNotebook - Modern AI-Powered Note Management Application

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-blue?style=for-the-badge&logo=vercel)](https://inotebook-live.vercel.app/)
[![API](https://img.shields.io/badge/API-View%20Docs-green?style=for-the-badge&logo=swagger)](https://inotebook-api.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/skp3214/inotebook?style=for-the-badge&logo=github)](https://github.com/skp3214/inotebook)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

*A full-stack intelligent note management application built with the MERN stack, featuring AI-powered assistance, advanced tag management, dark mode, offline support, and modern glassmorphism UI.*

</div>

## 🚀 Overview

iNotebook is a next-generation note management application that combines traditional note-taking with cutting-edge AI technology. Built with a completely decoupled architecture, it showcases modern web development practices while providing an intuitive, feature-rich experience for users to manage their digital notes efficiently.



https://github.com/user-attachments/assets/e08d49a7-bc7f-43e6-87a3-3f56f9650d5e



## 🌟 Latest Features & Updates

### 🤖 AI-Powered Note Assistant
- **Natural Language Processing** - Interact with your notes using conversational AI
- **Smart CRUD Operations** - Create, read, update, and delete notes through AI chat
- **Intelligent Search** - AI-powered note discovery and content analysis
- **Google Gemini Integration** - Powered by Google's advanced AI technology
- **Conversational Interface** - Chat-based UI with typing indicators and suggestions

### 🏷️ Advanced Tag Management System
- **Dynamic Tag Assignment** - Organize notes with customizable tags (Work, Urgent, Personal, Important, Completed)
- **Color-Coded Categories** - Visual tag system with predefined gradient colors
- **Smart Filtering** - Filter notes by tags with advanced search capabilities
- **Tag-Based Organization** - Hierarchical note organization with visual indicators

### 🌙 Dark Mode Support
- **Theme Toggle** - Seamless switching between light and dark modes
- **System Preference Detection** - Automatically adapts to OS theme settings
- **Persistent Theme** - Remembers user preference across sessions
- **Modern UI Consistency** - Cohesive design in both themes

### 📱 Offline Support
- **Offline Note Creation** - Create and edit notes without internet connection
- **Data Synchronization** - Automatic sync when connection is restored
- **Local Storage Management** - Efficient offline data persistence
- **Network Status Detection** - Smart handling of connectivity changes
- **Pending Actions Queue** - Manages offline operations for later sync

### ⚡ Enhanced User Experience
- **Loading Spinners** - Beautiful loading indicators for login/signup processes
- **Modern Glassmorphism UI** - Contemporary design with glass-like effects and gradients
- **Responsive Animations** - Smooth transitions and micro-interactions
- **Improved Performance** - Optimized rendering and state management
- **Advanced Search & Filter** - Powerful search functionality with real-time filtering

### ✨ Core Highlights

- **🔐 Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- **📱 Responsive Design** - Mobile-first approach with Bootstrap integration  
- **🌐 RESTful APIs** - Well-structured API endpoints with proper error handling
- **⚡ Real-time Updates** - Dynamic note management with instant UI updates
- **🛡️ Security First** - Environment-based configuration and security best practices
- **📊 Clean Architecture** - Separation of concerns with DAO, Service, and Controller layers

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library with hooks and context API
- **Bootstrap** - Responsive CSS framework
- **React Router** - Client-side routing
- **Context API** - State management
- **FontAwesome** - Icon library for modern UI
- **Service Workers** - For offline functionality

### Backend  
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt.js** - Password hashing library
- **Google Gemini AI** - AI-powered note assistance

### DevOps & Deployment
- **Vercel** - Frontend and backend deployment
- **Environment Variables** - Secure configuration management
- **Git** - Version control with proper .gitignore setup

## 📸 Screenshots

<div align="center">

<img width="2848" height="2927" alt="image" src="https://github.com/user-attachments/assets/198ec6a5-5ca5-47f8-9b70-c8d33f75ae72" />

<img width="2848" height="1603" alt="image" src="https://github.com/user-attachments/assets/2b4ef307-e439-4507-9565-df1a259f13ce" />


*Clean and intuitive user interface with modern glassmorphism design*

</div>

## 🏗️ Project Architecture

```
inotebook/
│
├── 🖥️ backend/                 # Node.js/Express API Server
│   ├── 🤖 ai-agent/            # AI-powered note assistant
│   ├── 🎯 controller/          # Request handlers & business logic
│   ├── 🗄️ dao/                 # Data Access Objects  
│   ├── 🔒 middleware/          # Authentication & validation
│   ├── 📋 models/              # MongoDB/Mongoose schemas
│   ├── 🛣️ routes/              # API route definitions (including AI routes)
│   ├── ⚙️ services/            # Business logic layer
│   ├── 🔧 .env                 # Environment variables
│   ├── 🌐 db.js                # Database connection
│   ├── 🚀 index.js             # Application entry point
│   └── 📦 package.json         # Dependencies & scripts
│
├── 🎨 frontend/                # React.js Client Application  
│   ├── 🧩 src/components/      # Reusable React components
│   │   ├── AiChat.js          # AI chat interface
│   │   ├── NotesItem.js       # Enhanced notes with tags
│   │   └── ModalForm.js       # Modern modal forms
│   ├── 🏪 src/context/         # Context API for state management
│   │   ├── notes/             # Notes context with offline support
│   │   └── theme/             # Theme context for dark mode
│   ├── 📄 src/pages/           # Application pages
│   │   ├── AiAssistant.js     # AI chat page
│   │   ├── Home.js            # Enhanced home with filters
│   │   ├── LoginForm.js       # Login with spinners
│   │   └── SignUpForm.js      # Signup with spinners
│   ├── 🔧 src/utils/           # Utility functions
│   │   ├── offlineUtils.js    # Offline functionality
│   │   └── sw.js              # Service worker
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
- **Google AI API Key** (for AI features)
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
   # Create .env file with the following configuration
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
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

# AI Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key

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
- `POST /api/auth/createuser` - User registration with spinner loading
- `POST /api/auth/login` - User login with spinner loading
- `POST /api/auth/getuser` - Get user profile (Protected)

### 📝 Notes Routes  
- `GET /api/notes/fetchallnotes` - Get all user notes with tags (Protected)
- `POST /api/notes/addnotes` - Create new note with tag assignment (Protected)
- `PUT /api/notes/updatenotes/:id` - Update existing note and tags (Protected)
- `DELETE /api/notes/deletenotes/:id` - Delete note (Protected)

### 🤖 AI Assistant Routes
- `POST /api/ai-agent/chat` - Chat with AI for note operations (Protected)

## 🎯 Features

### 👤 User Management
- **Secure Registration** - Email validation and password hashing with loading spinners
- **JWT Authentication** - Token-based session management
- **Protected Routes** - Middleware-based route protection
- **Enhanced UI** - Modern glassmorphism design with smooth animations

### 📝 Advanced Note Management
- **CRUD Operations** - Complete note lifecycle management
- **AI-Powered Operations** - Natural language note management
- **Tag System** - Organize notes with color-coded custom tags
- **Advanced Search & Filter** - Real-time search with tag-based filtering
- **Offline Support** - Create and manage notes without internet
- **Real-time Updates** - Instant UI synchronization

### 🎨 Modern User Interface
- **Glassmorphism Design** - Contemporary glass-like effects
- **Dark/Light Mode** - Theme switching with system preference detection
- **Responsive Design** - Mobile-friendly interface
- **Loading States** - Beautiful spinners and loading indicators
- **Smooth Animations** - Micro-interactions and transitions

### 🤖 AI Features
- **Conversational Interface** - Chat-based note management
- **Natural Language Processing** - Understand user intents
- **Smart Suggestions** - AI-powered note recommendations
- **Context Awareness** - Maintains conversation context

### 🛡️ Security Features
- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure stateless authentication
- **Environment Variables** - Sensitive data protection
- **CORS Configuration** - Cross-origin request security
- **Input Validation** - Server-side data validation

### 📱 Offline Capabilities
- **Local Storage** - Efficient offline data persistence
- **Sync Management** - Automatic synchronization when online
- **Network Detection** - Smart connectivity handling
- **Pending Actions** - Queue offline operations for later sync


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


## 🙏 Acknowledgments

- **CodeWithHarry** - Original inspiration and tutorial guidance
- **Google Gemini AI** - AI-powered note assistance
- **MongoDB** - Database technology
- **Vercel** - Hosting and deployment platform


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
