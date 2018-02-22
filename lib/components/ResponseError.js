/**
 * @param {object} response Response object @see https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
class ResponseError extends Error {
    constructor(response = null, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ResponseError);
        }

        // Custom debugging information
        this.response = response;
        this.date = new Date();
    }
}

export default ResponseError;
