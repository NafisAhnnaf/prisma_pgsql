import type { Request, Response, NextFunction } from "express"
const errorHandler = async (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        console.log(err)
        res.status(500).json({ message: "Something went Wrong" })
    }
    next();
}

export default errorHandler;