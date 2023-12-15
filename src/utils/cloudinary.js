// Import necessary modules
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with API credentials from environment variables
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Define a function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Check if localFilePath is provided
        if (!localFilePath) return null;

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File has been uploaded successfully
        console.log("File is uploaded on Cloudinary", response.url);

        fs.unlinkSync(localFilePath)// we will remove the file form cloudinary with this method so in future me have space in clodinary
        // Return Cloudinary response
        return response;
    } catch (error) {
        // If upload operation fails, remove the locally saved temporary file
        fs.unlinkSync(localFilePath);

        // Return null to indicate failure
        return null;
    }
}

// Export the uploadOnCloudinary function for use in other modules
export { uploadOnCloudinary };
