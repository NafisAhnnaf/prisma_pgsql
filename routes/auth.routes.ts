import { userGuard } from "../middlewares/auth.middleware.ts";
import { getAuthUser, loginUser, logoutUser } from "../controllers/auth.controller.ts";
import { Router } from "express";


const router = Router();

router.post('/login', loginUser);
router.post('/logout', userGuard, logoutUser);
router.get('/me', userGuard, getAuthUser);


export default router;