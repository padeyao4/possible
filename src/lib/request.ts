import axios from 'axios'

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
