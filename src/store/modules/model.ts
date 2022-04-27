import { defineStore } from 'pinia';
import previewN1 from '@/assets/images/n1.png';
import previewN2 from '@/assets/images/n2.png';
import previewN3 from '@/assets/images/n3.png';

const models:any = [
  {
    preview: previewN1,
    url: 'models/n1.glb'
  },
  {
    preview: previewN2,
    url: 'models/n2.glb'
  },
  {
    preview: previewN3,
    url: 'models/n3.glb'
  }
];

/**
 * 模型加载页面
 */
const useModel = defineStore({
  id: 'modelShow',
  state: () => ({
    modelsKey: 0
  }),
  getters: {
    url():string {
      return models[this.modelsKey].url;
    },
    models():any  {
      return models;
    }
  },
  actions: {
    changeModel(key:any):void {
      this.modelsKey = key;
    }
  }
});
export default useModel;