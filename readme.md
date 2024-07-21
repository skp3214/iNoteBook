# 📝 𝐈𝐧𝐭𝐫𝐨𝐝𝐮𝐜𝐢𝐧𝐠 𝐢𝐍𝐨𝐭𝐞𝐛𝐨𝐨𝐤 - 𝐀 𝐌𝐄𝐑𝐍 𝐒𝐭𝐚𝐜𝐤 𝐏𝐫𝐨𝐣𝐞𝐜𝐭! 📝

> - I'm excited to my latest project, iNotebook. What sets iNotebook apart is its distinctive approach - the backend and frontend are developed and deployed separately, providing enhanced flexibility and efficiency.

> - 🌐 The backend, crafted with precision using the MEN (MongoDB, Express.js and Node.js) stack, is designed to seamlessly handle data operations, ensuring a robust foundation for our application.

https://github.com/user-attachments/assets/afa0ee96-9d1d-4a46-b459-b64ad3e5dcdb



### 🌐𝙞𝙉𝙤𝙩𝙚𝘽𝙤𝙤𝙠 𝘼𝙥𝙞: [https://inotebook-api.vercel.app](https://inotebook-api.vercel.app)

> 🚀 On the frontend, we've harnessed the power of React to deliver a dynamic and user-friendly interface. But here's the twist - the frontend communicates with the backend through a set of APIs, creating a 
    decoupled architecture that amplifies scalability and maintainability.

### ✈️𝑳𝒊𝒗𝒆 𝑾𝒆𝒃𝒔𝒊𝒕𝒆: [https://inotebook-live.vercel.app](https://inotebook-live.vercel.app/)


#### 📑 Features that make iNotebook shine:
    - ✨ Add notes effortlessly with title, description, and tags.
    - 🔄 Your password is saved with hashing
    - 🚀 Deployed backend API for enhanced performance.

#### 👩‍💻 Dive into the world of iNotebook:

> - 🚀I made this project from CodeWithHarry youtube channel.This project is the best approach to understand software development,from this project you can learn how backend and frontend works.

> - In this project there is still stuffs left for improvement.


## Project Structure

```
INOTEBOOK
├── backend
│   ├── controller
│   ├── dao
│   ├── middleware
│   ├── models
│   ├── node_modules
│   ├── routes
│   ├── services
│   ├── .gitignore
│   ├── db.js
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   └── vercel.json
├── frontend
│   ├── node_modules
│   ├── public
│   └── src
│       ├── components
│       ├── context
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Backend

The backend is built with Node.js and Express.js. It includes the following directories:

- `controller`: Contains the controller logic for handling requests.
- `dao`: Data Access Object layer for interacting with the database.
- `middleware`: Custom middleware for handling various tasks such as authentication.
- `models`: Mongoose models for the database.
- `routes`: Route definitions for the API.
- `services`: Service layer for business logic.

### Setting Up the Backend

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/skp3214/inotebook.git
   cd inotebook/backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Server**:
   ```bash
   npm start
   ```
   The backend server will start on `http://localhost:5000`.

## Frontend

The frontend is built with React.js and is located in the `frontend` directory. It includes the following subdirectories:

- `components`: Contains reusable React components.
- `context`: Context API for state management.

### Setting Up the Frontend

1. **Navigate to the Frontend Directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Frontend**:
   ```bash
   npm start
   ```
   The frontend server will start on `http://localhost:3000`.

## Usage

1. **Sign Up / Login**:
   Users need to sign up or log in to use the application.

2. **Manage Notes**:
   Users can create, view, update, and delete notes.



## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any changes.

