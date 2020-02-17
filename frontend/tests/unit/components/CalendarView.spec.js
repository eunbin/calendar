import CalendarView from '@/components/CalendarView'
import { mount } from '@vue/test-utils'

describe('CalendarView.vue', () => {
  it('snapshot check', () => {
    const wrapper = mount(CalendarView)

    expect(wrapper.vm.$el).toMatchSnapshot()
  })
})
