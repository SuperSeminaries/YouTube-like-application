import Router from "express"
import { searchUsers, searchVideos } from "../controllers/search.controllers.js"

const router = Router()


// Search Routes:
router.route('/users').get(searchUsers) // Search for users by username or name.
router.route('/videos').get(searchVideos) // Search for posts by content.



export default router