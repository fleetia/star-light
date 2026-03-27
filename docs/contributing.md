# 개발자 기여 가이드

기여해주셔서 감사합니다! 이 문서는 코드 기여를 위한 가이드입니다.

코드 작성 없이 기여하고 싶다면 [비개발자 기여 가이드](contributing-non-dev.md)를 참고하세요.

## 개발 환경 설정

1. 저장소를 포크하고 클론합니다
2. 의존성을 설치합니다: `pnpm install`
3. 개발 서버를 실행합니다: `pnpm dev`

자세한 실행 방법은 [시작하기](getting-started.md)를 참고하세요.

## 모노레포 구조

```
apps/
  extension/      # Lotuspad Chrome 확장
  kbo-knit/       # KBO Knit 웹앱
packages/
  components/     # 공유 컴포넌트 라이브러리 (@star-light/components)
tools/
  config/         # 공유 설정 (ESLint, Prettier, TypeScript)
utils/
  test/           # 공유 테스트 유틸리티
```

- **apps/**: 독립적으로 배포되는 애플리케이션
- **packages/**: 앱 간 공유되는 라이브러리
- **tools/**: 개발 도구 설정
- **utils/**: 공유 유틸리티

## PR 프로세스

1. `main` 브랜치에서 새 브랜치를 생성합니다
2. 변경사항을 커밋합니다
3. PR을 생성합니다
4. CI 통과를 확인합니다

## 코드 스타일

이 프로젝트는 ESLint와 Prettier로 코드 스타일을 관리합니다. 커밋 시 Husky + lint-staged가 자동으로 린트와 포맷팅을 적용합니다.

수동으로 확인하려면:

```bash
pnpm lint          # 린트 검사
pnpm format:check  # 포맷팅 검사
pnpm format        # 자동 포맷팅
```

## 기술 스택

- **언어**: TypeScript
- **프레임워크**: React 19
- **빌드**: Vite (앱), Rollup (패키지)
- **스타일링**: Vanilla Extract (CSS-in-JS), SCSS (일부)
- **테스트**: Vitest, React Testing Library
- **컴포넌트 문서화**: Storybook

## 패키지 의존성 추가

특정 워크스페이스에 의존성을 추가할 때:

```bash
# 예: extension에 패키지 추가
pnpm -F @star-light/extension add 패키지명

# 개발 의존성
pnpm -F @star-light/extension add -D 패키지명
```

워크스페이스 간 의존성:

```json
{
  "dependencies": {
    "@star-light/components": "workspace:*"
  }
}
```

## 테스트 작성

- 테스트 파일은 `__tests__/` 디렉토리에 위치합니다
- 파일명은 `*.test.ts` 또는 `*.test.tsx` 형식을 사용합니다
- 컴포넌트 테스트는 React Testing Library를 사용합니다

```bash
pnpm test              # 전체 테스트
pnpm test:components   # 컴포넌트만
```

## 커밋 메시지

간결하고 명확하게 작성해주세요. 한국어 또는 영어 모두 괜찮습니다.
