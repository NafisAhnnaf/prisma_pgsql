import type { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma.ts";
import { decodeJwt } from "../utils/jwt.ts";

const adminGuard = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    try {
        const authHead = req.headers.authorization;
        if (req.cookies?.access_token) {
            token = req.cookies.access_token;
        }
        else if (authHead?.startsWith('Bearer ')) {
            token = authHead.split(' ')[1];
        }
        else {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (token && token.length > 0) {
            const userId = decodeJwt(token);
            // console.log(userId);
            if (typeof userId === 'string') {
                const response = await prisma.admin.findUnique({
                    where: { user_id: userId }
                })
                // console.log(response);
                if (response) {
                    req.headers.user_id = userId;
                    req.headers.admin_id = response.id;
                    next();
                }
                else return res.status(403).json({ message: "Admin access required" });
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: error.message });
    }
}
const userGuard = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    try {
        const authHead = req.headers.authorization;
        if (req.cookies?.access_token) {
            token = req.cookies.access_token;
        }
        else if (authHead?.startsWith('Bearer ')) {
            token = authHead.split(' ')[1];
        }
        else {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (token && token.length > 0) {
            const userId = decodeJwt(token);
            // console.log(userId);
            if (typeof userId === 'string') {
                const response = await prisma.user.findUnique({
                    where: { id: userId }
                })
                // console.log(response);
                if (response) {
                    req.headers.user_id = userId;
                    next();
                }
                else return res.status(403).json({ message: "Login required" });
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: error.message });
    }
}




export { adminGuard, userGuard }