import prisma from '../utils/prisma.ts'
import { generateHashedPassword } from '../utils/hash.ts';



const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                avatar: true,
                email: true
            }
        });
        if (users.length) {
            res.status(200).json({ payload: { users: users } });
        }
        else {
            throw Error("No user found")
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
                throw Error("No user found")
            }
        }
        else {
            throw Error("id not found in request");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
}

const createUser = async (req, res) => {
    const { first_name, last_name, email, password, avatar } = req.body;
    const hashedPassword = await generateHashedPassword(password);
    console.log(email);
    const user = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        avatar: avatar
    }
    try {
        if (user) {
            const response = await prisma.user.create({
                data: user
            })
            res.status(201).json({ message: "User created successfully" });
        }
        else {
            throw Error("User not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error })
    }
}


export { getAllUsers, getUser, createUser }