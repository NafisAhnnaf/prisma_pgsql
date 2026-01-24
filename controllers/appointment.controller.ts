import prisma from "../utils/prisma.ts";
import type { Request, Response } from "express"


const getClubAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await prisma.club_Appointment.findMany({
            select: {
                member_id: true,
                member: {
                    select: {
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                avatar: true,
                                email: true,
                                facebook: true,
                                linkedin: true,
                            }
                        }
                    }

                },
            }
        });
        if (appointments.length) {
            res.status(200).json({ payload: { appointments: appointments } });
        }
        else {
            throw new Error("No club appointments found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}
const getExecAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await prisma.executive_Appointment.findMany({
            select: {
                member_id: true,
                member: {
                    select: {
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                avatar: true,
                                email: true,
                                facebook: true,
                                linkedin: true,
                            }
                        }
                    }

                },
            }
        });
        if (appointments.length) {
            res.status(200).json({ payload: { appointments: appointments } });
        }
        else {
            throw new Error("No executive appointments found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}

const addClubAppointment = async (req: Request, res: Response) => {
    const { memId, role } = req.body;
    console.log(memId);
    try {
        if (memId && typeof memId === 'string' && role) {
            const response = await prisma.club_Appointment.create({
                data: { member_id: memId, role: role }
            })
            console.log(response);
            res.status(201).json({ message: "Member appointed as " + role });
        }
        else {
            throw new Error("Invalid ID or role not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
}
const addExecAppointment = async (req: Request, res: Response) => {
    const { memId, role } = req.body;
    console.log(memId);
    try {
        if (memId && typeof memId === 'string' && role) {
            const response = await prisma.executive_Appointment.create({
                data: { member_id: memId, role: role }
            })
            console.log(response);
            res.status(201).json({ message: "Member appointed as " + role });
        }
        else {
            throw new Error("Invalid ID or role not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
}
const deleteClubAppointment = async (req: Request, res: Response) => {
    const { id } = req.params; //Club_Appointment tuple id
    console.log(id);
    try {
        if (id && typeof id === 'string') {
            //Delete with appointment id not member id.
            const response = await prisma.club_Appointment.delete({
                where: { id: id }
            })
            res.status(200).json({ message: response.role + " appointment removed" });
        }
        else {
            throw new Error("Invalid ID or ID not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
}
const deleteExecAppointment = async (req: Request, res: Response) => {
    const { id } = req.params; //Executive_Appointment tuple id
    console.log(id);
    try {
        if (id && typeof id === 'string') {
            //Delete with appointment id not member id.
            const response = await prisma.executive_Appointment.delete({
                where: { id: id }
            })
            res.status(200).json({ message: response.role + " appointment removed" });
        }
        else {
            throw new Error("Invalid ID or ID not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
}




export { addClubAppointment, addExecAppointment, deleteClubAppointment, deleteExecAppointment, getClubAppointments, getExecAppointments }