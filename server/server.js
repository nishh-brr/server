const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json()); // VERY IMPORTANT (for req.body)
app.use(express.urlencoded({ extended: true }));

// ✅ CORS (allow React frontend)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    time: new Date()
  });
});

// ❌ Optional root route (to avoid "Cannot GET /")
app.get('/', (req, res) => {
  res.send("API is running...");
});

// ✅ MongoDB connection + server start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });