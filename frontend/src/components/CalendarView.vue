<template>
  <div class="calendar__view">
    <div
      v-if="isMonthView"
      class="month-view"
    >
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
              v-for="(event, j) in eventsMap[day.format(dateFormat.DATE)]"
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
    <table
      v-else
      class="week-view"
    >
      <thead>
        <tr>
          <th />
          <th
            v-for="(day, index) in dayOfWeek"
            :key="index"
          >
            <span class="day">{{ day.format(dateFormat.DATE_AND_DAY) }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(hour, index) in hours"
          :key="index"
        >
          <td class="hour">
            <span>{{ hour.format(dateFormat.HOUR_AND_MIN) }}</span>
          </td>
          <td
            v-for="(day, i) in dayOfWeek"
            :key="i"
            class="hour"
            @dragover.prevent
            @dragenter.prevent
            @drop.prevent="onDrop(day, hour)"
            @click.stop="selectHour(day, hour)"
          >
            <div class="event-list">
              <div
                v-for="(event, j) in getEventsByMap(day, hour)"
                :key="j"
                :class="{ 'selected': event.selected }"
                class="event"
                draggable="true"
                @dragstart="onDragStart(event)"
                @click.stop="selectEvent(event)"
              >
                <span>{{ event.title }}</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { viewTypes } from '@/types/calendar'
import moment from 'moment'

export default {
  name: 'CalendarView',
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
    selectedEvent: {
      type: String,
      default: null
    },
    events: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      days: [],
      weeks: [],
      eventsMap: {},
      draggingEvent: null
    }
  },
  computed: {
    isMonthView () {
      return this.viewType === viewTypes.MONTH
    },
    dayOfWeek () {
      if (this.viewType === viewTypes.MONTH) {
        return moment.weekdays()
      } else {
        const startOfWeek = this.currentDate.clone().startOf('week').subtract(1, 'd')
        return moment.weekdays().map(() => startOfWeek.add(1, 'd').clone())
      }
    },
    hours () {
      return Array(24).fill('').map((_, i) => moment(i, 'hh'))
    }
  },
  watch: {
    events () {
      this.eventsMap = this.events.reduce((res, event) => {
        res[event.start.date] = res[event.start.date] ? [...res[event.start.date], event] : [event]
        return res
      }, {})
    },
    currentDate: {
      immediate: true,
      handler () {
        this.buildDays()
      }
    }
  },
  methods: {
    // TODO: 성능개선
    getEventsByMap (day, hour) {
      const events = this.eventsMap[day.format(this.dateFormat.DATE)]
      let res = []
      if (events) {
        res = events.filter(event => moment(event.start.dateTime).hours() === hour.hours())
      }
      return res
    },
    isToday (day) {
      return this.today.isSame(day)
    },
    isSameMonth (date) {
      return this.currentDate.month() === date.month()
    },
    buildDays () {
      const previous = this.daysOfPrevMonth()

      const monthDate = this.currentDate.clone().startOf(viewTypes.MONTH)
      const daysOfMonth = [...Array(monthDate.daysInMonth())].map((_, i) => monthDate.clone().add(i, 'day'))

      const next = this.daysOfNextMonth()

      this.days = [...previous, ...daysOfMonth, ...next]
    },
    daysOfPrevMonth () {
      const startOfMonth = this.currentDate.clone().startOf('month')
      const day = startOfMonth.day()
      const arr = []
      for (let i = day; i > 0; i--) {
        arr.push(startOfMonth.clone().subtract(i, 'd'))
      }
      return arr
    },
    daysOfNextMonth () {
      const endOfMonth = this.currentDate.clone().endOf('month')
      const day = endOfMonth.day()
      const arr = []
      for (let i = 1; i < 7 - day; i++) {
        arr.push(endOfMonth.clone().add(i, 'd'))
      }
      return arr
    },
    // TODO: event delegation
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
    onDragStart (event) {
      this.draggingEvent = event
    },
    onDrop (date, hour = null) {
      const event = this.draggingEvent
      if (event) {
        const { start, end } = event
        const newDate = hour ? date.clone().hours(hour.hours()) : date
        const payload = {
          ...event,
          start: {
            date: moment(start.date).date(newDate.date()).format(this.dateFormat.DATE),
            dateTime: moment(start.dateTime).date(newDate.date()).hour(newDate.hours()).format(this.dateFormat.DATE_TIME)
          },
          end: {
            date: moment(end.date).date(newDate.date()).format(this.dateFormat.DATE),
            dateTime: moment(end.dateTime).date(newDate.date()).hour(newDate.hours() + 1).format(this.dateFormat.DATE_TIME)
          }
        }
        this.$emit('event-moved', payload)
      }
      this.draggingEvent = null
    },
    formatDate (date) {
      return moment(date).format(this.dateFormat.TIME)
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
      grid-auto-rows: 1fr;
      border-top: 1px solid var(--color-dark-gray);
      border-left: 1px solid var(--color-dark-gray);
      & .day {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        border-bottom: 1px solid var(--color-dark-gray);
        border-right: 1px solid var(--color-dark-gray);
        background-color: transparent;
        color: var(--color-text);
        .day-num {
          height: 25px;
          width: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
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

  .event-list {
    width: 100%;
    text-align: left;
    overflow: auto;
    .event {
      display: flex;
      justify-content: space-between;
      padding: 3px;
      cursor: pointer;
      span {
        &:first-child {
          &:before {
            flex: none;
            margin: 0 3px 0 3px;
            content: '';
            display: inline-block;
            width: 10px;
            height: 10px;
            -moz-border-radius: 7.5px;
            -webkit-border-radius: 7.5px;
            border-radius: 7.5px;
            background-color: var(--color-info);
          }
        }
        &:last-child {
          font-size: .9em;
        }
      }
      &:hover, &:focus {
        outline: none;
        background-color: var(--color-gray);
        color: var(--color-text);
      }
      &:active {
        color: var(--color-secondary);
      }
      &.selected {
        background-color: var(--color-primary);
      }
    }
  }

  table.week-view {
    width: 100%;
    height: 100%;
    border-spacing: 0;
    border-collapse: separate;
    table-layout: fixed;
    thead {
      tr {
        th {
          background: var(--color-primary);
          color: var(--color-text);
          padding: 0.5em;
          overflow: hidden;
          &:first-child {
            width: 50px;
            border-radius: 3px 0 0 0;
          }
          &:last-child {
            border-radius: 0 3px 0 0;
          }
          .day {
            font-size: 1.2em;
            border-radius: 50%;
            line-height: 1.8;
            &.active {
              background: var(--color-gray);
              color: var(--color-primary);
            }
          }
          .short {
            display: none;
          }
          i {
            vertical-align: middle;
            font-size: 2em;
          }
        }
      }
    }

    tbody {
      tr {
        background: var(--color-gray);
        height: calc(100%/24);
        &:nth-child(odd) {
          background: var(--color-gray);
        }
        &:nth-child(4n+0) {
          td {
            border-bottom: 1px solid var(--color-primary);
          }
        }
        td {
          text-align: center;
          vertical-align: middle;
          border-left: 1px solid var(--color-dark-gray);
          border-bottom: 1px solid var(--color-dark-gray);
          position: relative;
          height: 32px;
          &:last-child {
            border-right: 1px solid var(--color-dark-gray);
          }
          &.hour {
            font-size: 1.2em;
            padding: 0;
            color: var(--color-text);
            background: #fff;
            border-bottom: 1px solid var(--color-dark-gray);
            border-collapse: separate;
            min-width: 100px;
            span {
              display: block;
            }
          }
        }
      }
    }
  }
</style>
