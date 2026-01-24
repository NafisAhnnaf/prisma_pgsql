import { Router } from "express";
import { userGuard } from "../middlewares/auth.middleware.ts";
import { getAllUsers, getUser, createUser, deleteUser, updateUser, getProfile } from "../controllers/user.controllers.ts";
const router = Router();

router.get('/', getAllUsers);
router.get('/me', userGuard, getProfile);
router.get('/:id', getUser);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser)

export default router;