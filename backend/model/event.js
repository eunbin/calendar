import { Event } from "../entity/event"
import data from "../data"
import moment from "moment";

// TODO: DB 에 저장한다면 in-memory 기반 Redis 사용
let events = data.map(event => new Event(event));

const findAll = () => events.sort((a, b) => moment(a.start.dateTime).unix() - moment(b.start.dateTime).unix());

const findById = (id) => events.find(event => event.id === id);

const findByIdAndDateOfStart = (id, date) => events.filter((event) => id !== event.id && event.start.date === date);

const add = (event) => {
  const newEvent = new Event(event);
  events = [...events, newEvent];
  return findById(newEvent.id);
};

const deleteById = (id) => {
  const isExist = events.find(event => event.id === id);
  if (isExist) {
    events = events.filter(event => event.id !== id);
    return true;
  } else {
    return false;
  }
};

const save = (id, event) => {
  const objIndex = events.findIndex(obj => obj.id === id);
  if (objIndex > -1) {
    const oldEvent = events[objIndex];
    const newEvent = {
      ...oldEvent,
      title: event.title,
      start: event.start,
      end: event.end
    };
    events = [
      ...events.slice(0, objIndex),
      newEvent,
      ...events.slice(objIndex + 1),
    ];
    return newEvent;
  } else {
    return false;
  }
};

const saveStartAndEnd = (id, start, end) => {
  const objIndex = events.findIndex(obj => obj.id === id);
  if (objIndex > -1) {
    const newEvent = events[objIndex];
    events = [
      ...events.slice(0, objIndex),
      { ...newEvent, start, end },
      ...events.slice(objIndex + 1),
    ];
    return newEvent;
  } else {
    return false;
  }
};

export {
  findAll,
  findById,
  findByIdAndDateOfStart,
  deleteById,
  add,
  save,
  saveStartAndEnd
}
