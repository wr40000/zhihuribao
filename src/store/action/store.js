import * as TYPES from "../action-types";
import api from "../../api/index";

const storeAction = {
  // 异步获取收藏列表
  async queryStoreListAsync() {
    let list = null;
    try {
      let { code, data } = await api.storeList();
      if (+code === 0) {
        list = data;
      }
    } catch (_) {}
    return {
      type: TYPES.STORE_LIST,
      list,
    };
  },
  //   清空收藏列表
  clearStoreList() {
    return {
      type: TYPES.STORE_LIST,
      list: null,
    };
  },
  //   清除某一项收藏
  removeStoreListById(id){
    return {
        type: TYPES.STORE_REMOVE,
        id
    }
  }
};
export default storeAction;
