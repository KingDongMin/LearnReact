import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeField, initializeForm, register } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import {check} from "../../modules/user"
import {useNavigate} from 'react-router-dom'

const RegisterForm = () => {
    const [error, setError] = useState(null);
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
        // 입력칸이 비어있다면
        if([username, password, passwordConfirm].includes('')){
            setError("빈칸을 입력하세요");
            return;
        }
        
        if(password !== passwordConfirm){
            setError('비밀번호가 일치하지 않습니다.');
            dispatch(changeField({form:'register', key:'password', value:''}));
            dispatch(changeField({form:'register', key:'passwordConfirm', value:''}))
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
            //이미 계정이 존재
            if( authError.response.status == 409){
                setError('이미 존재하는 계정명입니다.')
                return;
            }
            // 기타 원인
            setError('회원가입 실패')
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
            navigate('/')
            try {
                localStorage.setItem('user', JSON.stringify(user))
            } catch (error) {
                console.log('localStorage is not working')
            }
        }
    },[navigate, user])

  return (
    <AuthForm
        type="register"
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        error={error}
    />
  )
}

export default RegisterForm