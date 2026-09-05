# KBO Knit 개발자 기여 가이드

KBO 야구 경기 결과를 니팅 패턴으로 시각화하는 웹앱 KBO Knit에 기여하기 위한 가이드입니다.

## 개발 환경

```bash
pnpm install
pnpm dev      # Vite 개발 서버
```

개발 서버에서는 `data/*.json` 파일을 미들웨어로 서빙합니다 (vite.config.ts에서 설정).

## 프로젝트 구조

```
kbo-knit/
├── src/
│   ├── components/    # KBO 기능 컴포넌트 (TeamSelector, ScarfPreview 등)
│   ├── ui/            # 공통 UI 컴포넌트, 테마, Storybook stories
│   ├── hooks/         # 커스텀 훅 (useAppState, useKboData)
│   ├── utils/         # 유틸리티 (게임 필터링, 행 빌드)
│   ├── types/         # TypeScript 타입 정의
│   ├── constants/     # 팀 데이터, 기본값
│   └── styles/        # Vanilla Extract 스타일
├── data/              # KBO 경기 데이터 (JSON, 스크래퍼가 생성)
├── public/            # 정적 자산과 서비스 워커
├── scripts/           # 빌드 결과와 브라우저 검증
├── .storybook/        # Storybook 설정
├── scrape-kbo.mjs     # Playwright 기반 KBO 데이터 스크래퍼
└── vite.config.ts     # Vite 설정 (데이터 파이프라인 포함)
```

## 데이터 파이프라인

`data/` 디렉토리의 JSON 파일은 스크래퍼가 자동 생성합니다.

```bash
pnpm scrape    # Playwright로 KBO 사이트에서 데이터 스크래핑
```

- 스크래핑에는 Playwright Chromium이 필요합니다
- 시즌 중(3~10월) GitHub Actions가 자동으로 스크래핑하고 커밋합니다
- `data/` 파일을 수동으로 수정하지 마세요 — 다음 스크래핑에서 덮어씌워집니다

## TypeScript

KBO Knit은 다음 TypeScript 설정을 사용합니다:

- `noUnusedLocals`, `noUnusedParameters` 활성화
- 앱과 UI 코드(`tsconfig.app.json`), Vite 설정(`tsconfig.node.json`)이 분리되어 있습니다
- 빌드 시 `tsc -b`가 먼저 실행된 후 Vite 빌드가 이어집니다

## 스타일링

- Vanilla Extract 사용 (`src/ui`의 테마 토큰 활용)

## 테스트

```bash
pnpm test
```

KBO Knit의 hooks, utilities와 UI 컴포넌트는 단일 Vitest 설정으로 테스트합니다. `pnpm test:watch`로 watch 모드를 실행할 수 있습니다.

앱의 주요 상호작용과 저장 상태, 서비스 워커는 [브라우저 검증](../getting-started.md#브라우저-검증)으로 확인합니다. UI 개발은 [컴포넌트 기여 가이드](../ui/CONTRIBUTING.md)를 참고하세요.

## PR 체크

PR에서 앱 코드, 테스트, Storybook 또는 빌드 설정이 변경되면 다음이 자동 실행됩니다:

- ESLint
- Vitest 테스트
- TypeScript 타입 체크와 앱 빌드
- Storybook 빌드

포맷 검사는 별도 Lint & Format 워크플로우에서 실행됩니다.

## 배포

- **main 브랜치에 머지되면 자동 배포됩니다** (AWS S3 + CloudFront)
- 데이터 파일 변경(`data/**`)은 배포를 트리거하지 않습니다
- 데이터 업데이트는 별도 워크플로우로 S3에 직접 동기화됩니다

PR 머지 전에 빌드가 정상적으로 되는지 확인해주세요:

```bash
pnpm build
```

## 주의사항

- `data/` 파일을 직접 수정하지 마세요
- 스크래퍼(`scrape-kbo.mjs`) 수정 시 실제 스크래핑 테스트를 해주세요
- 빌드 시 서비스 워커 버전이 자동 주입됩니다 (vite.config.ts의 `injectSwVersion` 플러그인)
