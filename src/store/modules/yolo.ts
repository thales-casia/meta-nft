import { defineStore } from 'pinia';

/**
 * yolo数据
 */
const useYolo= defineStore({
  id: 'Yolo',
  state: () => ({
    msg: <string>('') // 消息
  }),
  getters: {
    
  },
  actions: {
    
  }
});
export default useYolo;