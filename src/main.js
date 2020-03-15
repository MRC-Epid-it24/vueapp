import trim from 'lodash/trim';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Storage from 'vue-ls';
import Toasted from 'vue-toasted';
import Locale from './locale';

import api from './services/api.service';

import AuthMixin from './mixins/AuthMixin';
import ModuleMixin from './mixins/ModuleMixin';

import store from './store';
import router from './router';
import Web from './Web.vue';
import vuetify from './plugins/vuetify';

Vue.use(VueI18n);
Vue.use(Storage);
Vue.use(Toasted, {
  duration: 10000,
  keepOnHover: true,
  iconPack: 'fontawesome'
});

Vue.mixin(AuthMixin);
Vue.mixin(ModuleMixin);

const baseUrl = [process.env.VUE_APP_API_HOST, process.env.VUE_APP_API_URL]
  .map(item => trim(item, '/'))
  .join('/');

api.init(baseUrl);
Vue.prototype.$http = api;

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: Locale
});

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(Web)
}).$mount('#web');
