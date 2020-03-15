import AuthService from '../../services/auth.service';
import TokenService from '../../services/token.service';

const defaultState = () => ({
  accessToken: TokenService.getAccessToken(),
  refreshToken: TokenService.getRefreshToken(),
  status: '',
  error: {}
});

const state = defaultState();

const getters = {
  errors: state => state.error.errors ?? {}
};

const actions = {
  async login({ commit, dispatch }, { email, password }) {
    commit('request');
    commit('loading/add', 'login', { root: true });

    try {
      const refreshToken = await AuthService.login({ email, password });
      const accessToken = await AuthService.refresh();
      commit('login', { accessToken, refreshToken });
      await dispatch('user/load', {}, { root: true });
    } catch (err) {
      commit('error', err);
    } finally {
      commit('loading/remove', 'login', { root: true });
    }
  },
  async refresh({ commit }) {
    try {
      const accessToken = await AuthService.refresh();
      commit('refresh', accessToken);
      return Promise.resolve();
    } catch (err) {
      commit('error', err);
      return Promise.reject(err);
    }
  },
  async logout({ commit }) {
    await AuthService.logout();
    commit('loading/reset', {}, { root: true });
    commit('user/reset', {}, { root: true });
    commit('logout');
  }
};

const mutations = {
  request(state) {
    state.status = 'loading';
  },
  login(state, { accessToken, refreshToken }) {
    state.status = 'success';
    state.error = {};
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
  },
  refresh(state, accessToken) {
    state.status = 'success';
    state.error = {};
    state.accessToken = accessToken;
  },
  logout(state) {
    Object.assign(state, defaultState());
  },
  error(state, err) {
    state.status = 'error';
    const { response: { status, statusText, data: { message, errors } = {} } = {} } = err;
    state.error = {
      errors,
      message,
      status,
      statusText
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
