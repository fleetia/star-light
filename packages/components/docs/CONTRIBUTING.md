# Contributing Guide

## 새 컴포넌트 추가

### 폴더 구조

```
packages/components/src/ComponentName/
├── ComponentName.tsx          # 컴포넌트 구현
├── ComponentName.css.ts       # Vanilla Extract 스타일
├── index.ts                   # barrel export
├── __stories__/
│   └── ComponentName.stories.tsx
└── __tests__/
    └── ComponentName.test.tsx
```

### 체크리스트

1. [ ] 컴포넌트 파일 생성 (`ComponentName.tsx`)
2. [ ] Vanilla Extract 스타일 파일 생성 (`ComponentName.css.ts`)
3. [ ] barrel export (`index.ts`)
4. [ ] `src/index.ts`에 export 추가
5. [ ] 유닛 테스트 작성 (Vitest + @testing-library/react)
6. [ ] Storybook 스토리 작성

### 스타일 규칙

- **Vanilla Extract** 사용 (`*.css.ts` 파일)
- `vars`를 `styles/tokens.css.ts`에서 import하여 CSS 변수 참조
- `styleVariants`로 variant(size, color 등) 정의
- 상태 표현은 data attribute 사용 (`data-checked`, `data-disabled` 등)

```typescript
import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const container = style({
  color: vars.color.text,
  background: vars.color.surface
});

export const size = styleVariants({
  sm: { padding: "0.3em" },
  md: { padding: "0.5em" }
});
```

### 접근성 규칙

- 적절한 ARIA 속성 필수 (`aria-label`, `aria-expanded`, `role` 등)
- 키보드 네비게이션 지원 (Tab, Enter, Space, Arrow keys)
- 포커스 관리 (Modal의 포커스 트랩 등)

### i18n 규칙

- 사용자에게 보이는 문자열은 하드코딩하지 않음
- `useTranslation()` 훅의 `t()` 함수 사용
- 번역 키는 `컴포넌트.기능.설명` 형식 (예: `sidebar.general.export`)
- 새 키 추가 시 `packages/components/src/i18n/locales/`의 en, ko, ja 파일 모두 업데이트

### 테스트 규칙

- **Vitest** + **@testing-library/react** (happy-dom 환경)
- 렌더링, props 변형, className 적용 테스트
- callback 호출 확인 (`vi.fn()`)
- `aria-*`, `role` 속성 확인
- Storybook에서 시각적 확인 + Play Interaction 테스트

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component label="Test" />);
    expect(screen.getByText("Test")).toBeDefined();
  });

  it("handles click", () => {
    const onClick = vi.fn();
    render(<Component onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Storybook 규칙

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Component } from "../Component";

const meta: Meta<typeof Component> = {
  title: "Components/ComponentName",
  component: Component,
  args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
```

### 빌드

```bash
pnpm -F @star-light/components build      # 라이브러리 빌드
pnpm -F @star-light/components test:run   # 테스트 실행
pnpm -F @star-light/components storybook  # Storybook 실행
```
