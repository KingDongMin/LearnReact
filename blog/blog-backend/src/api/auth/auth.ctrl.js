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
        
        
    } catch (error) {
        ctx.throw(500, error)
    }

}

// 로그인
export const login = async ctx =>{

}

// 로그인 상태 확인
export const check = async ctx=>{

}

// 로그아웃
export const logout = async ctx=>{

}