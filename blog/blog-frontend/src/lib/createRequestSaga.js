import {call, put} from 'redux-saga/effects'
import { startLoading, finishLoading } from '../modules/loading'

// 액션타입 쉽게 만들기 ( 성공 실패 부분)
export const createRequestActionTypes = type =>{
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;
    return [type, SUCCESS, FAILURE];
}


export default function createRequestSaga(type, request){
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;

    return function*(action){
        yield put(startLoading(type));
        try {
            const response = yield call(request, action.payload);
            yield put({
                type: SUCCESS,
                payload: response.data,
                meta: response
            })
        } catch (error) {
            yield put({
                type:FAILURE,
                payload : error,
                error : true
            })
        }
        yield put(finishLoading(type))
    }

}