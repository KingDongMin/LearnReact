import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import WriteActionButtons from '../../components/write/WriteActionButtons';
import { writePost } from '../../modules/write';


const WriteActionButtonsContainer = () =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {title, body, tags, post, postError} = useSelector(({write})=>({
        title: write.title,
        body:write.body,
        tags:write.tags,
        post:write.post,
        postError : write.postError,
    }))

    //포스트 등록
    const onPublish = () => {
        dispatch(
            writePost({
                title,
                body,
                tags
            })
        )
    }

    // 취소
    const onCancel = ()=>{
        navigate(-1);
    }

    //성공 혹은 실패
    useEffect(()=>{
        if(post){
            const {_id, user} = post;
            console.log('페이지 이동')
            navigate(`/${user.username}/${_id}`);
        }
        if(postError){
            console.log(postError);
        }
    }, [navigate, post, postError]);
    
    return <WriteActionButtons onPublish={onPublish} onCancel={onCancel}></WriteActionButtons>
}

export default WriteActionButtonsContainer