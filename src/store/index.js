import { createStore, applyMiddleware } from 'redux'
import reduxLogger from 'redux-logger'
import reduxThunk from 'redux-thunk'
import reduxPromise from 'redux-promise'
import reducer from './reducer/index'

let middleware = [reduxThunk, reduxPromise];
let env = process.env.NODE_ENV;
if(env === 'development'){
    middleware.push(reduxLogger);
}

// 创建store容器
const store = createStore(
    reducer,
    applyMiddleware(...middleware)
);

export default store;