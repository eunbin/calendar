import { mount, shallowMount } from '@vue/test-utils'
import EventModal from '@/components/EventModal'
import dateMixin from '@/mixins/date'
import { modalTitles } from '@/types/calendar'
import { newEvent, eventHasId } from '../test-data'
import Vue from 'vue'

const createOption = (event) => {
  return {
    mixins: [dateMixin],
    propsData: {
      value: true, // open modal,
      event
    }
  }
}

describe('EventModal.vue', () => {
  it('snapshot check with model', () => {
    const wrapper = mount(EventModal, createOption(newEvent))
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it('event model의 id 가 없는 경우는 일정 등록 타이틀을 나타낸다.', () => {
    const option = createOption(newEvent)

    const wrapper = mount(EventModal, option)// then

    expect(wrapper.vm.isAdd).toBeTruthy()
    expect(wrapper.vm.modalTitle).toMatch(modalTitles.ADD_EVENT)
  })

  it('event model의 id 가 있는 경우는 일정 수정 타이틀을 나타낸다.', () => {
    const option = createOption(eventHasId)

    const wrapper = mount(EventModal, option)

    expect(wrapper.vm.isAdd).toBe(false)
    expect(wrapper.vm.modalTitle).toMatch(modalTitles.UPDATE_EVENT)
  })

  it('일정 추가인 경우 삭제 버튼은 렌더링되지 않는다.', () => {
    const option = createOption(newEvent)

    const wrapper = mount(EventModal, option)
    const saveButton = wrapper.find('.accent')

    expect(saveButton.exists()).toBe(false)
  })

  it('일정 수정인 경우 삭제 버튼이 렌더링된다.', () => {
    const option = createOption(eventHasId)

    const wrapper = mount(EventModal, option)
    const saveButton = wrapper.find('.accent')

    expect(saveButton.exists()).toBe(true)
  })

  it('Validation 에러가 존재하는 경우 에러 메시지가 보여진다.', async () => {
    const wrapper = shallowMount(EventModal, createOption(newEvent))

    wrapper.setData({ errors: [] })
    await Vue.nextTick()
    expect(wrapper.findAll('li').length).toBe(0)

    wrapper.setData({ errors: [1, 2, 3] })
    await Vue.nextTick()
    const eventWrapper = wrapper.findAll('li')
    expect(eventWrapper.length).toBe(3)
  })
})
