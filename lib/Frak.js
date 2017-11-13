/**
 * An implementation of the Fetch API specifically for JSON based Web Service requests and responses
 *
 * Constructor takes two optional objects:
 * Settings: Defaults to use globally to the Frak class
 *  abort:  {signal} - default is null. This should have an abort signal if used.
 *          @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController
 *  throwErrorOnFailedStatus: {boolean} - default is false. Set this to true if an error should be thrown on a failed
 *                            fetch. The default behavior is only to throw an error on a network failure.
 *  requestDefaultHeaders: {object} - headers to send with the request for each http method. See code for the defaults.
 *  responseExpectedHeaders: {object} - expected headers from the response per each http method. See code for defaults.
 *
 * Options - These are the same Request property hash that is used by fetch()
 *           @see https://developer.mozilla.org/en-US/docs/Web/API/Request
 *           The default is: {cache: 'default', headers: {}}
 *
 *           Note: These options are overriden from the settings argument per http method
 *           as well as the options argument for each request can override these options.
 */
class Frak
{
    /**
     * @protected
     * @property {object} _defaults
     * @property {object} _settings
    */

    /**
     * Constructor argument is a settings hash and can be undefined to use the defaults
     *
     * @param {object | undefined} settings - Defaults for specific http methods and settings outside of the fetch API.
     * @param {object | undefined} options
     */
    constructor(settings, options) {

        let isAsyncAvailable = true;
        try {
            async () => {};
        } catch (e) {
            isAsyncAvailable = false;
        }
        let isFetchAvailable = ('fetch' in window);

        if (!isFetchAvailable || !isAsyncAvailable) {
            throw new Error("Spend a dime and buy yourself a new modern browser that doesn't suck!");
        }

        Frak.JSON_CONTENT_TYPE = 'application/json';

        // Save defaults per http methods and allow for future use of abort
        this._settings = {
            abort: null,

            throwErrorOnFailedStatus: false,

            requestDefaultHeaders:
            {
                get: [{'content-type': null}],
                post: [{'content-type': Frak.JSON_CONTENT_TYPE}],
                put: [{'content-type': Frak.JSON_CONTENT_TYPE}],
                patch: [{'content-type': Frak.JSON_CONTENT_TYPE}],
                delete: [{'content-type': null}],
                head: [{'content-type': null}],
                options: [{'content-type': null}],
                connect: [{'content-type': null}],
                trace: [{'content-type': null}]
            },

            responseExpectedHeaders:
            {
                get: [{'content-type': Frak.JSON_CONTENT_TYPE}],
                post: [{'content-type': Frak.JSON_CONTENT_TYPE}],
                put: [{'content-type': Frak.JSON_CONTENT_TYPE}],
                patch: [{'content-type': Frak.JSON_CONTENT_TYPE}],
                delete:[{'content-type': null}],
                head: [{'content-type': null}],
                options: [{'content-type': null}],
                connect: [{'content-type': null}],
                trace: [{'content-type': null}]
            }
        };

        // Add the user overrides if any
        if (typeof settings === 'object') {
            this._settings = {...settings};
        }

        // Set up default Request options that are not http method specific
        this._defaults = {
            cache: 'default',
            headers: {}
        };

        // Merge in the user overrides if any
        if (typeof options === 'object') {
            this._defaults = {...options};
        }
    }

    /**
     * GET web method for the given url
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET
     * @public
     * @param {string} url The endpoint for the GET request
     * @param {object | null} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise} contains the response.body.json() object on success.
     */
    get(url, options)
    {
        let cargo = this._initializeRequest('GET', options);

        return this.call(url, cargo);
    }

    /**
     * POST web method for the given url and body
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
     * @public
     * @param {string} url The URL endpoint
     * @param {object | string} body The body of the request
     * @param {object} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise} contains the response.body.json() object on success.
     */
    post(url, body, options)
    {
        let cargo = this._initializeRequest('POST', options);
        cargo['body'] = (typeof body) === 'object' ? JSON.stringify(body) : body;

        return this.call(url, cargo);
    }

    /**
     * PATCH web method for the given url and body
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH
     * @public
     * @param {string} url - Endpoint for the request
     * @param {object | string} body - The body of the PATCH request
     * @param {object} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise} contains the response.body.json() object on success.
     */
    patch(url, body, options)
    {
        let cargo = this._initializeRequest('PATCH', options);
        cargo['body'] = (typeof body) === 'object' ? JSON.stringify(body) : body;

        return this.call(url, cargo);
    }

    /**
     * PUT web method for the given url and body
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT
     * @public
     * @param {string} url - Endpoint for the PUT method
     * @param {object | string} body -The body of the PUT request
     * @param {object} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise} contains the response.body.json() object on success.
     */
    put(url, body, options)
    {
        let cargo = this._initializeRequest('PUT', options);
        cargo['body'] = (typeof body) === 'object' ? JSON.stringify(body) : body;

        return this.call(url, cargo);
    }

    /**
     * DELETE web method for the given url
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
     * @public
     * @param {string} url - Endpoint for the DELETE request
     * @param {object} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise}
     */
    delete_(url, options)
    {
        let cargo = this._initializeRequest('DELETE', options);

        return this.call(url, cargo);
    }

