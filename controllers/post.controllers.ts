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
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true,
                    },
                },
            },
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

const createPost = async (req: Request, res: Response) => {
    const { title, content, image_urls, user_id } = req.body;
    const post = {
        title, content, image_urls, user_id
    }
    try {
        if (post) {
            const response = await prisma.post.create({
                data: post
            })
            res.status(201).json({ message: "Post created successfully" });
        }
        else {
            throw Error("Post not valid");
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
            const response = await prisma.user.delete({
                where: { id }
            })
            console.log(response);
            res.status(200).json({ message: "User Deleted successfully" })
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
    const { first_name, last_name, email, password, avatar, birth_date } = req.body;
    const data: any = {}
    try {
        if (first_name) data.first_name = first_name;
        if (last_name) data.last_name = last_name;
        if (email) data.email = email;
        if (avatar) data.avatar = avatar;
        if (birth_date) data.birth_date = new Date(birth_date); // convert to Date if needed

        if (Object.keys(data).length === 0) {
            throw new Error("No valid fields provided for update");
        }
        if (id && typeof id === 'string') {
            const response = await prisma.user.update({
                where: { id: id },
                data
            })
            res.status(200).json({ message: "User updated successfully" });
        }
        else {
            throw Error("User not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error })
    }
}


export { createPost, getAllPosts };