# Lotuspad 개발자 기여 가이드

Chrome 새 탭 확장 프로그램 Lotuspad에 기여하기 위한 가이드입니다.

## 개발 환경

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

개발 환경에서는 `chrome.storage` 대신 `localStorage`를 사용하므로 Chrome에 로드하지 않아도 개발할 수 있습니다.

### Chrome에서 확인하기

```bash
pnpm build:lotuspad
```

1. `chrome://extensions` → 개발자 모드 활성화
2. 압축해제된 확장 프로그램을 로드합니다 → `apps/extension/dist/` 선택
3. 새 탭 열기

## 프로젝트 구조

```
apps/extension/
├── src/
│   ├── background/    # 서비스 워커
│   ├── newtab/        # 새 탭 UI (메인 앱)
│   ├── hooks/         # 커스텀 훅 (useStorageState, useLocale 등)
│   ├── utils/         # 유틸리티 (storage, bookmarks, export/import 등)
│   └── styles/        # SCSS 스타일시트
├── manifest.json      # Chrome 확장 매니페스트 (Manifest V3)
└── vite.config.ts     # Vite 설정 (멀티 엔트리: newtab + background)
```

## 스토리지

`chrome.storage`를 직접 호출하지 마세요. 반드시 다음을 사용합니다:

- **`@/utils/storage`**: sync/local 스토리지 추상화 (개발 시 localStorage 폴백)
- **`useStorageState` 훅**: React 상태와 스토리지를 동기화

## 스타일링

- SCSS와 Vanilla Extract를 병행합니다
- 공유 컴포넌트는 Vanilla Extract (`@star-light/components`)
- 앱 고유 스타일은 SCSS

## 테스트

```bash
pnpm -F @star-light/extension test       # watch 모드
pnpm -F @star-light/extension test:run   # 단일 실행
```

- Vitest + React Testing Library 사용
- 테스트 환경: jsdom
- Chrome API는 `test/setup.ts`에서 모킹됩니다
- 새로운 훅이나 유틸리티를 추가하면 테스트도 함께 작성해주세요

## PR 체크

- ESLint + Prettier (루트 lint 워크플로우)
- 자동 배포 없음 — Chrome Web Store에는 수동 업로드

## 주의사항

- 설정 모달에서 저장 전까지 실제 컴포넌트에 CSS 변수를 적용하지 마세요
- `manifest.json` 수정 시 권한(permissions) 변경에 주의하세요
