import './styles/app.scss'

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import dateMixin from './mixins/date.vue'
import './plugins/httpClient'
import 'moment/locale/ko'

Vue.config.productionTip = false

Vue.mixin(dateMixin)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
