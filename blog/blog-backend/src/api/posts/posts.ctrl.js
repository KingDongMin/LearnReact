import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next)=>{
    const {id} = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        return;
    }
    return next();
}

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
    });

    try {
        await post.save();
        ctx.body = post;

        
    } catch (error) {
        ctx.throw(500, error);

    }
};

// 데이터 조회
export const list = async (ctx) =>{
    try {
        const posts = await Post.find().exec();
        ctx.body = posts;

    } catch (error) {
        ctx.throw(500,error);
    }
}

// 특정 데이터 조회
export const read = async ctx =>{
    const {id} = ctx.params
    try{
        const post = await Post.findById(id).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;

    }catch(error){
        ctx.throw(500,error);
    }
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