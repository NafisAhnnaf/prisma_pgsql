import { adminGuard } from "../middlewares/auth.middleware.ts";
import { addAdmin, deleteAdmin, getAllAdmins } from "../controllers/admin.controller.ts";
import { Router } from "express";

const router = Router();

router.post('/add/:userId', addAdmin)
router.delete('/:id', deleteAdmin);
router.get('/', getAllAdmins);

export default router;