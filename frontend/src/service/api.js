import httpClient from '@/plugins/httpClient'

export default {
  getEvents () {
    return httpClient.get('/events')
  },
  addEvent (event) {
    return httpClient.post('/events', { event })
  },
  updateEventById (id, event) {
    return httpClient.put(`/events/${id}`, { event })
  },
  updateEventDateById (id, { start, end }) {
    return httpClient.patch(`/events/${id}`, { event: { start, end } })
  },
  deleteEvent (id) {
    return httpClient.delete(`/events/${id}`)
  }
}
