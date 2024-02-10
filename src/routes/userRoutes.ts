import express from 'express';
import UserController from '../controllers/userController';
import upload from '../middlewares/upload';
// import checkDuplicateUsernameOrEmail from '../middlewares/checkDuplicateUsernameOrEmail';
import authJWT from '../middlewares/authJWT';
import roleAuth from '../middlewares/roleAuth';

const router = express.Router();

router.get('/list', authJWT.verifyToken, roleAuth.isAdmin, UserController.getAllUsers);
router.get('/currentUser', authJWT.verifyToken, UserController.getCurrentUser);
router.route('/:id').get(authJWT.verifyToken, roleAuth.isAdmin, UserController.getUserById).put(authJWT.verifyToken, upload, UserController.createOrUpdateUser);
router.post('/', authJWT.verifyToken, roleAuth.isAdmin, upload, UserController.createOrUpdateUser);
router.patch('/status/:id', authJWT.verifyToken, roleAuth.isAdmin, UserController.updateStatusUser);
router.delete('/:id', authJWT.verifyToken, roleAuth.isAdmin, UserController.deleteUser);
router.delete('/image/:id', authJWT.verifyToken, roleAuth.isAdmin, UserController.deleteImage);
router.post('/changepassword', authJWT.verifyToken, UserController.changePassword);

export default router;
