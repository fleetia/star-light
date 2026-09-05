# UI 기여 가이드

KBO Knit의 UI 변경을 어느 저장소에서 구현하고 검증할지 안내합니다. 범용 컴포넌트는 [Lagrange](https://github.com/fleetia/lagrange), 야구·뜨개 기능과 화면 조합은 KBO Knit에서 관리합니다.

## 변경 위치

- 버튼, 입력, Dialog, Tabs, 색상 선택기의 공통 동작과 접근성은 Lagrange에서 수정합니다.
- 경기별 배색, 줄 수 계산, 진행 기록과 앱 배치는 `src/components/`와 관련 hooks·utilities에서 수정합니다.
- 앱 브랜드와 여백 조정은 [KBO 테마 안내](THEME.md)를 참고합니다. 같은 변경을 공통 컴포넌트의 복사본으로 만들지 않습니다.

Lagrange의 API와 개별 컴포넌트 stories·tests는 [컴포넌트 소스](https://github.com/fleetia/lagrange/tree/main/src/components)가 기준입니다. 이 저장소에서는 API 표나 공통 토큰 목록을 따로 유지하지 않습니다.

## 로컬 개발 순서

1. [시작하기](../getting-started.md#설치)에 따라 sibling Lagrange를 빌드하고 KBO Knit에 설치합니다.
2. 필요한 저장소에서 변경하고 해당 동작의 테스트를 실행합니다. Lagrange를 바꾼 경우 빌드와 로컬 패키지 갱신을 반복합니다.
3. `pnpm storybook`에서 KBO 테마를 적용한 실제 조합을 확인합니다. 앱 조합 story는 `src/stories/`에 둡니다.
4. KBO Knit의 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`과 관련 [브라우저 검증](../getting-started.md#브라우저-검증)을 실행합니다.

키보드 조작, 입력 label, 오류 안내와 Dialog의 닫기 후 focus 복귀를 확인합니다. 앱의 숫자 보정이나 날짜 제약은 해당 앱 기능이 계속 소유합니다. 사용자에게 보이는 KBO 문구는 앱에서 전달하며, 공통 UI의 label props는 Lagrange API를 따릅니다.

패키지 발행과 서비스 배포는 로컬 확인 이후의 별도 작업입니다.
