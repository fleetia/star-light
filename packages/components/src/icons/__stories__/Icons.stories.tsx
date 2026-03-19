import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ChevronLeftIcon } from "../ChevronLeftIcon";
import { ChevronRightIcon } from "../ChevronRightIcon";
import { TriangleUpIcon } from "../TriangleUpIcon";
import { TriangleDownIcon } from "../TriangleDownIcon";
import { GearIcon } from "../GearIcon";
import { FolderIcon } from "../FolderIcon";
import { EyeIcon } from "../EyeIcon";
import { DragHandleIcon } from "../DragHandleIcon";

const icons = [
  { name: "ChevronLeftIcon", component: <ChevronLeftIcon /> },
  { name: "ChevronRightIcon", component: <ChevronRightIcon /> },
  { name: "TriangleUpIcon", component: <TriangleUpIcon /> },
  { name: "TriangleDownIcon", component: <TriangleDownIcon /> },
  { name: "GearIcon", component: <GearIcon /> },
  { name: "FolderIcon", component: <FolderIcon width="24" height="24" /> },
  { name: "EyeIcon (visible)", component: <EyeIcon isVisible={true} /> },
  { name: "EyeIcon (hidden)", component: <EyeIcon isVisible={false} /> },
  { name: "DragHandleIcon", component: <DragHandleIcon /> }
];

function IconGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: 24,
        padding: 16
      }}
    >
      {icons.map(({ name, component }) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            padding: 16,
            border: "1px solid #e0e0e0",
            borderRadius: 8
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {component}
          </div>
          <span
            style={{
              fontSize: 11,
              textAlign: "center",
              wordBreak: "break-word"
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Components/Icons",
  component: IconGrid
} satisfies Meta<typeof IconGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {};
