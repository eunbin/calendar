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
      @day-selected="onSelectDay"></calendar-view>
    <event-modal v-model="dialog"
                 :event="dialogModel"
                 @submit="onSubmit"
                 @close="onCloseDialog"></event-modal>
  </div>
</template>

<script>
import CalendarHeader from '@/components/CalendarHeader'
import CalendarView from '@/components/CalendarView'
import EventModal from '@/components/EventModal'
import { viewType } from '@/constant/constant'
import moment from 'moment'
import axios from 'axios'

export default {
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
      this.getEvents()
    }
  },
  created () {
    this.selectedDate = this.currentDate

    this.currentDate = moment()
    this.getEvents()
  },
  methods: {
    async getEvents () {
      const year = this.currentDate.year()
      const month = this.currentDate.month() + 1
      // TODO: split service layer
      try {
        const res = await axios.get(`http://localhost:4000/events/${year}/${month}`)
        this.events = res.data
      } catch (e) {
        console.error(e)
      }
    },
    onSelectEvent (event) {
      this.events.filter(event => event.selected).forEach(event => (event.selected = false))
      this.$set(event, 'selected', !event.selected)
      this.dialog = true
      this.dialogModel = event
    },
    onSelectDay (day) {
      this.dialog = true
    },
    onChangeViewType (viewType) {
      this.viewType = viewType
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
    onSubmit (event) {
    },
    onCloseDialog () {
      this.dialog = false
      this.dialogModel = null
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
