<template>
  <div class="calendar">
    <calendar-header
      :view-type="viewType"
      :current-date="currentDate"
      @change="onChangeViewType"
      @prev="onPrev"
      @next="onNext"
    />
    <calendar-view
      :view-type="viewType"
      :current-date="currentDate"
      :today="today"
      :events="events"
      @event-selected="onSelectEvent"
      @hour-selected="openDialog"
      @day-selected="openDialog"
      @event-moved="handleMoveEvent"
    />
    <event-modal
      v-model="dialog"
      :event="dialogModel"
      @add="handleAddEvent"
      @update="handleUpdateEvent"
      @delete="handleDeleteEvent"
      @close="onCloseDialog"
    />
  </div>
</template>

<script>
import CalendarHeader from '@/components/CalendarHeader'
import CalendarView from '@/components/CalendarView'
import EventModal from '@/components/EventModal'
import { viewTypes } from '@/types/calendar'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'Calendar',
  components: {
    EventModal,
    CalendarView,
    CalendarHeader
  },
  data () {
    return {
      viewType: viewTypes.MONTH,
      today: null,
      currentDate: null,
      selectedEvent: null,
      dialog: false,
      dialogModel: null
    }
  },
  computed: {
    ...mapState(['events'])
  },
  created () {
    this.resetDialogModel()
    this.today = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
    this.currentDate = this.today.clone()
    this.getEvents()
  },
  methods: {
    ...mapActions([
      'getEvents',
      'addEvent',
      'updateEventById',
      'updateEventDateById',
      'deleteEventById'
    ]),
    setSelectedEvent (event) {
      this.events.filter(event => event.selected).forEach(event => (event.selected = false))
      this.$set(event, 'selected', !event.selected)
    },
    onSelectEvent (event) {
      this.setSelectedEvent(event)
      this.dialog = true
      this.dialogModel = event
    },
    openDialog (selectedDay) {
      const now = moment().hours()
      const startDateTime = selectedDay.clone().hours(now)
      const endDateTime = startDateTime.clone().add(1, 'hour')
      this.dialogModel = {
        title: '',
        start: {
          date: startDateTime.format(this.dateFormat.DATE),
          dateTime: startDateTime.format(this.dateFormat.DATE_TIME)
        },
        end: {
          date: endDateTime.format(this.dateFormat.DATE),
          dateTime: endDateTime.format(this.dateFormat.DATE_TIME)
        }
      }
      this.dialog = true
    },
    onChangeViewType (viewType) {
      this.viewType = viewType
    },
    onPrev () {
      const date = this.currentDate.clone()
      if (this.viewType === viewTypes.MONTH) {
        this.currentDate = date.clone().subtract(1, viewTypes.MONTH)
      } else {
        this.currentDate = date.clone().subtract(7, 'd')
      }
    },
    onNext () {
      const date = this.currentDate.clone()
      if (this.viewType === viewTypes.MONTH) {
        this.currentDate = date.clone().add(1, viewTypes.MONTH)
      } else {
        this.currentDate = date.clone().add(7, 'd')
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
    },
    async handleAddEvent (newEvent) {
      const { result, message, data } = await this.addEvent(newEvent)
      if (result) {
        this.dialog = false
        await this.getEvents()
        const event = this.events.find(event => event.id === data.id)
        this.setSelectedEvent(event)
      } else {
        setTimeout(() => alert(message))
      }
    },
    async handleUpdateEvent (newEvent) {
      const { result, message, data } = await this.updateEventById(newEvent)
      if (result) {
        this.dialog = false
        await this.getEvents()
        const event = this.events.find(event => event.id === data.id)
        this.setSelectedEvent(event)
      } else {
        setTimeout(() => alert(message))
      }
    },
    async handleMoveEvent (newEvent) {
      const { result, message, data } = await this.updateEventDateById(newEvent)
      if (result) {
        await this.getEvents()
        const event = this.events.find(event => event.id === data.id)
        this.setSelectedEvent(event)
      } else {
        setTimeout(() => alert(message))
      }
    },
    async handleDeleteEvent () {
      const { result, message } = await this.deleteEventById(this.dialogModel.id)
      if (result) {
        this.dialog = false
        await this.getEvents()
        setTimeout(() => alert('일정이 삭제되었습니다.'))
      } else {
        setTimeout(() => alert(message))
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
