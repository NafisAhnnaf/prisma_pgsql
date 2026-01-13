import type { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma.ts";
import { decodeJwt } from "../utils/jwt.ts";

const adminGuard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHead = req.headers.authorization;
        if (authHead?.startsWith('Bearer ')) {
            const token = authHead.split(' ')[1];
            if (token.length > 0) {
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
        }
        else {
            throw new Error("Bearer token missing");
        }
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: error.message });
    }
}


export { adminGuard }