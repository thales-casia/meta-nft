import { models } from '@/utils';
import { defineStore } from 'pinia';


/**
 * 模型加载页面
 */
const useModel = defineStore({
  id: 'modelShow',
  state: () => ({
    modelUrl: models[0].url,
    modelsKey: 0,
    backgroundsKey: 0
  }),
  getters: {
    url():string {
      return models[this.modelsKey].url;
    },
    backgroundUrl():string {
      // return this.backgrounds[this.backgroundsKey].url;
      return 'backgrounds/universe.jpg';
    },
    backgrounds():any {
      const arr = new Array(8);
      for(let n = 0; n < 8; n++) {
        const url = `backgrounds/${n}.jpg`;
        arr[n] = {url};
      }
      return arr;
    },
    models():any  {
      return models;
    }
  },
  actions: {
    setModelUrl(id:any):void {
      this.modelUrl = `models/${id}.glb`;
    },
    changeModel(key:any):void {
      this.modelsKey = key;
    },
    changeBackground(key:any):void {
      this.backgroundsKey = key;
    }
  }
});
export default useModel;