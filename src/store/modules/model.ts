import { defineStore } from 'pinia';

const models:any = {
  'n1': 'models/n1.glb',
  'n2': 'models/n2.glb'
}

/**
 * 模型加载页面
 */
const useModel = defineStore({
  id: 'modelShow',
  state: () => ({
    url: <string>(models['n1']) // 地址
  }),
  getters: {
    models():any  {
      return models;
    }
  },
  actions: {
    changeModel(key:any):void {
      this.url = models[key];
    }
  }
});
export default useModel;