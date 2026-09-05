# KBO Knit 개발자 기여 가이드

KBO 경기 결과를 뜨개 패턴으로 변환하는 앱의 개발 경계와 검증 방법을 설명합니다. 설치와 패키지 인증은 [시작하기](../getting-started.md)를 먼저 참고하세요.

## 코드와 UI의 경계

KBO Knit은 경기·팀 선택, 줄 수 계산, 패턴 표시, 진행 기록과 화면 조합을 소유합니다. 범용 입력, 버튼, Dialog, Tabs와 색상 선택기는 `@fleetia/lagrange`에서 가져옵니다. 공통 컴포넌트를 바꿔야 한다면 [UI 기여 가이드](../ui/CONTRIBUTING.md)에 따라 Lagrange에서 수정합니다.

| 위치                               | 역할                                        |
| ---------------------------------- | ------------------------------------------- |
| `src/components/`                  | KBO 기능 컴포넌트와 앱 조합                 |
| `src/hooks/`, `src/utils/`         | 앱 상태와 게임·패턴 계산                    |
| `src/types/`, `src/constants/`     | 게임 타입, 팀 데이터와 기본값               |
| `src/styles/`                      | 앱 스타일과 Lagrange 소비 테마              |
| `src/stories/`, `.storybook/`      | 앱 조합 stories와 Storybook 설정            |
| `data/`                            | 스크래퍼가 생성하는 시즌별 JSON             |
| `public/`, `scripts/`              | 정적 자산, 서비스 워커와 빌드·브라우저 검증 |
| `scrape-kbo.mjs`, `vite.config.ts` | 경기 수집과 개발·빌드 데이터 처리           |

## 데이터 파이프라인

Playwright Chromium을 준비한 뒤 저장소 루트에서 실행합니다:

```bash
pnpm scrape       # 올해 시즌의 현재 월
pnpm scrape 2025  # 2025년의 현재 월
```

스크래퍼는 실행 시점의 월에 해당하는 일정을 받아 기존 `data/<연도>.json`과 합칩니다. 연도 인자를 주어도 그 시즌의 모든 월을 순회하지 않습니다. 자동 실행 일정은 [README의 Scraper 설명](../../README.md#scraper)과 [workflow](../../.github/workflows/kbo-knit-update-data.yml)를 참고하세요.

`data/`를 직접 고치면 이후 수집 결과로 덮어써질 수 있습니다. 파싱 문제는 `scrape-kbo.mjs` 또는 관련 유틸리티에서 수정하고, 영향을 받는 실제 경기 데이터로 확인합니다. 사용자가 자동 수집 전에 결과를 추가하는 기능은 `GameEditor`가 담당합니다.

## 스타일과 테스트

앱 스타일은 Vanilla Extract로 작성합니다. 공통 UI에 적용할 테마는 `src/styles/lagrange.css.ts`, 앱 자체 토큰은 `src/styles/theme.css.ts`가 기준입니다. [테마 안내](../ui/THEME.md)에 적용 위치를 정리했습니다.

```bash
pnpm test
pnpm lint
pnpm format:check
pnpm build
pnpm build-storybook
```

`pnpm build`는 `tsc -b`를 먼저 실행하고 앱과 서비스 워커를 검증합니다. 앱 상호작용과 저장 상태는 [브라우저 검증](../getting-started.md#브라우저-검증)으로 확인합니다. Lagrange를 수정한 경우 해당 저장소의 검증도 함께 수행합니다.

## CI와 배포 범위

저장소의 CI workflow에는 lint, 테스트, 앱 빌드와 Storybook 빌드가 있습니다. 배포 workflow는 main의 대상 파일 변경 시 S3와 CloudFront를 갱신하도록 설정되어 있고, `data/**`만 바뀐 경우에는 별도 데이터 workflow가 동기화를 담당합니다.

모든 설치 workflow는 GitHub Packages의 Lagrange를 `GITHUB_TOKEN`으로 받습니다. 패키지 접근 설정과 외부 fork PR의 제한은 [GitHub Actions 인증](../getting-started.md#github-actions-인증)을 참고하세요. 계정·클라우드 동기화 작업의 배포 여부는 이 UI 이행 범위에서 확정하지 않습니다.
