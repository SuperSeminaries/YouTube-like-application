import Routes from "express"
import { verifyjwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createVideo, deleteVideo, getTrendingVideos, getVideo, getVideoById, updateVideo } from "../controllers/videos.controllers.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { addComment, deleteComment, getCommentsByVideo, updateComment } from "../controllers/comment.controllers.js";
import { dislikesVideo, likeVideo } from "../controllers/like.controllers.js";
const router = Routes();


// Video Management:

router.route('/').get(verifyjwt, getVideo)
router.route("/").post(verifyjwt, upload.fields([{name: "videoUrl", maxCount: 1}, {name: "thumbnail", maxCount: 1}]), createVideo)
router.route('/:id').get(verifyjwt, getVideoById)
router.route('/:id').put(verifyjwt,  upload.none(), updateVideo)
router.route('/:id').delete(verifyjwt, isAdmin, deleteVideo )


// Comment Management:

router.route('/:id/comments').get(verifyjwt, getCommentsByVideo)
router.route('/:id/comments').post(verifyjwt, addComment)
router.route('/:id/comments/:comment_id').put(verifyjwt, updateComment)
router.route('/:id/comments/:comment_id').delete(verifyjwt, deleteComment)


// Like/Dislike Videos:

router.route('/:id/like').put(verifyjwt, likeVideo)
router.route('/:id/dislike').put(verifyjwt, dislikesVideo)







export default router