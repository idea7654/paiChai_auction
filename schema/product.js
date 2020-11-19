const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection(`mongodb://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@localhost:27017/admin`);

autoIncrement.initialize(connection);

const productSchema = new mongoose.Schema({
  id: Number,
  category: String,
  title: String,
  owner: String,
  nowowner: String,
  finaltime: {
    type: Date,
    default: Date.now() + 24*60*60*1000
  },
  nowprice: Number,
  onceprice: Number,
  image: String,
}, {
  timestamps: true
});

productSchema.plugin(autoIncrement.plugin, {
  model: 'product',
  field: 'id',
  startAt: 1,
  increment: 1
});

const Product = connection.model('product', productSchema);

module.exports = mongoose.model('Product', productSchema);
