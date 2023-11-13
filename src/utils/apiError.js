// This class represents an error that can be used to handle and propagate API-related errors.
// It extends the built-in Error class in JavaScript.

class ApiError extends Error {
    // Constructor method for creating instances of ApiError.
    // Parameters:
    //   - statusCode: HTTP status code associated with the error.
    //   - message: A human-readable error message (default is "Something went Wrong").
    //   - errors: An array of specific error details or additional information (default is an empty array).
    //   - stack: The stack trace of the error (default is an empty string).

    constructor(statusCode, message = "Something went Wrong", errors = [], stack = "") {
        // Call the constructor of the parent class (Error) and pass the provided message.
        super(message);

        // Store the provided status code in the instance variable.
        this.statusCode = statusCode;

        // Set the 'data' property to null, as it's not specified in the constructor parameters.
        this.data = null;

        // Store the provided message in the instance variable.
        this.message = message;

        // Set the 'success' property to false since this represents an error.
        this.success = false;

        // Store the provided errors in the instance variable.
        this.errors = errors;

        // Check if a stack trace is provided. If not, capture the stack trace using Error.captureStackTrace.
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the ApiError class for use in other modules.
export { ApiError };
