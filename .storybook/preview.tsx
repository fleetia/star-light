import type { Preview } from "@storybook/react-vite";
import { ThemeRoot } from "@fleetia/lagrange";
import "../src/reset.css";
import "@fleetia/lagrange/styles.css";
import "../src/index.css";
import { kboTheme } from "../src/styles/lagrange.css";

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeRoot themeClassName={kboTheme}>
        <Story />
      </ThemeRoot>
    )
  ],
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
