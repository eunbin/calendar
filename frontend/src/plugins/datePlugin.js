import { dateFormat } from '../types/date'

export default {
  install (Vue) {
    Vue.prototype.dateFormat = dateFormat
  }
}
