import { Router } from "express";
import { addClubAppointment, addExecAppointment, deleteClubAppointment, deleteExecAppointment, getClubAppointments, getExecAppointments } from "../controllers/appointment.controller.ts";

const router = Router();

router.get('/club', getClubAppointments);
router.get('/executive', getExecAppointments);
router.post('/club', addClubAppointment);
router.post('/executive', addExecAppointment);
router.delete('/club/:id', deleteClubAppointment);
router.delete('/executive/:id', deleteExecAppointment);

export default router;