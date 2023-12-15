import {Router} from "express"
import { registerUser } from "../controllers/user.Controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

export default router