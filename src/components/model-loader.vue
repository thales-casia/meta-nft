<template>
  <div class="model-loader">
    <div class="loading-bar">{{loadingMsg}}</div>
    <canvas ref="canvas" width="500" height="500" style="width:100%"></canvas>
  </div>
</template>

<script lang="ts" setup>
import {Exhibition, EVENT} from '@/utils/exhibition';
import { onMounted, ref } from 'vue';

const props = defineProps({
  modelUrl:String
});
const canvas = ref<HTMLCanvasElement>();

const loadingMsg = ref('');
function onLoading (e:any) {
  console.log(e);
  const { data } = e;
  const per = data.loaded / data.total;
  loadingMsg.value = `加载进度:${Math.floor(per * 1000) / 10}%`;
}
onMounted(() => {
  if(canvas.value && props.modelUrl) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    const exhibition = new Exhibition(canvas.value);
    exhibition.addEventListener(EVENT.LOADING, onLoading);
    exhibition.start(props.modelUrl);
  }
});
</script>

<style scoped lang="scss">
.model-loader {
  .loading-bar {
    position: fixed;
  }
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
