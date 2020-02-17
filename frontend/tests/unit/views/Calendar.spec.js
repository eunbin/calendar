import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { DEFAULT_VIEW_TYPE } from '@/types/calendar'
import Calendar from '@/views/Calendar'
import EventModal from '@/components/EventModal'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Calendar.vue', () => {
  let actions
  let store

  beforeEach(() => {
    actions = {
      getEvents: jest.fn()
    }
    store = new Vuex.Store({
      state: {},
      actions
    })
  })

  it('Created Hook 에 getEvents()가 호출되어야 한다.', () => {
    expect(typeof Calendar.created).toBe('function')

    const option = {
      localVue,
      store
    }

    shallowMount(Calendar, option)

    expect(actions.getEvents).toHaveBeenCalled()
  })

  it('기본 보기모드는 DEFAULT_VIEW_TYPE 과 같아야 한다.', () => {
    expect(typeof Calendar.data).toBe('function')

    const defaultData = Calendar.data()

    expect(defaultData.viewType).toBe(DEFAULT_VIEW_TYPE)
  })

  it('페이지에서 열린 에러 모달에서, close 이벤트가 오면 값이 페이지에 업데이트 된다.', () => {
    const option = {
      localVue,
      store
    }

    const wrapper = shallowMount(Calendar, option)
    wrapper.setData({ dialog: true })
    const eventModalWrapper = wrapper.find(EventModal)
    eventModalWrapper.vm.$emit('close', false)

    expect(wrapper.vm.dialog).toBe(false)
  })
})
