<template>
  <div class="model-loader">
    <div v-if="isLoading" class="msg">{{msg}}</div>
    <canvas ref="canvas" width="500" height="500" style="width:100%"></canvas>
    <div class="vibrate">
      <button @click="onClick">测试震动{{result}}</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Exhibition, EVENT} from '@/utils/exhibition';
import { onMounted, ref, watch } from 'vue';
import { Dialog } from 'vant';

const props = defineProps({
  modelUrl:String
});
const canvas = ref<HTMLCanvasElement>();

const msg = ref('');
const isLoading = ref(false);
function onLoading (e:any) {
  isLoading.value = true;
  const { data } = e;
  const per = data.loaded / data.total;
  msg.value = `loading:${Math.floor(per * 1000) / 10}%`;
}
function onLoaded(e:any) {
  isLoading.value = false;
}
let exhibition:any;
watch(() => props.modelUrl, (val) => {
  exhibition.changeModel(val);
});
onMounted(() => {
  if(canvas.value && props.modelUrl) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    exhibition = new Exhibition(canvas.value);
    exhibition.addEventListener(EVENT.LOADING, onLoading);
    exhibition.addEventListener(EVENT.LOADED, onLoaded);
    Dialog.confirm({
      title: 'Authorization',
      message: 'Please authorize the gyroscope',
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel'
    }).then(() => {
      if ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) {
        window.DeviceOrientationEvent.requestPermission().then( (res:any) => {
          if(res == 'granted') {
            exhibition.start();
            exhibition.changeModel(props.modelUrl);
          }
        });
      } else {
        exhibition.start();
        exhibition.changeModel(props.modelUrl);
      }
    }).catch(() => {
      msg.value = 'Gyroscope need authorized, please re-authorize while reopen page.';
    });
  }
});
const result = ref('准备');
function onClick() {
  try {
    navigator.vibrate(100);
    result.value = '成功'
  } catch (error:any) {
    result.value = error.message
  }
  setTimeout(() => {
    navigator.vibrate(1000);
  }, 5000);
}
</script>

<style scoped lang="scss">
.model-loader {
  .msg {
    background-color: white;
    position: fixed;
  }
  .vibrate {
    position: fixed;
    bottom: 0;
  }
}

</style>
