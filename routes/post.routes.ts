import { Router } from "express";
import { getAllPosts, createPost } from "../controllers/post.controllers.ts";
const router = Router();

router.get('/', getAllPosts);
router.post('/', createPost)



export default router;