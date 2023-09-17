import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

let v = new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

console.log(v,'v')