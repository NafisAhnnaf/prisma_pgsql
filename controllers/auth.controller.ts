import { decodePassword, generateHashedPassword } from "../utils/hash.ts";
import prisma from "../utils/prisma.ts";
import type { Request, Response } from "express";
import { encodeJwt, encodeRefreshToken } from "../utils/jwt.ts";
import { clearCookies, setAuthCookies } from "../utils/cookie.ts";


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

const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        if (email && password) {
            const response = await prisma.user.findUnique({
                where: { email: email }
            })
            if (response) {
                res.status(400).json({ message: "User already exists. Try Logging In" })
            }
            else {
                const hashedPassword = await generateHashedPassword(password);
                const user = { email, password: hashedPassword }
                const response = await prisma.user.create({
                    data: user
                })

                res.status(201).json({ message: "User registered successfully.", next_step: "Verify", user: { email: email } })
            }
        }
    } catch (error) {

    }
}

const verifyEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        if (email) {
            const response = await prisma.user.update({
                where: { email: email },
                data: { isverified: true }
            })
            if (response) {
                res.status(200).json({ message: "Email verified successfully. You can now login." });
            }
            else throw new Error("Email not found");
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
                // console.log();
                const hasMatched = await decodePassword(password, response.password)
                if (!hasMatched) return res.status(400).json("Invalid Password");
                if (!response.isverified) return res.status(400).json({ message: "Email not verified. Please verify your email to login." });
                else {
                    const token = encodeJwt(response.id);
                    const refreshtoken = encodeRefreshToken(response.id);
                    const user = {
                        id: response.id,
                        email: response.email,
                        first_name: response.first_name,
                        last_name: response.last_name,
                        avatar: response.avatar,
                    }
                    setAuthCookies(res, token, refreshtoken)
                    return res.status(200).json({ payload: { user }, message: "User Logged in" });
                }
            }
        }
        else throw new Error("Invalid credentials");

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while logging you in, " + error.message })
    }
}

const getAuthUser = async (req: Request, res: Response) => {
    const id = req.headers.user_id;
    try {
        if (id && typeof id === 'string') {
            const response = await prisma.user.findUnique({
                where: { id: id }
            });
            if (response) {

                const user = {
                    is_complete: response.is_complete,
                    first_name: response.first_name,
                    last_name: response.last_name,
                    email: response.email,
                    avatar: response.avatar,
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


const logoutUser = async (req: Request, res: Response) => {
    try {
        clearCookies(res, 'access_token');
        clearCookies(res, 'refresh_token');

        return res.status(200).json({ message: "Logged out" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while logging you out, " + error.message })
    }
};


export { loginUser, logoutUser, checkEmail, getAuthUser, registerUser, verifyEmail }