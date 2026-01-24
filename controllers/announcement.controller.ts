import prisma from '../utils/prisma.ts'
import type { Request, Response } from 'express';

const getAllAnnouncements = async (req: Request, res: Response) => {
    try {
        const announcements = await prisma.announcement.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                category: true,
                created_at: true
            },
            orderBy: { created_at: 'desc' }
        });
        if (announcements) {
            res.status(200).json({ payload: { announcements: announcements } });
        }
        else {
            throw Error("No announcements found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}

// const getPost = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     if (typeof id === 'string') {
//         try {
//             const post = await prisma.post.findUnique({
//                 where: { id: id },
//                 select: {
//                     id: true,
//                     title: true,
//                     content: true,
//                     tags: true,
//                     comments: true,
//                     image_urls: true,
//                     created_at: true,
//                     updated_at: true,
//                     user: {
//                         select: {
//                             id: true,
//                             first_name: true,
//                             last_name: true,
//                             avatar: true,
//                         },
//                     },
//                 },
//             });
//             if (post) {
//                 res.status(200).json({ payload: { post: post } });
//             }
//             else {
//                 throw Error("No post found with requested ID")
//             }
//         } catch (error: any) {
//             console.error(error);
//             res.status(500).json(error.message)
//         }
//     }
// }

const createAnnouncement = async (req: Request, res: Response) => {
    const { title, content, category } = req.body;
    const announcement = {
        title, content, category
    }
    try {
        if (announcement) {
            const response = await prisma.announcement.create({
                data: announcement
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

const deleteAnnouncement = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (id && typeof id === 'string') {
            const response = await prisma.announcement.delete({
                where: { id }
            })
            console.log(response);
            res.status(200).json({ message: "Announcement Deleted successfully" })
        }
        else {
            throw new Error("No id was provided")
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}


const updateAnnouncement = async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, content, category, created_at } = req.body;
    const data: any = {}
    try {
        if (category) data.category = category;
        if (title) data.title = title;
        if (content) data.content = content;
        if (created_at) data.created_at = created_at;
        if (Object.keys(data).length === 0) {
            throw new Error("No valid fields provided for update");
        }
        if (id && typeof id === 'string') {
            const response = await prisma.announcement.update({
                where: { id: id },
                data
            })
            res.status(200).json({ message: "Announcement updated successfully" });
        }
        else {
            throw Error("Announcement not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured " + error })
    }
}


export { createAnnouncement, getAllAnnouncements, deleteAnnouncement, updateAnnouncement };