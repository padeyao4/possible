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
 * @interface LoginRequest
 */
export interface LoginRequest {
    /**
     * 
     * @type {string}
     * @memberof LoginRequest
     */
    'username'?: string;
    /**
     * 
     * @type {string}
     * @memberof LoginRequest
     */
    'password'?: string;
}
/**
 * 
 * @export
 * @interface RegisterRequest
 */
export interface RegisterRequest {
    /**
     * 
     * @type {string}
     * @memberof RegisterRequest
     */
    'username'?: string;
    /**
     * 
     * @type {string}
     * @memberof RegisterRequest
     */
    'password'?: string;
}
/**
 * 
 * @export
 * @interface RestResponseLong
 */
export interface RestResponseLong {
    /**
     * 
     * @type {string}
     * @memberof RestResponseLong
     */
    'message'?: string;
    /**
     * 
     * @type {number}
     * @memberof RestResponseLong
     */
    'code'?: number;
    /**
     * 
     * @type {number}
     * @memberof RestResponseLong
     */
    'payload'?: number;
}
/**
 * 
 * @export
 * @interface RestResponseObject
 */
export interface RestResponseObject {
    /**
     * 
     * @type {string}
     * @memberof RestResponseObject
     */
    'message'?: string;
    /**
     * 
     * @type {number}
     * @memberof RestResponseObject
     */
    'code'?: number;
    /**
     * 
     * @type {object}
     * @memberof RestResponseObject
     */
    'payload'?: object;
}
/**
 * 
 * @export
 * @interface RestResponseStorage
 */
export interface RestResponseStorage {
    /**
     * 
     * @type {string}
     * @memberof RestResponseStorage
     */
    'message'?: string;
    /**
     * 
     * @type {number}
     * @memberof RestResponseStorage
     */
    'code'?: number;
    /**
     * 
     * @type {Storage}
     * @memberof RestResponseStorage
     */
    'payload'?: Storage;
}
/**
 * 
 * @export
 * @interface RestResponseString
 */
export interface RestResponseString {
    /**
     * 
     * @type {string}
     * @memberof RestResponseString
     */
    'message'?: string;
    /**
     * 
     * @type {number}
     * @memberof RestResponseString
     */
    'code'?: number;
    /**
     * 
     * @type {string}
     * @memberof RestResponseString
     */
    'payload'?: string;
}
/**
 * 
 * @export
 * @interface RestResponseUser
 */
export interface RestResponseUser {
    /**
     * 
     * @type {string}
     * @memberof RestResponseUser
     */
    'message'?: string;
    /**
     * 
     * @type {number}
     * @memberof RestResponseUser
     */
    'code'?: number;
    /**
     * 
     * @type {User}
     * @memberof RestResponseUser
     */
    'payload'?: User;
}
/**
 * 
 * @export
 * @interface Storage
 */
export interface Storage {
    /**
     * 
     * @type {number}
     * @memberof Storage
     */
    'id'?: number;
    /**
     * 
     * @type {number}
     * @memberof Storage
     */
    'userId'?: number;
    /**
     * 
     * @type {string}
     * @memberof Storage
     */
    'createAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof Storage
     */
    'expireAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof Storage
     */
    'uploadAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof Storage
     */
    'content'?: string;
}
/**
 * 
 * @export
 * @interface StoragePutRequest
 */
export interface StoragePutRequest {
    /**
     * 
     * @type {string}
     * @memberof StoragePutRequest
     */
    'uploadAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof StoragePutRequest
     */
    'content'?: string;
    /**
     * 
     * @type {number}
     * @memberof StoragePutRequest
     */
    'parentId'?: number;
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
     * @type {number}
     * @memberof User
     */
    'tokenVersion'?: number;
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
     * @type {Array<GrantedAuthority>}
     * @memberof User
     */
    'authorities'?: Array<GrantedAuthority>;
    /**
     * 
     * @type {boolean}
     * @memberof User
     */
    'enabled'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof User
     */
    'accountNonLocked'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof User
     */
    'credentialsNonExpired'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof User
     */
    'accountNonExpired'?: boolean;
}

/**
 * AccountControllerApi - axios parameter creator
 * @export
 */
