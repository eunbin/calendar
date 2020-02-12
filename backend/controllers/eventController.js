// TODO: connect db
import moment from "moment";

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
let events = [
  { id: '1', title: 'event1', year: 2020, month: 2, day: 7, startDate: moment([2020, 1, 7, 12]).format(), endDate: moment([2020, 1, 7, 13]).format() },
  { id: '2', title: 'event2', year: 2020, month: 2, day: 8, startDate: moment([2020, 1, 8, 1]).format(), endDate: moment([2020, 1, 8, 2]).format() },
  { id: '3', title: 'event3', year: 2020, month: 1, day: 4, startDate: moment([2020, 2, 4, 0]).format(), endDate: moment([2020, 2, 4, 1]).format() }
];

const findEvents = (req, res) => {
  const { params: { year, month } } = req;
  const result = events.filter(event => event.year === parseInt(year) && event.month === parseInt(month));
  res.json(result);
};

const findEventById = (req, res) => {
  const { params: { id } } = req;
  if (!id) {
    res.status(400).json({ code:'FAIL', message: 'event id is required' });
  }
  const event = events.find(event => event.id === id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ code:'FAIL', message: 'event not found' });
  }
};

const addEvent = (req, res) => {
  const { body } = req;
  const newEvent = {
    ...body,
    id: uuid(),
    year: moment(body.startDate).year(),
    month: moment(body.startDate).month() + 1,
    day: moment(body.startDate).date()
  }
  events = [...events, newEvent]
  res.json({ code: 'SUCCESS', message: 'event added successfully', data: newEvent });
}

const updateEventById = (req, res) => {
  const { params: { id }, body: { title, startDate, endDate } } = req;
  const event = events.find(event => event.id === id);
  event.title = title;
  event.startDate = startDate;
  event.endDate = endDate;
  event.year = moment(startDate).year();
  event.month = moment(startDate).month() + 1;
  event.day = moment(startDate).date();
  res.json({ code: 'SUCCESS', message: 'event updated successfully', data: event });
}

const updateEventDateById = (req, res) => {
  const { params: { id }, body: { startDate, endDate } } = req;
  const event = events.find(event => event.id === id);
  event.startDate = startDate;
  event.endDate = endDate;
  event.year = moment(startDate).year();
  event.month = moment(startDate).month() + 1;
  event.day = moment(startDate).date();
  res.json({ code: 'SUCCESS', message: 'event updated successfully', data: event });
  console.log(events)
};

const deleteEvent = (req, res) => {
  const { params: { id } } = req;
  if (!id) {
    res.status(400).json({ code:'FAIL', message: 'event id is required' });
  }
  events = events.filter(event => event.id !== id);
  res.json({ code: 'SUCCESS', message: 'event deleted successfully' });
};

export {
  findEvents,
  findEventById,
  deleteEvent,
  addEvent,
  updateEventById,
  updateEventDateById
}
