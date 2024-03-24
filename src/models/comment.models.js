import mongoose from "mongoose";
import { User } from "./users.models.js";
import { Video } from "./videos.models.js";

// Define the comment schema
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    commentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export const Comment = mongoose.model('Comment', commentSchema);


