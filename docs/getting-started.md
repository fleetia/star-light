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

`@star-light/components`를 먼저 빌드한 뒤 KBO Knit Vite 개발 서버를 실행합니다.

### 컴포넌트 라이브러리 (Storybook)

```bash
pnpm storybook
```

`http://localhost:6006`에서 Storybook이 실행됩니다.

컴포넌트를 watch 모드로 빌드하려면:

```bash
pnpm dev:components
```

## 빌드

전체 빌드:

```bash
pnpm build
```

개별 빌드:

```bash
pnpm build:kbo         # KBO Knit
pnpm build:components  # 컴포넌트 라이브러리
```

## 테스트

```bash
pnpm test              # 전체 테스트 (단일 실행)
pnpm test:components   # 컴포넌트 테스트 (watch 모드)
```

각 앱 디렉토리에서 개별 실행도 가능합니다:

```bash
cd apps/kbo-knit
pnpm test        # watch 모드
pnpm test:run    # 단일 실행
```

## 린트 & 포맷팅

```bash
pnpm lint            # 전체 린트
pnpm format:check    # 포맷팅 확인
pnpm format          # 자동 포맷팅
```

## 주요 스크립트 목록

| 스크립트              | 설명                |
| --------------------- | ------------------- |
| `pnpm dev`            | KBO Knit 개발 서버  |
| `pnpm dev:components` | 컴포넌트 watch 빌드 |
| `pnpm storybook`      | Storybook 실행      |
| `pnpm build`          | 전체 빌드           |
| `pnpm test`           | 전체 테스트         |
| `pnpm lint`           | 전체 린트           |
| `pnpm format`         | 자동 포맷팅         |
| `pnpm scrape:kbo`     | KBO 데이터 스크래핑 |
