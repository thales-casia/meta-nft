<template>
  <div>
    <model-loader :model-url="modelUrl" :bg-url="bgUrl" />
  </div>
</template>
<script setup lang="ts">
import ModelLoader from '@/components/model-loader.vue';
import { useModel } from '@/store';
import { computed, onMounted, watch } from 'vue';
const props = defineProps({
  id: String
})
const store = useModel();

const modelUrl = computed(() => store.modelUrl);
const bgUrl = computed(() => store.backgroundUrl);
// const models = computed(() => store.models);
watch(() => props.id, (val, old) => {
  console.log(val, old);
  store.setModelUrl(val);

}, {immediate:true});
</script>
