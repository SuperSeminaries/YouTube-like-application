import Routes from "express"
import { createUser, deleteUserAccount, getAllUsers, getUserById, loginUser, logout, updateUserProfile } from "../controllers/user.controllers.js";
import { verifyjwt } from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Routes();

// /----- Authentication Routes: -----/
router.route("/signin").post(createUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyjwt, logout)

// /-----  User Profile Routes:   ------/
router.route("/").get(verifyjwt, isAdmin, getAllUsers)
router.route("/:id").get(verifyjwt, getUserById)
router.route("/:id").put(verifyjwt, upload.single("avatar"), updateUserProfile)
router.route("/:id").delete(verifyjwt, isAdmin, deleteUserAccount)

export default router