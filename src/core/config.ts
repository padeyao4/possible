import axios from 'axios';
import { useAccount } from '@/stores/account';

const errorCode = {
  ERR_NETWORK: '网络错误',
  ERR_BAD_REQUEST: '请求错误',
  ERR_UNAUTHORIZED: '未授权，请重新登录',
  ERR_NOT_FOUND: '请求地址出错',
  ERR_TIMEOUT: '请求超时',
  ERR_CONFLICT: '请求冲突',
  ERR_SERVER: '服务器出错'
};

export function axiosConfig() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? '/';

  axios.interceptors.request.use((config) => {
    const token = useAccount().token;
    if (token) {
      config.headers['Token'] = token;
    }
    return config;
  });

  axios.interceptors.response.use(
    (resp) => {
      return resp;
    },
    (error) => {
      return Promise.reject({
        ...error,
        message: error?.response?.data?.message ?? errorCode[error.code]
      });
    }
  );
}
