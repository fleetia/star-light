# 포크 가이드

이 프로젝트를 포크해서 자신만의 프로젝트를 만들 수 있습니다. 마음껏 가져다 쓰세요!

## 포크 방법

1. GitHub에서 이 저장소를 포크합니다
2. 포크한 저장소를 클론합니다
3. `pnpm install`로 의존성을 설치합니다

## 새 앱 추가하기

`apps/` 디렉토리 아래에 새 프로젝트를 만들 수 있습니다.

1. `apps/` 아래에 새 폴더를 생성합니다
2. `package.json`을 만들고 `name`을 `@star-light/앱이름` 형식으로 지정합니다
3. 필요하다면 공유 패키지를 의존성으로 추가합니다:

```json
{
  "dependencies": {
    "@star-light/components": "workspace:*"
  }
}
```

4. 루트 `package.json`에 개발 스크립트를 추가합니다:

```json
{
  "scripts": {
    "dev:myapp": "pnpm -F @star-light/myapp dev"
  }
}
```

## 공유 패키지 활용

이 모노레포에는 재사용 가능한 패키지가 포함되어 있습니다:

- **@star-light/components**: React 컴포넌트 라이브러리 (Button, Modal, Toggle, ColorPicker 등 30+ 컴포넌트)
- **@star-light/config**: ESLint, Prettier, TypeScript 설정
- **@star-light/test-utils**: 테스트 유틸리티

## 불필요한 앱 제거

사용하지 않는 앱을 제거하려면:

1. `apps/` 아래의 해당 폴더를 삭제합니다
2. 루트 `package.json`에서 관련 스크립트를 제거합니다
3. `.github/workflows/`에서 관련 CI 워크플로우를 제거합니다
4. `pnpm install`을 다시 실행합니다

## 라이선스

**이 프로젝트는 [AGPL-3.0](../LICENSE) 라이선스로 배포됩니다.**

포크한 프로젝트는 반드시 AGPL-3.0 라이선스를 유지해야 합니다. 이는 다음을 의미합니다:

- 포크한 프로젝트의 소스코드를 공개해야 합니다
- 수정한 내용을 동일한 AGPL-3.0 라이선스로 배포해야 합니다
- 네트워크를 통해 서비스를 제공하는 경우에도 소스코드 공개 의무가 적용됩니다

라이선스 전문은 [LICENSE](../LICENSE) 파일을 참고하세요.
