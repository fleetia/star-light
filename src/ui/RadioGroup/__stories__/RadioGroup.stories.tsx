import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within, fn } from "storybook/test";

import { RadioGroup } from "../RadioGroup";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" }
];

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  args: {
    options,
    value: "a",
    onChange: fn()
  }
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: { value: "a" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole("radio");
    await expect(radios).toHaveLength(3);
    await expect(radios[0]).toBeChecked();
    await expect(radios[1]).not.toBeChecked();
  }
};

export const SecondSelected: Story = {
  args: { value: "b" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole("radio");
    await expect(radios[1]).toBeChecked();
  }
};

export const Disabled: Story = {
  args: { value: "a", disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole("radio");
    for (const radio of radios) {
      await expect(radio).toBeDisabled();
    }
  }
};

export const ClickToChange: Story = {
  args: { value: "a" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole("radio");
    await userEvent.click(radios[2]);
    await expect(radios[2]).toBeChecked();
  }
};

function RadioGroupDemo() {
  const [value, setValue] = useState("a");
  return <RadioGroup options={options} value={value} onChange={setValue} />;
}

export const Interactive: Story = {
  render: () => <RadioGroupDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole("radio");

    await expect(radios[0]).toBeChecked();
    await userEvent.click(radios[1]);
    await expect(radios[1]).toBeChecked();
    await expect(radios[0]).not.toBeChecked();
  }
};
