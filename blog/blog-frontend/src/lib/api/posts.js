import client from './client';

export const writePost = ({title, body, tags})=> client.post('/api/posts', {title, body, tags});

// 포스트 읽기
export const readPost=(id)=>client.get(`/api/posts/${id}`)

//포스트 리스트 
export const listPosts = ({page, username, tag})=>{
    return client.get(`/api/posts`,{
        params:{page, username, tag}
    })
}

// 포스트 수정
export const updatePost = ({id, title, body, tags}) => 
    client.patch(`api/posts/${id}`,{
        title,
        body,
        tags
    })


// 포스트 삭제
export const removePost = id => client.delete(`/api/posts/${id}`);