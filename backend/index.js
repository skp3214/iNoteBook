const connectToMongo = require('./db.js');
connectToMongo();
const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Enable this if you need to send cookies or authorization headers
    allowedHeaders: 'Content-Type, Authorization',
    optionsSuccessStatus: 204
}));

app.use(express.json());

// Handle preflight requests
app.options('*', cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
    console.log(`inotebbok backend app listening at http://localhost:${port}`);
});
