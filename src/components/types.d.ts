export type OptionType = {
  name: string;
  group: {
    title: string;
    action?: () => void;
    icon?: string;
    shortcut?: string;
    children?: [OptionType];
  }[];
};
