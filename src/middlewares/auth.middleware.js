import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js"
export const varifyJWT = asyncHandler(async(req, _, next)=>{
    try {
        /*
            The req.cookies?.accessToken line is used to check if the user has an access token in their cookies.
            The req.cookies object contains all of the cookies that were sent with the request, and the accessToken property
            is the name of the cookie that is used to store the access token. 
            The ? operator is used to check if the accessToken property exists on the req.cookies object. 
            If it does, the value of the property is returned. If it does not, undefined is returned.
    
            // for || req.header("Authorization")?.replace("Bearer ", "") ref: https://chat.openai.com/c/8bbd1654-f6c2-41c6-b874-c74c3742220d
        */
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if(!token){
            throw new ApiError(401, "Unauthorized request");
        }
    
        // decode the token with the private key which we have saved in .env file. The token can only be decoded by one who have private key
        const decodedToken = jwt.varify(token, process.env.ACCESS_TOKEN_SECRET)
    
        // if token is decoded we will try to have the value saved in the token // ref : user.model.js => generateAccessToken()
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        // try to get if user exists
        if(!user){
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token")
    }

})