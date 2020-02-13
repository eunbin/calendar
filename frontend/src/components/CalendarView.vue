<template>
  <div class="calendar-view">
    <div class="day-of-week">
      <div>일</div>
      <div>월</div>
      <div>화</div>
      <div>수</div>
      <div>목</div>
      <div>금</div>
      <div>토</div>
    </div>
    <div
        v-if="viewType === 'month'"
        class="date-grid">
      <div v-for="(day, index) in days"
           :key="index"
           :style="{ gridColumn: column(index) }"
           class="day"
           @dragover.prevent
           @dragenter.prevent
           @drop.prevent="onDrop(day)"
           @click.stop="selectDay(day)">
        <div class="day-num"
             :class="{ 'today': today(day) }">{{ `${day.date()}일` }}</div>
        <div class="event-list">
          <div v-for="(event, index) in eventsMap[day.format('YYYY-MM-DD')]"
               :key="index"
               :class="{ 'selected': event.selected }"
               class="event"
               draggable="true"
               @dragstart="onDragStart(event)"
               @click.stop="selectEvent(event)">
            <span>{{ event.title }}</span>
            <span>{{ formatDate(event.start.dateTime) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      주
    </div>
  </div>
</template>

<script>
import { dateFormat } from '@/date'
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
    selectedDate: {
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
      eventsMap: {},
      draggingEvent: null
    }
  },
  watch: {
    events () {
      this.eventsMap = this.events.reduce((res, event) => {
        if (res[event.start.date]) {
          res[event.start.date].push(event)
        } else {
          res[event.start.date] = [event]
        }
        return res
      }, {})
    },
    currentDate () {
      this.buildDays()
    }
  },
  mounted () {
    this.buildDays()
  },
  methods: {
    column (index) {
      // 첫번째 시작위치
      if (index === 0) {
        return this.days[0].day() + 1
      }
    },
    today (day) {
      return this.selectedDate && this.selectedDate.isSame(day, 'day')
    },
    buildDays () {
      const monthDate = this.currentDate.clone().startOf('month')
      this.days = [...Array(monthDate.daysInMonth())].map((_, i) => {
        return monthDate.clone().add(i, 'day')
      })
    },
    // TODO: event delegation
    selectEvent (event) {
      this.$emit('event-selected', event)
    },
    selectDay (date) {
      this.$emit('day-selected', date)
    },
    onDragStart (event) {
      this.draggingEvent = event
    },
    onDrop (newDate) {
      const event = this.draggingEvent
      if (event) {
        const { start, end } = event
        const payload = {
          ...event,
          start: {
            date: moment(start.date).date(newDate.date()).format('YYYY-MM-DD'),
            dateTime: moment(start.dateTime).date(newDate.date()).format('YYYY-MM-DD HH:mm')
          },
          end: {
            date: moment(end.date).date(newDate.date()).format('YYYY-MM-DD'),
            dateTime: moment(end.dateTime).date(newDate.date()).format('YYYY-MM-DD HH:mm')
          }
        }
        this.$emit('day-changed', event.id, payload)
      }
      this.draggingEvent = null
    },
    formatDate (date) {
      return moment(date).format(dateFormat.HHA)
    }
  }
}
</script>

<style lang="scss" scoped>
  .calendar-view {
    width: 100%;
    height: calc(100% - 50px);
  }

  .day-of-week,
  .date-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
  .date-grid {
    height: 100%;
  }

  .day-of-week {
    margin-top: 1.25em;
  }

  .day-of-week > * {
    font-size: 1.2em;
    color: var(--color-text);
    font-weight: 500;
    letter-spacing: 0.1em;
    text-align: center;
  }

  .date-grid {
    margin-top: 0.5em;
    grid-template-rows: repeat(5, 1fr);
  }

  .date-grid .day {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    border: 1px solid #000;
    background-color: transparent;
    color: var(--color-text);
    overflow: auto;

    .day-num {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      &.today {
        background-color: var(--color-primary);
        color: var(--color-text);
      }
    }

    .event-list {
      width: 100%;
      text-align: left;
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
        &:hover,
        &:focus {
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
  }

</style>
