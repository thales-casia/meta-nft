<template>
  <div>
    <ul class="bg-list">
      <li v-for="(v, k) in backgrounds" :class="{active:backgroundKey == k}" @click="onBgChoose" :data-k="k">
        {{k}}
      </li>
    </ul>
    <ul class="model-list">
      <li v-for="(v, k) in models" :class="{active:modelsKey == k}" @click="onModelChoose" :data-k="k">
        <img :src="v.preview" />
      </li>
    </ul>
    <model-loader :model-url="modelUrl" :bg-url="bgUrl" />
  </div>
</template>
<script setup lang="ts">
import ModelLoader from '@/components/model-loader.vue';
import { useModel } from '@/store';
import { computed, onMounted } from 'vue';
const store = useModel();

const modelsKey = computed(() => store.modelsKey);
const backgroundKey = computed(() => store.backgroundsKey);
const modelUrl = computed(() => store.url);
const bgUrl = computed(() => store.backgroundUrl);
const models = computed(() => store.models);
const backgrounds = computed(() => store.backgrounds);
function onModelChoose(e:MouseEvent) {
  const k = (e.currentTarget as HTMLLIElement).dataset.k;
  store.changeModel(k);
}
function onBgChoose(e:MouseEvent) {
  const k = (e.currentTarget as HTMLLIElement).dataset.k;
  store.changeBackground(k);
}
</script>
<style lang="scss">
.bg-list {
  position: fixed;
  top: 1em;
  width: 100%;
  padding: 1em;
  li {
    display: inline-block;
    border: solid rgba($color: #000000, $alpha: 0.5) 2px;
    margin-right: 1em;
    padding: 0.2em;
    color: #FFF;
    &.active {
      border: solid #FFF 2px;
    }
  }
}
.model-list {
  position: fixed;
  bottom: 1em;
  width: 100%;
  padding: 1em;
  li {
    display: inline-block;
    border: solid rgba($color: #000000, $alpha: 0.5) 2px;
    margin-right: 1em;
    height: 2em;
    color: #FFF;
    &.active {
      border: solid #FFF 2px;
    }
    img {
      width: 2em;
      height: 2em;
    }
  }
}
</style>
