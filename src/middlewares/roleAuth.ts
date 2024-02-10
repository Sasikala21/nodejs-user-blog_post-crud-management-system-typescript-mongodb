import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { IUser } from '../models/userModel'; // Assuming the user model interface is named IUser
import authJWT from './authJWT'; // Import authJWT middleware

interface CustomRequest extends Request {
    user?: any; // Adjust the type as per your user object structure
    userId?: string;
    token?: string;
    exp?: number;
    role?: string;
}

const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Verify the JWT token using authJWT middleware
        authJWT.verifyToken(req, res, async () => {
            const user:IUser | null = await UserModel.findById(req.userId);
            if (user && user.role === 'Admin') {
                next();
            } else {
                res.status(403).json({ status: 'Failure', statusCode: 403, message: 'Access denied! You do not have the required role!' });
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'Failure', statusCode: 500, message: error instanceof Error ? error.message : 'An error occurred' });
    }
};

const isManager = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Verify the JWT token using authJWT middleware
        authJWT.verifyToken(req, res, async () => {
            const user: IUser | null = await UserModel.findById(req.userId);
            if (user && user.role === 'Manager') {
                next();
            } else {
                res.status(403).json({ status: 'Failure', statusCode: 403, message: 'Access denied! You do not have the required role!' });
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'Failure', statusCode: 500, message: error instanceof Error ? error.message : 'An error occurred' });
    }
};

const roleAuth = { isAdmin, isManager };
export default roleAuth;
