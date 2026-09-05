# KBO Knit

KBO 경기 결과를 뜨개 패턴으로 시각화하고 진행 상황을 기록하는 웹앱입니다.

[서비스 바로가기](https://kbo-knit.star-light.space/)

뜨개질을 좋아하고 야구를 좋아하는 사람으로서, 시즌을 기록하는 방법이 기록 말고 또 있으면 좋겠다고 생각했어요.\
그러던 중 트위터에서 [뜨개일기님](https://x.com/hook_h_)의 [트윗](https://x.com/hook_h_/status/2022222157271662923)을 보고 이 프로젝트를 기획했습니다.

KBO 경기 데이터 크롤링은 [kbo-scraper](https://github.com/colabear754/kbo-scraper.git)를 참고했습니다.

## 이런 걸 할 수 있어요

### 팀을 고르면 색이 정해집니다

10개 구단 중 응원하는 팀을 선택하면 팀 컬러가 자동으로 적용됩니다. 물론 색은
마음대로 바꿀 수 있어요. 홈 경기와 원정 경기 색을 다르게 가져가는 것도 가능합니다.

### 시즌 경기가 목도리 패턴이 됩니다

정규시즌만 넣을 수도 있고, 시범경기나 포스트시즌까지 포함할 수도 있어요. 세로
패턴으로 한 줄씩 확인하거나, 가로 미리보기로 전체 느낌을 볼 수 있습니다.

### 뜨개 진행 상황을 체크할 수 있어요

어디까지 떴는지 체크박스로 기록하면서 진행할 수 있어요. 설정이랑 진행 상황은
브라우저에 자동 저장되니까 매번 다시 설정할 필요 없습니다.

### 줄 수와 뜨는 방식을 맞출 수 있어요

경기 수, 득점, 득점과 실점, 점수 차이를 기준으로 줄 수를 정할 수 있어요.
취소 경기의 줄 수를 따로 정하거나 0으로 설정해 뺄 수도 있습니다.
단수 카운터에서는 한 단씩 진행하고 되돌릴 수 있고, 메리야스뜨기의 겉뜨기·안뜨기도 확인할 수 있어요.

### 경기 결과를 먼저 넣을 수 있어요

자동 수집 전에 경기 결과를 직접 추가해 패턴에 반영할 수 있습니다.
공식 데이터에서 같은 경기 결과를 받으면 직접 추가했던 결과는 정리됩니다.

## Scraper

자동 수집 일정은 KST 오전 3시입니다. 3~8월에는 화요일을 제외하고, 9~10월에는
화요일에도 실행하도록 설정되어 있습니다. 실행 시점의 **현재 월** 경기 일정을 수집해
기존 시즌 데이터와 합칩니다. 전날 경기만 수집하거나 시즌 전체를 다시 받는 방식은 아닙니다.

실행 일정은 [데이터 업데이트 workflow](.github/workflows/kbo-knit-update-data.yml),
수집 범위는 [scrape-kbo.mjs](scrape-kbo.mjs)가 기준입니다.

## Getting Started

Node.js는 `.nvmrc`의 24, pnpm은 `package.json`의 11.25.0을 사용합니다.
공통 UI는 GitHub Packages의 비공개 [Lagrange](https://github.com/fleetia/lagrange) 패키지를 사용합니다.

먼저 [시작하기](docs/getting-started.md#설치)에 따라 패키지 읽기 권한과 로컬 인증을 준비한 뒤 저장소 루트에서 실행하세요:

```bash
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

빌드와 테스트:

```bash
pnpm build
pnpm test
pnpm lint
pnpm build-storybook
```

자세한 환경 설정과 브라우저 검증 방법은 [시작하기](docs/getting-started.md)를 참고하세요.

### 스크래퍼 (수동 실행 시)

```bash
pnpm exec playwright install chromium
pnpm scrape       # 올해 시즌의 현재 월
pnpm scrape 2025  # 2025년의 현재 월
```

## Contributing

기여는 언제나 환영합니다! 이슈를 열거나 PR을 보내주세요.

- [KBO Knit 기여 가이드](docs/kbo-knit/contributing.md) — 개발 환경, 데이터 파이프라인, 배포
- [UI 기여 가이드](docs/ui/CONTRIBUTING.md) — Lagrange 공통 UI와 KBO 화면의 작업 경계
- [비개발자 기여 가이드](docs/contributing-non-dev.md) — 버그 리포트, 기능 제안, 피드백

## License

[AGPL-3.0](LICENSE)
