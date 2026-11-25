# Slack Style for Buzz

Buzz 데스크톱 앱을 슬랙처럼 보이고 쓰이게 바꾸는 플러그인입니다.

- 보라색(aubergine) 사이드바와 왼쪽 앱 줄, 흰 카드 형태의 대화 영역
- 왼쪽 앱 줄: 아이콘 아래 이름 표시, **bot → 홈 → DM → 내 활동 → 에이전트** 순서, 선택 시 채워지는 아이콘
- 사이드바 맨 위 고정 메뉴: **내 활동 · 스레드 · 멘션 · DM · 반응**
- 메뉴 이름 한글화 (Activity → 내 활동, Team → 팀, Direct messages → 다이렉트 메시지 등)
- 슬랙과 같은 글자 크기·줄 간격, 굵은 이름, 둥근 사각형 프로필 사진
- 메시지 입력창 위에 서식 도구(굵게, 기울임, 링크, 목록…) 막대
- 메시지 호버 도구 막대, 선택된 채널 모양 등 세부 스타일

## 설치

1. Buzz에서 **Settings → Plugins → Manage plugins**를 엽니다.
2. **Add**를 누르고 **Add from Git**을 고릅니다.
3. 아래 주소를 붙여넣고 추가합니다. Branch와 Folder는 비워 두면 됩니다.

   ```
   https://github.com/pango-gy/buzz-slack-style
   ```
4. 목록에서 **Slack Style**이 켜져 있는지 확인합니다.

새 버전이 올라오면 같은 화면에서 Slack Style의 **Update** 버튼을 누르면 됩니다.

권장 설정: **Settings → Appearance → Message density → Compact**
(말풍선 없이 슬랙처럼 모든 메시지를 왼쪽에 표시합니다.)

### 끄거나 지우기

**Manage plugins → Slack Style**에서 **Disable**을 누르면 바로 원래 Buzz 화면으로 돌아갑니다.

## 알아둘 점

- Buzz **1.0.6, 영어 화면** 기준으로 맞췄습니다. 다른 버전에서는 일부 스타일이 적용되지 않을 수 있습니다. 앱이 망가지지는 않고 해당 부분만 Buzz 기본 모양으로 돌아갑니다.
- Buzz 내부 화면 구조에 기대는 부분이 있어서 Buzz 업데이트 후 일부가 어긋날 수 있습니다. 발견하면 알려 주세요.
- 사이드바의 스레드·멘션·DM·반응, 왼쪽 줄의 DM·내 활동은 Buzz의 Activity 화면을 해당 탭으로 여는 바로가기입니다.
- 서식 도구가 열려 있는 동안에는 Buzz 구조상 @·파일·이모지 버튼이 숨겨집니다. 막대 왼쪽 **X**로 닫으면 돌아옵니다.
- 메시지 본문과 입력 내용은 번역하거나 바꾸지 않습니다.
- Buzz 플러그인은 앱 안에서 제한 없이 실행됩니다. 이 플러그인은 화면 모양만 바꾸며 데이터를 외부로 보내지 않습니다.

## 설정 바꾸기

모든 설정은 `plugin.js` 위쪽 상수로 되어 있습니다. 고친 뒤 Buzz에서 플러그인을 다시 불러오면 적용됩니다.

| 상수 | 내용 |
| --- | --- |
| `COLORS` | 사이드바·앱 줄·선택 색 등 색상 |
| `SIZES` | 채널 줄 높이, 사이드바·메시지 글자 크기, 채널 제목 크기 |
| `TRANSLATIONS` | 한글로 바꿀 메뉴 이름 (`"영어": "한글"`) |
| `ACTIVITY_ROWS` | 사이드바 맨 위 바로가기와 순서 |
| `DOCK_APPS`, `DOCK_ORDER`, `DOCK_RENAMES` | 왼쪽 앱 줄 버튼, 순서, 이름 |
| `DOCK_LABELS`, `DOCK_TILE`, `DOCK_ICON` | 앱 줄 이름 표시, 아이콘 칸·아이콘 크기 |
| `AUTHOR_WEIGHT`, `UNREAD_WEIGHT`, `CHANNEL_TITLE_WEIGHT` | 이름·안 읽은 채널·채널 제목 굵기 |
| `AVATAR_RADIUS`, `MESSAGE_INDENT`, `AVATAR_GAP`, `STACK_GAP` | 프로필 사진 모서리, 메시지 위치와 간격 |
| `FORMAT_BAR`, `FORMAT_BAR_HEIGHT`, `FORMAT_BUTTONS` | 입력창 위 서식 막대 표시, 높이, 버튼 목록 |
| `FONT_SMOOTHING` | `""` Buzz 기본(얇게), `"auto"` 조금 두껍게 |
| `ROW_RADIUS`, `SECTION_INDENT`, `PINNED_ROW_HEIGHT` | 사이드바 줄 모서리, 들여쓰기, 고정 메뉴 줄 높이 |
| `CHANNEL_TABS`, `FILES_PAGE` | 채널 이름 아래 탭 줄(메시지·파일·캔버스) 표시, 파일 탭이 한 번에 읽는 메시지 수 |
| `SLACK_CORNERS`, `CARD_RADIUS` | 메뉴·대화상자·버튼 등 모서리 크기, 사이드바·대화 영역 모서리 |
| `SLACK_FONTS`, `SLACK_LETTER_SPACING` | Noto Sans KR 사용(설치된 컴퓨터만), 자간 0 |
| `COMPOSER_ICON`, `COMPOSER_BUTTON_GAP`, `COMPOSER_BUTTON_ORDER` | 입력창 버튼 아이콘 크기, 간격, 아래 줄 순서 |
| `DOCK_NEW_BUTTON`, `DOCK_NEW_BUTTON_BOTTOM` | + 버튼을 왼쪽 앱 줄에 표시, 창 아래에서의 거리 |
| `SEARCH_HEIGHT` | 상단 검색창 높이 |

## 개발

빌드 과정은 없습니다. `manifest.json`과 `plugin.js` 두 파일이 전부입니다.
로컬에서 고치며 확인하려면 **Add → Add from folder → Browse**로 이 폴더를 추가하세요.
(폴더를 끌어다 놓으면 복사본이 설치되어 수정 내용이 반영되지 않습니다.)
