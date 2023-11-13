// require('dotenv').config(path; './env')
// Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.
import dotenv from "dotenv"

import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
})

connectDB()// since DB connect is a async opration so it will return a promise object
.then(()=>{// so we can use than and catch
    app.on("error", (err)=>{
        console.log("ERRR: ", error);
        throw err
    })
    // ||8000 is there because if we are not able to get the port from env than use 8000
    app.listen(process.env.PORT|| 8000, ()=>{
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=> {
    console.log("Mongo db connection failed !!!", err);
})
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