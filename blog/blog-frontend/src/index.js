import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
import {createStore, applyMiddleware} from 'redux'
import rootReducer, {rootSaga} from './modules/index';
import { composeWithDevTools } from '@redux-devtools/extension';
import {Provider} from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { tempSetUser, check } from './modules/user';
import { HelmetProvider } from 'react-helmet-async'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));


// localStorage를 참고하여 로그인 상태 유지
function loadUser(){
  try {
    const user = localStorage.getItem('user');
    if(!user) return;
    store.dispatch(tempSetUser(JSON.parse(user)));
    store.dispatch(check());
  } catch (error) {
    console.log('localStorage is not working')
  }
}

sagaMiddleware.run(rootSaga);
loadUser();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>
  
);

reportWebVitals();
