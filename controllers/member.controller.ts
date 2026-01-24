import prisma from "../utils/prisma.ts";
import type { Request, Response } from "express"


const getAllMembers = async (req, res) => {
    try {
        const members = await prisma.member.findMany({
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
                status: true,
                approved_at: true,
                approved_by_id: true,
            }
        });
        if (members.length) {
            res.status(200).json({ payload: { members: members }, message: "Members found successfully" });
        }
        else {
            throw new Error("No member found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}

const addMember = async (req: Request, res: Response) => {
    const { userId } = req.params;
    console.log(userId);
    try {
        if (userId && typeof userId === 'string') {
            const response = await prisma.member.create({
                data: { user_id: userId }
            })
            console.log(response);
            res.status(201).json({ message: "User added as Member" });
        }
        else {
            throw new Error("Invalid ID or ID not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
}
const approveMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (id && typeof id === 'string') {
            const current_admin_id = req.headers.admin_id;
            const approvedAt = new Date(Date.now()).toISOString();
            const approvedById = Array.isArray(current_admin_id) ? current_admin_id[0] : current_admin_id;
            const response = await prisma.member.update({
                where: { id: id },
                data: { status: "APPROVED", approved_by_id: approvedById, approved_at: approvedAt }
            })
            console.log(response);
            res.status(201).json({ message: "Member approved!" });
        }
        else {
            throw new Error("Invalid ID or ID not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
}
const deleteMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    try {
        if (id && typeof id === 'string') {
            //Delete with member id, not user id.
            const response = await prisma.member.delete({
                where: { id: id }
            })
            res.status(200).json({ message: "Member removed" });
        }
        else {
            throw new Error("Invalid ID or ID not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
}




export { addMember, deleteMember, getAllMembers, approveMember }