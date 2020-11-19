const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  roomId: Number,
  chat: String,
  user: String
}, {
  timestamps: true
});


module.exports = mongoose.model('Chat', chatSchema);
