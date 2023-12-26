// Import the asyncHandler utility function
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from JsonWebTokenError;
import { JsonWebTokenError } from "jsonwebtoken";
// Define a function to handle user registration

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
        // since we have make password and other field and required in mongoose model 
        // so when we will try to save this than it will cause an error 
        // so for this we will stop validation because we are entring only one filed


        return {accessToken, refreshToken}
    } catch(error){
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
   // get user details for frontend
   // validation - not empty
   // check if user already exists: username, email
   // check for images, check for avatar
   // upload them to cloudinary, avatar
   // create user object - create entry in db
   // remove password and refresh token field from response
   // check for user creation 
   // return res

   console.log(req.body);
   const {username, email, fullName, password} = req.body
    // if(fullName === ""){
    //     throw new ApiError(400, "full name is required");
    // }

    // validation that we got data of each field in req.body
    if([fullName, email, username, password].some((field) =>{field?.trim() === ""})){
        throw new ApiError(400, "All fields are required")
    }

    // If username or email alrady  exsists
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    // than return error
    if(existedUser){
        throw new ApiError(409, "email id or username alrady existed");
    }

    // in multer we will get access of req.files
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path //
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    // here we are checking that did user provided coverImage or not (if files are array than we can have muliple files and if not coverImageNot given)
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    // since we have avtar as required if it is undefined than we will throw an error
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"// this is syntex to ignore the given field and not return 
    );// _id will be automaticly added by mongo in every entry
    
    if(!createdUser){
        return new ApiError(500, "User not created!, Something went wrong")
    }
    console.log(createdUser)

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registerd succesfully")
    )

});

// Define a function to handle user login
const loginUser = asyncHandler(async (req, res)=>{
    // take data form req body
    // username or email backed login
    // find user
    // passward check
    // access and referesh token
    // send data with the help of cookie

    const {email, username, password} = req.body;

    console.log(email);
    if(!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}] // find the value either on the basis of username on the level of email
    })

    if(!user){
        throw new ApiError(400, "User does not exist")
    }

    const isPasswordvalid = await user.isPasswordCorrect(password);

    if(!isPasswordvalid){
        throw new ApiError(401, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser  = await User.findById(user._id).select("-password -refreshToken")// "-"sign means these fields will not be included in the output

    // send Coockie
    // when we send cookie we have to design the object of onptions

    const options = {// the cookie are by default modifiable by anyone in front-end but after making httpOnly and secure true these can be modified by server only 
        httpOnly: true,
        secure: true,
    }
    // console.log(accessToken + " "+ refreshToken)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

// logout functionality
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
            req.user._id, 
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        )
    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged out"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    //
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthrized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
        
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token");
        }
    
        if(incomingRefreshToken != user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired or used");
        }
    
        const options = {
            httpOnly : true,
            secure: true
    
        }
    
        const {accessToken , newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken, newRefreshToken}
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token");
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) =>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)
    if(!user){
        throw ApiError(404, "User Not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw ApiError(404, "Invalid old password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {

    return res
    .status(200)
    .json(new ApiResponse(200,req.user, "current user fetched successfully"))
})


const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if(!(fullName || email)){
        throw ApiError(401, "All fields are required");
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            },
        },
        {new: true}//The { new: true } option instructs Mongoose to return the modified
        //document rather than the original document. By default, without this option (or if you set it to false),
        // the findByIdAndUpdate function will return the document as it was before the update operation. 
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200, user, "given fields are updated"));
})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(401, "Avatar file is missing");
    } 

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        throw new ApiError(400, "Error while uploading on avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar
            }
        },
        {new: true}
        ).select("-password -refreshToken");


    return res.
    status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
})


const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImagePath = req.file?.path;

    if(!coverImagePath){
        throw ApiError(400, "Error coverImage not uploded");
    }

    const coverImage = await uploadOnCloudinary(coverImagePath);

    if(!coverImage){
        throw ApiError(400, "Error while uploading to cloudinary")
    }

    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{

                coverImage
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "coverImage updated succesfully"));
})

// Export the registerUser function for use in other modules
export { 
    registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage
};
