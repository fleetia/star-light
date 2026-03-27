# AI 기여 가이드

이 문서는 AI 코딩 도구(GitHub Copilot, Cursor, Claude 등)가 이 프로젝트에 코드를 기여할 때 참고하는 가이드입니다.

## 프로젝트 구조

pnpm 워크스페이스 모노레포입니다.

```
apps/
  extension/          # Lotuspad - Chrome 새 탭 확장 프로그램
  kbo-knit/           # KBO Knit - 야구 니팅 패턴 웹앱
packages/
  components/         # @star-light/components - 공유 컴포넌트 라이브러리
tools/
  config/             # @star-light/config - ESLint, Prettier, TypeScript 설정
utils/
  test/               # @star-light/test-utils - 테스트 유틸리티
```

## 기술 스택

- TypeScript, React 19, Vite (앱), Rollup (패키지)
- 스타일링: Vanilla Extract (CSS-in-JS). 컴포넌트 라이브러리와 kbo-knit에서 사용
- extension 앱은 SCSS도 병행 사용
- 테스트: Vitest + React Testing Library
- 컴포넌트 문서화: Storybook

## 컴포넌트 작성 패턴

`packages/components/src/` 아래의 컴포넌트는 이 구조를 따릅니다:

```
ComponentName/
├── ComponentName.tsx           # 컴포넌트 구현
├── ComponentName.css.ts        # Vanilla Extract 스타일
├── index.ts                    # export { ComponentName, type ComponentNameProps }
├── __tests__/
│   └── ComponentName.test.tsx  # Vitest 테스트
└── __stories__/
    ├── ComponentName.stories.tsx  # Storybook 스토리
    └── ComponentName.mdx          # Storybook 문서 (선택)
```

새 컴포넌트를 추가하면 반드시:

1. `packages/components/src/index.ts`에 export를 추가합니다
2. `packages/components/package.json`의 `exports` 필드에 엔트리를 추가합니다

## 스타일링

Vanilla Extract를 사용합니다. 테마 토큰은 `packages/components/src/styles/tokens.css.ts`에 정의되어 있습니다.

```typescript
import { vars } from "../styles/tokens.css";

// 스타일에서 사용
export const myStyle = style({
  color: vars.color.accent,
  fontSize: vars.em
});
```

CSS 변수를 직접 작성하지 말고 `vars`를 통해 참조하세요.

## 경로 별칭

extension 앱에서는 `@/` 별칭을 사용합니다:

```typescript
import { storage } from "@/utils/storage";
import { useStorageState } from "@/hooks/useStorageState";
```

components 패키지에서는 상대 경로를 사용합니다.

## 스토리지 (extension)

`apps/extension/src/utils/storage.ts`가 개발/프로덕션 환경을 추상화합니다:

- **개발**: `localStorage` 사용
- **프로덕션**: `chrome.storage.sync` / `chrome.storage.local` 사용

스토리지에 접근할 때는 `chrome.storage`를 직접 호출하지 말고 `storage` 유틸리티 또는 `useStorageState` 훅을 사용하세요.

## 다국어 (i18n)

`packages/components/src/i18n/`에서 관리합니다. 지원 언어: 한국어, 영어, 일본어.

```typescript
import { useTranslation } from "@star-light/components";

const { t } = useTranslation();
t("someKey"); // TranslationKey 타입으로 타입 안전
```

새 번역 키를 추가하면 `types.ts`의 `TranslationKey` 유니온과 모든 로케일 파일(`locales/en.ts`, `ko.ts`, `ja.ts`)에 추가해야 합니다.

## 테스트

```bash
pnpm test              # 전체 테스트
pnpm test:components   # 컴포넌트만
```

- 컴포넌트 테스트: `__tests__/` 디렉토리, `*.test.tsx`
- 유틸리티 테스트: 같은 패턴
- React Testing Library를 사용하고, DOM 쿼리는 접근성 기반(`getByRole`, `getByText` 등)을 우선합니다

## 린트 & 포맷팅

커밋 시 Husky + lint-staged가 자동 실행됩니다. 수동으로:

```bash
pnpm lint
pnpm format
```

## 앱별 차이점

### Lotuspad (apps/extension/)

- 테스트 필수 — Vitest + React Testing Library, Chrome API 모킹 (`test/setup.ts`)
- 스타일링: SCSS + Vanilla Extract 병행
- 경로 별칭 `@/` 사용 (예: `@/utils/storage`)
- 자동 배포 없음 — Chrome Web Store 수동 업로드
- 설정 모달에서 저장 전까지 실제 컴포넌트에 CSS 변수를 적용하지 마세요

### KBO Knit (apps/kbo-knit/)

- 유닛 테스트 없음 (추가 환영)
- 스타일링: Vanilla Extract만 사용
- TypeScript 더 엄격 — `noUnusedLocals`, `noUnusedParameters` 활성화
- tsconfig이 앱(`tsconfig.app.json`)과 스크립트(`tsconfig.node.json`)로 분리
- `data/` 디렉토리는 스크래퍼가 자동 생성 — 직접 수정 금지
- main 머지 시 AWS S3 + CloudFront 자동 배포

## 주의사항

- 새 앱이나 패키지를 만들 때는 기존 앱(extension, kbo-knit)의 설정 패턴을 먼저 확인하고 따르세요
- 앱별 기여 가이드: [Lotuspad](lotuspad/contributing.md), [KBO Knit](kbo-knit/contributing.md)

## 라이선스

이 프로젝트는 AGPL-3.0입니다. 포크 한 코드도 동일 라이선스가 적용됩니다.
