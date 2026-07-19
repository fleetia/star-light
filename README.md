# KBO Knit

KBO 경기 결과를 뜨개 패턴으로 시각화하고 진행 상황을 기록하는 웹앱입니다.

- [서비스](https://kbo-knit.star-light.space/)
- [앱 소개](apps/kbo-knit/README.md)

## Workspace

- `apps/kbo-knit`: 웹앱과 KBO 데이터 스크래퍼
- `packages/components`: 앱에서 사용하는 UI 컴포넌트
- `tools/config`: 공통 ESLint, Prettier, TypeScript 설정
- `utils/test`: 공통 테스트 유틸리티

## Getting Started

```bash
pnpm install
pnpm dev
```

빌드와 테스트:

```bash
pnpm build
pnpm test
pnpm lint
```

자세한 내용은 [시작하기](docs/getting-started.md)와 [개발자 기여 가이드](docs/kbo-knit/contributing.md)를 참고하세요.

## License

[AGPL-3.0](LICENSE)
