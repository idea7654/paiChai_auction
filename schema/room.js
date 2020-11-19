const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection(process.env.MONGO_URI);

autoIncrement.initialize(connection);

const roomSchema = new mongoose.Schema({
  id: Number,
  title: String,
  owner: String,
  nowowner: String,
  finalprice: Number
}, {
  timestamps: true
});

roomSchema.plugin(autoIncrement.plugin, {
  model: 'room',
  field: 'id',
  startAt: 1,
  increment: 1
});

const Product = connection.model('room', roomSchema);

module.exports = mongoose.model('Room', roomSchema);
