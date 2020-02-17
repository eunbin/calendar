import httpClient from '@/plugins/httpClient'

const BASE_URI = '/api/events'

export default {
  getEvents () {
    return httpClient.get(BASE_URI)
  },
  addEvent (event) {
    return httpClient.post(BASE_URI, { event })
  },
  updateEventById (id, event) {
    return httpClient.put(`${BASE_URI}/${id}`, { event })
  },
  updateEventDateById (id, { start, end }) {
    return httpClient.patch(`${BASE_URI}/${id}`, { event: { start, end } })
  },
  deleteEventById (id) {
    return httpClient.delete(`${BASE_URI}/${id}`)
  }
}
