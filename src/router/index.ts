import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import NotFound from '@/pages/404.vue';
import Model from '@/pages/model.vue';
import { models } from '@/utils';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: `/${models[0].id}`
  },
  {
    name: 'model',
    path: '/:id',
    component: Model,
    props: true,
    meta: { title: 'model' }
  },
  {
    name: '404',
    path: '/404',
    component: NotFound
  },
  {
    path: '/:catchAll(.*)', // 此处需特别注意至于最底部
    redirect: '/404'
  }
];
let history = createWebHistory();
const router = createRouter({
  history,
  routes,
});
let title = 'META NFT';
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${title} | ${to.meta.title}`;
  }
  next();
});

export default router;
