# 배재대학교 중고경매장터

___

Node.js의 프레임워크 Express.js와 MongoDB를 이용해 만든 경매 시스템입니다.

실행버전은 http://pacific-peak-44361.herokuapp.com/ 에서 확인하실 수 있습니다.

___

## 구성

___

이 앱은 Express.js의 핵심 기능들을 알아보는 것에 중점을 둡니다. 

따라서 실사용시에는 좀 더 세부적인 기능들을 다듬은 후 사용할 예정입니다.

### 구조

- Node_modules - 의존성 모듈이 설치되어 있는 곳입니다.
- Public - 정적 요소들을 모아놓은 곳입니다. 아이콘, 클라이언트의 Javascript, Css 등이 있습니다.
- Routes - 라우터를 모듈로서 작성한 곳입니다.
- Schema - Mongoose의 연결과 컬렉션 형태를 지정해놓은 곳입니다.
- Views - 라우팅에 대해 렌더링 할 파일들을 모아놓은 곳입니다.
- .env - 보안을 위해 환경변수를 지정하는 곳입니다. app.js에서 dotenv로 접근합니다.
- app.js - 서버가 실행되는 곳입니다. 각종 모듈들을 등록하여 사용하고, 각종 설정을 하는 곳입니다.
- checkUser.js - Passport모듈을 통해 User가 로그인이 되어있는지 판단하는 미들웨어입니다.
- Package.json - 패키지를 관리하는 곳입니다.

___

### 주요 기능

___

- 로컬 로그인/로그아웃 

  Passport모듈로 구현하였습니다. 로그인을 수행하기 위해 데이터베이스에 User스키마를 만든 후 'loginId'필드와 'password'필드의 대조를 통해 구현하였습니다.

```javascript
passport.serializeUser((user, done) => {
  done(null, user.loginId);
});

passport.deserializeUser((loginId, done) => {
  User.findOne({'loginId': loginId}, (err, user) => {
    done(err, user);
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
```

- 채팅

  Socket.io + mongoose를 통해 구현하였습니다.

  우선, Room컬렉션에서 User가 속해있는 채팅방을 렌더링한 후, 해당 채팅방의 id값을 파라미터로 받아 해당 라우팅을 실행합니다.

  ```javascript
  router.get('/:id', isLoggedIn, async(req, res, next) => {
    try{
      const result = await Chat.find({
        roomId: req.params.id
      }).sort('createdAt');
      res.render('chat', {user: req.user, result: result, roomId: req.params.id});
    }catch(err){
      console.error(err);
      next(err);
    }
  ```

  이어서 GET요청으로 채팅방에 입장하게 되면 Socket.io를 통해 통신하고 채팅 이벤트가 발생할 때 마다 Chat컬렉션에 저장합니다.

- 결제

  국내 PG결제 연동을 쉽게해주는 결제 API서비스인 아임포트를 통해 구현하였습니다.

  ```javascript
  IMP.request_pay{
    ...parameters
  }, function(rsp){
    if(rsp.success){
      Ajax로 서버에 Post요청을 보내 데이터베이스 업데이트
    }else{
      에러내용
    }
  }
  ```

- CRUD

  CRUD 각 기능 별 설명이 적힌 현 앱의 요소는 다음과 같습니다.

  1) Create - 물품 등록, 경매가 끝나면 완료 물품 등록, 

  

