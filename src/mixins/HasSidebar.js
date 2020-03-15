import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      sidebar: true
    };
  },

  computed: {
    ...mapGetters('user', ['loggedIn']),
    showSidebar: {
      get: function() {
        return this.sidebar && this.loggedIn;
      },
      set: function(newValue) {
        this.sidebar = newValue;
      }
    }
  },

  async created() {},

  methods: {
    getWidth() {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    },

    toggleSidebar() {
      this.sidebar = !this.sidebar;
    }
  }
};
