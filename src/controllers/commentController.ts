import { Request, Response } from 'express';
import Comment from '../models/commentModel';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, comment } = req.body;
    const newComment = new Comment({
      postId: postId,
      comment: comment
    });
    await newComment.save();
    res.status(201).json({ message: "Comments created successfully!" });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create comment', error });
  }
};

export const getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId });
    if (!comments) {
      res.status(404).json({ data: comments, message: "Comments not found for this post!" });
    } else {
      res.status(200).json({ data: comments, message: "Comments retrieved successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = req.params.id;
    const { comment } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(comment, { comment }, { new: true });
    if (updatedComment) {
      res.status(200).json({ message: "Comment updated successfully!" });
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update comment!' });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = req.params.id;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (deletedComment) {
      res.status(200).json({ message: "Comments deleted successfully!" });
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
