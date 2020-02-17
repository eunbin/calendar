import Monthly from '@/components/view/Monthly.vue'
import dateMixin from '@/mixins/date'
import { createLocalVue, mount } from '@vue/test-utils'
import { currentDate } from '../../test-data'
import moment from 'moment'
import Vuex from 'vuex'

const createOption = () => {
  return {
    mixins: [dateMixin],
    propsData: {
      currentDate: moment(currentDate),
      today: moment(),
      eventsMap: {}
    }
  }
}

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Monthly.vue', () => {
  let store
  const getters = {
    getEventsByDay: () => () => []
  }

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        events: {}
      },
      getters: getters
    })
  })

  it('snapshot check', () => {
    const wrapper = mount(Monthly, Object.assign(createOption(), {
      localVue,
      store
    }))

    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it('컴포넌트가 정상적으로 동작되면 days-of-week 컬럼이 생성된다.', async () => {
    const wrapper = mount(Monthly, Object.assign(createOption(), {
      localVue,
      store
    }))
    const columnsWrapper = wrapper.findAll('.column')
    const DAYS = 7
    expect(columnsWrapper.length).toBe(DAYS)
  })
})
