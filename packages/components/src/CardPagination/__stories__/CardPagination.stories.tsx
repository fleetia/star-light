import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { CardPagination } from "../CardPagination";

const meta = {
  title: "Components/CardPagination",
  component: CardPagination
} satisfies Meta<typeof CardPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 2,
    totalPages: 5,
    onPrev: fn(),
    onNext: fn()
  }
};

export const FirstPage: Story = {
  args: {
    currentPage: 0,
    totalPages: 5,
    onPrev: fn(),
    onNext: fn()
  }
};

export const LastPage: Story = {
  args: {
    currentPage: 4,
    totalPages: 5,
    onPrev: fn(),
    onNext: fn()
  }
};
