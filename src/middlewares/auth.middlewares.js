import  Jwt  from "jsonwebtoken";
import { User } from "../models/users.models.js";



export const verifyjwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken  || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

        if (!token) {
            return res.status(401).json({ success: false,  message: 'Authorization token is required' });
        }

        const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decoded._id).select("-password -referenceToken")

        if (!user) {
          return res.status(401).json({ message: 'Invalid token'})
        }

        req.user = user
        next()

        // console.log(token);
        
    } catch (error) {
        console.error('Error verifying JWT', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}