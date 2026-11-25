# Slack Style for Buzz

**한국어** | [English](README.en.md)

Buzz 데스크톱 앱을 슬랙처럼 보이고 쓰이게 바꾸는 플러그인입니다.

- 보라색(aubergine) 사이드바와 왼쪽 앱 줄, 흰 카드 형태의 대화 영역
- 왼쪽 앱 줄: 아이콘 아래 이름 표시, **bot → 홈 → DM → 내 활동 → 에이전트** 순서, 선택 시 채워지는 아이콘
- 사이드바 맨 위 고정 메뉴: **스레드 · 허들 · 멘션 · DM · 반응**
- 메뉴 이름 한글화 (Activity → 내 활동, Team → 팀, Direct messages → 다이렉트 메시지 등)
- 슬랙과 같은 글자 크기·줄 간격, 굵은 이름, 둥근 사각형 프로필 사진
- 메시지 입력창 위에 서식 도구(굵게, 기울임, 링크, 목록…) 막대, 슬랙식 안내 문구("#채널에 메시지 보내기")
- 채널 이름 아래 탭 줄: **메시지 · 파일 · 캔버스**, 채널에 올라온 파일 목록
- **채널의 모든 새 메시지 알림** (슬랙의 "모든 새 메시지" 알림과 같음. Buzz 기본은 멘션·DM·스레드 답글만 알림)
- 프로필 카드: 사진이나 이름에 마우스를 올리면 슬랙처럼 사진 위에 카드가 뜸 (큰 사진·이름, 현지 시간, 프로필/메시지 버튼)
- 메시지 호버 도구 막대, 선택된 채널 모양, 날짜 구분선, 새 메시지 선, 코드 블록 등 세부 스타일

## 설치

1. Buzz에서 **Settings → Plugins → Manage plugins**를 엽니다.
2. **Add**를 누르고 **Add from Git**을 고릅니다.
3. 아래 주소를 붙여넣고 추가합니다. Branch와 Folder는 비워 두면 됩니다.

   ```
   https://github.com/pango-gy/buzz-slack-style
   ```
4. 목록에서 **Slack Style**이 켜져 있는지 확인합니다.

새 버전이 올라오면 같은 화면에서 Slack Style의 **Update**(또는 **Check for updates**) 버튼을 누르면 됩니다.

권장 설정: **Settings → Appearance → Message density → Compact**
(말풍선 없이 슬랙처럼 모든 메시지를 왼쪽에 표시합니다.)

### 언어와 색상

**Settings → Slack Style**에서 각자 고릅니다.

- **언어**: 한국어 / English / 자동(컴퓨터 언어). English를 고르면 Buzz 메뉴는 원래 영어 그대로 두고 플러그인이 추가한 메뉴도 영어로 표시합니다. 바꾼 뒤 **다시 불러오기**를 누르면 적용됩니다.
- **색상**: 보라 · 남색 · 초록 · 버건디 · 회색, 또는 **직접 고르기**(색 선택기로 사이드바 색을 고르면 나머지 색이 맞춰짐). 고르는 즉시 바뀝니다. 너무 밝은 색은 글자가 보이도록 어둡게 조정됩니다.
- Buzz를 다크 모드로 쓰면 사이드바와 위·왼쪽 막대가 자동으로 더 어두워집니다.

### 끄거나 지우기

**Manage plugins → Slack Style**에서 **Disable**을 누르면 바로 원래 Buzz 화면으로 돌아갑니다.

## 채널 메시지 알림

