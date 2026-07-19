# Design Guide

## 컴포넌트 목록

### 레이아웃

- **Box** - 제목 포함 가능한 그룹 컨테이너. `aria-labelledby` 자동 연결
- **Modal** - 오버레이 다이얼로그. `aria-modal`, 포커스 트랩, Escape 닫기, sm/md/lg 크기

### 네비게이션

- **Tabs** - 탭 네비게이션. primary(수평)/secondary(수직) variant, 키보드(Arrow) 탐색

### 입력

- **Button** - 기본 버튼. variant(primary, secondary, ghost, danger), size(sm, md)
- **TextInput** - 텍스트 입력. label, placeholder, error 지원. `aria-invalid`, `aria-describedby`
- **DateInput** - 날짜 입력. 네이티브 date picker와 표시 형식 분리
- **Select** - label과 option을 지원하는 선택 입력
- **RadioGroup** - 단일 선택 그룹. label, disabled 지원
- **Toggle** - 스위치 토글. `role="switch"`, `aria-checked`
- **ColorPicker** - HSL 색상환 기반 컬러 피커. alpha 지원, hex/rgba/hsla 포맷
- **ColorRow** - 라벨 + ColorPicker 조합

## i18n (국제화)

3개 언어를 지원합니다: 영어(en), 한국어(ko), 일본어(ja).

```tsx
import { I18nProvider, useTranslation } from "@star-light/components";

// 앱 루트에서 Provider로 감싸기
<I18nProvider locale="ko">
  <App />
</I18nProvider>;

// 컴포넌트 내부에서 사용
function MyComponent() {
  const { t, locale } = useTranslation();
  return <span>{t("modal.close")}</span>;
}
```

- 번역 키는 `packages/components/src/i18n/locales/` 디렉토리에서 관리
- 외부 라이브러리 없이 React Context 기반 경량 구현
- `localeMap` 객체로 런타임에 전체 번역 데이터 접근 가능

## 디자인 원칙

1. **CSS Custom Properties 기반** - 모든 색상/크기는 CSS 변수로 정의 (`--c-*`, `--em` 등)
2. **Vanilla Extract** - 타입 세이프 CSS-in-TS (`*.css.ts`)
3. **접근성 우선** - 모든 컴포넌트에 적절한 ARIA 속성, 키보드 네비게이션 포함
4. **최소 의존성** - peer dependency는 react/react-dom만
