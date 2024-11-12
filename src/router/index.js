//router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieDetail from '../views/MovieDetail.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }, // 로그인 필요
  },
  {
    path: '/about',
    name: 'about',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    meta: { requiresAuth: true }, // 로그인 필요
  },
  {
    path: '/signin',
    name: 'signin',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/SignIn.vue')
    },
  },
  {
    path: '/popular',
    name: 'popular',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Popular.vue')
    },
    meta: { requiresAuth: true }, // 로그인 필요
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Wishlist.vue')
    },
    meta: { requiresAuth: true }, // 로그인 필요
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetail, 
    meta: { requiresAuth: true }, // 로그인 필요
  },

  {
    path: '/search',
    name: 'Search',
    component: function () {
    return import(/* webpackChunkName: "about" */ '../views/Search.vue')
    },
    meta: { requiresAuth: true }, // 로그인 필요
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 네비게이션 가드 설정
router.beforeEach((to, from, next) => {
  const isLoggedIn = JSON.parse(localStorage.getItem('user'))?.isLoggedIn;

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    // 로그인이 필요하고, 로그인되어 있지 않다면 /signin으로 이동
    next({ path: '/signin' });
  } 
  else {
    // 그 외의 경우는 정상적으로 이동
    next();
  }
});

export default router
