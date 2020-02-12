<template>
  <div class="modal"
       :class="{ show: value }">
    <div class="modal__inner">
      <button class="modal__close" @click="close"></button>
      <h2>일정 {{ isAdd ? '등록' : '수정'}}</h2>
      <form @submit.prevent="submit">
        <div>
          <label for="title">일정 제목</label>
          <input v-model="model.title" id="title" type="text">
        </div>
        <div>
          <label for="startDate">시작시간</label>
          <date-pick v-model="model.startDate"
                     start-week-on-sunday
                     pick-time
                     :format="datePickerFormat"
                     id="startDate"></date-pick>
        </div>
        <div>
          <label for="endDate">종료시간</label>
          <date-pick v-model="model.endDate"
                     start-week-on-sunday
                     pick-time
                     :format="datePickerFormat"
                     id="endDate"></date-pick>
        </div><div>
      </div>
      </form>
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
        <button class="accent" type="submit" @click="submit">{{ isAdd ? '등록' : '저장'}}</button>
        <button @click="close">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import DatePick from 'vue-date-pick'
import 'vue-date-pick/dist/vueDatePick.css'
// import { dateFormat } from '@/date'
import moment from 'moment'

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
      model: {},
      errors: []
    }
  },
  computed: {
    isAdd () {
      return !this.event.id
    },
    datePickerFormat () {
      // return 'YYYY-MM-DD HH:mm'
      return moment.defaultFormat
    }
  },
  watch: {
    event: {
      handler () {
        // TODO:
        if (this.isAdd) {
          const now = moment().minutes(0).seconds(0).milliseconds(0)
          this.model = {
            ...this.event,
            startDate: now.format(),
            endDate: now.add(1, 'hour').format()
          }
        } else {
          this.model = {
            ...this.event,
            startDate: this.event.startDate,
            endDate: this.event.endDate
          }
        }
        this.errors = []
      },
      deep: true
    }
  },
  methods: {
    submit () {
      if (this.isValidForm()) {
        this.$emit('submit', this.model, this.isAdd)
        this.close()
      }
    },
    close () {
      this.$emit('close')
    },
    isValidForm () {
      if (this.model.title && this.model.startDate && this.model.endDate) {
        return true
      }
      this.errors = []
      if (!this.model.title) {
        this.errors.push('일정 제목 입력은 필수입니다.')
      }
      if (!this.model.startDate) {
        this.errors.push('시작날짜 입력은 필수입니다.')
      }
      if (!this.model.endDate) {
        this.errors.push('종료날짜 입력은 필수입니다.')
      }
      return false
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

    & form {
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
