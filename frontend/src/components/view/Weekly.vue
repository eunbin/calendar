<template>
  <table class="week-view">
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
          <dl class="event-list">
            <dt
              v-for="(event, j) in getEventsByMap(day, hour)"
              :key="j"
              :class="{ 'selected': event.selected }"
              class="event"
              draggable="true"
              @dragstart="onDragStart(event)"
              @click.stop="selectEvent(event)"
            >
              <span>{{ event.title }}</span>
            </dt>
          </dl>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import moment from 'moment'
import dateMixin from '@/mixins/date'

export default {
  name: 'Weekly',
  mixins: [dateMixin],
  props: {
    currentDate: {
      type: Object,
      default: null
    },
    eventsMap: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    dayOfWeek () {
      const startOfWeek = this.currentDate.clone().startOf('week').subtract(1, 'd')
      return moment.weekdays().map(() => startOfWeek.add(1, 'd').clone())
    },
    hours () {
      return Array(24).fill('').map((_, i) => moment(i, 'hh'))
    }
  },
  methods: {
    getEventsByMap (day, hour) {
      const events = this.eventsMap[day.format(this.dateFormat.DATE)]
      if (events) {
        return events.filter(event => moment(event.start.dateTime).hours() === hour.hours())
      }
      return []
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
    selectHour (day, hour) {
      this.$emit('hour-selected', day, hour)
    },
    onDragStart (event) {
      this.draggingEvent = event
    },
    // TODO: event delegation
    selectEvent (event) {
      this.$emit('event-selected', event)
    }
  }
}
</script>

<style lang="scss" scoped>
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
