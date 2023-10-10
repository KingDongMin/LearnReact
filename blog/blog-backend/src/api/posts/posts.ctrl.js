import Post from '../../models/post';


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
    const { title, body, tags } = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
    });
    try {
        await post.save();
        ctx.body = post;
    } catch (error) {
        ctx.throw(500, error)
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

// export const read = ctx =>{}

// export const remove = ctx => {}

// export const update = ctx => {}