import { Router } from "express";
import { getAllUsers, getUser, createUser } from "../controllers/user.controllers.ts";
const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);

export default router;