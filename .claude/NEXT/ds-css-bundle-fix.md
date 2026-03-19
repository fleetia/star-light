# NEXT: 디자인시스템 CSS 번들링 수정 [완료]

## 현재 상태

- 브랜치: master
- 커밋된 작업: React 19 + Vite 8 업그레이드, Select 컴포넌트 생성, kbo-knit Box/Select/Button/ColorRow/Toggle 적용 완료

## 핵심 문제

`@star-light/components`를 설치해서 import하면 JS는 오지만 **CSS가 소비 앱 번들에 포함되지 않음**.

### 원인

1. vanilla-extract 빌드 시 CSS를 `.vanilla.css` 파일로 추출
2. JS 파일에서 CSS import가 `/* empty css */`로 대체됨
3. 소비 앱 번들러가 CSS를 로드하지 못함

### 시도한 것 (실패)

- `cssCodeSplit: false` + 단일 번들 → 개별 모듈 파일이 사라져서 `lotuspad-bridge.css.ts` 등에서 resolve 실패
- `closeBundle` hook으로 후처리 → Vite 8(rolldown)에서 hook 미실행
- `generateBundle` hook → CSS 에셋이 아직 생성 전이라 빈 결과

## 다음 작업

- [x] ~~빌드 후처리 스크립트~~ → `@vanilla-extract/rollup-plugin`으로 전환 (Vite lib mode 대체)
- [x] `package.json` exports에 개별 컴포넌트 경로 추가 (이전 세션에서 완료)
- [x] `sideEffects: ["**/*.css"]` 설정
- [x] `.css.js` → `.styles.js` rename 플러그인 (소비자 VE 플러그인 충돌 방지)
- [x] extension 앱의 source alias 제거

## 사용자 요구사항

- `@star-light/components/Button` 처럼 개별 import 시 컴포넌트 + 스타일이 함께 와야 함
- dist 기반으로 동작해야 함 (source import 아님)
- `preserveModules: true` 유지 (개별 모듈 파일 필요)

## 참고 파일

- `packages/components/vite.config.ts` — 빌드 설정
- `packages/components/package.json` — exports 설정
- `apps/kbo-knit/src/styles/lotuspad-bridge.css.ts` — `vars` import 사용
- `packages/components/dist/Button/Button.css.js` — `/* empty css */` 패턴 확인용
- `packages/components/dist/styles/Button/Button.css.ts.vanilla.css` — 실제 CSS 출력
