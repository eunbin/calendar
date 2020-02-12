<template>
  <div class="modal"
       :class="{ show: value }">
    <div class="modal__inner">
      <button class="modal__close"
              @click="close"></button>
      <template v-if="isAdd">
        <h2>lorem ipsum</h2>
        <p>lorem ipsum lorem ipsum</p>
      </template>
      <template v-else>
        <h2>{{ event }}</h2>
      </template>
      <button @click="submit">저장</button>
      <button @click="close">취소</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isAdd () {
      return !this.event
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.event)
    },
    close () {
      this.$emit('close')
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
    height: 50%;
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
