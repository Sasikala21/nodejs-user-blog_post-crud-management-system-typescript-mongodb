import express from 'express';
import { createPost, getPostById, updatePost, deletePost, getAllPosts } from '../controllers/postController';
import authJWT from '../middlewares/authJWT';
const router = express.Router();

router.post('/', authJWT.verifyToken,createPost);
router.get('/', authJWT.verifyToken, getAllPosts);
router.get('/:id', authJWT.verifyToken, getPostById);
router.put('/:id', authJWT.verifyToken,updatePost);
router.delete('/:id', authJWT.verifyToken, deletePost);

export default router;
