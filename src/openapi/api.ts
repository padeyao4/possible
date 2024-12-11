/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface Backlog
 */
export interface Backlog {
    /**
     * 
     * @type {string}
     * @memberof Backlog
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof Backlog
     */
    'name'?: string;
    /**
     * 
     * @type {number}
     * @memberof Backlog
     */
    'index'?: number;
    /**
     * 
     * @type {boolean}
     * @memberof Backlog
     */
    'status'?: boolean;
}
/**
 * 
 * @export
 * @interface GrantedAuthority
 */
export interface GrantedAuthority {
    /**
     * 
     * @type {string}
     * @memberof GrantedAuthority
     */
    'authority'?: string;
}
/**
 * 
 * @export
 * @interface RestResponseListBacklog
 */
export interface RestResponseListBacklog {
    /**
     * 
     * @type {string}
     * @memberof RestResponseListBacklog
     */
    'message'?: string;
    /**
     * 
     * @type {number}
     * @memberof RestResponseListBacklog
     */
    'code'?: number;
    /**
     * 
     * @type {Array<Backlog>}
     * @memberof RestResponseListBacklog
     */
    'payload'?: Array<Backlog>;
}
/**
 * 
 * @export
 * @interface RestResponseSettingsPage
 */
export interface RestResponseSettingsPage {
    /**
     * 
     * @type {string}
     * @memberof RestResponseSettingsPage
     */
    'message'?: string;
    /**
     * 
     * @type {number}
     * @memberof RestResponseSettingsPage
     */
    'code'?: number;
    /**
     * 
     * @type {SettingsPage}
     * @memberof RestResponseSettingsPage
     */
    'payload'?: SettingsPage;
}
/**
 * 
 * @export
 * @interface RestResponseVoid
 */
export interface RestResponseVoid {
    /**
     * 
     * @type {string}
     * @memberof RestResponseVoid
     */
    'message'?: string;
    /**
     * 
     * @type {number}
     * @memberof RestResponseVoid
     */
    'code'?: number;
    /**
     * 
     * @type {object}
     * @memberof RestResponseVoid
     */
    'payload'?: object;
}
/**
 * 
 * @export
 * @interface SettingsPage
 */
export interface SettingsPage {
    /**
     * 
     * @type {User}
     * @memberof SettingsPage
     */
    'user'?: User;
}
/**
 * 
 * @export
 * @interface User
 */
export interface User {
    /**
     * 
     * @type {number}
     * @memberof User
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'username'?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'email'?: string;
    /**
     * 
     * @type {number}
     * @memberof User
     */
    'githubId'?: number;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'createdAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'updatedAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'name'?: string;
    /**
     * 
     * @type {{ [key: string]: object; }}
     * @memberof User
     */
    'attributes'?: { [key: string]: object; };
    /**
     * 
     * @type {Array<GrantedAuthority>}
     * @memberof User
     */
    'authorities'?: Array<GrantedAuthority>;
}

/**
 * BacklogControllerApi - axios parameter creator
 * @export
 */
export const BacklogControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {Array<Backlog>} backlog 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        add: async (backlog: Array<Backlog>, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'backlog' is not null or undefined
            assertParamExists('add', 'backlog', backlog)
            const localVarPath = `/api/backlog/add`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(backlog, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/backlog/list`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * BacklogControllerApi - functional programming interface
 * @export
 */
export const BacklogControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = BacklogControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {Array<Backlog>} backlog 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async add(backlog: Array<Backlog>, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseVoid>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.add(backlog, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['BacklogControllerApi.add']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async list(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseListBacklog>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.list(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['BacklogControllerApi.list']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * BacklogControllerApi - factory interface
 * @export
 */
export const BacklogControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = BacklogControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {Array<Backlog>} backlog 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        add(backlog: Array<Backlog>, options?: RawAxiosRequestConfig): AxiosPromise<RestResponseVoid> {
            return localVarFp.add(backlog, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list(options?: RawAxiosRequestConfig): AxiosPromise<RestResponseListBacklog> {
            return localVarFp.list(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * BacklogControllerApi - object-oriented interface
 * @export
 * @class BacklogControllerApi
 * @extends {BaseAPI}
 */
export class BacklogControllerApi extends BaseAPI {
    /**
     * 
     * @param {Array<Backlog>} backlog 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BacklogControllerApi
     */
    public add(backlog: Array<Backlog>, options?: RawAxiosRequestConfig) {
        return BacklogControllerApiFp(this.configuration).add(backlog, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BacklogControllerApi
     */
    public list(options?: RawAxiosRequestConfig) {
        return BacklogControllerApiFp(this.configuration).list(options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * PageControllerApi - axios parameter creator
 * @export
 */
export const PageControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSettingsPage: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/page/settings`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PageControllerApi - functional programming interface
 * @export
 */
export const PageControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = PageControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getSettingsPage(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseSettingsPage>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getSettingsPage(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['PageControllerApi.getSettingsPage']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * PageControllerApi - factory interface
 * @export
 */
export const PageControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = PageControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSettingsPage(options?: RawAxiosRequestConfig): AxiosPromise<RestResponseSettingsPage> {
            return localVarFp.getSettingsPage(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * PageControllerApi - object-oriented interface
 * @export
 * @class PageControllerApi
 * @extends {BaseAPI}
 */
export class PageControllerApi extends BaseAPI {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PageControllerApi
     */
    public getSettingsPage(options?: RawAxiosRequestConfig) {
        return PageControllerApiFp(this.configuration).getSettingsPage(options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * TestControllerApi - axios parameter creator
 * @export
 */
export const TestControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        test: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/test/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * TestControllerApi - functional programming interface
 * @export
 */
export const TestControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = TestControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async test(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.test(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TestControllerApi.test']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * TestControllerApi - factory interface
 * @export
 */
export const TestControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = TestControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        test(options?: RawAxiosRequestConfig): AxiosPromise<string> {
            return localVarFp.test(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * TestControllerApi - object-oriented interface
 * @export
 * @class TestControllerApi
 * @extends {BaseAPI}
 */
export class TestControllerApi extends BaseAPI {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TestControllerApi
     */
    public test(options?: RawAxiosRequestConfig) {
        return TestControllerApiFp(this.configuration).test(options).then((request) => request(this.axios, this.basePath));
    }
}



