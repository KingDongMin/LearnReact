
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx,next)=>{
  console.log(ctx.url);
  console.log(1);
  if( ctx.query.authorized !== '1'){
    ctx.status = 401; // Unauthorized
    return;
  }
  await next();
  console.log('END')
  
})

app.use((ctx,next)=>{
  console.log(2);
  next();
})


app.use(ctx => { // 미들웨어 함수를 애플리케이션에 등록하는 .use , 안에 들어있는 arrow func이 미들웨어 함수
  ctx.body = 'Hello World';
});

app.listen(4000, ()=>{
    console.log("Listening to port 4000");
})