// This class represents a standard API response structure.
class ApiResponse {
    // Constructor method for creating instances of ApiResponse.
    // Parameters:
    //   - statusCode: HTTP status code of the response.
    //   - data: The actual data payload of the response.
    //   - message: A human-readable message describing the status of the response (default is "Success").
    constructor(statusCode, data, message = "Success") {
        // Store the provided status code in the instance variable.
        this.statusCode = statusCode;

        // Store the provided data in the instance variable.
        this.data = data;

        // Store the provided message in the instance variable.
        this.message = message;

        // Calculate the 'success' property based on the statusCode.
        // If the status code is less than 400, consider it a success.
        this.success = statusCode < 400;
    }
}
