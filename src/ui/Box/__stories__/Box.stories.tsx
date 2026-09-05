import type { Meta, StoryObj } from "@storybook/react";

import { Box } from "../Box";

const meta: Meta<typeof Box> = {
  title: "Components/Box",
  component: Box
};

export default meta;
type Story = StoryObj<typeof Box>;

export const WithTitle: Story = {
  args: {
    title: "Section Title",
    children: "Content inside the box."
  }
};

export const NoTitle: Story = {
  args: {
    children: "A box without a title."
  }
};

export const WithMultipleChildren: Story = {
  render: () => (
    <Box title="Settings">
      <p style={{ margin: "0 0 0.5em", fontSize: "0.8rem" }}>First item</p>
      <p style={{ margin: 0, fontSize: "0.8rem" }}>Second item</p>
    </Box>
  )
};
