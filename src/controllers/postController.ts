import { Request, Response } from 'express';
import Post,{IPost } from '../models/postModel';

export const createPost = async (req: Request, res: Response): Promise<void> => {
   const { title, content } = req.body;
    try {
        const existingPost:IPost | null = await Post.findOne({ title });
        if(existingPost) {
            res.status(409).json({ message: "Already exists title, need unique title" });
        }
        const post:IPost= await Post.create({ title, content });
        await post.save();
        res.status(201).json({ message:"Post created successfully!"})
    } catch (error) {
      console.log(error);
    res.status(500).json({ message: "internal server error"})
   }  
}

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
      const posts: IPost[] = await Post.find();
      res.status(200).json(posts);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to fetch posts', error });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const post: IPost | null = await Post.findById(postId);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const updatedPost: IPost | null = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });
    if (updatedPost) {
      res.status(200).json({ message: "Post details updated successfully!"});
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const deletedPost: IPost | null = await Post.findByIdAndDelete(postId);
    if (deletedPost) {
      res.status(200).json({ message: "Post details deleted successfully!"});
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error });
  }
};
