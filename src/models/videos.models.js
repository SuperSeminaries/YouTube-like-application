import mongoose from "mongoose";
import { User } from "./users.models.js";
import { Like } from "./likes.models.js";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Like"
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Like"
  }],
  tags: [String],
  duration: {
    type: Number,
    required: true
  },
  thumbnail: String,
  videoUrl: {
    type: String,
    required: true
  },
  privacy: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
}, {
  timestamps: true
});


export const Video = mongoose.model('Video', videoSchema);


