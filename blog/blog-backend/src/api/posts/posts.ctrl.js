import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

// 작성자만이 포스트 수정 삭제 구현 -> 위 작업을 미들웨어로 처리하기 위해 id로 포스트 조회하는 작업도 미들웨어로 변경
// export const checkObjectId = (ctx, next)=>{
//     const {id} = ctx.params;
//     if(!ObjectId.isValid(id)){
//         ctx.status = 400;
//         return;
//     }
//     return next();
// }
export const getPostById = async (ctx, next)=>{
    const {id} = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        return;
    }
    try {
        const post = await Post.findById(id);
        // 포스트가 존재하지 않으면 에러
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.state.post = post;
        return next();
    } catch (error) {
        ctx.throw(500, error);
    }
};

/**
 * POST / api / posts
 * {
 *  title : 제목,
 *  body : 내용,
 *  tags : [ 태그1 , 태그2 ]
 * 
 * }
 */
export const write = async ctx =>{
    
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        body:Joi.string().required(),
        tags : Joi.array()
        .items(Joi.string())
        .required(),
    })

    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const {title, body, tags } = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
        user: ctx.state.user // 사용자 정보 추가 ( 로그인 후 )
    });

    try {
        await post.save();
        ctx.body = post;

        
    } catch (error) {
        ctx.throw(500, error);

    }
};

// 데이터 조회
// GET / api / posts ? username=  & tag=   & page=
// 특정 사용자가 작성한 포스트만 조회 및 특정 태그를 포함한 포스트만 조회하는 기능 구현
export const list = async (ctx) =>{
    const page = parseInt(ctx.query.page || '1' , 10);

    if( page < 1){
        ctx.status = 400;
        return;
    }

    // 특정 태그나 특정 사용자 검색
    const {tag, username } = ctx.query;
    // tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
    const query = {
        ...(username ? {'username' : username } : {}),
        ...(tag ? {tags : tag } : {}),
    }

    try {
        const posts = await Post.find(query)
        .sort({ _id : -1})
        .limit(10)
        .skip((page - 1 ) * 10)
        .exec();

        const postCount = await Post.countDocuments(query).exec();
        ctx.set('Last-page', Math.ceil(postCount / 10));

        ctx.body = posts
        .map(post => post.toJSON())
        .map(post=> ({
            ...post,
            body : post.body.length < 3 ? post.body : `${post.body.slice(0,3)}...`
        }));

    } catch (error) {
        ctx.throw(500,error);
    }
}

// 특정 데이터 조회
// export const read = async ctx =>{
//     const {id} = ctx.params
//     try{
//         const post = await Post.findById(id).exec();
//         if(!post){
//             ctx.status = 404;
//             return;
//         }
//         ctx.body = post;

//     }catch(error){
//         ctx.throw(500,error);
//     }
// }
// id로 포스트 찾는 코드를 간소화
export const read = ctx => {
    ctx.body = ctx.state.post
}

// 해당 id 삭제
export const remove = async ctx => {
    const {id} = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204 // 성공했지만 응답데이터 없음을 의미
    } catch (error) {
        ctx.throw(500, error)
    }
}

// 업데이트
export const update = async ctx => {
    const {id} = ctx.params;

    const schema = Joi.object().keys({
        title : Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
    })

    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true,
            // true는 업데이트된 데이터, false는 업데이트 전 데이터
        }).exec();

        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (error) {
        ctx.throw(500, error)
    }
}


// checkOwnPost : id로 찾은 포스트가 로그인 중인 사용자가 작성한 포스트인지 확인
export const checkOwnPost = (ctx, next)=>{
    const {user, post } = ctx.state;
    if(post.user._id.toString() !== user._id ){
        ctx.status = 403;
        return;
    }
    return next();
}