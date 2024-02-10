import express from 'express';
import * as UserController from '../controllers/userController';
import upload from '../middlewares/upload';
import authJWT from '../middlewares/authJWT';
import roleAuth from '../middlewares/roleAuth';

const router = express.Router();


router.get('/currentUser', authJWT.verifyToken, UserController.getCurrentUser);
router.route('/:id').get(authJWT.verifyToken, UserController.getUserById).put(authJWT.verifyToken, upload, UserController.createOrUpdateUser);
router.delete('/image/:id', authJWT.verifyToken, UserController.deleteImage);
router.post('/changepassword', authJWT.verifyToken, UserController.changePassword);

/* protected routes for admin */
router.get('/list', authJWT.verifyToken, roleAuth.isAdmin, UserController.getAllUsers);
router.post('/', authJWT.verifyToken, roleAuth.isAdmin, upload, UserController.createOrUpdateUser);
router.patch('/status/:id', authJWT.verifyToken, roleAuth.isAdmin, UserController.updateStatusUser);
router.delete('/:id', authJWT.verifyToken, roleAuth.isAdmin, UserController.deleteUser);


export default router;
