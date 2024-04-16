import mongoose from "mongoose";
import { Video } from "./videos.models.js";
import { User } from "./users.models.js";

const watchLaterSchema = new mongoose.Schema({
    videos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

export const WatchLater = mongoose.model("WatchLater", watchLaterSchema)