- 다른 사람이 채널에 글을 쓰면 **"#채널 · 보낸 사람"** 제목과 메시지 미리보기로 macOS 알림이 뜹니다. 누르면 그 메시지로 이동합니다.
- 멘션·DM·스레드 답글(Buzz가 이미 알림을 보냄), 음소거한 채널, 내 메시지, 2분 넘은 메시지(재접속 때 밀려오는 것)는 알리지 않습니다.
- Buzz 창을 보고 있는 동안 읽음 처리된 메시지(지금 열어 둔 채널)는 알리지 않습니다. Buzz가 뒤에 있으면 그 채널도 알립니다. 판단을 위해 알림이 1초 정도 늦게 뜹니다.
- **Settings → Notifications → 채널 메시지**에서 켜고 끄거나 소리를 바꿀 수 있습니다.
- 채널마다 **채널 우클릭 → 다음에 대해 알림…**에서 고릅니다: **모든 새 포스트**(채널 알림 받기) / **멘션만**(채널 알림 끄기) / **음소거**(Buzz 음소거). 선택은 내 컴퓨터에만 저장됩니다. 키보드 화살표로는 이 항목에 이동할 수 없습니다.
- 아직 고르지 않은 사람의 기본값은 `plugin.js`의 `CHANNEL_ALERTS.channels`입니다(`"all"` 또는 채널 이름 목록).
- Buzz에는 `@here`·`@channel` 같은 전체 멘션이 없어서, 메시지에 `@here`, `@channel`, `@everyone`이 들어 있으면 이 플러그인이 대신 알립니다. **멘션만**으로 설정한 채널에서도 오고, 음소거한 채널에서는 오지 않습니다. 플러그인을 설치한 사람에게만 알림이 갑니다.
- 지금 열려 있는 커뮤니티의 메시지만 알립니다.
- Buzz 문서에 없는 내부 기능(실시간 메시지 흐름)을 사용합니다. Buzz 업데이트로 바뀌면 채널 알림만 멈추고 다른 기능에는 영향이 없습니다.

## 알아둘 점

- Buzz **1.0.6, 영어 화면** 기준으로 맞췄습니다. 다른 버전에서는 일부 스타일이 적용되지 않을 수 있습니다. 앱이 망가지지는 않고 해당 부분만 Buzz 기본 모양으로 돌아갑니다.
- Buzz 내부 화면 구조에 기대는 부분이 있어서 Buzz 업데이트 후 일부가 어긋날 수 있습니다. 발견하면 알려 주세요.
- 사이드바의 스레드·멘션·DM·반응, 왼쪽 줄의 DM·내 활동은 Buzz의 Activity 화면을 해당 탭으로 여는 바로가기입니다.
- 서식 도구가 열려 있는 동안에는 Buzz 구조상 @·파일·이모지 버튼이 숨겨집니다. 막대 왼쪽 **X**로 닫으면 돌아옵니다.
- 메시지 본문과 입력 내용은 번역하거나 바꾸지 않습니다.
- 한글 글꼴은 Noto Sans KR이 설치된 컴퓨터에서만 적용되고, 없으면 시스템 글꼴이 쓰입니다.
- Buzz 플러그인은 앱 안에서 제한 없이 실행됩니다. 이 플러그인은 화면 모양을 바꾸고 위의 알림을 추가할 뿐, 데이터를 Buzz 밖으로 보내지 않습니다.

## 설정 바꾸기

모든 설정은 `plugin.js` 위쪽 상수로 되어 있습니다. 고친 뒤 Buzz에서 플러그인을 다시 불러오면 적용됩니다.

