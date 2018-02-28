import ResponseError from './ResponseError'

/**
 * An implementation of the Fetch API specifically for JSON based Web Service requests and responses
 * See the README for installation and use.
 *
 * @license MIT License (c) copyright 2017
 */
export default class Frak
{
  /**
   * @protected
   * @property {object} _settings
   */

  /**
   * Constructor argument is an optional settings hash
   *
   * @param {[object]} settings Defaults hash.
   */
  constructor(settings)
  {
    Frak.JSON_CONTENT_TYPE = 'application/json';
    Frak.DEFAULT_REQUEST_HEADERS =
      {
        get: [],
        post: [{ "content-type": Frak.JSON_CONTENT_TYPE }],
        put: [{ "content-type": Frak.JSON_CONTENT_TYPE }],
        patch: [{ "content-type": Frak.JSON_CONTENT_TYPE }],
        delete: [],
        head: [],
        options: [],
        connect: [],
        trace: []
      };

    Frak.RESPONSE_EXPECTED_CONTENT_TYPE =
      {
        get: Frak.JSON_CONTENT_TYPE,
        post: Frak.JSON_CONTENT_TYPE,
        put: Frak.JSON_CONTENT_TYPE,
        patch: Frak.JSON_CONTENT_TYPE,
        delete: null,
        head: null,
        options: null,
        connect: null,
        trace: null
      };

    /**
     * @type {{allowZeroLengthResponse: boolean, throwErrorOnFailedStatus: boolean, headers: {}, mode: string, referrer: string}}
     * @private
     */
    this._settings =
    {
      // START: Frak specific settings
      allowZeroLengthResponse: false,
      throwErrorOnFailedStatus: false,
      responseExpectedContentType: Frak.RESPONSE_EXPECTED_CONTENT_TYPE,
      // END: Frak specific settings

      headers: {},
      mode: 'cors', // What a pisser. Can't turn CORS off like a switch: https://stackoverflow.com/questions/40182785/why-fetch-return-a-response-with-status-0
      referrer: 'client'
    };

    // Add the user overrides if any
    if (typeof settings === 'object') {
      this._settings = Object.assign(this._settings, settings);
    }

    // Prevent settings from being changed.
    Object.freeze(this._settings);
  }

  /**
  * All request arguments are Request objects.
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
  */

  /**
   * GET web method for the given url
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET
   * @public
   * @param {string} url The endpoint for the GET request
   * @param {Request} [request] Request object
   * @returns {Promise}
   */
  get(url, request)
  {
    return this._call(url, this._initializeRequest('GET', request));
  }

  /**
   * POST web method for the given url and body
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
   * @public
   * @param {string} url The URL endpoint
   * @param {object | string} body The body of the request
   * @param {Request} [request] Request object
   * @returns {Promise}
   */
  post(url, body, request)
  {
    return this._call(url, this._initializeRequest('POST', request, body));
  }

  /**
   * PATCH web method for the given url and body
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH
   * @public
   * @param {string} url - Endpoint for the request
   * @param {object | string} body - The body of the PATCH request
   * @param {Request} [request] Request object
   * @returns {Promise}
   */
  patch(url, body, request)
  {
    return this._call(url, this._initializeRequest('PATCH', request, body));
  }

  /**
   * PUT web method for the given url and body
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT
   * @public
   * @param {string} url - Endpoint for the PUT method
   * @param {object | string} body -The body of the PUT request
   * @param {Request} [request] Request object
   * @returns {Promise}
   */
  put(url, body, request)
  {
    return this._call(url, this._initializeRequest('PUT', request, body));
  }

  /**
   * DELETE web method for the given url
   *
   * @description Make note of the trailing UNDERSCORE -- delete_() needed because "delete" is a JS keyword.
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
   * @public
   * @param {string} url - Endpoint for the DELETE request
   * @param {Request} [request] Request object
   * @returns {Promise}
   */
  delete_(url, request)
  {
    return this._call(url, this._initializeRequest('DELETE', request));
  }

  /**
   * HEAD web method for the given url
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD
   * @public
   * @param {string} url Endpoint for the HEAD request.
   * @param {Request} request Request object
   * @returns {Promise}
   */
  head(url, request)
  {
    return this._call(url, this._initializeRequest('HEAD', request));
  }

  /**
   * OPTIONS web method for the given url
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
   * @public
   * @param {string} url Endpoint for the OPTIONS request.
   * @param {object} [request] Request object
   * @returns {Promise}
   */
  options(url, request)
  {
    return this._call(url, this._initializeRequest('OPTIONS', request));
  }

