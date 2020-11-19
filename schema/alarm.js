const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection("mongodb://root:osm980811@localhost:27017/admin");

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
