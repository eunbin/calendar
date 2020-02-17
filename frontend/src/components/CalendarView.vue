<template>
  <div class="calendar__view">
    <template v-if="isMonthView">
      <monthly
        :current-date="currentDate"
        :today="today"
        @day-selected="selectDay"
        @event-selected="selectEvent"
        @event-moved="onMoveEvent"
      />
    </template>
    <template v-else>
      <weekly
        :current-date="currentDate"
        @hour-selected="selectHour"
        @event-selected="selectEvent"
        @event-moved="onMoveEvent"
      />
    </template>
  </div>
</template>

<script>
import Monthly from '@/components/view/Monthly'
import Weekly from '@/components/view/Weekly'
import { viewTypes } from '@/types/calendar'

export default {
  name: 'CalendarView',
  components: { Monthly, Weekly },
  props: {
    viewType: {
      type: String,
      default: ''
    },
    currentDate: {
      type: Object,
      default: null
    },
    today: {
      type: Object,
      default: null
    },
    events: {
      type: Array,
      default: null
    }
  },
  computed: {
    isMonthView () {
      return this.viewType === viewTypes.MONTH
    }
  },
  methods: {
    selectEvent (event) {
      this.$emit('event-selected', event)
    },
    selectDay (date) {
      this.$emit('day-selected', date)
    },
    selectHour (date, hour) {
      date.hours(hour.hours())
      this.$emit('hour-selected', date)
    },
    onMoveEvent (payload) {
      this.$emit('event-moved', payload)
    }
  }
}
</script>
