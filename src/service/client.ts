import { useAccount } from '@/stores/account';
import { Configuration } from '@/openapi';

export const config = () => {
  return new Configuration({
    baseOptions: {
      headers: {
        Token: useAccount().token
      }
    }
  });
};
