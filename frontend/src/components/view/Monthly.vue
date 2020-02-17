<template>
  <div class="month-view">
    <div class="days-of-week">
      <span
        v-for="(day, index) in dayOfWeek"
        :key="index"
        class="day column"
      >
        {{ day }}
      </span>
    </div>
    <div class="days-of-month">
      <div
        v-for="(day, i) in days"
        :key="i"
        class="day"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="onDrop(day)"
        @click.stop="selectDay(day)"
      >
        <div
          class="day-num"
          :class="{
            'today': isToday(day),
            'dim': !isSameMonth(day)}"
        >
          {{ day.date() }}
        </div>
        <dl class="event-list">
          <dt
            v-for="(event, j) in getEventsMap(day)"
            :key="j"
            :class="{ 'selected': event.selected }"
            class="event"
            draggable="true"
            @dragstart="onDragStart(event)"
            @click.stop="selectEvent(event)"
          >
            <span>{{ event.title }}</span>
            <span>{{ formatDate(event.start.dateTime) }}</span>
          </dt>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Monthly',
  props: {
    currentDate: {
      type: Object,
      default: null
    },
    today: {
      type: Object,
      default: null
    },
    eventsMap: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      days: []
    }
  },
  computed: {
    dayOfWeek () {
      return moment.weekdays()
    }
  },
  watch: {
    currentDate: {
      immediate: true,
      handler () {
        this.buildDays()
      }
    }
  },
  methods: {
    buildDays () {
      const previous = this.daysOfPrevMonth()

      const monthDate = this.currentDate.clone().startOf('month')
      const daysOfMonth = [...Array(monthDate.daysInMonth())].map((_, i) => monthDate.clone().add(i, 'day'))

      const next = this.daysOfNextMonth()

      this.days = [...previous, ...daysOfMonth, ...next]
    },
    daysOfPrevMonth () {
      const startOfMonth = this.currentDate.clone().startOf('month')
      const day = startOfMonth.day()
      const arr = []
      const SUNDAY_NUM = 0
      for (let i = day; i > SUNDAY_NUM; i--) {
        arr.push(startOfMonth.clone().subtract(i, 'd'))
      }
      return arr
    },
    daysOfNextMonth () {
      const endOfMonth = this.currentDate.clone().endOf('month')
      const day = endOfMonth.day()
      const arr = []
      const MAX_DAY = 7
      for (let i = 1; i < MAX_DAY - day; i++) {
        arr.push(endOfMonth.clone().add(i, 'd'))
      }
      return arr
    },
    isToday (day) {
      return this.today.isSame(day)
    },
    isSameMonth (date) {
      return this.currentDate.month() === date.month()
    },
    formatDate (date) {
      return moment(date).format(this.dateFormat.TIME)
    },
    getEventsMap (day) {
      return this.eventsMap[day.format(this.dateFormat.DATE)]
    },
    onDrop (date, hour) {
      const event = this.draggingEvent
      if (event) {
        const { start, end } = event
        const newDate = hour ? date.clone().hours(hour.hours()) : date.clone().hours(moment(start.dateTime).hours())
        const payload = {
          ...event,
          start: {
            date: moment(start.date).month(newDate.month()).date(newDate.date()).format(this.dateFormat.DATE),
            dateTime: moment(start.dateTime).month(newDate.month()).date(newDate.date()).hour(newDate.hours()).format(this.dateFormat.DATE_TIME)
          },
          end: {
            date: moment(end.date).month(newDate.month()).date(newDate.date()).format(this.dateFormat.DATE),
            dateTime: moment(end.dateTime).month(newDate.month()).date(newDate.date()).hour(newDate.hours() + 1).format(this.dateFormat.DATE_TIME)
          }
        }
        this.$emit('event-moved', payload)
      }
      this.draggingEvent = null
    },
    selectDay (date) {
      this.$emit('day-selected', date)
    },
    onDragStart (event) {
      this.draggingEvent = event
    },
    selectEvent (event) {
      this.$emit('event-selected', event)
    }
  }
}
</script>

<style lang="scss" scoped>
$day-width: 100% / 7;

.month-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  .days-of-week,
  .days-of-month {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(auto-fit, minmax(50px, 1fr));
  }
  .days-of-month {
    height: 100%;
  }
  .days-of-week {
    height: 44px;
    line-height: 44px;
    background-color: var(--color-primary);
    & > * {
      font-size: 1.2em;
      color: var(--color-text);
      font-weight: 500;
      letter-spacing: 0.1em;
      text-align: center;
    }
  }

  .days-of-month {
    border-top: 1px solid var(--color-dark-gray);
    border-left: 1px solid var(--color-dark-gray);
    & .day {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-start;
      overflow-x: hidden;
      border-bottom: 1px solid var(--color-dark-gray);
      border-right: 1px solid var(--color-dark-gray);
      background-color: transparent;
      color: var(--color-text);

      .day-num {
        height: 25px;
        width: 25px;
        border-radius: 50%;
        display: block;
        text-align: center;
        line-height: 25px;
        background-color: transparent;
        font-weight: bold;
        &.today {
          background-color: var(--color-accent);
          color: #fff;
        }
        &.dim {
          color: #ccc;
        }
      }
    }
  }
}
</style>
