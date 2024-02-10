import express, { Router } from 'express';
import * as AuthController from '../controllers/authController';
import authJWT from '../middlewares/authJWT';

const router: Router = express.Router();

router.post('/login', AuthController.login);
router.post('/logout', authJWT.verifyToken, AuthController.logout);
router.post('/token/refreshToken', AuthController.refreshToken);

export default router;
