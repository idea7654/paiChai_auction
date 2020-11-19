const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection(process.env.MONGO_URI);

autoIncrement.initialize(connection);

const alarmSchema = new mongoose.Schema({
  id: Number,
  content: String,
  owner: String,
  read: Boolean
}, {
  timestamps: true
});

alarmSchema.plugin(autoIncrement.plugin, {
  model: 'alarm',
  field: 'id',
  startAt: 1,
  increment: 1
});

const Alarm = connection.model('alarm', alarmSchema);

module.exports = mongoose.model('Alarm', alarmSchema);
