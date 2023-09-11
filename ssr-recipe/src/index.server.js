import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter} from 'react-router-dom/server';
import App from './App';
import path from 'path';
import fs from 'fs';

// 3.  css js를 응답하기 위한 코드?
// asset-mainfest.json에서 파일 경로들을 조회
const manifest = JSON.parse(
    fs.readFileSync(path.resolve('./build/asset-manifest.json'),'utf8')
);

function createPage(root){
    return `<!DOCTYPE html>
    <html lang= "en">
        <head>
            <meta charset="utf-8"/>
            <link rel="shortcut icon" href="/favicon.ico"/>
            <meta
                name="viewport"
                content="width=device-width,initial-scale=1, shrink-to-fit=no"
            />
            <meta name="theme-color" content="#000000"/>
            <title>React App</title>
            <link href="${manifest.files['main.css']}" rel="stylesheet" />
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">${root}</div>
            <script src="${manifest.files['main.js']}"></script>
        </body>
    </html>;
    `
}


// 2. [ 서버 코드 ]
const app = express();

// 서버 사이드 렌더링을 처리할 핸들링 함수
const serverRender = (req, res, next) => {
    // 이 함수는 404가 떠야하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해줌

    const context = {};
    const jsx= (
        <StaticRouter location={req.url} context={context}>
            <App/>
        </StaticRouter>
    );
    const root = ReactDOMServer.renderToString(jsx);//렌더링 하고
    res.send(createPage(root)); // 클라이언트에게 결과물을 응답

}

const serve = express.static(path.resolve('./build'), {
    index : false // '/'경로에서 index.html을 보여주지 않도록 설정
});


// 순서가 중요 serverRender전에 위치 -> 왜?
app.use(serve)
app.use(serverRender);

// 5000포트로 서버를 가동
app.listen(5000, ()=>{
    console.log('Running on http://localhost:5000');
})


// 1. [ 서버 사이드 렌더링용 엔트리 ]
// const html = ReactDOMServer.renderToString(
//     <div>Hello Server Side Rendering!!</div>
// );

// console.log(html);

/**
 * [ 서버 사이드 렌더링용 엔트리 ]
 * - 웹팩이 이 파일을 시작으로 웹 애플리케이션의 모든 파일(모듈)들을 찾아 합침(번들링) -> 빌드
 * - 리엑트의 기존 CSR방식에서 벗어나기 위해 SSR방식의 엔트리 파일이 필요함
 * - 서버에서 리엑트 컴포넌트를 렌더링하려면 ReactDOMServer의 renderToString함수가 필요.
 * - 이 함수 안에서 JSx를 넣고 호출하면 결과는 문자열로 반환 -> 이 문자열이 html파일이 된다???
 */