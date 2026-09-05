# 시작하기

KBO Knit 앱과 앱 조합 Storybook을 로컬에서 실행하는 절차입니다. 공통 UI는 형제 저장소의 Lagrange 빌드 결과를 사용합니다.

## 사전 요구사항

- Node.js 24: 저장소의 `.nvmrc`를 따라 `nvm use`로 선택합니다.
- pnpm 11.25.0: KBO Knit의 `package.json`에 지정된 버전입니다. Lagrange에서는 해당 저장소의 `packageManager`를 따릅니다.
- `kbo-knit/`와 같은 부모 디렉토리에 있는 `lagrange/` checkout. 이번 로컬 검토에 필요한 Lagrange 변경이 포함되어 있어야 합니다.

## 설치

KBO Knit의 `@fleetia/lagrange` 의존성은 `file:../lagrange`입니다. Lagrange가 내보내는 `dist/`를 먼저 만들어야 앱과 Storybook에서 import할 수 있습니다.

`kbo-knit/`에서 시작합니다:

```bash
nvm use
cd ../lagrange
pnpm install --frozen-lockfile
pnpm build
cd ../kbo-knit
pnpm install --frozen-lockfile
```

Lagrange 소스를 수정했다면 Lagrange에서 `pnpm build`를 다시 실행하고 KBO Knit에서 `pnpm install --force --frozen-lockfile`로 로컬 패키지 복사본을 갱신하세요. 실행 중인 개발 서버도 다시 시작합니다. `file:` 설치가 sibling 소스의 변경을 자동 반영한다고 가정하지 마세요.

이 설치 방식은 패키지를 registry에 발행하지 않는 로컬 검토용입니다. 형제 저장소가 없는 CI나 배포 환경에는 별도의 의존성 공급 방식이 필요합니다.

## 앱과 Storybook 실행

```bash
pnpm dev
```

Vite 개발 서버가 앱과 `data/*.json`을 제공합니다.

```bash
pnpm storybook
```

`http://localhost:6006`에서 앱 조합을 확인합니다. **KBO Knit / Knitting Controls**는 실제 `RowModeSelector`로 계산 방식 변경과 줄 수 입력을 시험합니다. Lagrange 자체 Storybook도 기본 포트가 6006이므로 동시에 실행할 때는 한쪽 포트를 바꾸세요.

## 빌드와 검사

```bash
pnpm test
pnpm lint
pnpm format:check
pnpm build
pnpm build-storybook
```

앱 빌드는 TypeScript 검사 후 `dist/`를 생성하고 서비스 워커의 precache 목록을 검증합니다. Storybook 결과는 `storybook-static/`에 생성됩니다. `pnpm test:watch`는 앱 테스트의 watch 모드이며, 공통 UI 테스트는 Lagrange 저장소에서 실행합니다.

## 브라우저 검증

Playwright Chromium을 준비하고 앱을 빌드한 뒤 preview 서버를 실행합니다:

```bash
pnpm exec playwright install chromium
pnpm build
pnpm preview --host 127.0.0.1 --port 4173
```

별도 터미널에서 실행 중인 preview를 검증합니다:

```bash
pnpm verify:app http://127.0.0.1:4173
```

색상 선택, 경기 편집, 진행 상황 저장과 서비스 워커 동작을 확인합니다. 스크린샷을 남기려면 두 번째 인자로 디렉토리를 지정하세요:

```bash
pnpm verify:app http://127.0.0.1:4173 /tmp/kbo-knit-screenshots
```

이 절차는 로컬 앱 검증입니다. 계정·클라우드 동기화의 운영 배포 상태를 확인하는 절차는 포함하지 않습니다.
