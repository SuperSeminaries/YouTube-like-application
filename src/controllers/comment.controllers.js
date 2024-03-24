import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/videos.models.js";

const addComment = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;

        if (!mongoose.isValidObjectId(videoId)) {
            return res.status(400).json({ success: false, message: "Valid video ID is required" });
        }

        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const video = await Video.findById(videoId);
        
        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        const comment = await Comment.create({
            text,
            commentBy: userId,
            video: videoId
        });

        await Video.findByIdAndUpdate(videoId, { $push: { comments: comment.id } });

        res.status(201).json({ success: true, message: "Comment added successfully", data: comment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getCommentsByVideo = async (req, res) => {
    try {
      const  videoId  = req.params.id;

      if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json({ success: false, message: "Valid video ID is required" });
      }

      const comments = await Comment.find({video:videoId});
  
      res.status(200).json({ success: true, data: comments });

    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id: videoId, comment_id: commentId } = req.params;

        const userId = req.user.id;

        if (!mongoose.isValidObjectId(videoId) || !mongoose.isValidObjectId(commentId)) {
            return res.status(400).json({ success: false, message: "Valid video and comment IDs are required" });
        }

        const comments = await Comment.findById(commentId);
        
        if (!comments) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        if (comments.commentBy.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete the comment" });
        }
    
        await Comment.findByIdAndDelete(commentId);

        await Video.findByIdAndUpdate(videoId, { $pull: { comments: comments.id } });

        res.status(200).json({ success: true, message: "Comment deleted successfully" });

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const updateComment = async (req, res) => {
    try {
        const { id: videoId, comment_id: commentId } = req.params;
        
        if (!mongoose.isValidObjectId(videoId) || !mongoose.isValidObjectId(commentId)) {
            return res.status(400).json({ success: false, message: "Valid video and comment IDs are required" });
        }

        const userId = req.user.id;
        console.log("userId", userId);

        const {text} = req.body;

        const comment = await Comment.findById(commentId);

        console.log("c",comment.commentBy.toString());

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        if (comment.commentBy.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to update the comment" });
        }

        comment.text = text;

        await comment.save();

        res.status(200).json({ success: true, message: "Comment updated successfully", data: comment });


    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}






export { addComment, getCommentsByVideo, deleteComment, updateComment }
