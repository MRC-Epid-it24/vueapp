<template>
  <v-app>
    <loader :show="isLoading" />

    <v-navigation-drawer v-if="loggedIn" v-model="showSidebar" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            My foods
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ new Date().toLocaleDateString() }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item-group v-model="meal" color="primary">
          <v-list-item
            v-for="(meal, idx) in meals"
            :key="idx"
            :to="{ name: 'meal', params: { id: idx } }"
            link
          >
            <v-list-item-action>
              <v-icon>mdi-food</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="meal.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark fixed>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon v-if="loggedIn" @click.stop="toggleSidebar"></v-app-bar-nav-icon>

        <v-toolbar-title>Intake24</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>
      <v-btn v-if="loggedIn" href="" text @click.stop="onLogout()">
        <span class="mr-2">{{ $t('common.logout') }}</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import HasSidebar from './mixins/HasSidebar';
import HasLoading from './mixins/HasLoading';
import Loader from './components/Loader';

export default {
  name: 'Web',

  components: { Loader },

  mixins: [HasLoading, HasSidebar],

  data: () => ({
    meal: 1
  }),

  computed: {
    ...mapGetters({
      loggedIn: 'user/loggedIn',
      meals: 'survey/meals'
    }),
    title() {
      if (this.$route.meta.title) return this.$t(this.$route.meta.title);

      return this.$t(`common.index`);
    }
  },

  watch: {
    '$route.meta.module': {
      handler(module) {
        this.$store.commit('module', module);
      },
      deep: true,
      immediate: true
    },
    title: {
      handler: val => (document.title = val),
      immediate: true
    }
  },

  async mounted() {},

  methods: {
    ...mapActions('auth', ['logout']),

    async onLogout() {
      await this.logout();
      this.$router.push({ name: 'login' });
    }
  }
};
</script>