    /**
     * HEAD web method for the given url
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD
     * @public
     * @param {string} url Endpoint for the HEAD request.
     * @param {object} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise}
     */
    head(url, options)
    {
        let cargo = this._initializeRequest('HEAD', options);

        return this.call(url, cargo);
    }

    /**
     * OPTIONS web method for the given url
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
     * @public
     * @param {string} url Endpoint for the OPTIONS request.
     * @param {object} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise}
     */
    options(url, options)
    {
        let cargo = this._initializeRequest('OPTIONS', options);

        return this.call(url, cargo);
    }

    /**
     * CONNECT web method for the given url and optional body.
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT
     * @public
     * @param {string} url Endpoint for the CONNECT method.
     * @param {string | undefined} body - Body to include with the CONNECT request if any.
     * @param {object} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise}
     */
    connect(url, body, options)
    {
        let cargo = this._initializeRequest('CONNECT', options);

        if ((!typeof body === 'undefined' || body === null)) {
            cargo['body'] = body;
        }

        return this.call(url, cargo);
    }

    /**
     * TRACE web method for the given url
     *
     * Note: Included only for completeness. There are potential security exploits with this web method and its
     * general use is discouraged.
     *
     * @link https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
     * @public
     * @param {string} url Endpoint for the TRACE request.
     * @param {object} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise}
     */
    trace(url, options)
    {
        let cargo = this._initializeRequest('TRACE', options);

        return this.call(url, cargo);
    }

    /**
     * Called prior to the fetch to apply defaults per http method and any options from the user
     *
     * @protected
     * @param {string} method The web method to invoke
     * @param options
     * @returns {{}}
     * @private
     */
    _initializeRequest(method, options)
    {
        method = method.toLowerCase();

        // Method must be one of the specified types per the HTTP spec
        // @see: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
        if (!['get','post','put','patch','delete','head','options','connect','trace'].includes(method)) {
            throw new TypeError('Invalid method: ' + method);
        }

        options = (typeof options === 'object') ? options : {};

        // Populate the headers from the defaults per the http method.
        let headers = {};
        let headersArray = this._settings.requestDefaultHeaders[method];
        headersArray.forEach((element) => {
            headers = {...element};
        });

        // Return a clone of the settings objects merged as one object.
        return {...this._defaults, ...{headers: headers}, ...options, ...{method: method.toUpperCase()}};
    }

    /**
     * Call to the actual fetch() function as an asynchronous call.
     *
     * @param {string} url
     * @param {object} options Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise}
     */
    call(url, options)
    {
        // We're not using arrow functions so let's keep a reference to ourself.
        let self = this;

        /**
         * ResponseError
         *
         * @param {object} response Response object @see https://developer.mozilla.org/en-US/docs/Web/API/Response
         * @param {string | undefined} message Optional string message.
         * @constructor
         */
        let ResponseError = function(response, message)
        {
            this.message = message;
            this.response = response;
            this.name = 'ResponseError';
            this.toString = function() {
                return this.message + ' status: ' + response.statusText || 'unknown';
            }
        };

        /**
         * Async call to the Fetch API
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
         *
         * @param {string} url Endpoint
         * @param {object} cargo Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
         * @param {boolean} errorOnFailedStatus Throw error on failed response status? (default is false).
         * @returns {Promise.<*>}
         */
        async function doFetch(url, cargo, errorOnFailedStatus) {
            let response;

            try {
                response = await fetch(url, cargo);

                // Should we throw an error when the response is not successful?
                if (errorOnFailedStatus && !response.ok) {
                    throw new ResponseError(response, "Request failed");
                }

                // Get the content-type from the response header.
                let contentType = response.headers.get('content-type');

                // Get the expected content type response from the settings.
                let settings = self._settings;
                let expectedHeaders = settings['responseExpectedHeaders'];
                let expectedContentType = expectedHeaders[cargo['method'].toLowerCase()];
                expectedContentType = expectedContentType[0];
                expectedContentType = expectedContentType['content-type'];

                // Toss a type error if the response is not the expected type.
                if (expectedContentType && !contentType.includes(expectedContentType)) {
                    throw new ResponseError(e, 'Unexpected content-type in response');
                }

                // If the contentType is JSON then return the json(), otherwise return the entire response.
                if (contentType && contentType.includes(Frak.JSON_CONTENT_TYPE)) {
                    return response.json();
                } else {
                    return response;
                }
            } catch (e) {
                // If this is a result of a ResponseError just throw up the given error object.
                if (e instanceof ResponseError) {
                    throw e;
                }

                // Something else went wrong (likely a network error).
                throw ResponseError(e, 'Error');
            }
        }

        // Do we have an abort signal object? If so merge it into the options object.
        // @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController
        let signal = this._settings['abort'];
        if (signal) {
            options = {...signal};
        }

        // Should we throw an error when the Response.ok === false?
        let errorOnFailedStatus = (this._settings['throwErrorOnFailedStatus']);

        // Do the fetch which in turn returns a Promise.
        return doFetch(url, options, errorOnFailedStatus);
    }
}

export default Frak;