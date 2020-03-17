const MONTH = 'month'
const WEEK = 'week'

const viewTypes = Object.freeze({
  MONTH,
  WEEK
})

const DEFAULT_VIEW_TYPE = viewTypes.MONTH

const modalTitles = Object.freeze({
  ADD_EVENT: '일정 등록',
  UPDATE_EVENT: '일정 수정'
})

export {
  viewTypes,
  DEFAULT_VIEW_TYPE,
  modalTitles
}
