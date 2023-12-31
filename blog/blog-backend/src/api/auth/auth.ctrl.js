// 회원 인증 API
import Joi from 'joi';
import User from '../../models/user';


/** POST / api / auth / register
 * 
 * 데이터 구조
 * {
 *  username : 'kim',
 *  password : '123444aadf'
 * 
 * }
 * 
 */


// 회원 가입
export const register = async ctx=>{
    
    // 회원가입 시 전송된 Request Body 검증
    const schema = Joi.object().keys({
        username : Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        password : Joi.string().required(),
    })
    const result = schema.validate(ctx.request.body);

    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return
    }

    // 검증 후 DB에 회원 정보 입력
    const { username , password } =ctx.request.body;
    try {
        // 이미 존재하는 아이디인지 확인
        const exists = await User.findByUsername(username)
        if(exists){
            ctx.status = 409 // conflict : 충돌
            return;
        }

        const user = new User({
            username,
        });
        await user.setPassword(password);
        await user.save(); // DB에 저장

        // 응답할 데이터에서 hashedPassword제거
        // const data = user.toJSON()
        // delete data.hashedPassword;
        // ctx.body = data;
        // !! serialize로 대처
        ctx.body = user.serialize();
        
        // 토큰을 쿠키에 담는 방식
        const token = user.generateToken();
        ctx.cookies.set('access_token',token, {
            maxAge : 1000 * 60 * 60 * 24 * 7, // 7일
            httpOnly : true, // js로 쿠키를 조회할 수 없도록 하는 설정
        });
        
    } catch (error) {
        ctx.throw(500, error)
    }

}

// 로그인
export const login = async ctx =>{
    const {username, password } = ctx.request.body;
    
    // 아이디와 패스워드가 없다면 에러
    if( !username || !password){
        ctx.status = 401 // Unauthorized
        return;
    }

    try {
        const user = await User.findByUsername(username); // 계정 확인
        // 계정이 없다면 에러 출력
        if(!user){
            ctx.status = 401;
            return;
        }

        // 비밀번호 확인
        const vaild = await user.checkPassword(password);
        if(!vaild){
            ctx.status = 401;
            return;
        }

        ctx.body = user.serialize(); // 비번을 지운채 응답

        // 토큰을 쿠키에 담기
        const token = user.generateToken();
        ctx.cookies.set('access_token',token,{
            maxAge : 1000 * 60 * 60 * 24 * 7,
            httpOnly : true
        });
    } catch (error) {
        ctx.throw(500, error)
    }
}

// 로그인 상태 확인
export const check = async ctx=>{
    const {user} = ctx.state;
    if(!user){
        // 로그인 중이 아님
        ctx.status = 401; // Unauthorized
        return;
    }
    ctx.body = user;
}

// 로그아웃 : 토큰을 지우면 로그아웃 완성
export const logout = async ctx=>{
    ctx.cookies.set('access_token');
    ctx.status = 204; // no content
}