import CalendarView from '@/components/CalendarView'
import { shallowMount } from '@vue/test-utils'

describe('CalendarView.vue', () => {
  it('snapshot check', () => {
    const wrapper = shallowMount(CalendarView)

    expect(wrapper.vm.$el).toMatchSnapshot()
  })
})
