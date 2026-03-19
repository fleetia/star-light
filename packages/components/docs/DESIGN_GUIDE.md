# Design Guide

## 컴포넌트 목록

### 레이아웃

- **Box** - 제목 포함 가능한 그룹 컨테이너. `aria-labelledby` 자동 연결
- **Sidebar** - 화면 측면에 고정되는 패널. `position` prop으로 좌/우 배치, ref 전달 지원
- **CollapsibleSection** - 접을 수 있는 섹션. `aria-expanded`, `aria-controls` 지원, 키보드(Enter/Space) 토글
- **Modal** - 오버레이 다이얼로그. `aria-modal`, 포커스 트랩, Escape 닫기, sm/md/lg 크기
- **ConfirmDialog** - 확인/취소 알림 다이얼로그. Escape 닫기 지원

### 네비게이션

- **Breadcrumb** - 경로 탐색 UI. `items` 배열, `aria-current="page"` 자동 적용
- **NavigationButton** - 좌/우 방향 네비게이션 버튼
- **CardPagination** - 카드 내 페이지네이션 (상/하 화살표 + 인디케이터)
- **Tabs** - 탭 네비게이션. primary(수평)/secondary(수직) variant, 키보드(Arrow) 탐색

### 입력

- **Button** - 기본 버튼. variant(primary, secondary, ghost, danger), size(sm, md)
- **TextInput** - 텍스트 입력. label, placeholder, error 지원. `aria-invalid`, `aria-describedby`
- **Checkbox** - 체크박스. label, disabled 지원. `aria-checked`
- **Toggle** - 스위치 토글. `role="switch"`, `aria-checked`
- **ColorPicker** - HSL 색상환 기반 컬러 피커. alpha 지원, hex/rgba/hsla 포맷
- **ColorRow** - 라벨 + ColorPicker 조합
- **RangeInput** - 라벨 + range slider 조합. 완전한 `aria-*` 속성
- **PositionGrid** - 3x3 그리드 위치 선택기. 마진(top/bottom/left/right) 컨트롤 포함

### 인터랙션

- **ContextMenu** - 우클릭 메뉴. `danger` variant, 키보드(Arrow/Home/End/Escape) 탐색
- **IconButton** - 아이콘 + 텍스트 버튼. normal/folder/empty 타입
- **Tree** - 계층 트리. 드래그 정렬, 가시성 토글, 키보드(Arrow/Home/End) 탐색

### 표시

- **Badge** - 상태 표시 배지. active/inactive/default variant, `role="status"`

### 아이콘

모든 아이콘은 `width`, `height`, `className` 및 SVG props를 받으며, `stroke="currentColor"`로 테마 색상 자동 적용:

- ChevronLeftIcon, ChevronRightIcon
- TriangleUpIcon, TriangleDownIcon
- GearIcon, FolderIcon
- EyeIcon (`isVisible` prop으로 상태 전환)
- DragHandleIcon

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
  return <span>{t("sidebar.tab.general")}</span>;
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
