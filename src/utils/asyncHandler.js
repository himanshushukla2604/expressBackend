// This is a higher-order function called asyncHandler.
// It wraps an asynchronous request handler function and ensures that any errors
// thrown during the execution of the handler are caught and passed to the Express 'next' function.

// The asyncHandler takes a request handler function as its parameter.
const asyncHandler = (requestHandler) => {
    // The returned function is a middleware function that Express can use.
    return async (req, res, next) => {
        // Execute the provided request handler function and wrap it in a Promise.
        // If the function resolves successfully, the next middleware in the chain is called.
        // If the function rejects (throws an error), the error is caught and passed to the 'next' function.
        try {
            return await Promise.resolve(requestHandler(req, res, next));
        } catch (err) {
            return next(err);
        }
    };
};

// Export the asyncHandler function for use in other modules.
export { asyncHandler };



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