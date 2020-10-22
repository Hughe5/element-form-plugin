import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import myForm from '../src/index.js'

Vue.config.productionTip = false

Vue.use(myForm)

new Vue({
  render: h => h(App),
}).$mount('#app')
