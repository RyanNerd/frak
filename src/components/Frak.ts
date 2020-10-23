type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';
type RequestWithBody = <T>(uri: string, body: any, request?: RequestInit)  => Promise<T>
type RequestWithoutBody = <T>(uri: string, request?: RequestInit) => Promise<T>
interface IDefaultRequestContent {
    [key: string]: string | null;
}
export interface IFrak {
    get: RequestWithoutBody
    post: RequestWithBody
    patch: RequestWithBody
    put: RequestWithBody
    delete: RequestWithoutBody
    options: RequestWithoutBody
    head: RequestWithoutBody
    connect: RequestWithoutBody
    trace: RequestWithoutBody
}

const JSON_CONTENT_TYPE = 'application/json';
const DEFAULT_REQUEST_CONTENT_TYPE = {
    GET: null,
    POST: JSON_CONTENT_TYPE,
    PUT: JSON_CONTENT_TYPE,
    PATCH: JSON_CONTENT_TYPE,
    DELETE: null,
    HEAD: null,
    OPTIONS: null,
    CONNECT: null,
    TRACE: null,
} as IDefaultRequestContent;

/**
 * Frak
 * A simple implementation of the Fetch API specifically for JSON based Web Service requests and responses
 * @param {RequestInit} defaultRequestInit
 * @constructor
 */
export const Frak = (defaultRequestInit: RequestInit = {mode: 'cors'}): IFrak => {
    const _baseRequest = {...defaultRequestInit};

    /**
     * GET
     * @param {string} uri
     * @param {RequestInit} request
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET
     * @return Promise<any>
     */
    const _get = async <T>(uri: string, request: RequestInit = {}): Promise<T> => {
        const options = _prepRequest('GET', request);
        return await _http<T>(new Request(uri, options));
    }

    /**
     * POST
     * @param {string} uri
     * @param {any} body
     * @param {RequestInit} request
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
     * @return {Promise<any>}
     */
    const _post = async <T>(uri: string, body: any, request: RequestInit = {body: JSON.stringify(body)}): Promise<T> => {
        const options = _prepRequest('POST', request);
        return await _http<T>(new Request(uri, options));
    }

    /**
     * PATCH
     * @param {string} uri
     * @param {any} body
     * @param {RequestInit} request
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH
     * @return {Promise<any>}
     */
    const _patch = async <T>(uri: string, body: any, request: RequestInit = {body: JSON.stringify(body)}): Promise<T> => {
        const options = _prepRequest('PATCH', request);
        return await _http<T>(new Request(uri, options));
    }

    /**
     * PUT
     * @param {string} uri
     * @param {any} body
     * @param {RequestInit} request
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT
     * @return {Promise<any>}
     */
    const _put = async <T>(uri: string, body: any, request: RequestInit = {body: JSON.stringify(body)}): Promise<T> => {
        const options = _prepRequest('PUT', request);
        return await _http<T>(new Request(uri, options));
    }

    /**
     * DELETE
     * @param {string} uri
     * @param {RequestInit} request
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
     * @return {Promise<any>}
     */
    const _delete = async <T>(uri: string, request: RequestInit = {}): Promise<T> => {
        const options = _prepRequest('DELETE', request);
        return await _http<T>(new Request(uri, options));
    }

    /**
     * OPTIONS
     * @param {string} uri
     * @param {RequestInit} request
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
     * @return {Promise<any>}
     */
    const _options = async <T>(uri: string, request: RequestInit = {}): Promise<T> => {
        const options = _prepRequest('OPTIONS', request);
        return await _http<T>(new Request(uri, options));
    }

    /**
     * HEAD
     * @param {string} uri
     * @param {RequestInit} request
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD
     * @return {Promise<any>}
     */
    const _head = async <T>(uri: string, request: RequestInit = {}): Promise<T> => {
        const options = _prepRequest('HEAD', request);
        return await _http<T>(new Request(uri, options));
    }

    /**
     * CONNECT
     * @param {string} uri
     * @param {RequestInit} request
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT
     * @return {Promise<any>}
     */
    const _connect = async <T>(uri: string, request: RequestInit = {}): Promise<T> => {
        const options = _prepRequest('CONNECT', request);
        return await _http<T>(new Request(uri, options));
    }

    /**
     * TRACE
     * @param {string} uri
     * @param {RequestInit} request
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE
     * @return {Promise<any>}
     */
    const _trace = async <T>(uri: string, request: RequestInit = {}): Promise<T> => {
        const options = _prepRequest('TRACE', request);
        return await _http<T>(new Request(uri, options));
    }

    /**
     * Initialize the Request options object
     * @private
     * @param {HTTPMethods} method
     * @param {RequestInit} request
     * @return {RequestInit}
     */
    const _prepRequest = (method: HTTPMethods, request: RequestInit): RequestInit => {
        const options = {..._baseRequest, ...request};

        // Override the method
        options.method = method;

        // Is there a headers property given? If not then add headers as a Headers object
        if (!options.headers) {
            options.headers = new Headers();
        }

        // Get the Content-Type header based on the given method
        const contentType = DEFAULT_REQUEST_CONTENT_TYPE[method];

        // Is the headers property of the type Headers?
        if (options.headers instanceof Headers) {
            // Append the contentType if not null (the append method will overwrite an existing header)
            if (contentType) {
                options.headers.append('Content-Type', contentType);
            } else {
                // Remove the Content-Type header if it exists.
                if (options.headers.has('Content-Type')) {
                    options.headers.delete('Content-Type');
                }
            }
        } else {
            throw new TypeError('Request options.headers must be of the type Headers. ' + typeof options.headers + ' was given');
        }
        return options;
    }

    /**
     * Async call to perform the fetch given the request
     * @param {Request} request
     * @throws {Response}
     * @return Promise<T>
     */
    const _http = async <T>(request: Request): Promise<T> => {
        const response = await fetch(request);
        try {
            if (response.headers) {
                // Get the Content-Type of the response
                let contentType = response.headers.get('Content-Type');

                // In case the contentType has a backslash we convert it to forward slash
                contentType = contentType?.replace(/\\/, '/') || null;

                // Is Content-Type JSON? If so return response as parsed JSON, otherwise throw the respone as an error
                if (contentType && contentType === JSON_CONTENT_TYPE) {
                    return response.json();
                } else {
                    throw response;
                }
            } else {
                throw response;
            }
        } catch (err) {
            throw err;
        }
    }

    return {
        get: async <T>(uri: string, request?: RequestInit): Promise<T> => {
            return _get(uri, request);
        },
        post: async <T>(uri: string, body: any, request?: RequestInit): Promise<T> => {
            return _post(uri, body, request);
        },
        patch: async <T>(uri: string, body: any, request?: RequestInit): Promise<T> => {
            return _patch(uri, body, request);
        },
        put: async <T>(uri: string, body: any, request?: RequestInit): Promise<T> => {
            return _put(uri, body, request);
        },
        delete: async <T>(uri: string, request?: RequestInit): Promise<T> => {
            return _delete(uri, request);
        },
        options: async <T>(uri: string, request?: RequestInit): Promise<T> => {
            return _options(uri, request);
        },
        head: async <T>(uri: string, request?: RequestInit): Promise<T> => {
            return _head(uri, request);
        },
        connect: async <T>(uri: string, request?: RequestInit): Promise<T> => {
            return _connect(uri, request);
        },
        trace: async <T>(uri: string, request?: RequestInit): Promise<T> => {
            return _trace(uri, request);
        }
    } as IFrak;
}

export default Frak;
