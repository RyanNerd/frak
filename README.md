# Frak

__An implementation of the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) specifically for JSON based requests and responses__

## Installation 

Recommended is via NPM / YARN

In your `package.json` for your app:

    "dependencies": {
      "frak": "^1.1.4"
    }

Install with NPM or YARN:

    npm install
    
    yarn install

**Important Note: `frak-js` is deprecated. Only use `frak`**

## Implementation

Here's a simple example of a GET request using Frak:

```ecmascript 6
    import { Frak } from 'frak';
    const frak = new Frak();
    
    getExample = (uri) => {
      return frak.get(uri)
      .then((json) =>
      {
        console.log(json);
      })
      .catch((error) => {
        console.log('Something went wrong', error);
      });
    };
    
    getExample('http://localhost/8080/endpoint');
```
**Frak constructor**

For most applications the defaults for Frak should be sufficient.
The constructor takes two optional arguments for the cases where you need Frak behave differently.

```ecmascript 6
  /**
   * Constructor argument is an optional settings hash
   *
   * @param {object} [settings] 
   */
  Frak(settings)

```

`settings` is an object hash for how Frak should behave:

| Property                    | Default   | Description                                                                |
| --------                    | -------   | -----------                                                                |
| throwErrorOnFailedStatus    | false     | Set this to true if you want Frak to behave more like Jquery's Ajax        |
| allowZeroLengthResponse     | false     | Set this to true for responses to **not** require a response body          |
| requestDefaultHeaders       | see below | Headers to send for each HTTP method (see below)                           |
| responseExpectedContentType | see below | Expected Content-Type for each HTTP method (see below)                     |
| abort                       | null      | [Signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) |

`requestDefaultHeaders` default:
```
    {
      get: [{ 'content-type': null }],
      post: [{ 'content-type': 'application/json' }],
      put: [{ 'content-type': 'application/json' }],
      patch: [{ 'content-type': 'application/json' }],
      delete: [{ 'content-type': null }],
      head: [{ 'content-type': null }],
      options: [{ 'content-type': null }],
      connect: [{ 'content-type': null }],
      trace: [{ 'content-type': null }]
    }
```

`responseExpectedContentType` default:
```
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
```

Most Request properties can be set the following are Frak defaults:

| Property | Default   | Description                             |
| -------- | -------   | -----------                             |
| mode     | 'cors'    | Cross-Origin Resource Sharing enabled   |
| headers  | {}        | Headers to send with each request       |

