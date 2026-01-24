import { adminGuard } from "../middlewares/auth.middleware.ts";
import { createEvent, deleteEvent, getAllEvents, updateEvent } from "../controllers/event.controllers.ts";
import { Router } from "express";

const router = Router();

router.get('/', getAllEvents);
router.post('/', adminGuard, createEvent);
router.patch('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;