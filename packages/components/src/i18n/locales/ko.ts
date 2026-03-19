import type { Translations } from "../types";

const ko: Translations = {
  // IconButton
  "iconButton.add": "추가",

  // NavigationButton
  "navigation.previous": "이전",
  "navigation.next": "다음",

  // CardPagination
  "pagination.previousPage": "이전 페이지",
  "pagination.nextPage": "다음 페이지",

  // NewTabApp
  "newtab.options": "옵션",
  "contextMenu.changeIcon": "아이콘 변경",
  "contextMenu.resetIcon": "아이콘 초기화",
  "contextMenu.delete": "북마크 삭제",

  // OptionsSidebar - Primary tabs
  "sidebar.tab.appearance": "외형",
  "sidebar.tab.layout": "배치",
  "sidebar.tab.css": "CSS",
  "sidebar.tab.groups": "그룹",
  "sidebar.tab.general": "일반",

  // OptionsSidebar - Appearance sub tabs
  "sidebar.appearance.background": "배경",
  "sidebar.appearance.container": "컨테이너",
  "sidebar.appearance.bookmark": "북마크",
  "sidebar.appearance.folder": "폴더",

  // OptionsSidebar - Background section
  "sidebar.background.image": "배경 이미지",
  "sidebar.background.urlPlaceholder": "URL을 입력하세요",
  "sidebar.background.apply": "적용",
  "sidebar.background.fileUpload": "파일 업로드",
  "sidebar.background.remove": "제거",
  "sidebar.background.box": "배경 박스",
  "sidebar.background.color": "색상",
  "sidebar.background.processing": "처리 중",
  "sidebar.background.preview": "배경 미리보기",

  // OptionsSidebar - Container section
  "sidebar.container.title": "제목",
  "sidebar.container.text": "텍스트",
  "sidebar.container.size": "크기",
  "sidebar.container.hover": "호버",
  "sidebar.container.border": "테두리",
  "sidebar.container.borderColor": "테두리 색상",
  "sidebar.container.borderWidth": "두께",
  "sidebar.container.subtitle": "부제목",
  "sidebar.container.containerBox": "컨테이너 박스",
  "sidebar.container.borderRadius": "모서리 둥글기",
  "sidebar.container.preview": "컨테이너 미리보기",
  "sidebar.container.mockupTitle": "제목",
  "sidebar.container.mockupSubtitle": "부제목 / 경로",

  // OptionsSidebar - Bookmark section
  "sidebar.bookmark.horizontalIcon": "아이콘을 가로로 사용",
  "sidebar.bookmark.scale": "스케일 (em)",
  "sidebar.bookmark.horizontalSize": "가로 사이즈",
  "sidebar.bookmark.verticalSize": "세로 사이즈",
  "sidebar.bookmark.iconSize": "아이콘 크기",
  "sidebar.bookmark.borderRadius": "둥글기",
  "sidebar.bookmark.iconBorderRadius": "아이콘 둥글기",
  "sidebar.bookmark.boxColor": "박스 색상",
  "sidebar.bookmark.text": "텍스트",
  "sidebar.bookmark.hoverBackground": "호버 배경",
  "sidebar.bookmark.hoverText": "호버 텍스트",
  "sidebar.bookmark.preview": "북마크 미리보기",
  "sidebar.bookmark.mockupName": "북마크",

  // OptionsSidebar - Folder section
  "sidebar.folder.horizontalIcon": "아이콘을 가로로 사용",
  "sidebar.folder.background": "배경",
  "sidebar.folder.iconBackground": "아이콘 배경",
  "sidebar.folder.iconColor": "아이콘 색상",
  "sidebar.folder.text": "텍스트",
  "sidebar.folder.border": "테두리",
  "sidebar.folder.preview": "폴더 미리보기",
  "sidebar.folder.mockupName": "폴더",

  // OptionsSidebar - Layout section
  "sidebar.layout.expandBookmarks": "북마크를 펼치기",
  "sidebar.layout.horizontalIcon": "아이콘을 가로로 사용",
  "sidebar.layout.expandLayout": "펼치기 레이아웃",
  "sidebar.layout.scrollLayout": "스크롤 레이아웃",
  "sidebar.layout.cardColumns": "카드 가로 개수",
  "sidebar.layout.horizontalSize": "가로사이즈",
  "sidebar.layout.cardInnerColumns": "카드 내 가로 개수",
  "sidebar.layout.horizontalColumnCount": "가로 열 개수",
  "sidebar.layout.cardGap": "카드 간격",
  "sidebar.layout.bookmarkGap": "북마크 간격",
  "sidebar.layout.count": "개수",
  "sidebar.layout.columnCount": "가로 개수",
  "sidebar.layout.rowCount": "세로 개수",
  "sidebar.layout.gap": "간격",
  "sidebar.layout.positionMargin": "위치 + 여백",
  "sidebar.layout.preview": "배치 미리보기",
  "sidebar.preview.note":
    "미리보기는 편의를 위해 제공하므로 실제 동작과 동일하지 않습니다.",

  // OptionsSidebar - CSS section
  "sidebar.css.title": "커스텀 CSS",
  "sidebar.css.placeholder":
    "/* 최우선 적용되는 커스텀 CSS */\n.my-class-* {\n  color: red;\n}",

  // OptionsSidebar - General section
  "sidebar.general.language": "언어",
  "sidebar.general.openInNewTab": "기본적으로 새 탭에서 열기",
  "sidebar.general.exportImport": "내보내기 / 가져오기",
  "sidebar.general.export": "내보내기",
  "sidebar.general.import": "가져오기",
  "sidebar.general.reset": "초기화",
  "sidebar.general.resetTheme": "기본 테마로 초기화",
  "sidebar.general.resetAll": "전체 초기화",
  "sidebar.general.credits": "크레딧",
  "sidebar.general.credits.dev": "개발 & 디자인",
  "sidebar.general.credits.planning": "기획 & QA",
  "sidebar.general.credits.github": "GitHub",
  "sidebar.general.credits.readme": "README",
  "sidebar.general.credits.postype": "Postype",
  "sidebar.general.credits.bugReport": "버그 제보",
  "sidebar.general.credits.homepage": "홈페이지",
  "sidebar.general.credits.buyMeACoffee": "Buy me a coffee",

  // OptionsSidebar - Footer / Confirm
  "sidebar.cancel": "취소",
  "sidebar.save": "저장",
  "sidebar.confirm.unsavedChanges":
    "저장하지 않은 변경사항이 있습니다. 닫을까요?",
  "sidebar.confirm.yes": "예",
  "sidebar.confirm.no": "아니오",

  // BookmarkTreeSelector
  "groups.rootGroup": "루트 그룹",
  "groups.allTopLevel": "전체 (최상위)",
  "groups.hide": "숨기기",
  "groups.show": "보이기",
  "groups.dragToReorder": "드래그하여 순서 변경",

  // PopupApp
  "popup.active": "활성화됨",
  "popup.inactive": "비활성화됨",
  "popup.deactivate": "비활성화",
  "popup.activate": "활성화",
  "popup.description": "현재 탭에서 Lotuspad 기능을 사용할 수 있습니다.",
  "popup.settings": "설정",

  // ConfirmDialog
  "confirmDialog.confirm": "확인",
  "confirmDialog.cancel": "취소",

  // Tree
  "tree.collapse": "접기",
  "tree.expand": "펼치기",
  "tree.hide": "숨기기",
  "tree.show": "보이기",
  "tree.dragToReorder": "드래그하여 순서 변경",

  // Modal
  "modal.close": "닫기",

  // PositionGrid
  "positionGrid.group": "위치 그리드",
  "positionGrid.margin.top": "위쪽 여백",
  "positionGrid.margin.bottom": "아래쪽 여백",
  "positionGrid.margin.left": "왼쪽 여백",
  "positionGrid.margin.right": "오른쪽 여백",

  // Content script
  "content.activated": "Lotuspad 활성화됨"
};

export default ko;
