import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeField, initializeForm, login } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { useNavigate } from'react-router-dom';
import {check} from '../../modules/user'

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {form, auth, authError, user} = useSelector(({auth,user})=>({
        form : auth.login,
        auth: auth.auth,
        authError : auth.authError,
        user: user.user
    }))

    // 인풋 변경 이벤트 핸들러
    const onChange = e =>{
        const { value, name } = e.target;
        dispatch(
            changeField({
                form: 'login',
                key: name,
                value
            })
        )
    }

    // 폼 등록 이벤트 핸들러
    const onSubmit = e =>{
        e.preventDefault();
        const { username, password } = form;
        dispatch(login({username, password}))
    }

    // 컴포넌트 첫 렌더링 시 form 초기화
    useEffect(() => {
        dispatch(initializeForm('login'))
    }, [dispatch])

    useEffect(()=>{
        if(authError){
            console.log("오류발생")
            console.log(authError)
            return;
        }
        if(auth){
            console.log('로그인 성공')
            dispatch(check());
        }
    },[auth, authError, dispatch])

    useEffect(()=>{
        if(user){
            navigate('/')
        }
    }, [navigate, user])

  return (
    <AuthForm
        type="login"
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
    />
  )
}

export default LoginForm