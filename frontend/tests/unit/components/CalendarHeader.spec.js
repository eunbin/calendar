import { shallowMount, mount } from '@vue/test-utils'
import CalendarHeader from '@/components/CalendarHeader.vue'
import dateMixin from '@/mixins/date'
import { dateFormat } from '@/types/date'
import { viewTypes, DEFAULT_VIEW_TYPE } from '@/types/calendar'
import moment from 'moment'

const currentDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0).clone()

const createOption = () => {
  return {
    mixins: [dateMixin],
    propsData: {
      currentDate,
      viewType: DEFAULT_VIEW_TYPE
    }
  }
}

describe('CalendarHeader.vue', () => {
  test('항상 동일한 컨텐츠가 렌더링되어야 한다.', () => {
    const wrapper = mount(CalendarHeader, createOption())
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it('오늘 날짜를 기준으로 YYYY년 MM월 타이틀이 보여진다.', () => {
    const option = createOption()

    const wrapper = shallowMount(CalendarHeader, option)

    expect(wrapper.vm.title).toMatch(currentDate.format(dateFormat.YEAR_AND_MONTH))
  })

  it('기본 보기모드는 DEFAULT_VIEW_TYPE 과 같아야 한다.', () => {
    const option = createOption()

    const wrapper = shallowMount(CalendarHeader, option)

    expect(wrapper.vm.$data.type).toBe(DEFAULT_VIEW_TYPE)
  })

  it('제공하는 모든 뷰 타입에 대한 버튼이 생성된다.', () => {
    const option = createOption()

    const wrapper = mount(CalendarHeader, option)
    const buttonWrapper = wrapper.find('.view-type').findAll('button')

    expect(buttonWrapper.length).toBe(Object.keys(viewTypes).length)
  })

  it('<, > 이동 버튼의 클릭 이벤트가 정상 동작한다.', () => {
    const option = createOption()

    const wrapper = mount(CalendarHeader, option)

    const buttonWrapper = wrapper.find('.nav').findAll('button')
    const firstButton = buttonWrapper.at(0)
    expect(firstButton.is('button')).toBe(true)
    const secondButton = buttonWrapper.at(1)
    expect(secondButton.is('button')).toBe(true)

    firstButton.trigger('click')
    secondButton.trigger('click')

    expect(wrapper.emitted().prev).toBeTruthy()
    expect(wrapper.emitted().next).toBeTruthy()
  })

  it('기본 view type인 month 에서 view 로 변경되도록 값을 전달한다.', () => {
    const option = createOption()

    const wrapper = mount(CalendarHeader, option)

    const buttonWrapper = wrapper.find('.view-type').findAll('button')
    const secondButton = buttonWrapper.at(1)
    expect(secondButton.is('button')).toBe(true)

    secondButton.trigger('click')

    expect(wrapper.emitted().change[0][0]).toEqual('week')
  })
})
