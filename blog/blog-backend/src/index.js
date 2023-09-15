const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser'); // Request의 body에 JSON형태로 데이터를 넣어 주는 패키지

// 라우터 가져오기
const api = require('./api')

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우터 적용

// 라우터 적용 전에 bodyParser를 적용해야 한다. 왜?
app.use(bodyParser());


router.get('/', ctx=>{
  ctx.body = '홈'
})

router.get('/about/:name?', ctx=>{
  const {name} = ctx.params; // 파라미터 조회
  ctx.body = name ? `${name}의 소개` : `그냥 소개`
});

router.get('/posts', ctx=>{
  const {id} = ctx.query;
  ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없음'
})

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, ()=>{
    console.log("Listening to port 4000");
})