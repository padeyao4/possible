import type { Config } from 'tailwindcss';
import { addDynamicIconSelectors } from '@iconify/tailwind';
import { iconsPlugin } from '@egoist/tailwindcss-icons';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {}
  },
  plugins: [iconsPlugin(), addDynamicIconSelectors()],
} satisfies Config;
