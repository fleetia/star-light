import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { CollapsibleSection } from "../CollapsibleSection";

const meta = {
  title: "Components/CollapsibleSection",
  component: CollapsibleSection,
  args: {
    children:
      "This is the collapsible content area. It can contain any React nodes."
  }
} satisfies Meta<typeof CollapsibleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Section Title",
    defaultOpen: false
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Section Title" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-expanded", "true");
  }
};

export const DefaultOpen: Story = {
  args: {
    title: "Open Section",
    defaultOpen: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Open Section" });
    await expect(button).toHaveAttribute("aria-expanded", "true");
  }
};
