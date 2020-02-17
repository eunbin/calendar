import express from "express";
import {
  getEventList,
  getEventById,
  addEvent,
  updateEventById,
  updateEventDateById,
  deleteEventById
} from "../controllers/eventController"

const eventRouter = express.Router();

eventRouter.get('/events', getEventList);
eventRouter.get('/events/:id', getEventById);
eventRouter.post('/events/', addEvent);
eventRouter.put('/events/:id', updateEventById);
eventRouter.patch('/events/:id', updateEventDateById);
eventRouter.delete('/events/:id', deleteEventById);

export default eventRouter;
