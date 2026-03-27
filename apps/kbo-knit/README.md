# KBO Knit

사이트 >> [https://kbo-knit.star-light.space/](https://kbo-knit.star-light.space/)

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

### 데이터는 매일 자동 업데이트됩니다

시즌 중에는 매일 아침, 전날 경기 결과가 자동으로 반영됩니다. 직접 뭔가 할 필요
없어요.

## Scraper

GitHub Actions로 시즌 중(3~10월) 매일 KST 오전 9시에 전날 경기 결과를 자동 크롤링합니다.

## Tech Stack

| 영역     | 스택                                      |
| -------- | ----------------------------------------- |
| Frontend | React, TypeScript, Vite, vanilla-extract  |
| Scraper  | Playwright                                |
| Data     | GitHub Actions (시즌 중 매일 자동 크롤링) |

## Getting Started

모노레포 루트에서:

```bash
pnpm install
pnpm dev:kbo
```

자세한 환경 설정은 [시작하기](../../docs/getting-started.md)를 참고하세요.

### 스크래퍼 (수동 실행 시)

```bash
npx playwright install chromium
node scrape-kbo.mjs          # 올해 시즌
node scrape-kbo.mjs 2025     # 특정 연도
```

## Contributing

기여는 언제나 환영합니다! 이슈를 열거나 PR을 보내주세요.

- [KBO Knit 기여 가이드](../../docs/kbo-knit/contributing.md) — 개발 환경, 데이터 파이프라인, 배포
- [비개발자 기여 가이드](../../docs/contributing-non-dev.md) — 버그 리포트, 기능 제안, 피드백

## License

[AGPL-3.0](../../LICENSE)
