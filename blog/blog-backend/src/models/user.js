// jwt를 사용한 인증 시스템 모델 user
import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt' // 비밀번호를 단방향 해싱 함수로 사용하기 위한 bcrypt 라이브러리
import jwt from 'jsonwebtoken'

// User 스키마
const UserSchema = new Schema({
    username : String,
    hashedPassword : String,
});
    
    // 모델 메소드 : 인스턴스 메서드
// 모델을 통해 만든 문서의 인스턴스로 사용할 수 있는 함수
// 방식 : 모델인스턴스.method.메소드이름 = 함수
UserSchema.methods.setPassword = async function(password){
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
}

UserSchema.methods.checkPassword = async function(password){
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result; // t & f
}

// 모델 메서드 : 스태틱 메서드
// 모델에서 바로 사용할 수 있는 함수
// 방식 : 모델인스턴스.static.메서드이름 = 함수
UserSchema.statics.findByUsername = function(username){
    return this.findOne({username})
}

// ? 인스턴스와 스태틱의 차이점은 무엇일까?


// serialize : 직렬화? / 회원가입 후 비밀번호를 삭제
UserSchema.methods.serialize = function(){
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
}

// 토큰 발급
UserSchema.methods.generateToken = function(){
    const token = jwt.sign(
        { // 토큰 안에 들어가는 데이터
            _id : this.id,
            username : this.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn : '7d' // 유효기간 7일
        }
    );
    return token;
}

const User = mongoose.model('User', UserSchema);
export default User;
