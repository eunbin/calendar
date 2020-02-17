import Monthly from '@/components/view/Monthly.vue'
import dateMixin from '@/mixins/date'
import { mount } from '@vue/test-utils'
import { currentDate } from '../../test-data'
import moment from 'moment'

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

describe('Monthly.vue', () => {
  it('컴포넌트가 정상적으로 동작되면 days-of-week 컬럼이 생성된다.', async () => {
    const wrapper = mount(Monthly, createOption())
    const columnsWrapper = wrapper.findAll('.column')
    const DAYS = 7
    expect(columnsWrapper.length).toBe(DAYS)
  })
})
