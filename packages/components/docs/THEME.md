# Theme Reference

## CSS Custom Properties

모든 컴포넌트는 아래 CSS 변수를 사용합니다. Vanilla Extract의 `createGlobalThemeContract`로 정의되며, `:root`에 기본값이 설정됩니다.

### 색상

| 변수              | 기본값    | 용도             |
| ----------------- | --------- | ---------------- |
| `--c-accent`      | `#000000` | 강조색           |
| `--c-accent-text` | `#ffffff` | 강조색 위 텍스트 |
| `--c-surface`     | `#ffffff` | 배경색           |
| `--c-text`        | `#000000` | 기본 텍스트      |
| `--c-border`      | `#000000` | 테두리           |
| `--c-hover-bg`    | `#000000` | 호버 배경        |
| `--c-hover-text`  | `#ffffff` | 호버 텍스트      |
| `--c-muted`       | `#999999` | 보조 텍스트      |

### 크기

| 변수          | 기본값 | 용도        |
| ------------- | ------ | ----------- |
| `--em`        | `16px` | 기본 단위   |
| `--icon-size` | `32px` | 아이콘 크기 |
| `--gap`       | `1em`  | 기본 간격   |

## ColorTheme 타입

```typescript
type ColorTheme = {
  accent: string;
  accentText: string;
  surface: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  muted: string;
};
```

## 프리셋

### lightTheme (기본)

```typescript
{
  accent: "#000000",
  accentText: "#ffffff",
  surface: "#ffffff",
  text: "#000000",
  border: "#000000",
  hoverBg: "#000000",
  hoverText: "#ffffff",
  muted: "#999999",
}
```

### darkTheme

```typescript
{
  accent: "#ffffff",
  accentText: "#000000",
  surface: "#1a1a1a",
  text: "#ffffff",
  border: "#333333",
  hoverBg: "#ffffff",
  hoverText: "#000000",
  muted: "#888888",
}
```

## 스타일 시스템

Vanilla Extract를 사용하여 타입 세이프 CSS-in-TS로 작성합니다.

```typescript
// tokens.css.ts에서 vars 임포트
import { vars } from "../styles/tokens.css";

// 컴포넌트 스타일에서 사용
export const container = style({
  color: vars.color.text,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`
});
```

## 유틸리티

```typescript
import { setCSSVariable, setCSSVariables } from "@star-light/components";

// 단일 변수 설정
setCSSVariable("--c-accent", "#ff0000");

// 여러 변수 일괄 설정
setCSSVariables({
  "--c-accent": "#ff0000",
  "--c-surface": "#1a1a1a"
});
```

## 색상 유틸리티

```typescript
import {
  parseColor,
  formatColor,
  hslToRgb,
  rgbToHsl,
  rgbToHex,
  hexToRgb
} from "@star-light/components";

// 문자열 → HSLA 객체
const hsla = parseColor("#ff0000");

// HSLA → 원하는 포맷 문자열
const hex = formatColor(hsla, "hex"); // "#ff0000"
const rgba = formatColor(hsla, "rgba"); // "rgba(255, 0, 0, 1)"
const hslaStr = formatColor(hsla, "hsla"); // "hsla(0, 100%, 50%, 1)"
```
