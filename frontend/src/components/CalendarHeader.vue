<template>
  <div class="month-indicator">
    <div class="nav">
      <button @click="prevMonth">
        이전
      </button>
      <span>{{ title }}</span>
      <button @click="nextMonth">
        다음
      </button>
    </div>
    <div class="btn-group">
      <button @click="setViewType('month')">월</button>
      <button @click="setViewType('week')">주</button>
    </div>
  </div>
</template>

<script>
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
      month: '12',
      type: this.viewType
    }
  },
  computed: {
    title () {
      return `${this.currentDate.format('YYYY')}년 ${this.currentDate.format('M')}월`
    }
  },
  methods: {
    setViewType (newType) {
      this.type = newType
      this.$emit('change', this.type)
    },
    prevMonth () {
      this.$emit('prev')
    },
    nextMonth () {
      this.$emit('next')
    }
  }
}
</script>

<style lang="scss">
  .month-indicator {
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
