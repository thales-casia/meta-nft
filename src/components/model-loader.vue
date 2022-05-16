<template>
  <div class="model-loader">
    <div v-if="isLoading" class="msg">{{msg}}</div>
    <canvas ref="canvas" width="500" height="500" style="width:100%"></canvas>
  </div>
</template>

<script lang="ts" setup>
import {Exhibition, EVENT} from '@/utils/exhibition';
import { onMounted, ref, watch } from 'vue';
import { Dialog } from 'vant';

const props = defineProps({
  modelUrl:String,
  bgUrl:String
});
const canvas = ref<HTMLCanvasElement>();

const msg = ref('');
const isLoading = ref(false);
function onLoading (e:any) {
  isLoading.value = true;
  const { data } = e;
  const per = data.loaded / data.total;
  msg.value = `加载进度:${Math.floor(per * 1000) / 10}%`;
}
function onLoaded(e:any) {
  isLoading.value = false;
}
let exhibition:any;
watch(() => props.modelUrl, (val) => {
  exhibition.changeModel(val);
});
watch(() => props.bgUrl, (val) => {
  exhibition.changeBackground(val);
});
onMounted(() => {
  if(canvas.value && props.modelUrl) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    exhibition = new Exhibition(canvas.value);
    exhibition.addEventListener(EVENT.LOADING, onLoading);
    exhibition.addEventListener(EVENT.LOADED, onLoaded);
    Dialog.confirm({
      title: '授权',
      message: '请授权陀螺仪'
    }).then(() => {
      if ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) {
        window.DeviceOrientationEvent.requestPermission().then( (res:any) => {
          if(res == 'granted') {
            exhibition.start();
            exhibition.changeModel(props.modelUrl);
            exhibition.changeBackground(props.bgUrl);
          }
        });
      } else {
        exhibition.start();
        exhibition.changeModel(props.modelUrl);
        exhibition.changeBackground(props.bgUrl);
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

</style>
