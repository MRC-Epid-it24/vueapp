<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col><v-icon>mdi-food</v-icon> {{ meal(id).name }} </v-col>
              <v-col>
                {{ meal(id).time }}
              </v-col>
            </v-row>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-subtitle>Selected foods:</v-card-subtitle>
          <v-card-text>
            <v-list dense>
              <v-list-item v-for="(food, foodIdx) in meal(id).foods" :key="`${food.code}`" link>
                <v-list-item-icon>
                  <v-icon>mdi-food</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  {{ `${food.code} | ${food.localDescription}` }}
                </v-list-item-content>
                <v-list-item-action @click="removeFood({ mealIdx: id, foodIdx })">
                  <v-icon>mdi-delete</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form @submit.prevent="onSearch">
          <v-text-field v-model="search" label="Search food" required outlined></v-text-field>
          <v-input></v-input>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Results:</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item
                v-for="food in results.foods"
                :key="food.code"
                @click="addFood({ mealIdx: id, food })"
              >
                <v-list-item-icon link>
                  <v-icon>mdi-food</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  {{ `${food.code} | ${food.localDescription}` }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mealDef } from '../store/modules/survey';

export default {
  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      currentMeal: { ...mealDef() },
      search: '',
      results: {
        foods: [],
        categories: []
      }
    };
  },

  computed: {
    ...mapGetters('survey', ['meal'])
  },

  watch: {
    id: {
      handler: function(val) {
        this.currentMeal = Object.assign(this.currentMeal, this.meal(val));
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions('survey', ['addFood', 'removeFood']),

    async onSearch() {
      const {
        data: { foods, categories }
      } = await this.$http.get('user/foods/NDNSv1/lookup', {
        params: {
          limit: 50,
          alg: 'paRules',
          desc: this.search
        }
      });
      this.results = { ...this.results, foods, categories };
    }

    /* async onSelect(item) {
      const idx = this.id;
      this.addFood({ idx, item });
    } */

    /* removeFood(idx) {
      alert(idx);
    } */

    // user/foods/NDNSv1/BANA
  }
};
</script>
