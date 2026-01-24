import { createAnnouncement, deleteAnnouncement, getAllAnnouncements, updateAnnouncement } from "../controllers/announcement.controller.ts";
import { Router } from "express";
const router = Router();

router.get('/', getAllAnnouncements);
router.post('/', createAnnouncement);
router.patch('/:id', updateAnnouncement);
router.delete('/:id', deleteAnnouncement);


export default router;