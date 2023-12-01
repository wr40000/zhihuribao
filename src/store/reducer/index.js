import { combineReducers} from 'redux'
import baseReducer from './base'
import storeReducer from './store'

// 合并reducer
const reducer = combineReducers({
    base: baseReducer,  // 个人信息
    store: storeReducer // 收藏
})

export default reducer;