import { defineStore } from 'pinia';
import previewN1 from '@/assets/images/n1.png';
import previewN2 from '@/assets/images/n2.png';
import previewN3 from '@/assets/images/n3.png';

import bgs2 from '@/assets/images/bg/SS2.jpg';
import bgs3 from '@/assets/images/bg/SS3.jpeg';
import bgs4 from '@/assets/images/bg/SS4.jpeg';
import bgs5 from '@/assets/images/bg/SS5.jpeg';
import bgs6 from '@/assets/images/bg/SS6.jpg';
import bgs7 from '@/assets/images/bg/SS7.jpg';
import bgs8 from '@/assets/images/bg/SS8.jpg';

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
  },
  {
    preview: previewN1,
    url: 'models/n4.glb'
  }
];
const backgrounds:any = [
  {
    url: bgs2
  },
  {
    url: bgs3
  },
  {
    url: bgs4
  },
  {
    url: bgs5
  },
  {
    url: bgs6
  },
  {
    url: bgs7
  },
  {
    url: bgs8
  }
]

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
      return backgrounds[this.backgroundsKey].url;
    },
    backgrounds():any {
      return backgrounds;
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