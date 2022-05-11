import { defineStore } from 'pinia';
import previewN1 from '@/assets/images/n1.png';
import previewN5 from '@/assets/images/n5.png';


const models:any = [
  {
    preview: previewN1,
    url: 'models/n1.glb'
  },
  {
    preview: previewN5,
    url: 'models/n5.glb'
  }
];

/**
 * 模型加载页面
 */
const useModel = defineStore({
  id: 'modelShow',
  state: () => ({
    modelsKey: 0,
    backgroundsKey: 0
  }),
  getters: {
    url():string {
      return models[this.modelsKey].url;
    },
    backgroundUrl():string {
      return this.backgrounds[this.backgroundsKey].url;
    },
    backgrounds():any {
      const arr = new Array(7);
      for(let n = 0; n < 7; n++) {
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
    changeModel(key:any):void {
      this.modelsKey = key;
    },
    changeBackground(key:any):void {
      this.backgroundsKey = key;
    }
  }
});
export default useModel;