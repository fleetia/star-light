# KBO Knit UI 설계 안내

KBO Knit은 Lagrange의 범용 UI를 조합해 경기 결과와 뜨개 진행 정보를 보여줍니다. 컴포넌트 사양은 [Lagrange README](https://github.com/fleetia/lagrange#readme)와 [소스·stories](https://github.com/fleetia/lagrange/tree/main/src/components)를 참고하세요.

## 앱에서 결정하는 것

팀·시즌·시리즈 선택, 홈·원정 배색, 경기별 줄 수와 체크 시점은 앱 기능입니다. 이 데이터와 상태 전환은 KBO Knit에 두고, 입력·선택·Dialog 등 기본 상호작용은 Lagrange에 맡깁니다. 그룹 이름은 FieldGroup의 legend 또는 연결된 제목으로 전달하고, 개별 입력에도 구별할 수 있는 label을 둡니다.

가로 미리보기와 설정 영역의 테두리·밝은 배경은 `src/styles/frame.css.ts`에서 적용합니다. 탭 본문의 사각 프레임과 연결된 활성 탭은 `src/App.css.ts`에서 관리하며, FieldGroup의 제목은 프레임 안에 배치합니다.

패턴, 뜨개 가이드와 단수 카운터는 같은 경기 데이터를 서로 다른 작업에 맞게 보여줍니다. 탭을 바꿀 때의 상태 수명과 계산 시점은 앱이 결정해야 하므로, 공통 Tabs로 바꾸면서 모든 패널을 무조건 mount하지 않습니다.

날짜는 native date input을 사용합니다. 표시는 브라우저와 locale에 따라 달라질 수 있고, 저장값은 날짜 문자열로 다룹니다. 숫자 입력은 native number 동작과 앱의 blur 보정 규칙을 유지합니다.

## 확인 방법

KBO Storybook의 **Knitting Controls**에서 실제 줄 수 설정 조합을 확인하고, 전체 흐름은 앱에서 검증합니다. 공통 primitive별 상태와 keyboard interaction은 Lagrange Storybook에서 확인합니다.

브랜드 적용은 [테마 안내](THEME.md), 수정·검증 순서는 [UI 기여 가이드](CONTRIBUTING.md)에 있습니다.
