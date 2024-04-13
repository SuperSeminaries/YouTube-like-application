import { CommentReply } from "../models/commentReply.models.js";



const getRepliesToComment = async (req, res) => {
    try {
        const { id: videoId, comment_id: commentId } = req.params;

        const replies = await CommentReply.find({ comment: commentId });

        res.status(200).json({ success: true, data: replies });

    } catch (error) {
        console.error('Error fetching replies to comment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


const replyToComment = async (req, res) => {
    try {
        const { id: videoId, comment_id: commentId } = req.params;
        const userId = req.user.id;
        const { content } = req.body;

        const reply = await CommentReply.create({ comment: commentId, user: userId, content });

        res.status(201).json({ success: true, data: reply });

    } catch (error) {
        console.error('Error replying to comment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export {replyToComment, getRepliesToComment }