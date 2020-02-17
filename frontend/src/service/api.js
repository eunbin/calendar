import httpClient from '@/plugins/httpClient'

const PATH = '/events'

export default {
  getEvents () {
    return httpClient.get(PATH)
  },
  addEvent (event) {
    return httpClient.post(PATH, { event })
  },
  updateEventById (id, event) {
    return httpClient.put(`${PATH}/${id}`, { event })
  },
  updateEventDateById (id, { start, end }) {
    return httpClient.patch(`${PATH}/${id}`, { event: { start, end } })
  },
  deleteEventById (id) {
    return httpClient.delete(`${PATH}/${id}`)
  }
}
