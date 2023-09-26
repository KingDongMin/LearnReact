let postId = 1; // id 초기값

// posts 배열 초기 데이터
const posts = [
    {id : 1, title: '제목', body : '내용'},
];

/** 포스트 작성
 * POST/api/posts
 * { title, body }
 */
export const write = ctx =>{
    // REST API의 Request Body는 ctx.request.body에서 조회 가능
    const { title, body } = ctx.request.body;
    postId += 1;
    const post = { id : postId, title:title, body:body};
    posts.push(post);
    ctx.body = post;
};

/** 포스트 목록 조회
 * GET / api / posts
 */
export const list = ctx =>{
    ctx.body = posts;
}

/** 특정 포스트 조회
 * GET / api / posts / :id
 */
export const read = ctx =>{
    const {id} = ctx.params;
    // 주어진 id로 포스트 찾기
    // id를 비교하기 위해 문자열로 변환
    const post = posts.find(p=> p.id.toString() === id);

    // 찾고자 하는 포스트가 없다면 오류 반환
    if(!post){
        ctx.status = 404;
        ctx.body={
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }
    ctx.body = post;
}

/** 특정 포스트 제거
 * DELETE / api / posts / :id
 */
export const remove = ctx => {
    const { id } = ctx.params;
    
    // 해당 포스트 인덱스를 찾기 -> 추후 slice하기 위해
    const index = posts.findIndex(p=>p.id.toString() === id);
    
    // 찾고자 하는 포스트가 없다면 오류 반환
    if(index === -1 ){
        ctx.status = 404;
        ctx.body = {
            message : '포스트가 존재하지 않습니다.'
        };
        return;
    }
    // index번째 포스트 제거
    posts.slice(index, 1)
    ctx.status = 204 ; // not content
}

/** 포스트 수정 및 교체 
 * PUT / api / posts / :id
 * { title, body }
*/
export const replace = ctx => {
    // PUT메서드는 전체 포스트를 통째로 교체할때 사용
    const {id} = ctx.params;
    // 해당 id를 가진 포스트 인덱스 조회
    const index = posts.findIndex(p=> p.id.toString() === id)
    if( index === -1){
        ctx.status = 404;
        ctx.body = {
            message : '포스트가 존재하지 않습니다.'
        }
        return;
    }
    // 전체 객체를 덮어 씌움 
    posts[index] = {
        id,
        ...ctx.request.body,
    };
    ctx.body = posts[index];
};

/** 특정 포스트 수정 
 * PATCH / api / posts / :id
 * { title , body }
 */
export const update = ctx => {
    const {id} = ctx.params;
    const index = posts.findIndex(p=>p.id.toString() === id);
    if(index === -1){
        ctx.status = 404;
        ctx.body = {
            message : '포스트가 존재하지 않습니다.'
        }
        return;
    }
    
    posts[index] = {
        ...posts[index],
        ...ctx.request.body,
    };
    ctx.body = posts[index];

}