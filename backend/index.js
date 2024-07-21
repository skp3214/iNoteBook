const connectToMongo = require('./db.js');
connectToMongo();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors({
    origin: '*', // Allow requests from all origins
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'A server error occurred' });
});

app.listen(port, () => {
    console.log(`iNotebook backend app listening at http://localhost:${port}`);
});
