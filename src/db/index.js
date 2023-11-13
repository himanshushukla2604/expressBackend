// Import the 'mongoose' library for MongoDB interaction.
import mongoose from "mongoose";

// Import the 'DB_NAME' constant from the specified file.
import { DB_NAME } from "../constaints.js";

// Define a function named 'connectDB' to establish a connection to the MongoDB database.
const connectDB = async () => {
    try {
        // Attempt to establish a connection to the MongoDB database using the provided URI and database name.
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        // If the connection is successful, log a message indicating the successful connection.
        console.log(`\n MongoDB connected !! DB Host:  ${connectionInstance} `);
    } catch (error) {
        // If an error occurs during the connection attempt, log an error message and exit the process with an error code.
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
};

// Export the 'connectDB' function as the default export of this module.
export default connectDB;
