import moment from "moment";
import * as eventRepository from "../model/event"

/**
 * 시작날짜가 동일한 일정 중 동일한 시간이 존재하는지 확인한다.
 * 동일한 시간에 일정이 이미 존재하는 경우 새로운 일정을 추가할 수 없다.
 * @param id
 * @param start: { date, dateTime }
 * @returns {boolean}
 */
const validStartDate = (id, start) => {
  const { date, dateTime } = start;
  const obj = moment(dateTime);
  const sameDateEvents = eventRepository.findByIdAndDateOfStart(id, date);
  return !sameDateEvents.some(event => moment(event.start.dateTime).isSame(obj));
};

const getEventList = (req, res) => {
  const result = eventRepository.findAll();
  res.json({ data: result });
};

const getEventById = (req, res) => {
  const { params: { id } } = req;
  if (!id) {
    res.status(400).json({ result: false, message: 'id 는 필수 파라미터입니다.' });
  }

  const event = eventRepository.findById(event => event.id === id);
  if (event) {
    res.json({ data: event });
  } else {
    res.status(404).json({ result: false, message: '동일한 아이디를 가진 일정을 찾을 수 없습니다.' });
  }
};

const addEvent = (req, res) => {
  const { body: { event } } = req;
  if (!validStartDate(event.id, event.start)) {
    return res.status(409).json({ result: false, message: '동일한 시간에 일정이 존재합니다.' });
  }

  const addedEvent = eventRepository.add(event);
  res.json({ result: true, message: '일정이 추가되었습니다.', data: addedEvent });
};

const updateEventById = (req, res) => {
  const { params: { id }, body: { event } } = req;
  if (!validStartDate(id, event.start)) {
    return res.status(409).json({ result: false, message: '동일한 시간에 일정이 존재합니다.' });
  }

  const updatedEvent = eventRepository.save(id, event);
  if (updatedEvent) {
    res.json({ result: true, message: '일정 정보가 수정되었습니다.', data: updatedEvent });
  } else {
    res.status(404).json({ result: false, message: '동일한 아이디를 가진 일정을 찾을 수 없습니다.' });
  }
};

const updateEventDateById = (req, res) => {
  const { params: { id }, body: { event: { start, end }} } = req;
  if (!validStartDate(id, start)) {
    return res.status(409).json({ result: false, message: '동일한 시간에 일정이 존재합니다.' });
  }

  const updatedEvent = eventRepository.saveStartAndEnd(id, start, end);
  if (updatedEvent) {
    res.json({ result: true, message: '일정의 일자가 수정되었습니다.', data: updatedEvent });
  } else {
    res.status(404).json({ result: false, message: '동일한 아이디를 가진 일정을 찾을 수 없습니다.' });
  }
};

const deleteEventById = (req, res) => {
  const { params: { id } } = req;
  if (!id) {
    res.status(400).json({ result: false, message: 'id 는 필수 파라미터입니다.' });
  }
  const isSuccess = eventRepository.deleteById(id);
  if (isSuccess) {
    res.json({ result: true, message: '해당 일정이 삭제되었습니다.' });
  } else {
    res.status(404).json({ result: false, message: '삭제할 일정이 존재하지 않습니다.'})
  }
};

export {
  getEventList,
  getEventById,
  addEvent,
  updateEventById,
  updateEventDateById,
  deleteEventById
}
