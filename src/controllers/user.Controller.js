// Import the asyncHandler utility function
import { asyncHandler } from "../utils/asyncHandler.js";

// Define a function to handle user registration
const registerUser = asyncHandler(async (req, res) => {
    // Send a JSON response with a 200 status code and a message
    res.status(200).json({
        message: "ok"
    });
});

// Export the registerUser function for use in other modules
export { registerUser };
