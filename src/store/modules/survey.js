export const mealDef = () => ({
  name: '',
  time: '8:00',
  foods: [],
  flags: [],
  state: null
});

export const defaultMealDefs = [
  {
    name: 'Breakfast',
    time: '8:00'
  },
  {
    name: 'Morning Snack',
    time: '10:00'
  },
  {
    name: 'Lunch',
    time: '12:00'
  },
  {
    name: 'Afternoot Snack',
    time: '14:00'
  },
  {
    name: 'Dinner',
    time: '18:00'
  }
];

export const defaultMeals = defaultMealDefs.map(item => ({ ...mealDef(), ...item }));

const defaultState = () => ({ meals: [...defaultMeals] });

const state = defaultState();

const getters = {
  meals: state => state.meals,
  meal: state => mealIdx => state.meals.find((meal, idx) => mealIdx == idx)
};

const actions = {
  addFood: async ({ commit }, payload) => commit('addFood', payload),
  removeFood: async ({ commit }, payload) => commit('removeFood', payload)
};

const mutations = {
  addFood: (state, { mealIdx, food }) => state.meals[mealIdx].foods.push(food),
  removeFood: (state, { mealIdx, foodIdx }) => {
    state.meals[mealIdx].foods = state.meals[mealIdx].foods.filter((food, idx) => idx != foodIdx);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
