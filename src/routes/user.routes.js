import {Router} from "express"
import {logoutUser, loginUser, registerUser, refreshAccessToken, refreshAccessToken, changeCurrentPassword, updateAccountDetails, updateAvatar, updateCoverImage } from "../controllers/user.Controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router();

router.route("/register").post(
    upload.fields([// fields method can process multiple files associated with given form fields
        // takes an array as an input
        // telling what will be the fields
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(varifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/refresh-Access-Token").post(varifyJWT, refreshAccessToken);

router.route("/change-password").post(varifyJWT, changeCurrentPassword);

router.route("/update-Account-Details").post(varifyJWT, updateAccountDetails);

router.route("/update-Avatar").post(varifyJWT, multer, updateAvatar);

router.route("/update-Cover-Image").post(varifyJWT, multer, updateCoverImage);

export default router