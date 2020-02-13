<template>
  <div class="modal"
       :class="{ show: value }">
    <div class="modal__inner">
      <button class="modal__close" @click="close"></button>
      <h2>일정 {{ isAdd ? '등록' : '수정'}}</h2>
      <div class="form">
        <div>
          <label for="title">일정 제목</label>
          <input v-model="model.title" id="title" type="text">
        </div>
        <div>
          <label for="startDate">시작시간</label>
          <date-pick v-model="model.start.dateTime"
                     start-week-on-sunday
                     pick-time
                     :format="datePickerFormat"
                     id="startDate"
                     @input="onChangeStartDateTime"></date-pick>
        </div>
        <div>
          <label for="endDate">종료시간</label>
          <date-pick v-model="model.end.dateTime"
                     start-week-on-sunday
                     pick-time
                     :format="datePickerFormat"
                     id="endDate"
                     @input="onChangeEndDateTime"></date-pick>
        </div><div>
      </div>
      </div>
      <p v-if="errors.length"
         class="validation">
        <b>아래 에러를 확인해주세요.</b>
        <ul>
          <li v-for="(error, index) in errors"
              :key="index">{{ error }}
          </li>
        </ul>
      </p>
      <div class="modal__action">
        <button @click="close">취소</button>
        <button v-show="!isAdd" class="accent" @click="deleteEvent">삭제</button>
        <button class="info" @click="submit">{{ isAdd ? '등록' : '저장'}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import DatePick from 'vue-date-pick'
import 'vue-date-pick/dist/vueDatePick.css'
import moment from 'moment'
import { cloneDeep } from 'lodash-es'
// import { dateFormat } from '@/date'

export default {
  name: 'EventModal',
  components: { DatePick },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object
    }
  },
  data () {
    return {
      model: null,
      errors: []
    }
  },
  computed: {
    isAdd () {
      return !this.event.id
    },
    datePickerFormat () {
      return 'YYYY-MM-DD HH:mm'
    }
  },
  watch: {
    event: {
      immediate: true,
      handler () {
        this.model = cloneDeep(this.event)
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
    onChangeStartDateTime (val) {
      const startDateTime = moment(val)
      const endDateTime = startDateTime.clone().add(1, 'hour')
      this.model.start.date = startDateTime.format('YYYY-MM-DD')
      this.model.end.date = endDateTime.format('YYYY-MM-DD')
      this.model.end.dateTime = endDateTime.format('YYYY-MM-DD HH:mm')
    },
    onChangeEndDateTime (val) {
      const endDateTime = moment(val)
      const startDateTime = endDateTime.clone().subtract(1, 'hour')
      this.model.end.date = endDateTime.format('YYYY-MM-DD')
      this.model.start.date = startDateTime.format('YYYY-MM-DD')
      this.model.start.dateTime = startDateTime.format('YYYY-MM-DD HH:mm')
    },
    submit () {
      if (this.isValidForm()) {
        this.$emit('submit', this.model, this.isAdd)
      }
    },
    deleteEvent () {
      this.$emit('delete')
    },
    close () {
      this.$emit('close')
    },
    isValidForm () {
      if (this.model.title && this.model.start && this.model.end) {
        return true
      }
      this.errors = []
      if (!this.model.title) {
        this.errors.push('일정 제목 입력은 필수입니다.')
      }
      if (!this.model.start) {
        this.errors.push('시작날짜 입력은 필수입니다.')
      }
      if (!this.model.end) {
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
    },
    addEventListeners () {
      document.addEventListener('keydown', this.handleKeyDown)
      document.addEventListener('click', this.handleClick)
    },
    removeEventListeners () {
      document.addEventListener('keydown', this.handleKeyDown)
      document.addEventListener('click', this.handleClick)
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal {
    opacity: 0;
    visibility: hidden;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: left;
    background: rgba(0, 0, 0, .5);
    transition: opacity .25s ease;
  }

  .modal__bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    cursor: pointer;
  }

  .modal-state {
    display: none;
  }

  .show  {
    opacity: 1;
    visibility: visible;
  }

  .modal__inner {
    transition: top .25s ease;
    position: absolute;
    top: -20%;
    right: 0;
    bottom: 0;
    left: 0;
    width: 50%;
    margin: auto;
    overflow: auto;
    background: #fff;
    border-radius: 5px;
    padding: 1em 2em;
    height: 700px;

    & .form {
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

  .modal__close {
    position: absolute;
    right: 1em;
    top: 1em;
    width: 1.1em;
    height: 1.1em;
    cursor: pointer;
  }

  .modal__close:after,
  .modal__close:before {
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

  .modal__close:hover:after,
  .modal__close:hover:before {
    background: #aaa;
  }

  .modal__close:before {
    transform: rotate(-45deg);
  }
</style>
