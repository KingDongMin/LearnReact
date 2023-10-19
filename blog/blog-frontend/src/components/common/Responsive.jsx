import styled from 'styled-components';


const ResponsiveBlock = styled.div`
    padding-left : 1rem;
    padding-right : 1rem;
    width : 1024px;
    margin : 0 auto;

    @media (max-width : 1024px){
        width : 768px;
    }

    @media (max-width : 768px){
        width : 100%
    }
`;

// 반응형



const Responsive = ({children, ...rest}) => {
  // ...rest = style, className, onClick, onMouseMove등 여러가지를 props로 쓰기 위한 것
    return (
    <ResponsiveBlock {...rest}>
        {children}
    </ResponsiveBlock>
    )
}

export default Responsive