import Routes from "express"
import { verifyjwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createVideo, deleteVideo, getVideo, getVideoById, updateVideo } from "../controllers/videos.controllers.js";
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




export default router