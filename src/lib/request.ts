import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_PATH ?? '/'

axios.interceptors.response.use(
  (resp) => resp,
  (error) => {
    return Promise.resolve({
      ...error,
      ...{
        data: {
          code: -1,
          message: error.message,
          payload: undefined
        }
      }
    })
  }
)
