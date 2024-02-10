import express from 'express';
import { createComment, getCommentsByPostId, updateComment, deleteComment } from '../controllers/commentController';
import authJWT from '../middlewares/authJWT';

const router = express.Router();

router.post('/', authJWT.verifyToken,createComment);
router.get('/:postId', authJWT.verifyToken,getCommentsByPostId);
router.put('/:id', authJWT.verifyToken, updateComment);
router.delete('/:id', authJWT.verifyToken,deleteComment);

export default router;
