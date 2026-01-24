import { addMember, approveMember, deleteMember, getAllMembers } from "../controllers/member.controller.ts";
import { Router } from "express";
import { adminGuard } from "../middlewares/auth.middleware.ts";

const router = Router();

router.get('/', adminGuard, getAllMembers);
router.post('/add/:userId', addMember)
router.patch('/approve/:id', adminGuard, approveMember)
router.delete('/:id', adminGuard, deleteMember);


export default router;