const connectToMongo = require('./db.js');
connectToMongo();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Use CORS middleware
const allowedOrigins = ['http://localhost:3000', '*']; // Add your allowed origins here
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin, like mobile apps or curl requests
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization,authtoken',
    optionsSuccessStatus: 204
}));

app.use(express.json());

// Handle preflight requests
app.options('*', cors());

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/notes', require('./routes/notes.js'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'A server error occurred' });
});

app.listen(port, () => {
    console.log(`iNotebook backend app listening at http://localhost:${port}`);
});
