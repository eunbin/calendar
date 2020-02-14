import api from '@/service/api'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    events: []
  },
  getters: {},
  mutations: {
    SET_EVENTS (state, { data }) {
      state.events = data
    }
  },
  actions: {
    async getEvents ({ commit }) {
      try {
        const { data } = await api.getEvents()
        commit('SET_EVENTS', data)
      } catch (e) {
        console.error((e.response && e.response.data.message) || e)
      }
    },
    async addEvent ({ commit }, newEvent) {
      try {
        const { data } = await api.addEvent(newEvent)
        return data
      } catch (e) {
        console.error((e.response && e.response.data.message) || e)
      }
    },
    async updateEventById ({ commit }, event) {
      const { id } = event
      try {
        const { data } = await api.updateEventById(id, event)
        return data
      } catch (e) {
        console.error((e.response && e.response.data.message) || e)
      }
    },
    async updateEventDateById ({ commit }, { id, start, end }) {
      try {
        const { data } = await api.updateEventDateById(id, { start, end })
        return data
      } catch (e) {
        console.error((e.response && e.response.data.message) || e)
      }
    },
    async deleteEventById ({ commit }, id) {
      try {
        const { data } = await api.deleteEventById(id)
        return data
      } catch (e) {
        console.error((e.response && e.response.data.message) || e)
      }
    }
  }
})

export default store
