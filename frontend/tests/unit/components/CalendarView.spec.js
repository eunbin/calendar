import CalendarView from '@/components/CalendarView'
import { shallowMount } from '@vue/test-utils'
import { currentDate, eventHasId, newEvent } from '../test-data'
import moment from 'moment'

describe('CalendarView.vue', () => {
  const wrapper = shallowMount(CalendarView)

  it('snapshot check', () => {
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it('일정 선택 이벤트를 수신하여 부모로 이벤트를 전달해야 한다.', () => {
    wrapper.vm.selectEvent(newEvent)
    expect(wrapper.emitted()['event-selected'][0][0]).toEqual(newEvent)
  })

  it('날짜 선택 이벤트를 수신하여 부모로 이벤트를 전달해야 한다.', () => {
    wrapper.vm.selectDay(currentDate)
    expect(wrapper.emitted()['day-selected'][0][0]).toEqual(currentDate)
  })

  it('날짜, 시간 선택 이벤트를 수신하여 부모로 이벤트를 전달해야 한다.', () => {
    const date = moment(currentDate)
    const hour = moment(currentDate)
    wrapper.vm.selectHour(date, hour)
    const expectedDate = date.clone().hours(hour.hours())

    expect(wrapper.emitted()['hour-selected'][0][0]).toEqual(expectedDate)
  })

  it('드래그 완료 이벤트를 수신하여 부모로 이벤트를 전달해야 한다.', () => {
    wrapper.vm.onMoveEvent(eventHasId)
    expect(wrapper.emitted()['event-moved'][0][0]).toEqual(eventHasId)
  })
})
