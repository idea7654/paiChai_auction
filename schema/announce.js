const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection(process.env.MONGO_URI);

autoIncrement.initialize(connection);

const announceSchema = new mongoose.Schema({
  id: Number,
  title: String,
  contents: String
}, {
  timestamps: true
});

announceSchema.plugin(autoIncrement.plugin, {
  model: 'announce',
  field: 'id',
  startAt: 1,
  increment: 1
});

const Product = connection.model('announce', announceSchema);

module.exports = mongoose.model('Announce', announceSchema);
