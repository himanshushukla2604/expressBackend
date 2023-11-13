// Import the 'express' framework for building web applications.
import express from "express";

// Import the 'cors' middleware for handling Cross-Origin Resource Sharing (CORS).
import cors from "cors";

// Import the 'cookie-parser' middleware for parsing cookies.
import cookieParser from "cookie-parser";

// Create an instance of the Express application.
const app = express();

// Use the 'cors' middleware with specified configuration options.
app.use(cors({
    // Set the allowed origin for CORS requests to the value specified in the 'CORS_ORIGIN' environment variable.
    origin: process.env.CORS_ORIGIN,
    
    // Allow credentials to be sent with cross-origin requests.
    credentials: true
}));

// Use the built-in 'express.json()' middleware to parse incoming JSON requests.
// Set a limit of 16kb for the request body size.
app.use(express.json({ limit: "16kb" }));

// Use the built-in 'express.urlencoded()' middleware to parse incoming URL-encoded requests.
// Set a limit of 16kb for the request body size and allow extended URL-encoded options.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Use the 'express.static()' middleware to serve static files from the "public" directory.
// This is useful for serving files like images, CSS, and JavaScript.
app.use(express.static("public"));

// Use the 'cookie-parser' middleware to parse cookies from incoming requests.
app.use(cookieParser());

// Export the 'app' instance for use in other modules.
export { app };
