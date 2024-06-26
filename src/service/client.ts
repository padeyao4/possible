import { useAccount } from '@/stores/account';
import { Configuration } from '@/openapi';

export const config = () => {
  return new Configuration({
    basePath: import.meta.env.VITE_API_URL ?? '/',
    baseOptions: {
      headers: {
        Token: useAccount().token
      }
    }
  });
};
