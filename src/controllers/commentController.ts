import { Request, Response } from 'express';
import Comment, { IComment } from '../models/commentModel';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, comment } = req.body;
    const newComment: IComment = new Comment({ postId, comment });
    await newComment.save();
    res.status(201).json({ message: "Comments created successfully!"});
  } catch (error) {
    res.status(500).json({ message: 'Failed to create comment', error });
  }
};

export const getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.postId;
    const comments: IComment[] = await Comment.find({ postId });
    res.status(200).json({ data: comments, message: "Comments retrieved successfully!"});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error });
  }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = req.params.id;
    const { comment } = req.body;
    const updatedComment: IComment | null = await Comment.findByIdAndUpdate(commentId, { comment }, { new: true });
    if (updatedComment) {
      res.status(200).json({ message: "Comment updated successfully!"});
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update comment', error });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = req.params.id;
    const deletedComment: IComment | null = await Comment.findByIdAndDelete(commentId);
    if (deletedComment) {
      res.status(200).json({ message: "Comments deleted successfully!"});
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error });
  }
};
