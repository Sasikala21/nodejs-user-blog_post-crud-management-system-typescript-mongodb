import { Request, Response } from 'express';
// import UserModel, { IUser } from '../models/UserModel';
import UserModel from '../models/userModel';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import securePassword from '../middlewares/securePassword';

interface UserRequest extends Request {
    userId?: string;
}
//create or update User
export const createOrUpdateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        let user;

        if (userId) {
            // Update existing user
            user = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
            if (!user) {
                res.status(404).send({ status: 'Failure', statusCode: 404, message: 'User not found' });
                return;
            }
            res.status(200).send({ status: 'Success', statusCode: 200, message: 'User updated successfully' });
        } else {
            // Create new user
            const existingUser = await UserModel.findOne({ username: req.body.username });
            if (existingUser) {
                res.status(409).send({ status: 'Failure', statusCode: 409, error: 'Username already exists' });
                return;
            }

            if (req.body.password !== req.body.confirmPassword) {
                res.status(400).send({ status: 'Failure', statusCode: 400, message: 'Password & Confirm Password do not match!' });
                return;
            }

            user = new UserModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
                mobile: req.body.mobile,
                password: req.body.password ? req.body.password : 'password@123',
                status: req.body.status,
                role: req.body.role,
            });

            if (req.file) {
                user.profileImage = req.file.path;
            } else {
                user.profileImage = '';
            }

            await user.save();
            res.status(201).send({ status: 'Success', statusCode: 201, message: 'User created successfully!!' });
        }
    } catch (error) {
        res.status(500).json({ status: 'Failure', statusCode: 500, message: error instanceof Error ? error.message : 'An error occurred' });
    }
};


// Retrieve all Users from the database
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const searchQuery: string = req.query.search as string;
        const limitValue: number = parseInt(req.query.limit as string) || 10; // Type assertion and default value
        const page: number = parseInt(req.query.page as string) || 1; // Type assertion and default value
        const sortBy: string = req.query.sortBy as string || 'username';
        const order: string = req.query.order as string || 'asc';
        const startIndex = (page - 1) * limitValue;
        const endIndex = page * limitValue;
        const status: string = req.query.status as string;
        const role: string = req.query.role as string;
        const username: string = req.query.username as string;
        const regexOptions = 'i'; // Declare $regex as a string variable with the desired options
        const regex = new RegExp(searchQuery, regexOptions); // Create a regex object with the options
        const query: any = {};
        if (status) {
            query.status = new RegExp(status, regexOptions);
        }
        if (role) {
            query.role = new RegExp(role, regexOptions);
        }
        if (username) {
            query.username = new RegExp(username, regexOptions);
        }
        const sort: any = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;
        const totalCount = await UserModel.countDocuments(query);
        const nextPageCount = Math.max(0, totalCount - endIndex);
        const totalPages = Math.ceil(totalCount / limitValue);
        const users = await UserModel.find(query)
            .sort(sortBy)
            .skip((page - 1) * limitValue)
            .limit(limitValue);
        const currentPageCount = users.length;
        res.status(200).send({
            status: 'Success',
            statusCode: 200,
            data: users,
            page: page,
            limit: limitValue,
            totalCount, currentPageCount, nextPageCount,
            totalPages, currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
            message: 'Users Details Fetched Successfully',

        });
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'Failure', statusCode: 500, message: 'Internal Server Error' });
    }
};

// Get current user profile
export const getCurrentUser = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            res.status(404).send({ status: 'Failure', statusCode: 404, message: 'User not found' });
        } else {
            const userData = {
                "userId": user._id,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "username": user.username,
                "mobileCountryCode": user.mobileCountryCode,
                "mobile": user.mobile,
                "profileImage": user.profileImage,
                "status": user.status,
                "role": user.role
            }
            res.status(200).send({ status: 'Success', statusCode: 200, message: 'User Details Fetched Successfully!', userData });
        }
    } catch {
        res.status(500).send({ status: 'Failure', statusCode: 500, message: "Internal server error" });
    }
};

// Get a single User by id
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById({ _id: req.params.id });
        if (!user) {
            res.status(404).send({ status: 'Failure', statusCode: 404, message: "User not found" });
        } else {
            const userData = {
                "_id": user._id,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "username": user.username,
                "mobileCountryCode": user.mobileCountryCode,
                "mobile": user.mobile,
                "profileImage": user.profileImage,
                "status": user.status
            }
            res.send({
                status: 'Success',
                statusCode: 200,
                message: "User Details fetched sucessfully",
                data: userData
            });
        }
    } catch (error) {
        res.status(500).json({ status: 'Failure', statusCode: 500, message: error instanceof Error ? error.message : 'An error occurred' });
    }
};

// Update User status by id
export const updateStatusUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        const updatedUser = await UserModel.findByIdAndUpdate(id, status);
        if (!updatedUser) {
            res.status(404).send({ status: 'Failure', statusCode: 404, message: 'User not found' });
        } else {
            res.status(200).send({ status: 'Success', statusCode: 200, message: 'User status updated successfully!' });
        }
    } catch (error) {
        res.status(500).json({ status: 'Failure', statusCode: 500, message: error instanceof Error ? error.message : 'An error occurred' });
    }
};

// Delete a User by id
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const deleteUser = await UserModel.findById(id);
        if (!deleteUser) {
            res.status(404).send({ status: 'Failure', statusCode: 404, message: 'User not found' });
        } else {
            await UserModel.findByIdAndDelete(id);
            res.status(200).send({ status: 'Success', statusCode: 200, message: 'User deleted successfully' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Failure', statusCode: 500, message: error instanceof Error ? error.message : 'An error occurred' });
    }
};

// Delete a profile image by id
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            res.status(404).send({ status: 'Failure', statusCode: 404, message: "User Not Found" });
        }
        else {
            if (existingUser.profileImage) {
                const imagePath = path.join(existingUser.profileImage);
                fs.unlinkSync(imagePath);
                existingUser.profileImage = '';
                existingUser.save();
                res.status(200).send({ status: 'Success', statusCode: 200, message: "ProfileImage deleted successfully" });
            } else {
                existingUser.profileImage = '';
                existingUser.save();
                res.status(200).send({ status: 'Success', statusCode: 200, message: "ProfileImage deleted successfully" });
            }
        }
    } catch (error) {
        res.status(500).send({ status: 'Failure', statusCode: 500, message: 'Internal Server Error' });
    }
};

// Change password
export const changePassword = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            res.status(404).send({ status: 'Failure', statusCode: 404, message: 'User not found' })
        } else {
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
            if (isPasswordMatch) {
                res.status(400).send({ status: 'Failure', statusCode: 400, message: 'Old password is incorrect' });
            } else {
                if (oldPassword !== newPassword) {
                    if (newPassword !== confirmPassword) {
                        res.status(400).send({ status: 'Failure', statusCode: 400, message: 'New password and confirm password do not match' });
                    }
                    const hashedNewPassword = await securePassword(newPassword);
                    user.password = hashedNewPassword;
                    await user.save();
                    res.status(200).send({ status: 'Success', statusCode: 200, message: 'Password was updated successfully' });
                } else {
                    res.status(400).send({ status: 'Failure', statusCode: 400, message: 'Old password should not same as new password!' });
                }

            }
        }
    } catch (error) {
        res.status(500).send({ status: 'Failure', statusCode: 500, message: 'Internal server error' });
    }
};
