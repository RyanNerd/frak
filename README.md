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
    
    getExample = (uri) =>
    {  return frak.get(uri)
      .then((response) =>
      {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    };
    
    getExample('http://localhost:8080/endpoint');
```

**Frak constructor**

For most applications the defaults for Frak should be sufficient.
The constructor takes a single optional argument for the cases where you need Frak behave differently.


```ecmascript 6
  /**
   * Constructor argument is an optional settings hash
   *
   * @param {object} [settings] 
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Request
   */
  Frak(settings)

```

These are the Frak settings defaults and description:

| Property                 | Default   | Description                                                             |
| --------                 | -------   | -----------                                                             |
| throwErrorOnFailedStatus | false     | Set this to true if you want Frak to behave more like Jquery's Ajax     |
| resolveJsonResponse      | true      | `fetch()` responses of the type `application/json` will resolve to JSON |
| request                  | see below | Request object if you want to override Frak's defaults                  |

`throwErrorOnFailedStatus`
 
Set this to true if you want Frak to behave more like Jquery's `$.AJAX()`
Frak is a wrapper around `fetch()` which **does not** throw errors when `status !== 200`
Jquery's `$.AJAX()` on the other hand does throw errors when `status === 200`.
  
resolveJsonResponse`
 
Set this to false if you want the returned promise to **not** resolve to JSON. The resloved promise from a `fetch()`
call by default returns a [Response object](https://developer.mozilla.org/en-US/docs/Web/API/Response). Frak detects 
if the response is a content-type of `application/json` and if so it will resolve the Response object to JSON. 

`request`

You can set the default request properties in the constructor.
See [Request object](https://developer.mozilla.org/en-US/docs/Web/API/Request) for available properties.

Frak default request properties are:

| Property | Default   | Link                                                              |
| -------- | -------   | ----                                                              |
| mode     | 'cors'    | https://developer.mozilla.org/en-US/docs/Web/API/Request/mode     |
| referrer | 'client'  | https://developer.mozilla.org/en-US/docs/Web/API/Request/referrer |

Frak supports all the standard [HTTP web methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

**Methods**

Frak acts as a _proxy_ to `fetch()` exposing methods matching the names of the HTTP web methods 
(with the exception of DELETE -- which is named `delete_`.

Frak (like `fetch()`) is implemented as a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
If the web service response header of Content-Type is 'application/json' then Frak will resolve to JSON (see `resolveJsonResponse` above). 
Other content types are not specifically handled by Frak and resolve to a standard  
[Response object](https://developer.mozilla.org/en-US/docs/Web/API/Response).

What follows are Frak's public methods and their signatures.

Note: The optional `requestOptions` argument for all methods corresponds to a
[Request Object](https://developer.mozilla.org/en-US/docs/Web/API/Request) An object primitive can also be used (ex: `{mode: "no-cors"}`)

```ecmascript 6
    /**
    * GET web method for the given url
    * @param {string} url The endpoint for the GET request
    * @param {object} [requestOptions] 
    * @returns {Promise} contains the response.body.json() object on success.
    */
    get(url, requestOptions)

    /**
    * POST web method for the given url and body
    * @param {string} url The URL endpoint
    * @param {object | string} body The body of the request (if a string it must be valid JSON)
    * @param {object} [requestOptions] 
    * @returns {Promise} contains the response.body.json() object on success.
    */
    post(url, body, requestOptions)

    /**
    * PATCH web method for the given url and body
    * @param {string} url - Endpoint for the request
    * @param {object | string} body - The body of the PATCH request (if a string it must be valid JSON)
    * @param {object} [requestOptions] 
    * @returns {Promise} contains the response.body.json() object on success.
    */
    patch(url, body, requestOptions)

    /**
    * PUT web method for the given url and body
    * @param {string} url - Endpoint for the PUT method
    * @param {object | string} body -The body of the PUT request (if a string it must be valid JSON)
    * @param {object} [requestOptions] 
    * @returns {Promise} contains the response.body.json() object on success.
    */
    put(url, body, requestOptions)

    /**
    * DELETE web method for the given url
    * @param {string} url - Endpoint for the DELETE request
    * @param {object} [requestOptions] 
    * @returns {Promise}
    * 
    * NOTE: This method is called `delete_` with an underscore.
    * It is done this way because may JS engines consider delete a reserved word.
    */
    delete_(url, requestOptions)

    /**
    * HEAD web method for the given url
    * @param {string} url Endpoint for the HEAD request.
    * @param {object} [requestOptions]
    * @returns {Promise}
    */
    head(url, requestOptions)

    /**
    * OPTIONS web method for the given url
    * @param {string} url Endpoint for the OPTIONS request.
    * @param {object} [requestOptions]
    * @returns {Promise}
    */
    options(url, requestOptions)

    /**
    * CONNECT web method for the given url and optional body.
    * @param {string} url Endpoint for the CONNECT method.
    * @param {string} [body] Body to include with the CONNECT request if any.
    * @param {object} [requestOptions] 
    * @returns {Promise}
    */
    connect(url, body, requestOptions)

    /**
     * TRACE web method for the given url
     * @param {string} url Endpoint for the TRACE request.
     * @param {object} [requestOptions] Request object @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @returns {Promise}
     * 
     * Note: Included only for completeness. There are potential security exploits with this web method and its
     * general use is discouraged.
     * @link https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
     */
    trace(url, requestOptions)
```

## Why use Frak and what is with the name Frak?

One does not simply use [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) directly.
Actually you can use `fetch()` directly, but with Frak you get these features:

Frak exposes all valid [HTTP verbs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) as a method that takes sane arguments:

`Frak.post('https://some.com/endpoint', {"my": "JSON"});`

`Frak.patch('https://example.com/endpoint', {"my": "JSON"});`

`Frak.get('https://example.com/endpoint?count=10');`

Frak is a class that specifically targets a JSON request/response scenario.
If you need to deal with XML or some other data format then Frak is probably **not** a good fit in these situations.

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
