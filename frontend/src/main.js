import './styles/app.scss'

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import 'moment/locale/ko'
import router from './router'
import DatePlugin from './plugins/datePlugin.js'
import 'vue-date-pick/dist/vueDatePick.css'

Vue.config.productionTip = false

Vue.use(DatePlugin)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
