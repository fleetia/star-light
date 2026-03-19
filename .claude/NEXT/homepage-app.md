# NEXT: 개인 홈페이지 앱

## 현재 상태

- 브랜치: master
- 앱 생성 완료, 미커밋

## 완료 조건

- [x] `apps/homepage` 앱 생성 (Vite + React + react-markdown)
- [x] 메뉴 JSON 설정 (소개, kbo-knit, lotuspad)
- [x] @star-light/components Button 재사용
- [x] 루트 스크립트 추가 (`dev:homepage`, `build:homepage`)
- [ ] 커밋

## 다음 작업

- MD 콘텐츠 보강 (kbo-knit.md, lotuspad.md)
- 디자인 다듬기 (사이드바, 타이포그래피 등)
- tsc 빌드 문제: components 라이브러리 declaration 미생성 (기존 이슈, kbo-knit 동일)

## 참고 파일

- `apps/homepage/src/config/menu.json` — 메뉴 설정
- `apps/homepage/src/content/` — MD 파일들
- `apps/homepage/src/App.tsx` — 메인 컴포넌트
- `apps/homepage/src/components/MarkdownViewer.tsx` — MD 렌더러