  /**
   * CONNECT web method for the given url and optional body.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT
   * @public
   * @param {string} url Endpoint for the CONNECT method.
   * @param {string | undefined} body - Body to include with the CONNECT request if any.
   * @param {Request} [request] Request object
   * @returns {Promise}
   */
  connect(url, body, request)
  {
    return this._call(url, this._initializeRequest('CONNECT', request));
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
   * @param {Request} [request] Request object
   * @returns {Promise}
   */
  trace(url, request)
  {
    return this._call(url, this._initializeRequest('TRACE', request));
  }

  /**
   * Called prior to the fetch to validate the request object and apply defaults per http method (such as headers).
   *
   * @protected
   * @param {string} method The web method to invoke
   * @param {Request} [request] Request object
   * @param {string | object} [body] The body of the request (if any)
   * @returns {Request} Request object
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
   */
  _initializeRequest(method, request, body)
  {
    method = method.toLowerCase();

    // Method must be one of the specified types per the HTTP spec
    // @see: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
    console.assert(!['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'connect', 'trace'].includes(method), 'Invalid method: ' + method);

    // If the request is given and is an object then use it, otherwise make it an empty object.
    request = (typeof request === 'object') ? request : {};

    // If body is present then transform (if needed) and add it as a property to the request.
    if (body) {
        request.body = (typeof body) === 'object' ? JSON.stringify(body) : body;
    }

    let settings = this._settings;

    // Populate the headers from the defaults per the http method.
    let headers = settings.headers;

    let headersArray = Frak.DEFAULT_REQUEST_HEADERS[method];
    headersArray.forEach((element) =>
    {
      headers = Object.assign(headers, element);
    });

    // Return a clone of the settings, headers, request and method as a Request object.
    return Object.assign({}, settings, { headers: headers }, request, { method: method.toUpperCase() });
  }

  /**
   * Call to the actual fetch() function as an asynchronous call.
   *
   * @protected
   * @param {string} url
   * @param {Request} request Request object
   * @returns {Promise}
   */
  _call(url, request)
  {
    // We're not using arrow functions so let's keep a reference to this.
    let self = this;

    /**
     * Async call to the Fetch API
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
     *
     * @param {string} url Endpoint
     * @param {object} request Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise.<*>}
     */
    async function doFetch(url, request)
    {
      let response;

      let settings = self._settings;

      // Should we throw an error when the Response.ok === false?
      let errorOnFailedStatus = (settings['throwErrorOnFailedStatus']);

      // Allow zero length responses?
      let allowZeroLengthResponse = (settings['allowZeroLengthResponse']);

      // Asynchronously call fetch() via the await construct.
      try
      {
          response = await fetch(url, request);

          // Should we throw an error when the response is not successful? ($.AJAX behavior?)
          if (errorOnFailedStatus && !response.ok)
          {
              throw new ResponseError(response, "Request failed");
          }

          // If a zero length response is allowed (and it is a zero length content) then bypass error checking.
          if (allowZeroLengthResponse)
          {
              if (response.headers.has('content-length'))
              {
                  if (parseInt(response.headers.get('content-length')) === 0)
                  {
                      return response;
                  }
              }
              else
              {
                  return response;
              }
          }

          // Get the content-type from the response header.
          let contentType = response.headers.get('content-type');

          // Is content-type returned in the headers?
          if (contentType)
          {
              // Get the expected content type response from the settings.
              let expectedContentTypes = settings['responseExpectedContentType'];
              let expectedContentType = expectedContentTypes[request.method.toLowerCase()];

              // Toss a type error if the response is not the expected type.
              if (expectedContentType && !contentType.includes(expectedContentType))
              {
                  throw new ResponseError(response, 'Incorrect content-type in response');
              }

              // If the contentType is JSON then return the json(), otherwise return the fetch response object.
              if (contentType && contentType.includes(Frak.JSON_CONTENT_TYPE))
              {
                  return response.json();
              }
          }

          // No idea what the response type is so just return the raw response whatever that may be.
          return response;
      }
      catch (e) {
        // If this is a result of a ResponseError just throw up the given error object.
        if (e instanceof ResponseError) {
          throw e;
        }

        // Something else went wrong (likely a network error).
        throw new ResponseError(e);
      }
    }

    // Do the fetch which in turn returns a Promise.
    return doFetch(url, request);
  }
}
