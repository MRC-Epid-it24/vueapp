import jwtDecode from 'jwt-decode';

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';

export default {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  },

  decodeAccessToken() {
    try {
      const { userId, name, roles, exp } = jwtDecode(this.getAccessToken());

      if (new Date().getTime() > exp * 1000) return null;

      return { userId, name, roles };
    } catch {
      return null;
    }
  },

  saveAccessToken(accessToken) {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  },

  clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
  },

  saveRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  },

  clearRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN);
  },

  clearTokens() {
    this.clearAccessToken();
    this.clearRefreshToken();
  }
};
