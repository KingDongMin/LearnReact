import styled from 'styled-components';

// 회원가입 및 로그인 페이지 레이아웃 컴포넌트

const AuthTemplateBlock = styled.div``;

const AuthTemplate = ({children}) => {
  return (
    <AuthTemplateBlock>
    {children}
    </AuthTemplateBlock>
    )
}

export default AuthTemplate