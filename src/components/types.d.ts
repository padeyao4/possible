import type { ID } from '@/core/types';

export type OptionType = {
  name?: string;
  group: {
    title: string;
    action?: () => void;
    icon?: string;
    shortcut?: string;
    children?: OptionType[];
  }[];
};

export interface DraggableType {
  id: ID;
  [key: string]: any;
}
