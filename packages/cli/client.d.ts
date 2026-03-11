declare module 'virtual:reslide/slides' {
  import type { SlideEntry } from '@reslide/core';
  export const slides: SlideEntry[];
}

declare module 'virtual:reslide/config' {
  import type { ReslideConfig } from '@reslide/core';
  const config: ReslideConfig;
  export default config;
}
