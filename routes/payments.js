const express = require('express');
const router = express.Router();
const Finishproduct = require('../schema/finishproduct');
const Iamport = require('iamport');
const iamport = new Iamport({
  impKey: '0757516472583356',
  impSecret: 'mMWWbKndtUZ06DpRTUHeedQWIQeVyoFVaBRmmezP9zQgdg87bPmp3dmM3AIBZnwaYowlD6bMG23Uib1u'
});
const axios = require('axios');

router.get('/:id', async(req, res) => {
  try{
    const result = await Finishproduct.findOne({
      id: req.params.id
    });
    res.render('import', {result: result});
  }catch(err){
    res.status(400).send(err);
  }
});

router.get('/status/all', (req, res) => {
  iamport.payment.getByStatus({
    payment_status: 'paid'
  }).then(function(result){
    res.render('payments_list',{list:result.list});
  }).catch(function(error){
    console.log(error);
    red.send(error);
  });
});

router.post('/completes/:id', async(req, res, next) => {
  try{
      await Finishproduct.findOneAndUpdate({
        id: req.params.id
      }, {
        pay: true
      });
      res.redirect('/');
    // const { imp_uid, merchant_uid } = JSON.parse(JSON.stringify(req.body));
    //
    // const getToken = await axios({
    //     url: "https://api.iamport.kr/users/getToken",
    //     method: "post", // POST method
    //     headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    //     data: {
    //       imp_key: "0757516472583356", // REST API키
    //       imp_secret: "mMWWbKndtUZ06DpRTUHeedQWIQeVyoFVaBRmmezP9zQgdg87bPmp3dmM3AIBZnwaYowlD6bMG23Uib1u" // REST API Secret
    //     }
    // });
    //
    // const { access_token } = getToken.data.response; // 인증 토큰
    //
    // // imp_uid로 아임포트 서버에서 결제 정보 조회
    // const getPaymentData = await axios({
    //   url: `https://api.iamport.kr/payments/\${imp_uid}\ `, // imp_uid 전달
    //   method: "get", // GET method
    //   headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
    // });
    // const paymentData = getPaymentData.data.response; // 조회한 결제 정보
    //
    // // DB에서 결제되어야 하는 금액 조회
    // const order = await Finishproduct.findById(paymentData.merchant_uid);
    // const amountToBePaid = order.finalprice; // 결제 되어야 하는 금액
    // // 결제 검증하기
    // const { amount, status } = paymentData;
    // console.log(amount, amountToBePaid);
    // if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
    //   await Finishproduct.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
    //   switch (status) {
    //     case "ready": // 가상계좌 발급
    //       // DB에 가상계좌 발급 정보 저장
    //       //const { vbank_num, vbank_date, vbank_name } = paymentData;
    //       //await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});
    //       // 가상계좌 발급 안내 문자메시지 발송
    //       //SMS.send({ text: \`가상계좌 발급이 성공되었습니다. 계좌 정보 \${vbank_num} \${vbank_date} \${vbank_name}\`});
    //       //res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
    //       console.log('가상계좌 발급 성공');
    //       break;
    //     case "paid": // 결제 완료
    //       //res.send({ status: "success", message: "일반 결제 성공" });
    //
    //       console.log('일반 결제 성공');
    //       break;
    //   }
    //   await Finishproduct.findOneAndUpdate({
    //     id: req.params.id
    //   }, {
    //     pay: true
    //   });
    //   res.redirect('/');
    // } else { // 결제 금액 불일치. 위/변조 된 결제
    //   throw { status: "forgery", message: "위조된 결제시도" };
    // }
  }catch(err){
    console.log(err);
    next(err);
  }
})

module.exports = router;
