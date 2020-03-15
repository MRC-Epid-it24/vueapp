<template>
  <div class="page-login">
    <v-card class="card-login">
      <v-card-title>Login</v-card-title>
      <v-form @submit.prevent="onLogin">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="email" label="Email" required outlined></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                type="password"
                label="Password"
                required
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-row>
              <v-col cols="12">
                <v-btn type="submit" color="primary" width="100%">{{ $t('common.login') }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Login',

  data() {
    return {
      email: null,
      password: null
    };
  },

  computed: mapGetters({
    errors: 'auth/errors',
    loggedIn: 'user/loggedIn'
  }),

  methods: {
    ...mapActions('auth', ['login']),

    async onLogin() {
      const { email, password } = this;
      await this.login({ email, password });
      if (this.loggedIn) {
        this.email = null;
        this.password = null;
        this.$router.push({ name: 'dashboard' });
      }
    }
  }
};
</script>

<style lang="scss">
.page-login {
  width: 100%;
  height: calc(100vh - 300px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-login {
  width: 100%;

  @media screen and (min-width: 576px) {
    width: 30rem;
  }
}
</style>
