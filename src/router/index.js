import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import views from '../views';

Vue.use(Router);

let routes = [
  {
    path: '/',
    name: 'login',
    component: views.login,
    meta: { module: 'login', title: 'common.login' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: views.dashboard,
    meta: { module: 'dashboard', title: 'common.dashboard' }
  },
  {
    path: '/meal/:id',
    name: 'meal',
    component: views.meal,
    meta: { module: 'meal' },
    props: true
  }
];

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.VUE_APP_BASE_URL || '/',
  routes
});

router.beforeEach(async (to, from, next) => {
  // Login page
  if (to.name === 'login') {
    if (store.getters['user/loggedIn']) next({ name: 'dashboard' });
    else next();
    return;
  }

  // Get logged-in user information if not yet loaded
  if (!store.getters['user/loggedIn']) await store.dispatch('user/load');

  // Any other page (requires to be logged in)
  if (!store.getters['user/loggedIn']) {
    next({ name: 'login' });
    return;
  }

  next();
});

export default router;
