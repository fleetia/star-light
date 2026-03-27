# 시작하기

## 사전 요구사항

- [Node.js](https://nodejs.org/) 24+
- [pnpm](https://pnpm.io/) 10.32+

## 설치

```bash
pnpm install
```

## 개발 서버 실행

### Lotuspad (Chrome 확장)

```bash
pnpm dev
# 또는
pnpm dev:lotuspad
```

`http://localhost:5173`에서 실행됩니다. 개발 환경에서는 `chrome.storage` 대신 `localStorage`를 사용합니다.

### KBO Knit

```bash
pnpm dev:kbo
```

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
pnpm build:lotuspad    # Chrome 확장
pnpm build:kbo         # KBO Knit
pnpm build:components  # 컴포넌트 라이브러리
```

Lotuspad 빌드 결과물은 `apps/extension/dist/` 폴더에 생성됩니다.

## Chrome에 확장 프로그램 로드

1. `chrome://extensions` → **개발자 모드** 활성화
2. **압축해제된 확장 프로그램을 로드합니다** → `apps/extension/dist/` 폴더 선택
3. 새 탭 열기

## 테스트

```bash
pnpm test              # 전체 테스트 (단일 실행)
pnpm test:components   # 컴포넌트 테스트 (watch 모드)
```

각 앱 디렉토리에서 개별 실행도 가능합니다:

```bash
cd apps/extension
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
| `pnpm dev`            | Lotuspad 개발 서버  |
| `pnpm dev:kbo`        | KBO Knit 개발 서버  |
| `pnpm dev:components` | 컴포넌트 watch 빌드 |
| `pnpm storybook`      | Storybook 실행      |
| `pnpm build`          | 전체 빌드           |
| `pnpm test`           | 전체 테스트         |
| `pnpm lint`           | 전체 린트           |
| `pnpm format`         | 자동 포맷팅         |
| `pnpm scrape:kbo`     | KBO 데이터 스크래핑 |
