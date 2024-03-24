import { isValidObjectId } from "mongoose";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// Authentication
const createUser = async (req, res) => {
    try {
        const {username, email, password, role} = req.body;

        if ([username, email, password].some((fildes) => fildes && fildes.trim() === "")) {
            return res.status(400).json({ message: "All fildes are required" });
        }

        const existedUser = await User.findOne({$or: [{email}, {username}]})

        if (existedUser) {
            console.error("User with the provided email or username already exists");
            return res.status(400).json({ 
                message: "User with the provided email or username already exists",
            })
        }

        const user = await User.create({
            username: username.toLowerCase(),
            email,
            password,
            role
        })

        const createdUser = await User.findById(user._id).select("-password -referenceToken")

        res.status(200).json({success: true, message: 'User created successfully', data: createdUser })

    } catch (error) {
        console.error('Error creating User:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

const generateAccessTokenAndReferenceToken = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = await user.generateAccessToken()
    const referenceToken = await user.generateReferenceToken()

    user.referenceToken = referenceToken
    await user.save({validateBeforeSave: false})

    return ({accessToken, referenceToken})
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email) {
            return res.status(400).json({ email: "email is required" });
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ email: "wrong email" });
        }

        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
            return res.status(400).json({ password: "wrong password" })
        }

        const { accessToken, referenceToken } = await generateAccessTokenAndReferenceToken(user._id)

        const option = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("referenceToken". referenceToken, option)
        .json({success: true, message: 'User login successfully', accessToken, referenceToken })

        
    } catch (error) {
        console.error('Error login User:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {$set: {referenceToken: undefined}}, {new: true})

        const option = {
            httpOnly: true,
            secure: true
        }

        res.clearCookie("accessToken", option)
        res.clearCookie("referenceToken", option)

        res.status(200).json({ success: true ,message: 'Logout successfully' })
        
    } catch (error) {
        console.error('Error logout User:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}




// User Management
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-referenceToken");
        res.status(200).json({ success: true, message: 'Users retrieved successfully', data: users });
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(userId).select("-password -referenceToken")

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, message: 'Users retrieved successfully', data: user });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const data =  req.body?.profile || req.body;

        // Check if there's a file upload
        const localFilePath = req.file?.path;

        // Initialize an empty update object
        let updateData = {};

        // If there's an avatar uploaded, add it to the update object
        if (localFilePath) {
            const  avatar = await uploadOnCloudinary(localFilePath)
            updateData = { ...updateData, 'profile.avatar': avatar.url };
        } else {
            const user = await User.findById(userId);
            if (user && user.profile.avatar) {
                updateData = user.profile.avatar;
            }
        }

        // Loop through the fields in the data object
        for (const key in data) {
            // Check if the field is present and not empty
            if (data[key] !== undefined && data[key] !== '') {
                // Add the field to the update object
                updateData = { ...updateData, [`profile.${key}`]: data[key] };
            }
        }

        // Update the user profile with the constructed update object
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-referenceToken -password");

        res.status(200).json({ success: true, message: 'User profile updated successfully', data: user });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId).select("-referenceToken -password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully', data: user });
       
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



export { createUser, loginUser, logout, getAllUsers, getUserById, updateUserProfile, deleteUserAccount }