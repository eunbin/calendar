import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { DEFAULT_VIEW_TYPE } from '@/types/calendar'
import Calendar from '@/views/Calendar'

const localVue = createLocalVue()
localVue.use(Vuex)

describe.only('Calendar.vue', () => {
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

  it('snapshot check', () => {
    const wrapper = shallowMount(Calendar, {
      localVue,
      store
    })
    expect(wrapper.vm.$el).toMatchSnapshot()
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
})
