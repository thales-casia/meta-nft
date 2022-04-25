<template>
  <div>
    <ul class="model-list">
      <li v-for="(v, k) in models" @click="onModelChoose" :data-k="k">{{k}}</li>
    </ul>
    <model-loader :model-url="modelUrl" />
  </div>
</template>
<script setup lang="ts">
import ModelLoader from '@/components/model-loader.vue';
import { useModel } from '@/store';
import { computed, onMounted } from 'vue';
const store = useModel();

const modelUrl = computed(() => store.url);
const models = computed(() => store.models);
function onModelChoose(e:MouseEvent) {
  const k = (e.currentTarget as HTMLLIElement).dataset.k;
  store.changeModel(k);
}
</script>
<style lang="scss">
.model-list {
  position: fixed;
  bottom: 1em;
  width: 100%;
  padding: 1em;
  li {
    background-color: rgba($color: #000000, $alpha: 0.5);
    display: inline;
    padding: 1em;
    margin-right: 1em;
    color: #FFF;
  }
}
</style>
