const express    = require('express');
const session    = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose   = require('mongoose');
const path       = require('path');
const authRoutes = require('./routes/auth');

const app = express();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔧 ONLY EDIT THIS SECTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MONGO_URI      = 'mongodb+srv://nishigandhi_db:password@cluster7.e7gijkh.mongodb.net/loginapp';
const SESSION_SECRET = 'pick-any-long-random-string-here-123!@#';
const PORT           = 3000;
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅  MongoDB connected — reading from loginapp → users'))
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    console.error('    → Check your MONGO_URI in server.js');
    process.exit(1);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sessions stored in MongoDB
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: false,              // set true if using HTTPS
    maxAge: 1000 * 60 * 60 * 8 // 8 hours
  }
}));

// Auth routes
app.use('/api/auth', authRoutes);

// Root — redirect logged-in users straight to dashboard
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Protected dashboard
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/');
}

app.listen(PORT, () => {
  console.log(`🚀  Server running → http://localhost:${PORT}`);
  console.log(`🔐  To encrypt passwords run: node hashpasswords.js`);
});
