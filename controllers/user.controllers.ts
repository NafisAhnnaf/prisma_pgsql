import prisma from '../utils/prisma.ts'
import { generateHashedPassword } from '../utils/hash.ts';
import type { Request, Response } from 'express';


const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                avatar: true,
                email: true,
                birth_date: true,
            }
        });
        if (users.length) {
            res.status(200).json({ payload: { users: users } });
        }
        else {
            throw new Error("No user found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}


const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            const user = await prisma.user.findUnique({
                where: { id: id }
            });
            if (user) {
                res.status(200).json({ payload: { user: user } });
            }
            else {
                throw new Error("No user found")
            }
        }
        else {
            throw new Error("id not found in request");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}
const getProfile = async (req: Request, res: Response) => {
    // const { id } = req.params;
    const id = req.headers.user_id;
    try {
        if (id && typeof id === 'string') {
            const response = await prisma.user.findUnique({
                where: { id: id }
            });
            if (response) {
                let user;
                if (response.is_complete) {
                    user = {
                        is_complete: response.is_complete,
                        first_name: response.first_name,
                        last_name: response.last_name,
                        avatar: response.avatar,
                        email: response.email,
                        created_at: response.created_at,
                        birth_date: response.birth_date,
                        facebook: response.facebook,
                        gender: response.gender,
                    }
                }
                else {
                    user = {
                        is_complete: response.is_complete,
                        first_name: response.first_name,
                        last_name: response.last_name,
                        email: response.email,
                        avatar: response.avatar,
                        created_at: response.created_at,
                    }
                }
                res.status(200).json({ payload: { user: user } });
            }
            else {
                throw new Error("No user found")
            }
        }
        else {
            throw new Error("id not found in request headers");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}



const createUser = async (req, res) => {
    const { first_name, last_name, email, password, avatar, birth_date, facebook, linkedin, gender } = req.body;
    const hashedPassword = await generateHashedPassword(password);
    console.log(email);
    const user = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        avatar: avatar,
        birth_date: new Date(birth_date),
        facebook: facebook,
        linkedin: linkedin,
        gender: gender && typeof gender === 'string' && gender.toUpperCase(),
    }
    try {
        if (user) {
            const response = await prisma.user.create({
                data: user
            })
            res.status(201).json({ message: "User created successfully" });
        }
        else {
            throw new Error("User not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error })
    }
}


const deleteUser = async (req: Request, res: Response) => {
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


const updateUser = async (req, res) => {
    const { id } = req.params
    const { first_name, last_name, email, password, avatar, birth_date, gender, facebook, linkedin, roll_number } = req.body;
    const data: any = {}
    try {
        if (first_name) data.first_name = first_name;
        if (last_name) data.last_name = last_name;
        if (email) data.email = email;
        if (password) data.password = await generateHashedPassword(password);
        if (avatar) data.avatar = avatar;
        if (facebook) data.facebook = facebook;
        if (linkedin) data.linkedin = linkedin;
        if (roll_number && typeof roll_number === 'string') data.roll_number = parseInt(roll_number);
        if (gender && typeof gender === 'string') data.gender = gender.toUpperCase();
        if (birth_date) data.birth_date = new Date(birth_date); // convert to Date if needed

        if (Object.keys(data).length === 0) {
            throw new Error("No valid fields provided for update");
        }
        if (id) {
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


export { getAllUsers, getUser, getProfile, createUser, deleteUser, updateUser }