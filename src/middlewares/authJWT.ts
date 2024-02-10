import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

interface CustomRequest extends Request {
    user?: any; // Adjust the type as per your user object structure
    userId?: string;
    token?: string;
    exp?: number;
    role?: string;
}

const invalidatedTokens: string[] = [];
const refreshTokens: string[] = [];


const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ status: 'Failure', statusCode: 401, message: 'Access denied! No token provided!' });
    }
    if (invalidatedTokens.includes(token)) {
        return res.status(401).json({ status: 'Failure', statusCode: 401, message: 'Invalid token!' });
    } 
    try {
        const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
        req.user = decoded;
        req.userId = decoded._id;
        req.token = token;
        req.exp = decoded.exp;
        req.role = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ status: 'Failure', statusCode: 401, message: 'Invalid token!' });
    }
};

const invalidateToken = (token: string) => {
    invalidatedTokens.push(token);
};

const refreshToken = (refreshToken: string) => {
    refreshTokens.push(refreshToken);
};

const authJWT = { verifyToken, invalidateToken, refreshToken };
export default authJWT;