The above settings are implicitly set and
any [Request property](https://developer.mozilla.org/en-US/docs/Web/API/Request) can be used in this hash.

Frak supports all the standard [HTTP web methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

Frak acts as a _proxy_ to fetch() exposing methods matching the names of the HTTP web methods 
(with the exception of DELETE -- which is named `delete_` so JS doesn't pitch a fit).

The common methods of GET, POST, PATCH, and PUT have an expectation that the response 'Content-Type' (if any)
will be 'application/json'. 
If there is a payload (response content body) it **must** match the `responseExpectedContentType` or a `TypeError` 
will be thrown. `responseExpectedContentType` can be overridden in the constructor argument.

Frak is implemented as a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
For the common methods (GET, POST, PATCH and PUT) that have a return body -- Frak will return the JSON object as the 
promise response. Other methods will return the `response` object.

What follows are Frak's public methods and their signatures.

**Methods**

Note: The optional `options` argument for all methods corresponds to
      an object hash for [Request Properties](https://developer.mozilla.org/en-US/docs/Web/API/Request)

```ecmascript 6
    /**
    * GET web method for the given url
    * @param {string} url The endpoint for the GET request
    * @param {object} [options] 
    * @returns {Promise} contains the response.body.json() object on success.
    */
    get(url, options)

    /**
    * POST web method for the given url and body
    * @param {string} url The URL endpoint
    * @param {object | string} body The body of the request (if a string it must be valid JSON)
    * @param {object} [options] 
    * @returns {Promise} contains the response.body.json() object on success.
    */
    post(url, body, options)

    /**
    * PATCH web method for the given url and body
    * @param {string} url - Endpoint for the request
    * @param {object | string} body - The body of the PATCH request (if a string it must be valid JSON)
    * @param {object} [options] 
    * @returns {Promise} contains the response.body.json() object on success.
    */
    patch(url, body, options)

    /**
    * PUT web method for the given url and body
    * @param {string} url - Endpoint for the PUT method
    * @param {object | string} body -The body of the PUT request (if a string it must be valid JSON)
    * @param {object} [options] 
    * @returns {Promise} contains the response.body.json() object on success.
    */
    put(url, body, options)

    /**
    * DELETE web method for the given url
    * @param {string} url - Endpoint for the DELETE request
    * @param {object} [options] 
    * @returns {Promise}
    * 
    * NOTE: This method is called `delete_` with an underscore.
    *       It is done this way because in some edge cases the JS VM was interpreting this as a JS DELETE command.
    */
    delete_(url, options)
    delete(url, options) // Alias to delete_()

    /**
    * HEAD web method for the given url
    * @param {string} url Endpoint for the HEAD request.
    * @param {object} [options]
    * @returns {Promise}
    */
    head(url, options)

    /**
    * OPTIONS web method for the given url
    * @param {string} url Endpoint for the OPTIONS request.
    * @param {object} [options]
    * @returns {Promise}
    */
    options(url, options)

    /**
    * CONNECT web method for the given url and optional body.
    * @param {string} url Endpoint for the CONNECT method.
    * @param {string} [body] Body to include with the CONNECT request if any.
    * @param {object} [options] 
    * @returns {Promise}
    */
    connect(url, body, options)

    /**
     * TRACE web method for the given url
     * @param {string} url Endpoint for the TRACE request.
     * @param {object} [options] Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise}
     * 
     * Note: Included only for completeness. There are potential security exploits with this web method and its
     * general use is discouraged.
     * @link https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
     */
    trace(url, options)
```

## Why use Frak and what is with the name Frak?

It's certainly possible to simply use 
[`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) directly.

Frak is an opinionated JavaScript class library that targets a JSON request/response scenario.
If you need to deal with XML or some other data format then Frak is **not** a good fit in these situations.

When you call a Frak method such as `get()`, valid JSON is expected in the promise and captured in `then()` 
otherwise error details will be in the `catch()`. 
Frak is a wrapper around `fetch()` which is similar to `XMLHttpRequest()` and Jquery's `$.Ajax()`
-- with the biggest significant difference being that a failed response status (ex: 404 Not Found) doesn't indicate an
exception or error.
You can make Frak behave more like Ajax by setting `throwErrorOnFailedStatus` to true:

```ecmascript 6
    import { Frak } from 'frak';
    const frak = new Frak({throwErrorOnFailedStatus: true});
```

`fetch()` typically only throws an exception when a network error occurs. 
Frak takes this one step further for responses expecting JSON in the body that has something else will throw an error. 
Upon success the promise will contain a valid JSON payload (for methods that return a body).

Another difference is that [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is enabled by default. 
The reasoning for this is that CORS is an annoying necessary evil with **tons** of documented issues
where developers stub their toes and break their fingers trying to get `fetch` or even Ajax request/response to work.

__If you are detecting some personal annoyance at CORS by the developer of Frak you are correct.__

Enabling CORS by default is admittedly a potential security risk but for the sake of developers sanity and the technical
 support nightmare that CORS is it will remain enabled by default in Frak.

The name Frak is a nod in the direction of [Battlestar Galatica](https://en.wikipedia.org/wiki/Frak_(expletive))
The developer of Frak found himself saying "What the frak?!?" over and over especially when it came to dealing with
the CORS insanity.

Note: Frak works really well with the [Slim Framework](https://www.slimframework.com) and is the primary reason that
      Frak exists in the first place. (Not to say that Frak will not work with other server side web services)

-----------

Question: Why did you name this class library `frak` and not just `frak`?

Answer: `frak` at [NPM](https://www.npmjs.com/package/frak) is already taken 
(although it appears to be 4 year old abandonware).

## Contributing

If you find a bug or would like to include a feature then post a new issue in github.

**For security related issues please look in `package.json` and email the developer directly.**

If you want to contribute code to Frak you are encouraged to fork this repo and create a pull request.
