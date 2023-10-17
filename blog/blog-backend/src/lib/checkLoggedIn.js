// 로그인했을 때만 API를 사용할 수 있게 하기
// 이 미들웨어는 다른 곳에서도 쓸 수 있기에 미들웨어로 작성
const checkLoggedIn = (ctx, next) =>{
    if(!ctx.state.user){ // 로그인 상태가 아니라면 에러
        ctx.status = 401; // Unauthorized
        return;
    }
    return next();
};

export default checkLoggedIn;