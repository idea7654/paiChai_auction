const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./schema/index');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('./schema/user');
const Chat = require('./schema/chat');
const Alarm = require('./schema/alarm');
const Finishproduct = require('./schema/finishproduct');
const engine = require('ejs-locals');
const methodOverride = require('method-override');

const socket = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 3000;

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const productRouter = require('./routes/product');
const mypageRouter = require('./routes/mypage');
const subproductRouter = require('./routes/sub-product');
const signRouter = require('./routes/sign');
const chatRouter = require('./routes/chat');
const announceRouter = require('./routes/announce');
const subannounceRouter = require('./routes/sub-announce');
const categoryRouter = require('./routes/category');
const paymentsRouter = require('./routes/payments');
const alarmRouter = require('./routes/alarm');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

db();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
  secret:'asdjfakerhoajfd',
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 360000, httpOnly: true},
  rolling: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/product', productRouter);
app.use('/mypage', mypageRouter);
app.use('/sub-product', subproductRouter);
app.use('/sign', signRouter);
app.use('/chat', chatRouter);
app.use('/announce', announceRouter);
app.use('/sub-announce', subannounceRouter);
app.use('/category', categoryRouter);
app.use('/payments', paymentsRouter);
app.use('/alarm', alarmRouter);

app.engine('ejs', engine);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(port);

// iamport
app.post("/iamport-webhook", async(req, res) => {
  try{
    const {imp_uid, merchant_uid} = req.body;

    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: "0757516472583356", // REST API키
        imp_secret: "mMWWbKndtUZ06DpRTUHeedQWIQeVyoFVaBRmmezP9zQgdg87bPmp3dmM3AIBZnwaYowlD6bMG23Uib1u" // REST API Secret
      }
    });
    const { access_token } = getToken.data.response; // 인증 토큰

    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/+\${imp_uid}\ `, // imp_uid 전달
      method: "get", // GET method
      headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
    });

    const paymentData = getPaymentData.data.response; // 조회한 결제 정보

    const order = await Finishproduct.findById(paymentData.merchant_uid);
    const amountToBePaid = order.finalprice; // 결제 되어야 하는 금액

    // 결제 검증하기
    const { amount, status } = paymentData;
    if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      await Finishproduct.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
      switch (status) {
        case "ready": // 가상계좌 발급
          // DB에 가상계좌 발급 정보 저장
          //const { vbank_num, vbank_date, vbank_name } = paymentData;
          //await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});
          // 가상계좌 발급 안내 문자메시지 발송
          //SMS.send({ text: \`가상계좌 발급이 성공되었습니다. 계좌 정보 \${vbank_num} \${vbank_date} \${vbank_name}\ `});
          //res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
          console.log('가상계좌 발급 성공');
          break;
        case "paid": // 결제 완료
          //res.send({ status: "success", message: "일반 결제 성공" });
          console.log('일반 결제 성공');
          break;
      }
      await Finishproduct.findOneAndUpdate({
        id: id
      }, {
        pay: true
      });
      res.redirect('/');
    } else { // 결제 금액 불일치. 위/변조 된 결제
      throw { status: "forgery", message: "위조된 결제시도" };
    }
  }catch(err){
    console.log(err);
    res.status(400).send(err);
  }
})

//passport config

passport.serializeUser((user, done) => {
  done(null, user.loginId);
});

passport.deserializeUser((loginId, done) => {
  User.findOne({'loginId': loginId}, (err, user) => {
    done(err, user);
  });
});

passport.use('local', new LocalStrategy({
  usernameField: 'loginId',
  passwordField: 'password'
  },
  async(loginId, password, done) => {
    try{
      const exUser = await User.findOne({"loginId": loginId});
      if(exUser){
        const result = await exUser.password == password;
        if(result){
          done(null, exUser);
        }else{
          done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
        }
      }else{
        done(null, false, {message: '가입되지 않는 회원입니다'});
      }
    }
    catch(err){
      console.log('여기 에러에용2');
      done(err);
    }
  })
);

//socket
const io = socket(server);

io.on('connection', (socket) => {
  console.log("a user connected");

  socket.on('sendUser', (data) => {
    const result =  Chat.create({
      roomId: data.roomId,
      chat: data.value,
      user: data.user
    });
    console.log(data.roomId);
    io.to(data.roomId).emit('sendUser', data);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    //socket.leave()
  });

  socket.on('sendRoom', (data) => {
    socket.join(data);
  });

  socket.on('layout', async(data) => {
    if(data !== undefined){
      const result = await Alarm.find().and([{
        owner: data
      }, {
        read: false
      }]);
      socket.emit('layout', result.length);
    }
  });
});
