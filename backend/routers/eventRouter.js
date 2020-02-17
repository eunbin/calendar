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

eventRouter.get('/', getEventList);
eventRouter.get('/:id', getEventById);
eventRouter.post('/', addEvent);
eventRouter.put('/:id', updateEventById);
eventRouter.patch('/:id', updateEventDateById);
eventRouter.delete('/:id', deleteEventById);

export default eventRouter;
