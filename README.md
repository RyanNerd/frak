# Frak

__A simple implementation of the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) specifically for JSON based requests and responses__

**Important Notes:**

- `frak-js` is deprecated. **Only** use `Frak`
-  Versions of Frak prior to 3.1.2 are **NOT** supported or maintained.

## Installation 

Recommended is via NPM / YARN

In your `package.json` for your app add this:

```metadata json
"dependencies": {
  "frak": "^3.1.3"
}
```

 Then install with either NPM or YARN:
```shell script
npm install
yarn install
```

## Implementation

Frak is a wrapper around `fetch()` Frak supports all the standard [HTTP web methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

Here's a simple example of a GET request using Frak:

```ecmascript 6
import Frak from "frak/lib/components/Frak";
const frak = new Frak();

getExample = (uri) =>
{  
  return frak.get(uri)
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

The constructor takes a single optional argument of the type [RequestInit](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html)
The default value is `{mode: "cors"}`. 

Anytime a Frak request is made what is passed to the Frak constructor will be merged into the request.
 
Here's an example:

```typescript
// https://developer.mozilla.org/en-US/docs/Web/API/AbortController
const abortController = new AbortController();
// All frak method calls will now have an abort signal and the mode "cors"
const frak = Frak({signal: abortController.signal, mode: "cors"}); 

/**
/* @see https://dog.ceo/dog-api/
*/
const getRandomDogImage = async () => {
    // Because the abort signal and mode of "cors" are in the Frak constructor
    // when the get() request is made these are automatically included in the request.
    return await frak.get("https://dog.ceo/api/breeds/image/random");    
}

getRandomDogImage()
.then((response) => {
    return response.response.message;
})
.then((img) => { 
    document.getElementById('dog-img').setAttribute('src', img);    
});
```

**Methods**

Frak acts as a _proxy_ to `fetch()` exposing methods matching the names of the HTTP web methods 

Frak is implemented as a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
If the web service response header of Content-Type is 'application/json' then Frak will resolve to `Promise<JSON>`. 
Content types other than `application/json` or `text/json` in the response will throw the [Response object](https://developer.mozilla.org/en-US/docs/Web/API/Response) as an error.   

What follows are Frak's public methods and their signatures in TypeScript format.

Types:
  - [RequestInit](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html)
  - JSON = `object | string // as valid JSON`
  - [Promise](https://microsoft.github.io/PowerBI-JavaScript/classes/_typings_globals_es6_promise_index_d_.promise.html)

```typescript
interface Frak {
    get: async <T>(uri: string, request?: RequestInit): Promise<T> => {}
    post: async <T>(uri: string, body: any, request?: RequestInit): Promise<T> => {}
    patch: async <T>(uri: string, body: any, request?: RequestInit): Promise<T> => {}
    put: async <T>(uri: string, body: any, request?: RequestInit): Promise<T> => {}
    delete: async <T>(uri: string, request?: RequestInit): Promise<T> => {}
    options: async <T>(uri: string, request?: RequestInit): Promise<T> => {}
    head: async <T>(uri: string, request?: RequestInit): Promise<T> => {}
    connect: async <T>(uri: string, request?: RequestInit): Promise<T> => {}
    trace: async <T>(uri: string, request?: RequestInit): Promise<T> => {}
}
```

## Why use Frak and what is with the name Frak?

You can of course use [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) directly, but with Frak you get these features:

Frak exposes all valid [HTTP verbs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) as a method that takes sane arguments:

`frak.post('https://some.com/endpoint', {"my": "JSON"});`

`frak.patch('https://example.com/endpoint', {"my": "JSON"});`

`frak.get('https://example.com/endpoint?count=10');`

Frak specifically targets a JSON request/response scenario.

If you need to deal with XML or some other data format then Frak is probably **not** a good fit in these situations.

The name Frak is a nod to [Battlestar Galatica](https://en.wikipedia.org/wiki/Frak_(expletive)).
The developer of Frak found himself saying "What the frak?!?" over and over especially when it came to dealing with
the [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) insanity.

__If you are detecting some personal annoyance at CORS by the developer of Frak you are correct.__

Note: Frak works really well with the [Slim](https://www.slimframework.com) and [Willow](https://www.notion.so/Willow-Framework-Users-Guide-bf56317580884ccd95ed8d3889f83c72) frameworks. 
(Not to say that Frak will not work well with other server side web services)

## Contributing

If you find a bug or would like to include a feature then post a new issue in github.

**For security related issues please look in `package.json` and email the developer directly.**

If you want to contribute code to Frak you are encouraged to fork this repo and create a pull request.
