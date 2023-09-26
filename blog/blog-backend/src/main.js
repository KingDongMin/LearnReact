require('dotenv').config(); 
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser'); // Request의 body에 JSON형태로 데이터를 넣어 주는 패키지
const mongoose = require('mongoose');

const {PORT, MONGO_URI} = process.env;

mongoose
.connect(MONGO_URI)
.then(()=>{
  console.log("Connected to MongoDB")
})
.catch(e=>{
  console.log(e);
});


// 라우터 가져오기
const api = require('./api')

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우터 적용

// 라우터 적용 전에 bodyParser를 적용해야 한다. 왜?
app.use(bodyParser());


// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, ()=>{
    console.log("Listening to port %d", port);
})

