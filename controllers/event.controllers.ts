import prisma from '../utils/prisma.ts'
import type { Request, Response } from 'express';

const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                image_url: true,
                type: true,
                status: true,
                created_at: true,
            },
            orderBy: { created_at: 'desc' }
        });
        if (events) {
            res.status(200).json({ payload: { events: events } });
        }
        else {
            throw Error("No events found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}

const createEvent = async (req: Request, res: Response) => {
    const { title, summary, description, image_url, starts_at, ends_at, tags, sponsors, type, status } = req.body;
    const admin_id = req.headers.admin_id;
    try {
        if (admin_id && typeof admin_id === 'string') {
            const event = {
                title, summary, description, image_url, admin_id, starts_at, ends_at, tags, sponsors, type, status
            }
            const response = await prisma.event.create({
                data: event
            })
            res.status(201).json({ message: "Event created successfully" });
        }
        else {
            throw Error("Cannot create event without admin privileges");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error.message })
    }
}

const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (id && typeof id === 'string') {
            const response = await prisma.event.delete({
                where: { id }
            })
            console.log(response);
            res.status(200).json({ message: "Event Deleted successfully" })
        }
        else {
            throw new Error("No id was provided")
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}


const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params
    const { admin_id, title, description, image_url, type, start_at, ends_at, status } = req.body;
    const data: any = {}
    try {
        if (admin_id) data.admin_id = admin_id;
        if (title) data.title = title;
        if (description) data.description = description;
        if (image_url) data.image_url = image_url;
        if (start_at) data.start_at = start_at;
        if (ends_at) data.ends_at = ends_at;
        if (type) data.type = type;
        if (status) data.status = status;
        if (Object.keys(data).length === 0) {
            throw new Error("No valid fields provided for update");
        }
        if (id && typeof id === 'string') {
            const response = await prisma.event.update({
                where: { id: id },
                data
            })
            res.status(200).json({ message: "Event updated successfully" });
        }
        else {
            throw Error("Event not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error })
    }
}


export { createEvent, getAllEvents, updateEvent, deleteEvent };