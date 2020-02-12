import httpClient from '@/plugins/httpClient'

export default {
  getEvents (year, month) {
    return httpClient.get(`/events/${year}/${month}`)
  },
  addEvent (newEvent) {
    return httpClient.post('/events', newEvent)
  },
  updateEvent (id, newEvent) {
    return httpClient.put(`/events/${id}`, newEvent)
  },
  updateEventDateById ({ id }, { startDate, endDate }) {
    return httpClient.patch(`/events/${id}`, { startDate, endDate })
  }
}
