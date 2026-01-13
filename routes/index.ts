import UserRoutes from './user.routes.ts'
import PostRoutes from './post.routes.ts'
import AdminRoutes from './admin.routes.ts'
import AuthRoutes from './auth.routes.ts'
import { Router } from 'express'
import { adminGuard } from '../middlewares/auth.middleware.ts'

const router = Router()

router.use('/users', UserRoutes);
router.use('/admins', adminGuard, AdminRoutes);
router.use('/posts', PostRoutes);
router.use('/auth', AuthRoutes);


export default router;