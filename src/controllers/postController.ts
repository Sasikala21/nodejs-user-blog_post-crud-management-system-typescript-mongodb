import { Request, Response } from 'express';
import Post, { IPost } from '../models/postModel';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;
  try {
    const existingPost: IPost | null = await Post.findOne({ title });
    if (existingPost) {
      res.status(409).json({ message: "Already exists title, need unique title" });
    }
    const post: IPost = await Post.create({ title, content });
    await post.save();
    res.status(201).json({ message: "Post created successfully!" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" })
  }
}

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchQuery: string = req.query.search as string;
    const limitValue: number = parseInt(req.query.limit as string) || 10; // Type assertion and default value
    const page: number = parseInt(req.query.page as string) || 1; // Type assertion and default value
    const sortBy: string = req.query.sortBy as string || 'title';
    const order: string = req.query.order as string || 'asc';
    const startIndex = (page - 1) * limitValue;
    const endIndex = page * limitValue;
    const status: string = req.query.status as string;
    const regexOptions = 'i'; // Declare $regex as a string variable with the desired options
    const regex = new RegExp(searchQuery, regexOptions); // Create a regex object with the options
    const query: any = {};
    if (status) {
      query.status = new RegExp(status, regexOptions);
    }
    const sort: any = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;
    const totalCount = await Post.countDocuments(query);
    const nextPageCount = Math.max(0, totalCount - endIndex);
    const totalPages = Math.ceil(totalCount / limitValue);
    const posts: IPost[] = await Post.find(query).sort(sortBy).skip((page - 1) * limitValue).limit(limitValue);
    const currentPageCount = posts.length;
    if (!posts) {
      res.status(404).json({ message: "unable to fetch the posts" });
    } else {
      res.status(200).json({
        data: posts,
        page: page,
        limit: limitValue,
        totalCount, currentPageCount, nextPageCount,
        totalPages, currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        message: "Posts retrieved successfully!"
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
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
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const updatedPost: IPost | null = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });
    if (updatedPost) {
      res.status(200).json({ message: "Post details updated successfully!" });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const deletedPost: IPost | null = await Post.findByIdAndDelete(postId);
    if (deletedPost) {
      res.status(200).json({ message: "Post details deleted successfully!" });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
