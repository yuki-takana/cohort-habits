// 1. Import required packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // This loads the .env file

// 2. Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Apply middleware
app.use(cors());
app.use(express.json());

// 4. Connect to MongoDB
const uri = process.env.MONGO_URI; // Get the connection string

// --- NEW SAFETY CHECK ---
// Check if the MONGO_URI is loaded
if (!uri) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  console.error("Please check your .env file in the /server folder.");
  process.exit(1); // Stop the app
}
// --- END SAFETY CHECK ---

console.log("Attempting to connect to MongoDB..."); // Added for clarity

// Connect to the database
mongoose.connect(uri);

const connection = mongoose.connection;

// Log a success message once connected
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// --- NEW ERROR HANDLER ---
// Log an error if the connection fails
connection.on('error', (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Stop the app
});
// --- END ERROR HANDLER ---


// 5. Create a simple "Hello World" route
app.get('/', (req, res) => {
  res.send('Hello from the Cohort Habits server!');
});

// --- NEW: Define API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cohorts', require('./routes/cohorts'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard')); // <-- THIS IS THE NEW LINE
// --- END API Routes ---


// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});