// require('dotenv').config(path; './env')
// Import the 'dotenv' library for loading environment variables from a '.env' file.
import dotenv from "dotenv";

// Import the 'connectDB' function from the 'db' module.
import connectDB from "./db/index.js";
import {app} from "./app.js";
import express from "express";
// Load environment variables from the '.env' file located in the './env' directory.
dotenv.config({
    path: './env'
});

// Call the 'connectDB' function to establish a connection to the MongoDB database.
// Since 'connectDB' returns a Promise, use '.then()' and '.catch()' to handle success and failure.
connectDB()
    .then(() => {
        // Attach an error event listener to the Express application to log and throw errors.
        app.on("error", (err) => {
            console.log("ERRR: ", error);
            throw err;
        });

        // Start the Express application and listen for incoming requests on the specified port.
        // Use the port specified in the 'PORT' environment variable, defaulting to 8000 if not provided.
        app.listen(process.env.PORT || 8000, () => {
            console.log(` Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        // Log an error message if the MongoDB connection fails.
        console.log("Mongo db connection failed !!!", err);
    });

/*

const app = express()
 // first approch to connect the database
(async() =>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port number ${process.env.PORT}`);
        })
    
    } catch (error){
        console.error("ERROR: ", error);
        throw err
    }
})()

*/