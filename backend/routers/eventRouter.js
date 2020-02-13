import express from "express";
import {
  findEvents,
  findEventById,
  addEvent,
  updateEventById,
  deleteEvent,
  updateEventDateById
} from "../controllers/eventController"

const eventRouter = express.Router();

eventRouter.get('/', findEvents);
eventRouter.get('/:id', findEventById);
eventRouter.post('/', addEvent);
eventRouter.put('/:id', updateEventById);
eventRouter.delete('/:id', deleteEvent);
eventRouter.patch('/:id', updateEventDateById);
export default eventRouter;
