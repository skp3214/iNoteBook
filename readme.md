# 📝 iNotebook - Modern AI-Powered Note Management Application

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-blue?style=for-the-badge&logo=vercel)](https://inotebook-live.vercel.app/)
[![API](https://img.shields.io/badge/API-View%20Docs-green?style=for-the-badge&logo=swagger)](https://inotebook-api.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/skp3214/inotebook?style=for-the-badge&logo=github)](https://github.com/skp3214/inotebook)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

*A full-stack intelligent note management application built with the MERN stack, featuring AI-powered assistance, advanced tag management, dark mode, offline support, and modern glassmorphism UI.*

</div>

<img width="3087" height="1743" alt="image" src="https://github.com/user-attachments/assets/867d93e6-107d-4c20-94b3-973007f558ae" />


## 🚀 Overview

iNotebook is a next-generation note management application that combines traditional note-taking with cutting-edge AI technology. Built with a completely decoupled architecture, it showcases modern web development practices while providing an intuitive, feature-rich experience for users to manage their digital notes efficiently.



https://github.com/user-attachments/assets/e08d49a7-bc7f-43e6-87a3-3f56f9650d5e



## 🌟 Latest Features & Updates

### 🎤 Speech Recognition Feature
- **Voice-to-Text Conversion** - Convert spoken words directly into note content
- **Real-time Speech Processing** - Live transcription with instant feedback
- **Multi-language Support** - Support for multiple languages and accents
- **Voice Commands** - Control note operations using voice commands
- **Hands-free Note Taking** - Create and edit notes without typing

### 🤖 AI-Powered Note Assistant
- **Natural Language Processing** - Interact with your notes using conversational AI
- **Smart CRUD Operations** - Create, read, update, and delete notes through AI chat
- **Intelligent Search** - AI-powered note discovery and content analysis
- **Google Gemini Integration** - Powered by Google's advanced AI technology

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
- **Responsive Animations** - Smooth transitions and micro-interactions
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
- **Web Speech API** - For speech recognition capabilities

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
   MONGODB_URI=mongodb://localhost:27017/inotebook
   PORT=5000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3000
   FRONTEND_URL=http://localhost:3000
   ACCESS_TOKEN_SECRET=replace_with_strong_access_secret
   REFRESH_TOKEN_SECRET=replace_with_strong_refresh_secret
   JWT_SECRET=replace_with_legacy_jwt_secret
   GOOGLE_AI_API_KEY=replace_with_google_ai_api_key
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_gmail_app_password
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
