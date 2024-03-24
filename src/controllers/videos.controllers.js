import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/videos.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createVideo = async(req, res) => {
    try {
        const { title, description, privacy, tags } = req.body;

        // if ([title, description, tags].some(field => !field || field.trim() === "")) {
        //     return res.status(400).json({ success: false, message: "Title and description are required" });
        // }

        if (!title || !description || !tags) {
            let errors = {};
        
            if (!title) {
                errors.title = "Title is required";
            }
            if (!description) {
                errors.description = "Description is required";
            }
            if (!tags) {
                errors.tags = "Tags are required";
            }
            return res.status(400).json({ success: false, errors });
        }

        const uploadedBy = req.user.id;

        const videoUrl = req.files['videoUrl'][0]?.path;
        const thumbnail = req.files['thumbnail'][0]?.path;

        if (!videoUrl || !thumbnail) {
            return res.status(400).json({ success: false, message: "Video and thumbnail are required" });
        }

        const uploadedVideo = await uploadOnCloudinary(videoUrl);
        const uploadedThumbnail = await uploadOnCloudinary(thumbnail);

        if (!uploadedVideo || !uploadedThumbnail) {
            return res.status(500).json({ success: false, message: "Problem uploading video or thumbnail" });
        }

        const video = await Video.create({
            uploadedBy,
            title,
            description,
            duration: uploadedVideo.duration ,
            videoUrl: uploadedVideo.url, // Assuming `uploadOnCloudinary` returns an object with `url` property
            thumbnail: uploadedThumbnail.url,
            tags,
            privacy,
        });

        res.status(201).json({ success: true, data:video });

    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getVideoById = async (req, res) => {
    try {
        const videoId = req.params.id;

        if (!videoId || !isValidObjectId(videoId)) {
            return res.status(400).json({ message: "Valid video ID is required" })
        }

        const video = await Video.findByIdAndUpdate(videoId, {$inc: {views: 1}}, {new: true}).populate('uploadedBy', 'username')

        if (!video) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        res.status(200).json({success: true, data: video})

    } catch (error) {
        console.error('Error fetching video by ID:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const updateVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;

        if (!mongoose.isValidObjectId(videoId)) {
            return res.status(400).json({ message: "Valid video ID is required" });
        }

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        const { title, description, tags, privacy = "public" } = req.body; // Default value for privacy

        if (!title || !description || !tags) {
            let errors = {};
            if (!title) {
                errors.title = "Title is required";
            }
            if (!description) {
                errors.description = "Description is required";
            }
            if (!tags) {
                errors.tags = "Tags are required";
            }
            return res.status(400).json({ success: false, errors });
        }

        if (video.uploadedBy.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to update the video" });
        }

        // Update the video fields
        video.title = title;
        video.description = description;
        video.tags = tags;
        video.privacy = privacy;

        const updatedVideo = await video.save();

        res.status(200).json({ success: true, message: "Video updated successfully", data: updatedVideo });

    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const user = req.user;

        if (!mongoose.isValidObjectId(videoId)) {
            return res.status(400).json({ success: false, message: "Valid video ID is required" });
        }

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        if (video.uploadedBy.toString() !== user.id && user.role !== 'admin' ) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete the video" });
        }

        await Video.findByIdAndDelete(videoId);

        res.status(200).json({ success: true, message: 'Video deleted successfully', data: video });

    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getVideo = async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json({ success: true, message: 'Videos retrieved successfully', data: videos });
    } catch (error) {
        console.error('Error retrieving videos:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



export { createVideo, getVideoById, updateVideo, deleteVideo, getVideo }