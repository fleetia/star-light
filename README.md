# Star-light

귀찮아서, 쓰고싶어서 만드는 프로젝트들입니다.

매번 새로 세팅하기 귀찮으므로 대충 모노레포로 대충 만들었습니다.
기여는 매우 환영하고있습니다.의견이 있거나 수정사항이 있거나 한다면 편하게 PR 주세요

# Launchpad

Chrome 새 탭을 커스터마이징 가능한 북마크 그리드로 대체하는 확장 프로그램.

- 스크롤 모드 (고정 그리드 + 페이지네이션) / 펼치기 모드 (Masonry 레이아웃)
- 9분할 위치 배치
- 테마 프리셋 (라이트/다크) + 개별 색상 커스터마이징
- 배경 이미지/동영상 지원
- 북마크 및 설정 가져오기/내보내기

## 설치

```bash
yarn install
```

## 개발

```bash
yarn dev
```

`http://localhost:5173`에서 실행됩니다. 개발 환경에서는 `chrome.storage` 대신 `localStorage`를 사용합니다.

## 빌드

```bash
yarn build
```

`dist/` 폴더에 결과물이 생성됩니다. 배포용 zip 파일을 만들려면:

```bash
yarn pack
```

## Chrome에 로드

1. `chrome://extensions` → **개발자 모드** 활성화
2. **압축해제된 확장 프로그램을 로드합니다** → `dist/` 폴더 선택
3. 새 탭 열기

## 테스트

```bash
yarn test        # watch 모드
yarn test:run    # 단일 실행
```

## 라이선스

MIT
