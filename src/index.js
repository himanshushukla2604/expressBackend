// require('dotenv').config(path; './env')

import dotenv from "dotenv"

import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
})

connectDB()
/*
import express from "express"
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