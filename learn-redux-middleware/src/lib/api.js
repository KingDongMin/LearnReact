// api 호출 부분을 함수화 하여 유지보수 향상
import axios from 'axios'

export const getPost = id =>
    axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)

export const getUsers = (id) =>
    axios.get(`https://jsonplaceholder.typicode.com/users`);