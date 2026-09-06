# KBO Knit 테마 안내

이 문서는 앱이 Lagrange 테마를 적용하는 위치와 앱 스타일의 경계를 설명합니다. 토큰 구조와 API는 [Lagrange theming 문서](https://github.com/fleetia/lagrange/blob/main/docs/theming.md)가 기준입니다.

## 적용 위치

`src/styles/lagrange.css.ts`는 `@fleetia/lagrange/theme`의 `createThemeTokens`와 `themeVars`를 사용해 KBO 브랜드의 `kboTheme` 클래스를 만듭니다. `src/main.tsx`에서 Lagrange stylesheet를 한 번 불러오고 `ThemeRoot`의 `themeClassName`으로 이 클래스를 적용합니다.

`.storybook/preview.tsx`도 같은 theme과 reset·글꼴을 적용합니다. Storybook에서만 별도 기본 테마를 사용하면 앱과 다른 결과를 보게 되므로 두 entry의 구성을 함께 확인하세요.

## 변경할 파일

- 공통 UI의 KBO 색상·글꼴·입력 크기: `src/styles/lagrange.css.ts`
- 앱 자체 토큰: `src/styles/theme.css.ts`
- 앱 배치와 기능별 표시: 해당 컴포넌트의 `*.css.ts`
- 브라우저 reset과 글꼴 선언: `src/reset.css`, `src/index.css`

팀별 승패·홈·원정 배색은 사용자 설정과 패턴 데이터입니다. 이 값을 UI 브랜드 테마로 바꾸지 않습니다. Lagrange 토큰 자체의 의미나 공통 기본값을 바꿔야 한다면 Lagrange에서 수정하고 소비 앱을 다시 확인합니다.

테마 변경 후에는 앱과 KBO Storybook을 모두 확인합니다. Dialog, 색상 선택기와 입력의 focus·오류·disabled 상태도 같은 테마에서 읽을 수 있어야 합니다.
