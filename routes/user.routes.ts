import { Router } from "express";
import { getAllUsers, getUser, createUser, deleteUser, updateUser } from "../controllers/user.controllers.ts";
const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser)

export default router;