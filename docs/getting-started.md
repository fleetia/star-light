# 시작하기

KBO Knit 앱과 앱 조합 Storybook을 로컬에서 실행하는 절차입니다. 공통 UI는 GitHub Packages에 발행된 `@fleetia/lagrange`를 사용합니다.

## 사전 요구사항

- Node.js 24: 저장소의 `.nvmrc`를 따라 `nvm use`로 선택합니다.
- pnpm 11.25.0: KBO Knit의 `package.json`에 지정된 버전입니다.
- 비공개 `@fleetia/lagrange` 패키지 읽기 권한이 있는 GitHub 계정과 `read:packages` 권한의 personal access token (classic).

## 설치

저장소의 `.npmrc`는 `@fleetia` 패키지를 `https://npm.pkg.github.com`에서 받도록 설정합니다. 인증은 사용자 설정에 둡니다. pnpm 11은 저장소에 포함된 registry credential을 신뢰하지 않습니다.

토큰을 `NODE_AUTH_TOKEN` 환경 변수로 준비한 뒤 아래 명령으로 사용자 설정에 **환경 변수 참조**를 저장합니다. 작은따옴표를 유지하면 실제 토큰 대신 `${NODE_AUTH_TOKEN}` 문자열이 기록됩니다. 이후 `pnpm` 명령을 실행하는 터미널에서도 이 환경 변수가 설정되어 있어야 합니다.

```bash
pnpm config set --location=user '//npm.pkg.github.com/:_authToken' '${NODE_AUTH_TOKEN}'
```

실제 토큰과 사용자 `.npmrc`는 저장소에 넣지 않습니다. 토큰 발급과 패키지 사용에 관한 기준은 [Lagrange 설치 안내](https://github.com/fleetia/lagrange#설치)를 참고하세요.

KBO Knit 저장소 루트에서 실행합니다:

```bash
nvm use
pnpm install --frozen-lockfile
```

설치는 lockfile에 고정된 registry 패키지를 가져옵니다. `401` 또는 `403`으로 실패하면 환경 변수, 토큰의 `read:packages` 권한과 계정의 패키지 읽기 권한을 확인하세요. Lagrange를 변경할 때는 해당 저장소에서 검증·발행한 뒤 KBO Knit의 의존성 버전과 lockfile을 함께 갱신합니다.

### GitHub Actions 인증

모든 설치 workflow는 `actions/setup-node`의 registry 설정과 작업 단위 `NODE_AUTH_TOKEN`을 사용합니다. 토큰은 `packages: read` 권한의 `GITHUB_TOKEN`이며, Lagrange 패키지의 **Manage Actions access**에 `fleetia/kbo-knit`의 Read 접근이 등록되어 있어야 합니다. CI용 PAT는 필요하지 않습니다.

외부 fork의 PR에서는 토큰과 비공개 패키지 접근이 제한되어 설치 단계가 실패할 수 있습니다. 원본 저장소의 Actions 접근 등록만으로 모든 fork 실행의 설치 성공을 보장하지 않습니다. 이 경우 권한이 있는 로컬 환경에서 검증하고, 관리자가 변경을 검토한 후 원본 저장소의 브랜치에서 CI를 실행합니다. 비공개 패키지 접근을 위해 fork 코드에 토큰을 제공하거나 `pull_request_target`으로 실행하지 않습니다.

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
