import styled from 'styled-components';
import Responsive from './Responsive';
import Button from './Button';
import {Link} from 'react-router-dom'


const HeaderBlock = styled.div`
    position : fixed;
    width : 100%;
    background: white;
    box-shadow: 0px 2px 4px rgba(0,0,0,0.08);
`;

// Responsive 컴포넌트의 속성에 style이란 props를 전달하여 새로운 컴포넌트 생성
const Wrapper = styled(Responsive)`
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo{
        font-size:1.125rem;
        font-weight:800;
        letter-spacing : 2px;
    }
    .right{
        display: flex;
        align-items: center;
    }
`

// Header가 fixed이기에 페이지의 콘텐츠를 4rem 아래로 나타나도록 하는 컴포넌트
const Spacer = styled.div`
    height: 4rem;
`

const Header = () => {
  return (
    <>
        <HeaderBlock>
            <Wrapper>
                <Link to="/" className="logo">REACTERS</Link>
                <div className='right'>
                    <Button to='/login'>로그인</Button>
                </div>
            </Wrapper>
        </HeaderBlock>
        <Spacer/>
    </>
    
    )
}

export default Header