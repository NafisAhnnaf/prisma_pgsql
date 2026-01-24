import prisma from '../utils/prisma.ts'
import type { Request, Response } from 'express';

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                image_urls: true,
                created_at: true,
                updated_at: true,
                created_by: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                avatar: true,
                            },
                        },
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });
        if (posts) {
            res.status(200).json({ payload: { posts: posts } });
        }
        else {
            throw Error("No posts found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}
const getPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id === 'string') {
        try {
            const post = await prisma.post.findUnique({
                where: { id: id },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    tags: true,
                    comments: true,
                    image_urls: true,
                    created_at: true,
                    updated_at: true,
                    created_by: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    first_name: true,
                                    last_name: true,
                                    avatar: true,
                                },
                            },
                        }
                    }

                },
            });
            if (post) {
                res.status(200).json({ payload: { post: post } });
            }
            else {
                throw Error("No post found with requested ID")
            }
        } catch (error: any) {
            console.error(error);
            res.status(500).json(error.message)
        }
    }
}

const createPost = async (req: Request, res: Response) => {
    const { title, content, image_urls, tags } = req.body;
    const admin_id = req.headers.admin_id
    try {
        if (admin_id && typeof admin_id === "string") {
            const post = {
                title, content, image_urls, tags, admin_id
            }
            const response = await prisma.post.create({
                data: post
            })
            res.status(201).json({ message: "Post created successfully" });
        }
        else {
            throw Error("Cannot create event without admin privileges");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error.message })
    }
}

const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (id && typeof id === 'string') {
            const response = await prisma.post.delete({
                where: { id }
            })
            console.log(response);
            res.status(200).json({ message: "Post Deleted successfully" })
        }
        else {
            throw new Error("No id was provided")
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}


const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params
    const { user_id, title, content, image_urls } = req.body;
    const data: any = {}
    try {
        if (user_id) data.user_id = user_id;
        if (title) data.title = title;
        if (content) data.content = content;
        if (image_urls) data.image_urls = image_urls;
        if (Object.keys(data).length === 0) {
            throw new Error("No valid fields provided for update");
        }
        if (id && typeof id === 'string') {
            const response = await prisma.post.update({
                where: { id: id },
                data
            })
            res.status(200).json({ message: "Post updated successfully" });
        }
        else {
            throw Error("Post not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error })
    }
}


export { createPost, getAllPosts, deletePost, updatePost, getPost };