import React from 'react';
import { Suspense, useState } from 'react';
import './App.css';
import loadable from '@loadable/component';


// const SplitMe = React.lazy(()=> import('./SplitMe')); // React.lazy : 비동기 import
const SplitMe = loadable(()=>import('./SplitMe'),{fallback : <div>loading...</div>});

function App() {
  const [visible, setVisible] = useState(false);
  const onClick = ()=>{
    // import('./notify').then(result=>result.default()); // 코드 스플리팅 예시 1
    setVisible(true)
  }

  const onMouseOver = ()=>{
    SplitMe.preload(); // preload : 미리 파일을 불러옴
  }

  return (
    <div className="App">
      <p onClick={onClick} onMouseOver={onMouseOver}>Hellow React!!</p>
      {/* Suspense : 코드 스플리팅된 컴포넌트 렌더링
      <Suspense fallback={<div>loading.....</div>}>
        {visible && <SplitMe/>}
      </Suspense>
       */}
      {visible && <SplitMe/>}
    </div>
  );
}

export default App;
