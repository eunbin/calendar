<template>
  <div class="calendar__view">
    <template v-if="isMonthView">
      <monthly
        :current-date="currentDate"
        :events-map="eventsMap"
        :today="today"
        @day-selected="selectDay"
        @event-selected="selectEvent"
        @event-moved="onMoveEvent"
      />
    </template>
    <template v-else>
      <weekly
        :current-date="currentDate"
        :events-map="eventsMap"
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
import moment from 'moment'

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
  data () {
    return {
      eventsMap: {}
    }
  },
  computed: {
    isMonthView () {
      return this.viewType === viewTypes.MONTH
    }
  },
  watch: {
    events () {
      this.eventsMap = this.events.reduce((res, event) => {
        res[event.start.date] = res[event.start.date] ? [...res[event.start.date], event] : [event]
        return res
      }, {})
    }
  },
  methods: {
    // TODO: 성능개선
    getEventsByMap (day, hour) {
      const events = this.eventsMap[day.format(this.dateFormat.DATE)]
      if (events) {
        return events.filter(event => moment(event.start.dateTime).hours() === hour.hours())
      }
      return []
    },
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
