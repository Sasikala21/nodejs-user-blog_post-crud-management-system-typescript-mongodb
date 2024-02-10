import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: string;
  comment: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>('Comment', CommentSchema);
