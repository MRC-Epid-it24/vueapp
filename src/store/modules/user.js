import TokenService from '../../services/token.service';

const defaultState = () => ({ status: '', profile: TokenService.decodeAccessToken() ?? {} });

const state = defaultState();

const getters = {
  can: state => role => state.profile.roles?.includes(role),
  loggedIn: state => !!Object.keys(state.profile).length,
  profile: state => state.profile,
  roles: state => state.profile.roles ?? []
};

const actions = {
  async load({ commit, dispatch }) {
    let decoded = TokenService.decodeAccessToken();
    if (decoded) {
      commit('success', decoded);
      return Promise.resolve();
    }

    await dispatch('auth/refresh', null, { root: true });
    decoded = TokenService.decodeAccessToken();
    commit('success', decoded);
    return Promise.resolve();
  }
};

const mutations = {
  success(state, data) {
    state.status = 'success';
    state.profile = { ...state.profile, ...data };
  },
  error(state) {
    Object.assign(state, defaultState(), { status: 'error' });
  },
  reset(state) {
    Object.assign(state, defaultState());
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
