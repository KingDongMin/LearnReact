import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeField, initializeForm, register } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import {check} from "../../modules/user"
import {useNavigate} from 'react-router-dom'

const RegisterForm = () => {
    const dispatch = useDispatch();
    const {form, auth, authError, user} = useSelector(({auth, user})=>({
        form : auth.register,
        auth: auth.auth,
        authError: auth.authError,
        user: user.user
    }))

    // 인풋 변경 이벤트 핸들러
    const onChange = e =>{
        const { value, name } = e.target;
        dispatch(
            changeField({
                form: 'register',
                key: name,
                value
            })
        )
    }

    // 폼 등록 이벤트 핸들러
    const onSubmit = e =>{
        e.preventDefault();
        const { username, password, passwordConfirm} = form;
        if(password !== passwordConfirm){
            return;
        }
        dispatch(register({username, password}))
    }

    // 컴포넌트 첫 렌더링 시 form 초기화
    useEffect(() => {
        dispatch(initializeForm('register'))
    }, [dispatch])

    // 회원가입 성공 실패
    useEffect(() => {
        if(authError){
            console.log("오류 발생");
            console.log(authError)
            return;
        }
        if(auth){
            console.log("회원가입 성공")
            console.log(auth)
            dispatch(check())
        }
    }, [auth, authError, dispatch])

    const navigate = useNavigate();
    // user 값 확인
    useEffect(()=>{
        if(user){
            console.log('check API 성공')
            console.log(user)
            navigate('/')
        }
    },[navigate, user])

  return (
    <AuthForm
        type="register"
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
    />
  )
}

export default RegisterForm