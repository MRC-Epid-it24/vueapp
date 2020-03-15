import ApiService from './api.service';
import TokenService from './token.service';

export default {
  /**
   * Login the user and store the access token to TokenService.
   *
   * @returns {Promise<{*}>}
   * */
  async login({ email, password }) {
    const { data: { refreshToken } = {} } = await ApiService.post('signin', { email, password });
    TokenService.saveRefreshToken(refreshToken);
    return refreshToken;
  },

  /**
   * Refresh access token and store the access token to TokenService.
   *
   * @returns {Promise<string>}
   * */
  async refresh() {
    const { data: { accessToken } = {} } = await ApiService.post('refresh');
    TokenService.saveAccessToken(accessToken);
    return accessToken;
  },

  /**
   * Logout user
   *
   * @returns {Promise<void>}
   * */
  async logout() {
    // await ApiService.post('logout');
    TokenService.clearTokens();
  }
};
