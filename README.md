# Frak

__A simple implementation of the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) specifically for JSON based requests and responses__

## Installation 

Recommended is via NPM / YARN

In your `package.json` for your app:

    "dependencies": {
      "frak": "^1.1.18"
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
      .then((response) =>
      {
        console.log(response);
      })
      .catch((error) => {
        console.log('Something went wrong', error);
      });
    };
    
    getExample('http://localhost/8080/endpoint');
```

**Frak constructor**

For most applications the defaults for Frak should be sufficient.
The constructor takes a single optional argument for the cases where you need Frak behave differently.


```ecmascript 6
  /**
   * Constructor argument is an optional settings hash
   *
   * @param {object} [settings] The Request object hash (with some additional Frak specific properties)
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Request
   */
  Frak(settings)

```

These are Frak specific properties that can be in the settings hash:

| Property                    | Default   | Description                                                                |
| --------                    | -------   | -----------                                                                |
| throwErrorOnFailedStatus    | false     | Set this to true if you want Frak to behave more like Jquery's Ajax        |
| requestDefaultHeaders       | see below | Headers to send for each HTTP method (see below)                           |

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

The settings object hash can use _most_ properties in the
[Request property](https://developer.mozilla.org/en-US/docs/Web/API/Request) object hash.

Frak overrides the following default property:

| Property | Default   | Link                                                          |
| -------- | -------   | ----                                                          |
| mode     | 'cors'    | https://developer.mozilla.org/en-US/docs/Web/API/Request/mode |

Frak supports all the standard [HTTP web methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

Frak acts as a _proxy_ to fetch() exposing methods matching the names of the HTTP web methods 
(with the exception of DELETE -- which is named `delete_` so JS doesn't pitch a fit).

Frak is implemented as a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
If the web service response header of Content-Type is 'application/json' then Frak will implement the json() parser 
as the promise response. Other content types are not specifically handled by Frak. 
For more info see `fetch()` [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object.

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
    *       It is done this way because packagers such as webpak will choke on this.
    */
    delete_(url, options)

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

Frak is a class that specifically targets a JSON request/response scenario.
If you need to deal with XML or some other data format then Frak is probably **not** a good fit in these situations.

Frak is a wrapper around `fetch()` which is similar to `XMLHttpRequest()` and Jquery's `$.Ajax()`
You can make Frak behave more like Ajax by setting `throwErrorOnFailedStatus` to true:

```ecmascript 6
    import { Frak } from 'frak';
    const frak = new Frak({throwErrorOnFailedStatus: true});
```

The name Frak is a nod in the direction of [Battlestar Galatica](https://en.wikipedia.org/wiki/Frak_(expletive)).
The developer of Frak found himself saying "What the frak?!?" over and over especially when it came to dealing with
the [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) insanity.

__If you are detecting some personal annoyance at CORS by the developer of Frak you are correct.__

Note: Frak works really well with the [Slim Framework](https://www.slimframework.com) and is the primary reason that
      Frak exists in the first place. (Not to say that Frak will not work well with other server side web services)

## Contributing

If you find a bug or would like to include a feature then post a new issue in github.

**For security related issues please look in `package.json` and email the developer directly.**

If you want to contribute code to Frak you are encouraged to fork this repo and create a pull request.
