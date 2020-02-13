<template>
  <div class="calendar-view">
    <template v-if="viewType === 'month'">
      <div class="day-of-week">
        <div v-for="(day, index) in dayOfWeek" :key="index">
          {{ day }}
        </div>
      </div>
      <div class="date-grid">
        <div v-for="(day, index) in days"
             :key="index"
             :style="{ gridColumn: column(index) }"
             class="day"
             @dragover.prevent
             @dragenter.prevent
             @drop.prevent="onDrop(day)"
             @click.stop="selectDay(day)">
          <div class="day-num"
               :class="{ 'today': isToday(day) }">{{ `${day.date()}일` }}</div>
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
    </template>
    <template v-else>
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="(day, index) in dayOfWeek" :key="index">
              <span class="day">{{ day.format('DD (dd)') }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hour, index) in hours"
              :key="index">
            <td class="hour"><span>{{ hour.format('LT') }}</span></td>
            <td v-for="(day, index) in dayOfWeek"
                :key="index"
                class="hour"
                @dragover.prevent
                @dragenter.prevent
                @drop.prevent="onDrop(day, hour)"
                @click.stop="selectDay(day, hour)"
                @click="selectHour(day, hour)">
              <div class="event-list">
                <div v-for="(event, index) in getEventsByMap(day, hour)"
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
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
// import { dateFormat } from '@/date'
import moment from 'moment'
import { viewType } from '@/constant/constant'

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
    dayOfWeek () {
      if (this.viewType === viewType.month) {
        return moment.weekdays()
      } else {
        const today = this.currentDate.clone()
        const fromDate = today.startOf('week').subtract(1, 'd')
        const res = moment.weekdays().reduce((obj, cur) => {
          const date = fromDate.add(1, 'd')
          obj.push(date.clone())
          return obj
        }, [])
        return res
      }
    },
    hours () {
      return Array(24).fill('').map((val, i) => moment(i, 'hh'))
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
    // TODO: 성능개선
    getEventsByMap (day, hour) {
      const events = this.eventsMap[day.format('YYYY-MM-DD')]
      let res = []
      if (events) {
        res = events.filter(event => moment(event.start.dateTime).hours() === hour.hours())
      }

      return res
    },
    column (index) {
      // 첫번째 시작위치
      if (index === 0) {
        return this.days[0].day() + 1
      }
    },
    isToday (day) {
      return this.today.isSame(day)
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
    selectDay (date, hour = null) {
      if (hour) {
        date.hours(hour.hours())
      }
      this.$emit('day-selected', date)
    },
    selectHour (day, hour) {
      console.log(day, hour.hours())
      // ?
    },
    onDragStart (event) {
      this.draggingEvent = event
    },
    onDrop (date, hour = null) {
      let newDate = date
      if (hour) {
        // TODO: clone () ?
        newDate = date.hours(hour.hours())
      }
      const event = this.draggingEvent
      if (event) {
        const { start, end } = event
        const payload = {
          ...event,
          start: {
            date: moment(start.date).date(newDate.date()).format('YYYY-MM-DD'),
            dateTime: moment(start.dateTime).date(newDate.date()).hour(newDate.hours()).format('YYYY-MM-DD HH:mm')
          },
          end: {
            date: moment(end.date).date(newDate.date()).format('YYYY-MM-DD'),
            dateTime: moment(end.dateTime).date(newDate.date()).hour(newDate.hours()).format('YYYY-MM-DD HH:mm')
          }
        }
        this.$emit('day-changed', event.id, payload)
      }
      this.draggingEvent = null
    },
    formatDate (date) {
      return moment(date).format('LT')
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
    cursor: pointer;

    .day-num {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      &.today {
        background-color: var(--color-accent);
        color: var(--color-text);
      }
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
  table{
    margin-top: 10px;
    font-family:sans-serif;
    width: 100%;
    border-spacing: 0;
    border-collapse: separate;
    table-layout: fixed;
    margin-bottom: 50px;

    thead{
      tr{
        th{
          background: var(--color-primary);
          color: var(--color-text);
          padding: 0.5em;
          overflow: hidden;

          &:first-child{
            border-radius:3px 0 0 0;
          }
          &:last-child{
            border-radius:0 3px  0 0;
          }

          .day{
            font-size: 1.2em;
            border-radius: 50%;
            line-height: 1.8;

            &.active{
              background: var(--color-gray);
              color: var(--color-primary);
            }
          }

          .short{
            display: none;
          }

          i{
            vertical-align: middle;
            font-size: 2em;
          }
        }
      }
    }
    tbody{
      tr{
        background: var(--color-gray);

        &:nth-child(odd){
          background:var(--color-gray);
        }
        &:nth-child(4n+0){
          td{
            border-bottom:1px solid var(--color-primary);
          }
        }
        td{
          text-align: center;
          vertical-align: middle;
          border-left: 1px solid var(--color-primary);
          border-bottom: 1px solid var(--color-primary);
          position: relative;
          height: 32px;
          cursor: pointer;

          &:last-child{
            border-right:1px solid var(--color-primary);
          }
          &.hour{
            font-size: 1.2em;
            padding: 0;
            color: var(--color-text);
            background:#fff;
            border-bottom:1px solid var(--color-primary);
            border-collapse: separate;
            min-width: 100px;
            cursor: pointer;

            span{
              display: block;

            }
          }
        }
      }
    }
  }

</style>
