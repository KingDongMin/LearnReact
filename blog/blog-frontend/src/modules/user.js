import createRequestSaga, { createRequestActionTypes } from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth'
import {takeLatest, call} from 'redux-saga/effects';
import { createAction, handleActions } from 'redux-actions';

// 새로고침 이후 임시 로그인 처리
const TEMP_SET_USER = 'user/TEMP_SET_USER';

//회원 정보 확인
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes(
    'user/CHECK'
);

//로그아웃 
const LOGOUT = 'user/LOGOUT';

export const tempSetUser = createAction(TEMP_SET_USER, user => user);
export const check = createAction(CHECK);
export const logout = createAction(LOGOUT);

const checkSaga = createRequestSaga(CHECK, authAPI.check );

function checkFailuerSaga(){
    try {
        localStorage.removeItem('user'); // localStorage에서 user제거
    } catch (error) {
        console.log('localStorage is not working')
    }
}

function* logoutSaga(){
    try {
        yield call(authAPI.logout); // API 호출
        localStorage.removeItem('user')// localStorage에서 user삭제
    } catch (error) {
        console.log(error);
    }
}

export function* userSaga(){
    yield takeLatest(CHECK, checkSaga);
    yield takeLatest(CHECK_FAILURE, checkFailuerSaga)
    yield takeLatest(LOGOUT, logoutSaga)
}

const initialState = {
    user : null,
    checkError: null,
}

export default handleActions(
    {
        [TEMP_SET_USER] : (state, {payload : user})=>({
            ...state,
            user,
        }),
        [CHECK_SUCCESS] : (state, {payload : user})=>({
            ...state,
            user,
            checkError: null,
        }),
        [CHECK_FAILURE]: ( state, {payload : error})=>({
            ...state,
            user:null,
            checkError: error
        }),
        [LOGOUT] : state => ({
            ...state,
            user:null,
        })
    },
    initialState
)