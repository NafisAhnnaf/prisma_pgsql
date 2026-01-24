import UserRoutes from './user.routes.ts'
import PostRoutes from './post.routes.ts'
import AdminRoutes from './admin.routes.ts'
import MemberRoutes from './member.routes.ts'
import AuthRoutes from './auth.routes.ts'
import EventRoutes from './event.routes.ts'
import AnnouncementRoutes from './announcement.routes.ts'
import DepartmentRoutes from './department.routes.ts'
import AppointmentRoutes from './appointment.routes.ts'

import { Router } from 'express'
import { adminGuard } from '../middlewares/auth.middleware.ts'

const router = Router()

router.use('/users', UserRoutes);
router.use('/admins', adminGuard, AdminRoutes);
router.use('/posts', PostRoutes);
router.use('/events', EventRoutes);
router.use('/auth', AuthRoutes);
router.use('/announcements', AnnouncementRoutes);
router.use('/departments', DepartmentRoutes);
router.use('/members', MemberRoutes);
router.use('/appointments', AppointmentRoutes);


export default router;