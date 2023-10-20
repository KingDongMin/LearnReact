import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, { createRequestActionTypes } from '../lib/createRequestSaga';
import * as postsAPI from '../lib/api/posts'
import {takeLatest} from 'redux-saga/effects'

// 액션
const [LIST_POST, LIST_POST_SUCCESS, LIST_POST_FAILURE] = createRequestActionTypes('posts/LIST_POSTS');

//액션 생성 함수
export const listPosts = createAction(
    LIST_POST,
    ({tag,username,page})=>({tag, username, page})
)

// 사가
const listPostSaga = createRequestSaga(LIST_POST, postsAPI.listPosts )
export function* postsSaga(){
    yield takeLatest(LIST_POST, listPostSaga)
}

// 초기 상태
const initialState={
    posts:null,
    error:null,
    lastPage:1
}

const posts = handleActions(
    {
        [LIST_POST_SUCCESS] : (state, {payload : posts, meta : response})=>({
            ...state,
            posts,
            lastPage : parseInt(response.headers['last-page'], 10)// 문자열을 숫자로 변환
        }),
        [LIST_POST_FAILURE] : (state, {payload:error})=>({
            ...state,
            error,
        })
    },
    initialState
)

export default posts;