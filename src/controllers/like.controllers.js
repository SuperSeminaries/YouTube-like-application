import mongoose from "mongoose";
import { Video } from "../models/videos.models.js";


const likeVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;

        if (!mongoose.isValidObjectId(videoId)) {
            return res.status(400).json({ success: false, message: "Valid video IDs are required" });
        }

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        let isLiked = video.likes.includes(userId);
        const isDisliked = video.dislikes.includes(userId);
        if (isDisliked) {
            await Video.findByIdAndUpdate(videoId, { $pull: { dislikes: userId } })
        }

        const update = isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };
        const updatedVideo = await Video.findByIdAndUpdate( videoId, update, { new: true });

        if (!updatedVideo) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        const message = isLiked ? 'Video liked successfully' : 'Video unliked successfully';

        res.status(200).json({ success: true, message, data: updatedVideo });
    } catch (error) {
        console.error('Error liking video:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const dislikesVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        const isDisliked = video.dislikes.includes(userId);
        let isLiked = video.likes.includes(userId);
        if (isLiked) {
            await Video.findByIdAndUpdate(videoId, { $pull: { likes: userId } })
        }
        const update = isDisliked ? {$pull: {dislikes: userId}} : {$addToSet: {dislikes: userId}}
        const updatedVideo = await Video.findByIdAndUpdate(videoId, update, {new: true})

        if (!updatedVideo) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        const message = isDisliked ? 'Video undisliked successfully' : 'Video disliked successfully';

        res.status(200).json({ success: true, message, data: updatedVideo });

    } catch (error) {
        console.error('Error dislikes video:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



export { likeVideo, dislikesVideo }