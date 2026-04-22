// const admin = require('firebase-admin');
// const serviceAccount = require('../firebase_key.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;
const admin = require('firebase-admin');
const serviceAccount = require('../firebase_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;

