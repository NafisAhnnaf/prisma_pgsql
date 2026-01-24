import { Router } from "express";
import { getAllPosts, createPost, updatePost, deletePost, getPost } from "../controllers/post.controllers.ts";
import { adminGuard } from "../middlewares/auth.middleware.ts";
const router = Router();

router.get('/', getAllPosts);
router.get('/:id', getPost)
router.post('/', adminGuard, createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);



export default router;