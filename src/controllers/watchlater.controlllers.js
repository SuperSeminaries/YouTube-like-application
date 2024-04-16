import mongoose from "mongoose";
import { WatchLater } from "../models/watchlater.models.js";



const addToWatchLater = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;

        console.log("userId", userId);
        console.log("videoId", videoId);

        if (!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid video ID or user ID' });
        }

        const watchLater = await WatchLater.findOne({videos: videoId, user: userId})
        if (watchLater) {
            return res.status(400).json({ success: false, message: 'Video already added to watch later' });
        }

        const newWatchLater = new WatchLater({ videos: videoId, user: userId });
        await newWatchLater.save();

        res.status(201).json({ success: true, message: 'Video added to watch later successfully' });

    } catch (error) {
        console.error('Error adding video to watch later:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const removeFromWatchLater = async (req, res) => {
    try {
        const userId = req.user.id;
        const videoId = req.params.id;

        const watchLater = await WatchLater.findOneAndDelete({ videos: videoId, user: userId });
        if (!watchLater) {
          return res.status(404).json({ success: false, message: 'Video not found in watch later list' });
        }
    
        res.status(200).json({ success: true, message: 'Video removed from watch later successfully' });
      } catch (error) {
        console.error('Error removing video from watch later:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
};

const getWatchLaterList = async (req, res) => {
    try {
        const userId = req.user.id;

        const watchLaterList = await WatchLater.findOne({user: userId}).populate('videos');
        res.status(200).json({ success: true, data: watchLaterList });
    } catch (error) {
      console.error('Error getting watch later list:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
    

export { addToWatchLater, removeFromWatchLater, getWatchLaterList }