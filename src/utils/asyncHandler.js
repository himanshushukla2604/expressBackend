// since we have to talk to database a lot will write dbconnect code here
// promish
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promish.resolve(requestHandeler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}



// try catch
// const asyncHandler = (fn) => {async()=>{}} can also be written as following
// const asyncHandler = (fn) => async(req, res, next) => {
//     try{
//         await fn(req, res, next)
//     } catch (error){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }