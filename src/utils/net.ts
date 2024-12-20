export const ErrorCode = {
    ERR_NETWORK: '网络错误',
    ERR_BAD_REQUEST: '请求错误',
    ERR_UNAUTHORIZED: '未授权，请重新登录',
    ERR_NOT_FOUND: '请求地址出错',
    ERR_TIMEOUT: '请求超时',
    ERR_CONFLICT: '请求冲突',
    ERR_SERVER: '服务器出错'
  };
  
// 新增接口定义
export interface AxiosErrorConfig {
    transitional: {
        silentJSONParsing: boolean;
        forcedJSONParsing: boolean;
        clarifyTimeoutError: boolean;
    };
    adapter: string[];
    transformRequest: null[];
    transformResponse: null[];
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
    env: Record<string, unknown>;
    headers: {
        Accept: string;
        Authorization: string;
    };
    baseURL: string;
    method: string;
    url: string;
}

export interface AxiosErrorResponse {
    data: {
        message: string;
        code: number;
        payload: null;
    };
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosErrorConfig;
    request: Record<string, unknown>;
}

export interface AxiosErrorDetail {
    message: string;
    name: string;
    code: string;
    config: AxiosErrorConfig;
    request: Record<string, unknown>;
    response: AxiosErrorResponse;
    status: number;
}
  

