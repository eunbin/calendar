<template>
  <div class="calendar">
    <calendar-header
      :view-type="viewType"
      :current-date="currentDate"
      @change="onChangeViewType"
      @prev="onPrev"
      @next="onNext"></calendar-header>
    <calendar-view
      :view-type="viewType"
      :current-date="currentDate"
      :selected-date="selectedDate"
      :events="events"
      @event-selected="onSelectEvent"
      @day-selected="onSelectDay"
      @day-changed="onChangeDay"></calendar-view>
    <event-modal v-model="dialog"
                 :event="dialogModel"
                 @submit="onSubmit"
                 @delete="onDelete"
                 @close="onCloseDialog"></event-modal>
  </div>
</template>

<script>
import CalendarHeader from '@/components/CalendarHeader'
import CalendarView from '@/components/CalendarView'
import EventModal from '@/components/EventModal'
import { viewType } from '@/constant/constant'
import moment from 'moment'
import api from '@/service/api'

export default {
  name: 'Calendar',
  data () {
    return {
      viewType: viewType.month,
      events: [],
      currentDate: null,
      selectedDate: null,
      selectedEvent: null,
      dialog: false,
      dialogModel: null
    }
  },
  components: {
    EventModal,
    CalendarView,
    CalendarHeader
  },
  computed: {
  },
  watch: {
    currentDate () {
    }
  },
  created () {
    this.resetDialogModel()
    this.selectedDate = this.currentDate

    this.currentDate = moment()
    this.getEvents()
  },
  methods: {
    async getEvents () {
      try {
        const { data: { data } } = await api.getEvents()
        this.events = data
      } catch (e) {
        setTimeout(() => alert((e.response && e.response.data.message) || e))
      }
    },
    onSelectEvent (event) {
      this.selectEvent(event)
      this.dialog = true
      this.dialogModel = event
    },
    selectEvent (event) {
      this.events.filter(event => event.selected).forEach(event => (event.selected = false))
      this.$set(event, 'selected', !event.selected)
    },
    onSelectDay (selectedDay) {
      const now = moment().hours()
      const startDateTime = selectedDay.clone().hours(now)
      const endDateTime = startDateTime.clone().add(1, 'hour')
      this.dialogModel = {
        title: '',
        start: {
          date: startDateTime.format('YYYY-MM-DD'),
          dateTime: startDateTime.format('YYYY-MM-DD HH:mm')
        },
        end: {
          date: endDateTime.format('YYYY-MM-DD'),
          dateTime: endDateTime.format('YYYY-MM-DD HH:mm')
        }
      }
      this.dialog = true
    },
    onChangeViewType (viewType) {
      this.viewType = viewType
    },
    async onChangeDay (id, { start, end }) {
      try {
        const { data: { result, message, data } } = await api.updateEventDateById(id, { start, end })
        if (result) {
          await this.getEvents()
          const event = this.events.find(event => event.id === data.id)
          this.selectEvent(event)
        } else {
          setTimeout(() => alert(message))
        }
      } catch (e) {
        setTimeout(() => alert((e.response && e.response.data.message) || e))
      }
    },
    onPrev () {
      if (this.viewType === viewType.month) {
        this.currentDate = this.currentDate.clone().add(-1, 'month')
      }
    },
    onNext () {
      if (this.viewType === viewType.month) {
        this.currentDate = this.currentDate.clone().add(1, 'month')
      }
    },
    async addEvent (newEvent) {
      try {
        const { data: { result, message, data } } = await api.addEvent(newEvent)
        if (result) {
          this.dialog = false
          await this.getEvents()
          const event = this.events.find(event => event.id === data.id)
          this.selectEvent(event)
        } else {
          setTimeout(() => alert(message))
        }
      } catch (e) {
        setTimeout(() => alert((e.response && e.response.data.message) || e))
      }
    },
    async updateEventById (newEvent) {
      const { id } = newEvent
      try {
        const { data: { result, message, data } } = await api.updateEventById(id, newEvent)
        if (result) {
          this.dialog = false
          await this.getEvents()
          const event = this.events.find(event => event.id === data.id)
          this.selectEvent(event)
        } else {
          setTimeout(() => alert(message))
        }
      } catch (e) {
        setTimeout(() => alert((e.response && e.response.data.message) || e))
      }
    },
    onSubmit (newEvent, isAdd) {
      if (isAdd) {
        this.addEvent(newEvent)
      } else {
        this.updateEventById(newEvent)
      }
    },
    async onDelete () {
      try {
        const { data: { result, message } } = await api.deleteEvent(this.dialogModel.id)
        if (result) {
          this.dialog = false
          await this.getEvents()
          setTimeout(() => alert('일정이 삭제되었습니다.'))
        } else {
          setTimeout(() => alert(message))
        }
      } catch (e) {
        setTimeout(() => alert((e.response && e.response.data.message) || e))
      }
    },
    onCloseDialog () {
      this.dialog = false
      this.resetDialogModel()
    },
    resetDialogModel () {
      this.dialogModel = {
        id: '',
        title: '',
        start: {
          date: '',
          dateTime: ''
        },
        end: {
          date: '',
          dateTime: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .calendar {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 1em;
  }
</style>
