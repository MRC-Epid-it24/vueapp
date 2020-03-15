import Vue from 'vue';
// import Vue from 'vue-native-core';
import Vuex from 'vuex';
import modules from './modules/index';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = () => ({
  lang: document ? document.documentElement.lang.substr(0, 2) : null,
  module: null
});

const getters = {
  lang: state => state.lang,
  module: state => state.module
};

const mutations = {
  module(state, module) {
    state.module = module;
  }
};

export default new Vuex.Store({
  modules,
  state: state(),
  getters,
  mutations,
  strict: debug
});