| 상수 | 내용 |
| --- | --- |
| `COLORS` | 사이드바·앱 줄·선택 색 등 기본 색상 |
| `THEMES`, `DEFAULT_THEME` | 고를 수 있는 색상 테마, 아직 고르지 않은 사람의 기본 테마 |
| `DARK_MODE_DARKEN` | 다크 모드에서 위·왼쪽 막대와 사이드바를 어둡게 하는 정도 |
| `DEFAULT_LANGUAGE` | 아직 고르지 않은 사람의 언어 (`"auto"`, `"ko"`, `"en"`) |
| `SIZES` | 채널 줄 높이, 사이드바·메시지 글자 크기, 채널 제목 크기 |
| `TRANSLATIONS` | 한글로 바꿀 메뉴 이름 (`"영어": "한글"`) |
| `ACTIVITY_ROWS`, `HIDE_ACTIVITY_ROW` | 사이드바 맨 위 바로가기와 순서, Buzz 기본 내 활동 줄 숨김 |
| `HUDDLES`, `HUDDLES_LABEL` | 허들 줄과 최근 허들 화면 |
| `DOCK_APPS`, `DOCK_ORDER`, `DOCK_RENAMES`, `DOCK_ICON_OVERRIDES` | 왼쪽 앱 줄 버튼, 순서, 이름, 아이콘 |
| `DOCK_LABELS`, `DOCK_TILE`, `DOCK_ICON` | 앱 줄 이름 표시, 아이콘 칸·아이콘 크기 |
| `DOCK_NEW_BUTTON`, `DOCK_NEW_BUTTON_BOTTOM` | + 버튼을 왼쪽 앱 줄에 표시, 창 아래에서의 거리 |
| `AUTHOR_WEIGHT`, `UNREAD_WEIGHT`, `CHANNEL_TITLE_WEIGHT` | 이름·안 읽은 채널·채널 제목 굵기 |
| `AVATAR_RADIUS`, `MESSAGE_INDENT`, `AVATAR_GAP`, `STACK_GAP` | 프로필 사진 모서리, 메시지 위치와 간격 |
| `DM_AVATAR`, `DM_AVATAR_RADIUS` | 사이드바 다이렉트 메시지 목록의 사진 크기와 모서리 |
| `FORMAT_BAR`, `FORMAT_BAR_HEIGHT`, `FORMAT_BUTTONS` | 입력창 위 서식 막대 표시, 높이, 버튼 목록 |
| `COMPOSER_ICON`, `COMPOSER_BUTTON_GAP`, `COMPOSER_BUTTON_ORDER` | 입력창 버튼 아이콘 크기, 간격, 아래 줄 순서 |
| `COMPOSER_BORDER`, `COMPOSER_BORDER_FOCUS` | 입력창 테두리 진하기 (평소, 입력 중) |
| `PLACEHOLDER_SUFFIX`, `PLACEHOLDERS` | 빈 입력창의 안내 문구 |
| `CHANNEL_TABS`, `FILES_PAGE` | 채널 이름 아래 탭 줄(메시지·파일·캔버스) 표시, 파일 탭이 한 번에 읽는 메시지 수 |
| `CHANNEL_ALERTS` | 채널 메시지 알림: 켜기/끄기, 기본 대상 채널, 보고 있는 채널 제외 |
| `SLACK_CORNERS`, `CARD_RADIUS` | 메뉴·대화상자·버튼 등 모서리 크기, 사이드바·대화 영역 모서리 |
| `SLACK_FONTS`, `SLACK_LETTER_SPACING` | Noto Sans KR 사용(설치된 컴퓨터만), 자간 0 |
| `FONT_SMOOTHING` | `""` Buzz 기본(얇게), `"auto"` 조금 두껍게 |
| `ROW_RADIUS`, `SECTION_INDENT`, `PINNED_ROW_HEIGHT` | 사이드바 줄 모서리, 들여쓰기, 고정 메뉴 줄 높이 |
| `MENTION_SELECTED`, `INLINE_CODE_COLOR`, `NEW_LINE_COLOR` | @멘션 목록 선택 색, 인라인 코드 글자색, 새 메시지 선 색 |
| `SEARCH_HEIGHT` | 상단 검색창 높이 |

## 개발

빌드 과정은 없습니다. `manifest.json`과 `plugin.js` 두 파일이 전부입니다.
로컬에서 고치며 확인하려면 **Add → Add from folder → Browse**로 이 폴더를 추가하세요.
(폴더를 끌어다 놓으면 복사본이 설치되어 수정 내용이 반영되지 않습니다.)
