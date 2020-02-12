import express from "express";
import { findEvents, findEventById, deleteEvent, updateEventDate } from "../controllers/eventController"

const eventRouter = express.Router();

eventRouter.get('/:year/:month', findEvents);
eventRouter.get('/:id', findEventById);
eventRouter.delete('/:id', deleteEvent);
eventRouter.patch('/:id', updateEventDate);
export default eventRouter;
