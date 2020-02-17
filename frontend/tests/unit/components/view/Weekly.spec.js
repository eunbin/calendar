import Weekly from '@/components/view/Weekly.vue'
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

describe('Weekly.vue', () => {
  it('컴포넌트가 정상적으로 동작되면 days-of-week 컬럼이 생성된다.', async () => {
    const wrapper = mount(Weekly, createOption())
    const columnsWrapper = wrapper.findAll('th')
    const DAYS = 7
    const TIME_COLUMN = 1
    expect(columnsWrapper.length).toBe(DAYS + TIME_COLUMN)
  })
})
