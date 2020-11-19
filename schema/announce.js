const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection(`mongodb://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@localhost:27017/admin`);

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
