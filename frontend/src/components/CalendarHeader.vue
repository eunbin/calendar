<template>
  <header>
    <div class="nav">
      <button @click="prev">
        이전
      </button>
      <h1>{{ title }}</h1>
      <button @click="next">
        다음
      </button>
    </div>
    <div class="view-type">
      <button
        v-for="(obj, index) in viewTypeList"
        :key="index"
        :class="{ active: isSelected(obj.value) }"
        @click="setViewType(obj.value)"
      >
        {{ obj.label }}
      </button>
    </div>
  </header>
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
    },
    isSelected (obj) {
      return obj.value === this.type
    }
  }
}
</script>

<style lang="scss" scoped>
$header-height: 50px;

@mixin btn--normal {
  background-color: var(--color-gray);
  width: 100px;
  height: 100%;
  border: none;
  cursor: pointer;
}

header {
  position: relative;
  height: $header-height;
  display: flex;
  justify-content: center;
  color: var(--color-primary);

  .nav {
    display: flex;
    align-items: center;
    & button {
      @include btn--normal;
    }
    & h1 {
      font-size: 2em;
      margin: 0 0.3em 0 0.3em;
    }
  }

  .view-type {
    position: absolute;
    right: 0;
    height: 100%;
    button {
      @include btn--normal;
      &:not(:last-child) {
        border-right: 1px solid #fff;
      }
      &:hover, &.active {
        background-color: var(--color-secondary);
      }
    }
  }
}
</style>
