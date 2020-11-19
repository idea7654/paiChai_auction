const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  loginId: Number,
  password: String
});
module.exports = mongoose.model('User', userSchema);
