const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  // The user who will RECEIVE the notification
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // The message, e.g., "Bob just joined your cohort!"
  message: {
    type: String,
    required: true
  },
  
  // A link to make the notification clickable
  // e.g., "/cohort/690e123c8bd4d27970b8f92d"
  link: {
    type: String,
    default: '/dashboard'
  },
  
  // To track if the user has seen it
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds "createdAt"
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;