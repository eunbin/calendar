<template>
  <div
    role="dialog"
    class="modal"
    :class="{ show: value }"
  >
    <div class="modal__inner">
      <button
        class="modal__close"
        @click="close"
      />
      <h2>{{ modalTitle }}</h2>
      <div class="form">
        <div>
          <label for="title">일정 제목</label>
          <input
            id="title"
            v-model="model.title"
            type="text"
            maxlength="30"
          >
        </div>
        <div>
          <label for="startDate">시작 시간</label>
          <date-pick
            id="startDate"
            v-model="model.start.dateTime"
            start-week-on-sunday
            pick-time
            :format="dateFormat.DATE_TIME"
            @input="onChangeStartDateTime"
          />
        </div>
        <div>
          <label for="endDate">종료 시간</label>
          <date-pick
            id="endDate"
            v-model="model.end.dateTime"
            start-week-on-sunday
            pick-time
            :format="dateFormat.DATE_TIME"
            @input="onChangeEndDateTime"
          />
        </div>
      </div>
      <div
        v-if="errors.length"
        class="validation"
      >
        <b>아래 에러를 확인해주세요.</b>
        <ul>
          <li
            v-for="(error, index) in errors"
            :key="index"
          >
            {{ error }}
          </li>
        </ul>
      </div>
      <div class="modal__action">
        <button @click="close">
          취소
        </button>
        <button
          v-if="!isAdd"
          class="accent"
          @click="deleteEvent"
        >
          삭제
        </button>
        <button
          class="info"
          @click="submit"
        >
          {{ submitButtonLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DatePick from 'vue-date-pick'
import moment from 'moment'
import { modalTitles } from '@/types/calendar'

export default {
  name: 'EventModal',
  components: { DatePick },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      model: null,
      errors: []
    }
  },
  computed: {
    modalTitle () {
      return this.isAdd ? modalTitles.ADD_EVENT : modalTitles.UPDATE_EVENT
    },
    isAdd () {
      return !this.model.id
    },
    submitButtonLabel () {
      return this.isAdd ? '등록' : '저장'
    }
  },
  watch: {
    event: {
      immediate: true,
      handler () {
        this.model = { ...this.event }
        this.errors = []
      }
    }
  },
  created () {
    this.addEventListeners()
  },
  beforeDestroy () {
    this.removeEventListeners()
  },
  methods: {
    addEventListeners () {
      document.addEventListener('keydown', this.handleKeyDown)
      document.addEventListener('click', this.handleClick)
    },
    removeEventListeners () {
      document.addEventListener('keydown', this.handleKeyDown)
      document.addEventListener('click', this.handleClick)
    },
    onChangeStartDateTime (val) {
      const startDateTime = moment(val)
      const endDateTime = startDateTime.clone().add(1, 'hour')
      this.model.start.date = startDateTime.format(this.dateFormat.DATE)
      this.model.end.date = endDateTime.format(this.dateFormat.DATE)
      this.model.end.dateTime = endDateTime.format(this.dateFormat.DATE_TIME)
    },
    onChangeEndDateTime (val) {
      const endDateTime = moment(val)
      const startDateTime = endDateTime.clone().subtract(1, 'hour')
      this.model.end.date = endDateTime.format(this.dateFormat.DATE)
      this.model.start.date = startDateTime.format(this.dateFormat.DATE)
      this.model.start.dateTime = startDateTime.format(this.dateFormat.DATE_TIME)
    },
    submit () {
      if (!this.isValidForm()) {
        return
      }
      if (this.isAdd) {
        this.$emit('add', this.model)
      } else {
        this.$emit('update', this.model)
      }
    },
    deleteEvent () {
      this.$emit('delete')
    },
    close () {
      this.$emit('close')
    },
    isValidForm () {
      const isStartNotEmpty = this.model.start && this.model.start.date && this.model.start.dateTime
      const isEndNotEmpty = this.model.end && this.model.end.date && this.model.end.dateTime
      if (this.model.title && isStartNotEmpty && isEndNotEmpty) {
        return true
      }
      this.errors = []
      if (!this.model.title) {
        this.errors.push('일정 제목 입력은 필수입니다.')
      }
      if (!isStartNotEmpty) {
        this.errors.push('시작날짜 입력은 필수입니다.')
      }
      if (!isEndNotEmpty) {
        this.errors.push('종료날짜 입력은 필수입니다.')
      }
      return false
    },
    handleKeyDown (e) {
      const keyCode = e.keyCode
      if (keyCode === 27) {
        this.close()
      }
    },
    handleClick (e) {
      // FIXME: date-picker close
      if (!e.target.closest('.modal__inner')) {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: left;
    background: rgba(0, 0, 0, .5);
    transition: opacity .25s ease;

    &.show  {
      opacity: 1;
      visibility: visible;
    }

    .modal__inner {
      transition: top .25s ease;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 500px;
      height: 500px;
      background: #fff;
      border-radius: 5px;
      padding: 1em 2em;

      .form {
        margin-top: 1em;
        margin-bottom: 1em;
        input {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 14px;
        }
      }
      .validation {
        color: var(--color-accent);
        font-size: .8em;
      }

      .modal__close {
        position: absolute;
        right: 1em;
        top: 1em;
        width: 1.1em;
        height: 1.1em;
        border: none;
        cursor: pointer;
        &:after,
        &:before {
          content: '';
          position: absolute;
          width: 2px;
          height: 1.5em;
          background: #ccc;
          display: block;
          transform: rotate(45deg);
          left: 50%;
          margin: -3px 0 0 -1px;
          top: 0;
        }

        &:hover:after,
        &:hover:before {
          background: #aaa;
        }

        &:before {
          transform: rotate(-45deg);
        }
      }

      .modal__action {
        display: flex;
        justify-content: flex-end;
        > button {
          border: none;
          background-color: var(--color-gray);
          padding: 16px 32px;
          text-decoration: none;
          margin: 4px 2px;
          cursor: pointer;
          &.info {
            background-color: var(--color-info);
            color: white;
          }
          &.accent {
            background-color: var(--color-accent);
            color: white;
          }
        }
      }
    }

  }
</style>
