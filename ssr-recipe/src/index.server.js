import ReactDOMServer from 'react-dom/server';

const html = ReactDOMServer.renderToString(
    <div>Hello Server Side Rendering!!</div>
);

console.log(html);

/**
 * [ 서버 사이드 렌더링용 엔트리 ]
 * - 웹팩이 이 파일을 시작으로 웹 애플리케이션의 모든 파일(모듈)들을 찾아 합침(번들링) -> 빌드
 * - 리엑트의 기존 CSR방식에서 벗어나기 위해 SSR방식의 엔트리 파일이 필요함
 * - 서버에서 리엑트 컴포넌트를 렌더링하려면 ReactDOMServer의 renderToString함수가 필요.
 * - 이 함수 안에서 JSx를 넣고 호출하면 결과는 문자열로 반환 -> 이 문자열이 html파일이 된다???
 */