<template>
  <div class="calendar__header">
    <div class="nav">
      <button @click="prev">
        이전
      </button>
      <span>{{ title }}</span>
      <button @click="next">
        다음
      </button>
    </div>
    <div class="btn-group">
      <button
        v-for="(obj, index) in viewTypeList"
        :key="index"
        @click="setViewType(obj.value)"
      >
        {{ obj.label }}
      </button>
    </div>
  </div>
</template>

<script>
import { viewTypes } from '@/types/calendar'

export default {
  name: 'CalendarHeader',
  props: {
    viewType: {
      type: String,
      default: ''
    },
    currentDate: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      type: this.viewType
    }
  },
  computed: {
    title () {
      return this.currentDate.format(this.dateFormat.YEAR_AND_MONTH)
    },
    viewTypeList () {
      return [{
        value: viewTypes.MONTH,
        label: '월'
      }, {
        value: viewTypes.WEEK,
        label: '주'
      }]
    }
  },
  methods: {
    setViewType (newType) {
      this.type = newType
      this.$emit('change', this.type)
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      this.$emit('next')
    }
  }
}
</script>

<style lang="scss" scoped>
  .calendar__header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    color: var(--color-primary);
    text-align: center;
    font-weight: 500;

    .nav {
      display: flex;
      & button {
        width: 100px;
        cursor: pointer;
      }
      & span {
        font-size: 2em;
        margin: 0 0.3em 0 0.3em;
      }
    }

    .btn-group button {
      background-color: var(--color-primary);
      border: 1px solid var(--color-primary);
      width: 100px;
      height: 100%;
      cursor: pointer;
    }

    .btn-group button:not(:last-child) {
      border-right: none;
    }

    .btn-group button:hover {
      background-color: var(--color-primary);
    }
  }
</style>
