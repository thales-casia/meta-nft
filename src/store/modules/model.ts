import { defineStore } from 'pinia';
import previewS1 from '@/assets/images/s1.png';
import previewS2 from '@/assets/images/s2.png';
import bg from '@/assets/images/universe.jpg';

const models:any = [
  {
    preview: previewS1,
    url: 'models/S1.glb'
  },
  {
    preview: previewS2,
    url: 'models/S2.glb'
  },
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
      // return this.backgrounds[this.backgroundsKey].url;
      // return 'backgrounds/universe.jpg';
      return bg;
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
    changeModel(key:any):void {
      this.modelsKey = key;
    },
    changeBackground(key:any):void {
      this.backgroundsKey = key;
    }
  }
});
export default useModel;