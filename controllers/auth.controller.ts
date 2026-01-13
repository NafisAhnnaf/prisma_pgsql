import { decodePassword } from "../utils/hash.ts";
import prisma from "../utils/prisma.ts";
import type { Request, Response } from "express";
import { encodeJwt } from "../utils/jwt.ts";


const checkEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        if (email) {
            const response = await prisma.user.findUnique({
                where: { email: email }
            })
            if (response) res.status(200).json({ message: "Email exists and registered" });
            else throw new Error("Email doesn't exist");
        }
        else throw new Error("Email not found with request");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while verifying email" })
    }
}

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        if (email && password) {
            const response = await prisma.user.findUnique({
                where: { email: email }
            })
            if (response?.password) {
                console.log();
                const hasMatched = await decodePassword(password, response.password)
                if (!hasMatched) return res.status(400).json("Invalid Password");
                else {
                    const token = encodeJwt(response.id);
                    const user = {
                        id: response.id,
                        email: response.email,
                        first_name: response.first_name,
                        last_name: response.last_name,
                        avatar: response.avatar
                    }
                    return res.status(200).json({ payload: { user, token }, message: "User Logged in" });
                }
            }
        }
        else throw new Error("Invalid credentials");

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while logging you in, " + error.message })
    }
}


export { loginUser, checkEmail }