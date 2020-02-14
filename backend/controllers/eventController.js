import moment from "moment";

const dateFormat = Object.freeze({
  DATE: 'YYYY-MM-DD',
  DATE_TIME: 'YYYY-MM-DD HH:mm',
  HOUR_AND_MIN: 'HH:mm'
})

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// TODO: connect db
/**
 * id:
 * title:
 * startDate:
 * EndDate:
 * createdAt:
 * @type {*[]}
 */
let events = [
  {
    id: uuid(),
    title: 'event1',
    start: {
      date: moment({ year: 2020, month: 1, day: 7, hour: 23}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 1, day: 7, hour: 23}).format(dateFormat.DATE_TIME)
    },
    end: {
      date: moment({ year: 2020, month: 1, day: 7, hour: 24}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 1, day: 7, hour: 24}).format(dateFormat.DATE_TIME)
    },
    createdAt: moment().format(dateFormat.DATE_TIME)
  },
  {
    id: uuid(),
    title: 'event2',
    start: {
      date: moment({ year: 2020, month: 1, day: 5, hour: 14}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 1, day: 5, hour: 14}).format(dateFormat.DATE_TIME)
    },
    end: {
      date: moment({ year: 2020, month: 1, day: 5, hour: 15}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 1, day: 5, hour: 15}).format(dateFormat.DATE_TIME)
    },
    createdAt: moment().format(dateFormat.DATE_TIME)
  },
  {
    id: uuid(),
    title: 'event3',
    start: {
      date: moment({ year: 2020, month: 1, day: 4, hour: 14}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 1, day: 4, hour: 14}).format(dateFormat.DATE_TIME)
    },
    end: {
      date:moment({ year: 2020, month: 1, day: 4, hour: 15}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 1, day: 4, hour: 15}).format(dateFormat.DATE_TIME)
    },
    createdAt: moment().format(dateFormat.DATE_TIME)
  },
  {
    id: uuid(),
    title: 'event4',
    start: {
      date: moment({ year: 2020, month: 1, day: 5, hour: 18}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 1, day: 5, hour: 18}).format(dateFormat.DATE_TIME),
    },
    end: {
      date: moment({ year: 2020, month: 1, day: 5, hour: 19}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 1, day: 5, hour: 19}).format(dateFormat.DATE_TIME),
    },
    createdAt: moment().format(dateFormat.DATE_TIME)
  },
  {
    id: uuid(),
    title: 'event5',
    start: {
      date: moment({ year: 2020, month: 2, day: 5, hour: 12}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 2, day: 5, hour: 12}).format(dateFormat.DATE_TIME),
    },
    end: {
      date: moment({ year: 2020, month: 2, day: 5, hour: 13}).format(dateFormat.DATE),
      dateTime: moment({ year: 2020, month: 2, day: 5, hour: 13}).format(dateFormat.DATE_TIME)
    },
    createdAt: moment().format(dateFormat.DATE_TIME)
  }
];

const validStartDate = (id, start) => {
  const { date, dateTime } = start;
  const obj = moment(dateTime);
  const sameDateEvents = events.filter(event => {
      return id !== event.id && event.start.date === date;
    }
  );
  return !sameDateEvents.some(event => moment(event.start.dateTime).isSame(obj));
};

const findEvents = (req, res) => {
  const result = events.sort((a, b) => moment(a.start.dateTime).unix() - moment(b.start.dateTime).unix());
  res.json({ data: result });
};

const findEventById = (req, res) => {
  const { params: { id } } = req;
  if (!id) {
    res.status(400).json({ result: false, message: 'id 는 필수 파라미터입니다.' });
  }
  const event = events.find(event => event.id === id);
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
  const newEvent = {
    id: uuid(),
    ...event
  };
  events = [...events, newEvent];
  res.json({ result: true, message: '일정이 추가되었습니다.', data: newEvent });
};

const updateEventById = (req, res) => {
  const { params: { id }, body: { event } } = req;
  if (!validStartDate(id, event.start)) {
    return res.status(409).json({ result: false, message: '동일한 시간에 일정이 존재합니다.' });
  }
  const objIndex = events.findIndex(obj => obj.id === id);
  if (objIndex > -1) {
    const oldEvent = events[objIndex];
    const newEvent = {
      ...oldEvent,
      title: event.title,
      start: event.start,
      end: event.end
    }
    events = [
      ...events.slice(0, objIndex),
      newEvent,
      ...events.slice(objIndex + 1),
    ];
    res.json({ result: true, message: '일정 정보가 수정되었습니다.', data: newEvent });
  } else {
    res.json({ result: false, message: '동일한 아이디를 가진 일정을 찾을 수 없습니다.' });
  }
};

const updateEventDateById = (req, res) => {
  const { params: { id }, body: { event: { start, end }} } = req;

  if (!validStartDate(id, start)) {
    return res.status(409).json({ result: false, message: '동일한 시간에 일정이 존재합니다.' });
  }

  const objIndex = events.findIndex(obj => obj.id === id);
  if (objIndex > -1) {
    const event = events[objIndex];
    events = [
      ...events.slice(0, objIndex),
      { ...event, start, end },
      ...events.slice(objIndex + 1),
    ];
    res.json({ result: true, message: '일정의 일자가 수정되었습니다.', data: event });
  } else {
    res.json({ result: false, message: '동일한 아이디를 가진 일정을 찾을 수 없습니다.' });
  }
};

const deleteEvent = (req, res) => {
  const { params: { id } } = req;
  if (!id) {
    res.status(400).json({ result: false, message: 'id 는 필수 파라미터입니다.' });
  }
  events = events.filter(event => event.id !== id);
  res.json({ result: true, message: '해당 일정이 삭제되었습니다.' });
};

export {
  findEvents,
  findEventById,
  deleteEvent,
  addEvent,
  updateEventById,
  updateEventDateById
}
