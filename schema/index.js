const mongoose = require('mongoose');
const MONGO_URL = `mongodb://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@localhost:27017/admin`;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

module.exports = () => {
  function connect() {
    let connection = mongoose.connect(MONGO_URL, {
      dbName: 'auction',
    }, (error) => {
      if (error) {
        console.log('몽고디비 연결 에러', error);
      } else {
        console.log('몽고디비 연결 성공');
      }
    });
  }
  connect();

  mongoose.connection.on('disconnected', connect);

  require('./user.js');
  require('./product.js');
  require('./finishproduct.js');
  require('./room.js');
  require('./chat.js');
  require('./announce.js');
  require('./alarm.js');
};
