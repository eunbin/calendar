import './styles/app.scss'

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import dateMixin from './mixins/date.vue'
import './plugins/httpClient'
import 'moment/locale/ko'
import router from './router'
import 'vue-date-pick/dist/vueDatePick.css'

Vue.config.productionTip = false

Vue.mixin(dateMixin)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
