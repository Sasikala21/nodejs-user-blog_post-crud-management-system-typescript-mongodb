import { Request, Response } from 'express';
import UserModel, { IUser } from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Login route
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(401).send({ status: 'Failure!', statusCode: 401, message: 'Invalid Email' });
        } else {
            // Check password
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                res.status(401).send({ status: 'Failure', statusCode: 401, message: 'Invalid Password' });
            } else {
                const accessToken = jwt.sign({ _id: user._id },
                    process.env.SECRET_KEY as string, {
                    expiresIn: '15m', // 15 min
                });
                const refreshToken = jwt.sign({ _id: user._id },
                    process.env.SECRET_KEY as string, {
                    expiresIn: '1d', // 1 day 
                });
                const decodedToken: any = jwt.decode(accessToken);
                const expirationTimestamp = decodedToken.exp;
                res.status(200).send({
                    statusCode: 200,
                    message: "Login Successfully",
                    accessToken,
                    refreshToken,
                    expiredAt: expirationTimestamp
                });
            }
        }
    } catch (error) {
        res.status(500).send({ status: 'Failure', statusCode: 500, message: 'Internal server error' });
    }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).send({ status: 'Success', statusCode: 200, message: "User Logged Out Successfully" });
    } catch (error) {
        res.status(500).send({ status: 'Failure', statusCode: 500, message: 'Internal Server Error' });
    }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    let { refreshToken } = req.body;
    if (!refreshToken)
        res.sendStatus(401);
    // Verify the refresh token
    jwt.verify(refreshToken, process.env.SECRET_KEY as string, (error: any, user: any) => {
        if (error) {
            res.sendStatus(403);
        } else {
            // Generate a new access token
            const accessToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY as string, { expiresIn: '15m' });
            res.status(200).send({ accessToken });
        }
    });
};