<template>
  <div class="model-loader">
    <div class="msg">{{msg}}</div>
    <canvas ref="canvas" width="500" height="500" style="width:100%"></canvas>
  </div>
</template>

<script lang="ts" setup>
import {Exhibition, EVENT} from '@/utils/exhibition';
import { onMounted, ref } from 'vue';
import { Dialog } from 'vant';

const props = defineProps({
  modelUrl:String
});
const canvas = ref<HTMLCanvasElement>();

const msg = ref('');
function onLoading (e:any) {
  console.log(e);
  const { data } = e;
  const per = data.loaded / data.total;
  msg.value = `加载进度:${Math.floor(per * 1000) / 10}%`;
}

onMounted(() => {
  if(canvas.value && props.modelUrl) {
    const url = props.modelUrl;
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    const exhibition = new Exhibition(canvas.value);
    exhibition.addEventListener(EVENT.LOADING, onLoading);
    Dialog.confirm({
      title: '授权',
      message: '请授权陀螺仪'
    }).then(() => {
      if ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) {
        window.DeviceOrientationEvent.requestPermission().then( (res:any) => {
          if(res == 'granted') {
            exhibition.start(url);
          }
        });
      } else {
        exhibition.start(url);
      }
    }).catch(() => {
      msg.value = '未授权陀螺仪，请关闭App重新授权';
    });
  }
});
</script>

<style scoped lang="scss">
.model-loader {
  .msg {
    background-color: white;
    position: fixed;
  }
}
body {
  overflow: hidden;
}
</style>
