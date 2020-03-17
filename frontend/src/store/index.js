import api from '@/service/api'
import Vue from 'vue'
import Vuex from 'vuex'
import { dateFormat } from '@/types/date'
import moment from 'moment'

Vue.use(Vuex)

const createError = (e) => ({
  result: false,
  message: (e.response && e.response.data) || e
})

const store = new Vuex.Store({
  state: {
    eventsList: [],
    eventsMap: {}
  },
  getters: {
    getEventsByDay: (state) => (day) => {
      if (!day) {
        return []
      }
      return state.eventsMap[day.format(dateFormat.DATE)]
    },
    getEventsByDayAndHour: (state) => (day, hour) => {
      if (!day || !hour) {
        return []
      }
      const events = state.eventsMap[day.format(dateFormat.DATE)]
      if (!events) {
        return []
      }
      return events.filter(event => moment(event.start.dateTime).hours() === hour.hours())
    }
  },
  mutations: {
    SET_EVENTS_MAP (state, eventsMap) {
      state.eventsMap = eventsMap
    },
    SET_EVENTS_LIST (state, eventsList) {
      state.eventsList = eventsList
    }
  },
  actions: {
    async getEvents ({ commit }) {
      try {
        const { data: { data } } = await api.getEvents()
        commit('SET_EVENTS_LIST', data)

        const res = data.reduce((res, event) => {
          res[event.start.date] = res[event.start.date] ? [...res[event.start.date], event] : [event]
          return res
        }, {})
        commit('SET_EVENTS_MAP', res)
      } catch (e) {
        setTimeout(() => alert(createError(e).message))
      }
    },
    async addEvent ({ commit }, newEvent) {
      try {
        const { data } = await api.addEvent(newEvent)
        return data
      } catch (e) {
        return createError(e)
      }
    },
    async updateEventById ({ commit }, event) {
      const { id } = event
      try {
        const { data } = await api.updateEventById(id, event)
        return data
      } catch (e) {
        return createError(e)
      }
    },
    async updateEventDateById ({ commit }, { id, start, end }) {
      try {
        const { data } = await api.updateEventDateById(id, { start, end })
        return data
      } catch (e) {
        return createError(e)
      }
    },
    async deleteEventById ({ commit }, id) {
      try {
        const { data } = await api.deleteEventById(id)
        return data
      } catch (e) {
        return createError(e)
      }
    }
  }
})

export default store
