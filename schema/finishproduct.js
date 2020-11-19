const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection(process.env.MONGO_URI);

autoIncrement.initialize(connection);

const finishproductSchema = new mongoose.Schema({
  id: Number,
  category: String,
  title: String,
  owner: String,
  nowowner: String,
  finalprice: Number,
  image: String,
  pay: Boolean
}, {
  timestamps: true
});

finishproductSchema.plugin(autoIncrement.plugin, {
  model: 'finishproduct',
  field: 'id',
  startAt: 1,
  increment: 1
});

const Product = connection.model('finishproduct', finishproductSchema);

module.exports = mongoose.model('Finishproduct', finishproductSchema);
