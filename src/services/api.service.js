import axios from 'axios';
import Vue from 'vue';
import router from '../router';
import store from '../store';
import TokenService from './token.service';

let isRefreshing = false;
let tokenSubscribers = [];

const subscribeTokenRefresh = cb => tokenSubscribers.push(cb);

const onTokenRefreshed = (errRefreshing = null) => tokenSubscribers.map(cb => cb(errRefreshing));

export default {
  axios,

  init(baseURL) {
    this.axios.defaults.baseURL = baseURL;
    this.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // this.axios.defaults.withCredentials = true;

    this.mountBearerInterceptor();
    this.mount401Interceptor();
  },

  async get(url, config = {}) {
    return this.request(url, 'get', {}, config);
  },

  async post(url, data = {}, config = {}) {
    return this.request(url, 'post', data, config);
  },

  async put(url, data = {}, config = {}) {
    return this.request(url, 'put', data, config);
  },

  async patch(url, data = {}, config = {}) {
    return this.request(url, 'patch', data, config);
  },

  async delete(url, config = {}) {
    return this.request(url, 'delete', {}, config);
  },

  async request(url, method, data = {}, config = {}) {
    // const { withErr, ...rest } = config;

    return new Promise((resolve, reject) => {
      this.axios
        .request({
          url,
          method,
          data,
          ...config
        })
        .then(res => resolve(res))
        .catch(err => {
          const { response } = err;
          if (response && ![401, 422].includes(response.status)) {
            const {
              data: { message }
            } = response;
            Vue.toasted.error(message || err.message);
          }

          return reject(err);
        });
    });
  },

  mountBearerInterceptor() {
    this.axios.interceptors.request.use(request => {
      const token = request.url.includes('refresh')
        ? TokenService.getRefreshToken()
        : TokenService.getAccessToken();
      if (token) request.headers['X-Auth-Token'] = token;
      return request;
    });
  },

  mount401Interceptor() {
    this.axios.interceptors.response.use(
      response => response,
      err => {
        const { config, response: { status } = {} } = err;
        const origRequest = config;

        if (status !== 401 || config.url.includes('signin')) return Promise.reject(err);

        // Refresh token has failed. Logout the user
        if (config.url.includes('refresh')) {
          isRefreshing = false;
          store.dispatch('auth/logout').then(() => router.push({ name: 'login' }));
          return Promise.reject(err);
        }

        if (!isRefreshing) {
          isRefreshing = true;

          store
            .dispatch('auth/refresh')
            .then(() => {
              isRefreshing = false;
              onTokenRefreshed();
              tokenSubscribers = [];
            })
            .catch(() => {
              isRefreshing = false;
              onTokenRefreshed(err);
              tokenSubscribers = [];
            });
        }

        const initTokenSubscriber = new Promise((resolve, reject) => {
          subscribeTokenRefresh(errRefreshing => {
            if (errRefreshing) return reject(errRefreshing);

            return resolve(this.axios(origRequest));
          });
        });
        return initTokenSubscriber;
      }
    );
  }
};
