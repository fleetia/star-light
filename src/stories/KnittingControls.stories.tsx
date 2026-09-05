import { useState, type ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { RowModeSelector } from "../components/row-mode-selector/RowModeSelector";
import type { RowMode } from "../types/game.types";

function KnittingControls(): ReactElement {
  const [mode, setMode] = useState<RowMode>("perGame");
  const [count, setCount] = useState(2);
  const [cancelCount, setCancelCount] = useState(0);

  return (
    <div style={{ maxWidth: 420 }}>
      <RowModeSelector
        mode={mode}
        count={count}
        cancelCount={cancelCount}
        onModeChange={setMode}
        onCountChange={setCount}
        onCancelCountChange={setCancelCount}
      />
      <p role="status">
        계산 기준: {mode} · 기본 {count}줄 · 취소 {cancelCount}줄
      </p>
    </div>
  );
}

const meta = {
  title: "KBO Knit/Knitting Controls",
  component: KnittingControls,
  parameters: { layout: "padded" },
  tags: ["autodocs"]
} satisfies Meta<typeof KnittingControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RowSettings: Story = {
  play: async ({ canvas, userEvent }): Promise<void> => {
    await userEvent.selectOptions(
      canvas.getByRole("combobox", { name: "줄 수 계산 방식" }),
      "perScore"
    );
    const countInput = canvas.getByRole("spinbutton", {
      name: "경기 기준 줄 수"
    });
    await userEvent.clear(countInput);
    await userEvent.type(countInput, "3");
    await userEvent.tab();
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "계산 기준: perScore · 기본 3줄 · 취소 0줄"
    );
  }
};
