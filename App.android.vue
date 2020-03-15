<template>
  <view class="container">
    <text class="text-color-primary">{{ message }}</text>
    <button :title="message" :on-press="handleBtnPress" />
  </view>
</template>

<script>
/* import Vue from 'vue-native-core';
import store from './src/store/index';
Vue.prototype.$store = store; */

export default {
  data: function() {
    return {
      message: 'Hello World'
    };
  },
  methods: {
    handleBtnPress: function() {
      alert('Btn Press');
    }
  }
};
</script>

<style>
.container {
  background-color: white;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.text-color-primary {
  color: blue;
}
</style>
