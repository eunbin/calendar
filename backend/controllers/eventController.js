// TODO: connect db
let events = [
  { id: '1', title: 'event1', year: 2020, month: 1, day: 7 },
  { id: '2', title: 'event2', year: 2020, month: 2, day: 7 },
  { id: '3', title: 'event3', year: 2020, month: 1, day: 4 }
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

const deleteEvent = (req, res) => {
  const { params: { id } } = req;
  if (!id) {
    res.status(400).json({ code:'FAIL', message: 'event id is required' });
  }
  events = events.filter(event => event.id !== id);
  res.json({ code: 'SUCCESS', message: 'event deleted successfully' });
};

const updateEvenById = (req, res) => {
};

const updateEventDate = (req, res) => {
  const { params: { id } } = req;
  const startDate = '';
  const endDate = '';
  const event = events.find(event => event.id !== id);
  event.startDate = startDate;
  event.endDate = endDate;
  res.json({ code: 'SUCCESS', message: 'event deleted successfully' });
};

export {
  findEvents,
  findEventById,
  deleteEvent,
  updateEvenById,
  updateEventDate
}
