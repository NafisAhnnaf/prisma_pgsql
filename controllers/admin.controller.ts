import prisma from "../utils/prisma.ts";
import type { Request, Response } from "express"


const getAllAdmins = async (req, res) => {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                user_id: true,
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        avatar: true,
                        email: true,
                        birth_date: true,
                    }
                },
                approved_at: true,
                approved_by_id: true,
                approved_by: true,
                admin_approvals: true,
                member_approvals: true,

            }
        });
        if (admins.length) {
            res.status(200).json({ payload: { admins: admins } });
        }
        else {
            throw new Error("No admin found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}

const addAdmin = async (req: Request, res: Response) => {
    const { userId } = req.params;
    console.log(userId);
    try {
        if (userId && typeof userId === 'string') {
            const current_admin_id = req.headers.admin_id;
            const approvedById = Array.isArray(current_admin_id) ? current_admin_id[0] : current_admin_id;
            const response = await prisma.admin.create({
                data: { user_id: userId, approved_by_id: approvedById }
            })
            console.log(response);
            res.status(201).json({ message: "User added as Admin" });
        }
        else {
            throw new Error("Invalid ID or ID not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
}
const deleteAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    try {
        if (id && typeof id === 'string') {
            //Delete with admin id not user id.
            const response = await prisma.admin.delete({
                where: { id: id }
            })
            res.status(200).json({ message: "Admin removed" });
        }
        else {
            throw new Error("Invalid ID or ID not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
}




export { addAdmin, deleteAdmin, getAllAdmins }