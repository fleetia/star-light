# 시작하기

## 사전 요구사항

- [Node.js](https://nodejs.org/) 24+
- [pnpm](https://pnpm.io/) 10.32+

## 설치

```bash
pnpm install
```

## 개발 서버 실행

```bash
pnpm dev
```

KBO Knit Vite 개발 서버를 실행합니다. `src/ui`의 컴포넌트도 앱과 함께 처리됩니다.

### UI 컴포넌트 (Storybook)

```bash
pnpm storybook
```

`http://localhost:6006`에서 Storybook이 실행됩니다.

## 빌드

```bash
pnpm build
pnpm build-storybook
```

앱 빌드는 TypeScript 검사 후 `dist/`를 생성하고 서비스 워커의 precache 목록을 검증합니다. Storybook 빌드 결과는 `storybook-static/`에 생성됩니다.

## 테스트

```bash
pnpm test        # 앱과 UI 전체 테스트 (단일 실행)
pnpm test:watch  # watch 모드
```

## 브라우저 검증

Playwright Chromium을 준비하고 앱을 빌드한 뒤 preview 서버를 실행합니다:

```bash
pnpm exec playwright install chromium
pnpm build
pnpm preview --host 127.0.0.1 --port 4173
```

preview 서버를 켜 둔 상태에서 별도 터미널로 실행합니다:

```bash
pnpm verify:app http://127.0.0.1:4173
```

색상 선택, 경기 편집, 진행 상황 저장과 서비스 워커 동작을 확인합니다. 스크린샷이 필요하면 두 번째 인자로 저장 디렉토리를 지정합니다:

```bash
pnpm verify:app http://127.0.0.1:4173 /tmp/kbo-knit-screenshots
```

## 린트 & 포맷팅

```bash
pnpm lint            # 전체 린트
pnpm format:check    # 포맷팅 확인
pnpm format          # 자동 포맷팅
```

## 주요 스크립트 목록

| 스크립트               | 설명                         |
| ---------------------- | ---------------------------- |
| `pnpm dev`             | KBO Knit 개발 서버           |
| `pnpm storybook`       | Storybook 실행               |
| `pnpm build`           | 앱 빌드와 서비스 워커 검증   |
| `pnpm build-storybook` | Storybook 정적 빌드          |
| `pnpm test`            | 앱과 UI 전체 테스트          |
| `pnpm test:watch`      | 테스트 watch 모드            |
| `pnpm verify:app`      | 실행 중인 앱의 브라우저 검증 |
| `pnpm lint`            | 전체 린트                    |
| `pnpm format`          | 자동 포맷팅                  |
| `pnpm scrape`          | KBO 데이터 스크래핑          |
