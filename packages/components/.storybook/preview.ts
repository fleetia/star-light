import type { Preview } from "storybook/internal/types";
import "../src/styles/tokens.css.ts";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
