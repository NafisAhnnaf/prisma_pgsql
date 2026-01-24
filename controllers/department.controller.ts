import prisma from '../utils/prisma.ts'
import type { Request, Response } from 'express';

const getAllDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await prisma.department.findMany({
            select: {
                id: true,
                slug: true,
                name: true,
                description: true,
            }
        });
        if (departments) {
            res.status(200).json({ payload: { departments: departments } });
        }
        else {
            throw Error("No departments found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}
const getDepartmentBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    if (typeof slug === 'string') {
        try {
            const department = await prisma.department.findUnique({
                where: { slug: slug },
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    description: true,
                    dept_allocs: {
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
                                            linkedin: true,
                                            facebook: true
                                        }
                                    }
                                }
                            },
                            role: true,
                            speciality: true
                        }
                    }
                }
            });
            if (department) {
                res.status(200).json({ payload: { department: department } });
            }
            else {
                throw Error("No department found with requested slug")
            }
        } catch (error: any) {
            console.error(error);
            res.status(500).json(error.message)
        }
    }
}

const createDepartment = async (req: Request, res: Response) => {
    const { name, slug, description } = req.body;
    const department = {
        name, slug, description
    }
    try {
        if (department) {
            const response = await prisma.department.create({
                data: department
            })
            res.status(201).json({ message: "Department created successfully" });
        }
        else {
            throw Error("Department not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error.message })
    }
}
const createDepartmentAllocation = async (req: Request, res: Response) => {
    const { dept_id, member_id, role, speciality } = req.body;

    try {
        if (dept_id && typeof dept_id === 'string') {
            const dept_alloc = {
                member_id,
                dept_id,
                role,
                speciality
            }
            const response = await prisma.dept_Allocations.create({
                data: dept_alloc
            })
            console.log(response);
            res.status(201).json({ message: "Department Allocation created successfully" });
        }
        else {
            throw Error("Department not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error.message })
    }
}

const deleteDepartmentBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        if (slug && typeof slug === 'string') {
            const response = await prisma.department.delete({
                where: { slug }
            })
            console.log(response);
            res.status(200).json({ message: "Department Deleted successfully" })
        }
        else {
            throw new Error("No slug was provided")
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}
const deleteDepartmentAllocation = async (req: Request, res: Response) => {
    const { id } = req.params;//Dept_Allocation_id
    try {
        if (id && typeof id === 'string') {
            const response = await prisma.department.delete({
                where: { id }
            })
            console.log(response);
            res.status(200).json({ message: "Department Allocation Deleted successfully" })
        }
        else {
            throw new Error("No id was provided")
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}


const updateDepartmentBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params
    const { name, description } = req.body;
    const data: any = {}
    try {
        if (name) data.name = name;
        if (description) data.description = description;
        if (slug && typeof slug === 'string') {
            const response = await prisma.department.update({
                where: { slug: slug },
                data
            })
            res.status(200).json({ message: "Department updated successfully" });
        }
        else {
            throw Error("Department not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error })
    }
}


export { createDepartment, getAllDepartments, deleteDepartmentBySlug, updateDepartmentBySlug, getDepartmentBySlug, createDepartmentAllocation, deleteDepartmentAllocation };