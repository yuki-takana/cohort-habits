const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    default: '',
    maxlength: 200
  },
  profilePicture: {
    type: String,
    default: ''
  },
  interests: {
    type: [String],
    default: []
  },

  
  age: {
    type: String, // <-- THIS IS THE FIX (was 'Number')
    trim: true
  },
  gender: {
    type: String,
    trim: true
  },
  occupation: {
    type: String,
    trim: true
  }
  // --- END OF NEW FIELDS ---

}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;