export const AccountControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {LoginRequest} loginRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        login: async (loginRequest: LoginRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'loginRequest' is not null or undefined
            assertParamExists('login', 'loginRequest', loginRequest)
            const localVarPath = `/login`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(loginRequest, localVarRequestOptions, configuration)

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
        logout: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/logout`;
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
        /**
         * 
         * @param {RegisterRequest} registerRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        register: async (registerRequest: RegisterRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'registerRequest' is not null or undefined
            assertParamExists('register', 'registerRequest', registerRequest)
            const localVarPath = `/register`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(registerRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AccountControllerApi - functional programming interface
 * @export
 */
export const AccountControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AccountControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {LoginRequest} loginRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async login(loginRequest: LoginRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseString>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.login(loginRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AccountControllerApi.login']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async logout(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseObject>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.logout(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AccountControllerApi.logout']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {RegisterRequest} registerRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async register(registerRequest: RegisterRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseObject>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.register(registerRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AccountControllerApi.register']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AccountControllerApi - factory interface
 * @export
 */
export const AccountControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AccountControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {LoginRequest} loginRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        login(loginRequest: LoginRequest, options?: any): AxiosPromise<RestResponseString> {
            return localVarFp.login(loginRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logout(options?: any): AxiosPromise<RestResponseObject> {
            return localVarFp.logout(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {RegisterRequest} registerRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        register(registerRequest: RegisterRequest, options?: any): AxiosPromise<RestResponseObject> {
            return localVarFp.register(registerRequest, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AccountControllerApi - object-oriented interface
 * @export
 * @class AccountControllerApi
 * @extends {BaseAPI}
 */
export class AccountControllerApi extends BaseAPI {
    /**
     * 
     * @param {LoginRequest} loginRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AccountControllerApi
     */
    public login(loginRequest: LoginRequest, options?: RawAxiosRequestConfig) {
        return AccountControllerApiFp(this.configuration).login(loginRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AccountControllerApi
     */
    public logout(options?: RawAxiosRequestConfig) {
        return AccountControllerApiFp(this.configuration).logout(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {RegisterRequest} registerRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AccountControllerApi
     */
    public register(registerRequest: RegisterRequest, options?: RawAxiosRequestConfig) {
        return AccountControllerApiFp(this.configuration).register(registerRequest, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * StorageControllerApi - axios parameter creator
 * @export
 */
export const StorageControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {StoragePutRequest} storagePutRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        forcePut: async (storagePutRequest: StoragePutRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'storagePutRequest' is not null or undefined
            assertParamExists('forcePut', 'storagePutRequest', storagePutRequest)
            const localVarPath = `/api/storage/force/put`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(storagePutRequest, localVarRequestOptions, configuration)

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
        get: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/storage/get`;
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
        /**
         * 
         * @param {StoragePutRequest} storagePutRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        put: async (storagePutRequest: StoragePutRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'storagePutRequest' is not null or undefined
            assertParamExists('put', 'storagePutRequest', storagePutRequest)
            const localVarPath = `/api/storage/put`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(storagePutRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * StorageControllerApi - functional programming interface
 * @export
 */
export const StorageControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = StorageControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {StoragePutRequest} storagePutRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async forcePut(storagePutRequest: StoragePutRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseLong>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.forcePut(storagePutRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['StorageControllerApi.forcePut']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async get(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseStorage>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.get(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['StorageControllerApi.get']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {StoragePutRequest} storagePutRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async put(storagePutRequest: StoragePutRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseLong>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.put(storagePutRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['StorageControllerApi.put']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * StorageControllerApi - factory interface
 * @export
 */
export const StorageControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = StorageControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {StoragePutRequest} storagePutRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        forcePut(storagePutRequest: StoragePutRequest, options?: any): AxiosPromise<RestResponseLong> {
            return localVarFp.forcePut(storagePutRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get(options?: any): AxiosPromise<RestResponseStorage> {
            return localVarFp.get(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {StoragePutRequest} storagePutRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        put(storagePutRequest: StoragePutRequest, options?: any): AxiosPromise<RestResponseLong> {
            return localVarFp.put(storagePutRequest, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * StorageControllerApi - object-oriented interface
 * @export
 * @class StorageControllerApi
 * @extends {BaseAPI}
 */
export class StorageControllerApi extends BaseAPI {
    /**
     * 
     * @param {StoragePutRequest} storagePutRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StorageControllerApi
     */
    public forcePut(storagePutRequest: StoragePutRequest, options?: RawAxiosRequestConfig) {
        return StorageControllerApiFp(this.configuration).forcePut(storagePutRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StorageControllerApi
     */
    public get(options?: RawAxiosRequestConfig) {
        return StorageControllerApiFp(this.configuration).get(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {StoragePutRequest} storagePutRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StorageControllerApi
     */
    public put(storagePutRequest: StoragePutRequest, options?: RawAxiosRequestConfig) {
        return StorageControllerApiFp(this.configuration).put(storagePutRequest, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * UserControllerApi - axios parameter creator
 * @export
 */
export const UserControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        userInfo: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/user/info`;
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
 * UserControllerApi - functional programming interface
 * @export
 */
export const UserControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UserControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userInfo(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RestResponseUser>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.userInfo(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UserControllerApi.userInfo']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * UserControllerApi - factory interface
 * @export
 */
export const UserControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UserControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        userInfo(options?: any): AxiosPromise<RestResponseUser> {
            return localVarFp.userInfo(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserControllerApi - object-oriented interface
 * @export
 * @class UserControllerApi
 * @extends {BaseAPI}
 */
export class UserControllerApi extends BaseAPI {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserControllerApi
     */
    public userInfo(options?: RawAxiosRequestConfig) {
        return UserControllerApiFp(this.configuration).userInfo(options).then((request) => request(this.axios, this.basePath));
    }
}



