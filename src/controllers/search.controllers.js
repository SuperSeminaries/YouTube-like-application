import { User } from "../models/users.models.js";
import { Video } from "../models/videos.models.js";


const searchUsers = async (req, res) => {
    try {
        const searchQuery = req.query.q;

        if (!searchQuery) {
            return res.status(400).json({ success: false, message: 'Search query is missing or invalid' });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: searchQuery, $options: "i" } },
            ]
        }).select("-password -referenceToken");

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Error searching for users:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const searchVideos = async (req, res) => {
    try {
        const searchQuery = req.query.q;

        const videos = await Video.find({ title: { $regex: searchQuery, $options: 'i' } });

        res.status(200).json({ success: true, data: videos });
        
    } catch (error) {
        console.error('Error searching for videos:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export { searchUsers, searchVideos }