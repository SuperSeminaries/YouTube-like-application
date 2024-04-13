import mongoose from "mongoose";
import { User } from "./users.models.js";
import { Comment } from "./comment.models.js";


const commentReplySchema = new mongoose.Schema({
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }, { timestamps: true });
  
  export const CommentReply = mongoose.model('CommentReply', commentReplySchema);