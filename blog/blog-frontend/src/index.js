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

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>
  
);

reportWebVitals();
