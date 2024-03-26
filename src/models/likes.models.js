import mongoose from "mongoose";
import { Video } from "./videos.models.js";
import { User } from "./users.models.js";


const likeSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    likeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ['likes', 'dislikes'],
        required: true
    }

},{timestamps: true})

export const Like = mongoose.model("Like", likeSchema)