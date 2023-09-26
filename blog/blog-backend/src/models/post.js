import mongoose from 'mongoose';

const {Schema} = mongoose;

const PostSchema = new Schema({
    type : String,
    body : String,
    tags : [String], //문자열로 이루어진 배열
    publishedDate : {
        type : Date,
        default : Date.now, // 현재 날짜 디폴트
    },
});

const Post = mongoose.model('Post', PostSchema);
export default Post;