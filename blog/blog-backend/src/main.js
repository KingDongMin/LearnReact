require('dotenv').config(); 
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';


const {PORT, MONGO_URI} = process.env;

mongoose
.connect(MONGO_URI)
.then(()=>{
  console.log("Connected to MongoDB");

})
.catch(e=>{
  console.log(e);
});

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우터 적용

// 라우터 적용 전에 bodyParser를 적용해야 한다. 왜?
app.use(bodyParser());
app.use(jwtMiddleware); // jwt는 router 전에 할당

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, ()=>{
    console.log("Listening to port %d", port);
})

