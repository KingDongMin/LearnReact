// jwt를 사용한 인증 시스템 모델 user
import mongoose, {Schema} from 'mongoose';

// User 스키마
const UserSchema = new Schema({
    username : String,
    hashedPassword : String
});

const User = mongoose.model('User', UserSchema);
export default User;
