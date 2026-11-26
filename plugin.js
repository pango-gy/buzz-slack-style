// Slack-style look for Buzz: aubergine window chrome and sidebar, a white
// rounded conversation area, Slack sizes and spacing, Korean menu names,
// Threads/Mentions/DMs shortcuts and dock apps, and an always-open
// formatting bar. Settings are the constants below; see README.md.
// Overrides Buzz's internal classes and color variables, which can change
// between Buzz versions. If they do, only the affected colors revert.

// ---- Language ------------------------------------------------------------
// Language of this plugin's labels and of Buzz menu names: Korean ("ko") or
// Buzz's own English ("en"). Each person picks it in Settings → Slack Style;
// DEFAULT_LANGUAGE applies until they do. "auto" follows the computer's
// language (Korean if it is set to Korean, otherwise English).
const DEFAULT_LANGUAGE = "auto";
const LANGUAGE_KEY = "slack-style.language.v1";
function savedLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === "ko" || saved === "en") return saved;
  } catch {}
  return undefined;
}
function pickAutoLanguage() {
  if (DEFAULT_LANGUAGE === "ko" || DEFAULT_LANGUAGE === "en") return DEFAULT_LANGUAGE;
  const langs = typeof navigator !== "undefined" ? [navigator.language, ...(navigator.languages || [])] : [];
  return langs.some((l) => String(l || "").toLowerCase().startsWith("ko")) ? "ko" : "en";
}
function pickLanguage() {
  const saved = savedLanguage();
  return saved ?? pickAutoLanguage();
}
// Chosen once when the plugin loads; changing it reloads the Buzz window.
const LANG = pickLanguage();
const t = (ko, en) => (LANG === "en" ? en : ko);

export const inject = ["react", "pages", "navigation", "panels", "relay", "notifications", "settingsCards", "conversation", "host"];

// Slack-style shortcuts pinned at the top of the Messages sidebar, next to
// Activity. Each row opens Buzz's own Activity page with that tab already
// selected. Remove a line to hide it.
const ACTIVITY_ROWS = [
  { id: "threads", label: t("스레드", "Threads"), icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM7 8h10M7 12h6" },
  { id: "mentions", label: t("멘션", "Mentions"), icon: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" },
  { id: "dms", label: t("DM", "DMs"), icon: "M7.9 20A9 9 0 1 0 4 16.1L2 22z" },
  { id: "reactions", label: t("반응", "Reactions"), icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" },
];

// Edit these to change the palette.
const COLORS = {
  chrome: "#3B1A3C", // top bar and left dock
  sidebar: "#4A2A4B", // channel sidebar
  text: "#D9CCD9", // read channel names
  textStrong: "#FFFFFF", // unread channels, hover, headings
  textMuted: "#B7A3B8", // section titles, icons, metadata
  hover: "rgba(255, 255, 255, 0.10)",
  pressed: "rgba(255, 255, 255, 0.16)",
  selected: "#E4C6E8", // selected channel row (light lilac)
  selectedText: "#3B1A3C",
  border: "rgba(255, 255, 255, 0.14)",
  searchFill: "rgba(255, 255, 255, 0.16)",
  floating: "#6A466B", // pills and buttons floating over the sidebar
  dockSelected: "rgba(255, 255, 255, 0.20)", // selected dock icon tile
  scrollbar: "rgba(255, 255, 255, 0.22)", // scrollbars on purple
};

// Sidebar color themes, picked per person in Settings → Slack Style. Each
// entry overrides the matching COLORS above; all are dark sidebars with light
// text. Add a theme by copying an entry.
const THEMES = {
  aubergine: { name: t("보라", "Aubergine") },
  navy: {
    name: t("남색", "Navy"),
    chrome: "#0B1F33", sidebar: "#13304D", floating: "#2A4A6B",
    text: "#CDD8E4", textMuted: "#9DB0C4", selected: "#BFD7F2", selectedText: "#0B1F33",
  },
  jade: {
    name: t("초록", "Jade"),
    chrome: "#0F3B33", sidebar: "#164D43", floating: "#2C6A5E",
    text: "#CFE3DD", textMuted: "#9CC2B8", selected: "#BEE6D9", selectedText: "#0F3B33",
  },
  burgundy: {
    name: t("버건디", "Burgundy"),
    chrome: "#3D1220", sidebar: "#521A2C", floating: "#733246",
    text: "#E6CDD5", textMuted: "#C29AA7", selected: "#F0C6D2", selectedText: "#3D1220",
  },
  graphite: {
    name: t("회색", "Graphite"),
    chrome: "#1F1F22", sidebar: "#2B2B2F", floating: "#45454B",
    text: "#D4D4D8", textMuted: "#A1A1AA", selected: "#D9D9DE", selectedText: "#1F1F22",
  },
};
// "직접 고르기": one color picked in Settings; the rest of the palette is
// derived from it. Very light colors are darkened so white text stays readable.
const CUSTOM_COLOR_KEY = "slack-style.custom-color.v1";
const DEFAULT_CUSTOM_COLOR = "#4A2A4B";
function savedCustomColor() {
  try {
    const saved = localStorage.getItem(CUSTOM_COLOR_KEY);
    if (/^#[0-9a-f]{6}$/i.test(saved || "")) return saved;
  } catch {}
  return DEFAULT_CUSTOM_COLOR;
}
THEMES.custom = customTheme(savedCustomColor());
const DEFAULT_THEME = "aubergine";
// In Buzz's dark mode the top bar, left bar and sidebar get this much darker
// (0 = same as light mode, 1 = black), like Slack's dark mode.
const DARK_MODE_DARKEN = { chrome: 0.45, sidebar: 0.42, floating: 0.3 };
const THEME_KEY = "slack-style.theme.v1";
const BASE_COLORS = { ...COLORS };
let themeStyle;
function savedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved && Object.hasOwn(THEMES, saved)) return saved;
  } catch {}
  return Object.hasOwn(THEMES, DEFAULT_THEME) ? DEFAULT_THEME : "aubergine";
}
// Blend two #RRGGBB colors: amount 0 = a, 1 = b.
function mixHex(a, b, amount) {
  const parse = (hex) => {
    const m = /^#([0-9a-f]{6})$/i.exec(hex);
    return m ? [16, 8, 0].map((sh) => (parseInt(m[1], 16) >> sh) & 255) : undefined;
  };
  const x = parse(a);
  const y = parse(b);
  if (!x || !y) return a;
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * amount).toString(16).padStart(2, "0")).join("")}`;
}
function mixWithBlack(hex, amount) {
  return mixHex(hex, "#000000", amount);
}
// Relative luminance, 0 (black) to 1 (white).
function luminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return 0;
  const [r, g, b] = [16, 8, 0].map((sh) => {
    const v = ((parseInt(m[1], 16) >> sh) & 255) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// A full palette from one sidebar color.
function customTheme(color) {
  let sidebar = /^#[0-9a-f]{6}$/i.test(color || "") ? color : DEFAULT_CUSTOM_COLOR;
  for (let i = 0; i < 20 && luminance(sidebar) > 0.13; i++) sidebar = mixWithBlack(sidebar, 0.12);
  return {
    name: t("직접 고르기", "Custom"),
    chrome: mixWithBlack(sidebar, 0.22),
    sidebar,
    floating: mixHex(sidebar, "#ffffff", 0.16),
    text: mixHex(sidebar, "#ffffff", 0.82),
    textMuted: mixHex(sidebar, "#ffffff", 0.6),
    selected: mixHex(sidebar, "#ffffff", 0.78),
    selectedText: mixWithBlack(sidebar, 0.22),
  };
}
// The stylesheet refers to every palette color as var(--ss-<name>), defined
// once for light mode and once, darker, for Buzz's dark mode.
function buildThemedCss() {
  const keys = Object.keys(COLORS);
  const refs = Object.fromEntries(keys.map((k) => [k, `var(--ss-${k})`]));
  const vars = (pick) => keys.map((k) => `--ss-${k}: ${pick(k)};`).join(" ");
  const dark = (k) => (DARK_MODE_DARKEN[k] ? mixWithBlack(COLORS[k], DARK_MODE_DARKEN[k]) : COLORS[k]);
  return `:root { ${vars((k) => COLORS[k])} }
:root[data-color-mode="dark"] { ${vars(dark)} }
${buildCss(refs)}`;
}
// Switch COLORS to a theme; when the stylesheet is already on the page it is
// rebuilt at once, so the change needs no reload.
function switchTheme(id) {
  const { name, ...colors } = THEMES[id] ?? {};
  Object.assign(COLORS, BASE_COLORS, colors);
  if (themeStyle) themeStyle.textContent = buildThemedCss();
}

// Text rendering. Slack uses "antialiased", the same as Buzz, so this stays
// empty; "auto" draws heavier glyphs.
const FONT_SMOOTHING = "";

// Slack's font in Korean (read from Slack's own stylesheet): Noto Sans KR
// for Korean and English alike, in two weights, Regular and Bold. Buzz uses
// Inter plus the system Korean font. Buzz can't load fonts from the web, so
// this applies only on computers that have Noto Sans KR or Noto Sans CJK KR
// installed; otherwise Buzz's own fonts stay. Set to false to keep them.
const SLACK_FONTS = true;

// Buzz tightens the space between letters slightly; Slack uses none. Set to
// false to keep Buzz's spacing.
const SLACK_LETTER_SPACING = true;

// Slack's formatting bar (B, I, links, lists...) across the top of every
// message box, above Buzz's own row of buttons (@, files, emoji, send). Each
// button presses the matching Buzz keyboard shortcut. Buzz's "Aa" button
// shows and hides this bar (its own toolbar would replace that bottom row).
const FORMAT_BAR = true;
// Height (px) of the formatting bar.
const FORMAT_BAR_HEIGHT = 38;
// Buttons from the left; "|" is a divider. Remove an entry to hide it.
// key/shift/alt is the Buzz shortcut (with Cmd, or Ctrl on Windows/Linux).
const FORMAT_BUTTONS = [
  { label: t("굵게", "Bold"), text: "B", style: "font-weight:800", key: "b" },
  { label: t("기울임꼴", "Italic"), text: "I", style: "font-style:italic;font-family:Georgia,serif", key: "i" },
  { label: t("취소선", "Strikethrough"), text: "S", style: "text-decoration:line-through", key: "x", shift: true },
  "|",
  { label: t("링크", "Link"), key: "u", shift: true, icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" },
  { label: t("순서 있는 목록", "Numbered list"), key: "7", shift: true, icon: "M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" },
  { label: t("글머리 기호 목록", "Bulleted list"), key: "8", shift: true, icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
  "|",
  { label: t("인용", "Quote"), key: "9", shift: true, icon: "M4 5v14M9 7h11M9 12h11M9 17h7" },
  { label: t("코드", "Code"), key: "e", icon: "m16 18 6-6-6-6M8 6l-6 6 6 6" },
  { label: t("코드 블록", "Code block"), key: "c", alt: true, icon: "M4 4h16v16H4zM10 9.5 7.5 12l2.5 2.5M14 9.5l2.5 2.5-2.5 2.5" },
];

// Message box border strength (% of the text color): idle, and while typing.
const COMPOSER_BORDER = 15;
const COMPOSER_BORDER_FOCUS = 35;

// Message box buttons, both rows: icon size and the gap between the 28px
// buttons, in px (Slack: 18 and 4; Buzz: 16px icons in 36px buttons).
const COMPOSER_ICON = 18;
const COMPOSER_BUTTON_GAP = 4;

// Buttons under the message box from the left, by Buzz's own (English)
// button names, in Slack's order: attach, Aa, emoji, mention. Others follow.
const COMPOSER_BUTTON_ORDER = ["Attach files", "Toggle formatting", "Emoji and GIFS", "Mention a member"];

// Words after the channel name in an empty message box, like Slack's
// "#채널에 메시지 보내기". Set to "" to keep Buzz's "Message #channel".
const PLACEHOLDER_SUFFIX = t("에 메시지 보내기", "");
// Other empty message boxes, matched by the start of Buzz's English text.
// The person's name can't be kept here, so DMs read just "메시지 보내기".
const PLACEHOLDERS = LANG === "en" ? {} : {
  "Message ": t("메시지 보내기", "Message"),
  "Reply ": t("답글...", "Reply..."),
  "Edit message": t("메시지 편집", "Edit message"),
};

// Corner radius (px) of the sidebar and conversation card, and of other
// panels in the workspace (Slack: about 10; Buzz: a much rounder panel).
const CARD_RADIUS = 10;

// Corner sizes (px) used across Buzz, by Buzz's own names. Slack uses about
// 12 on dialogs, 8 on menus, cards and buttons, 6 on rows and 4 on chips.
// Set SLACK_CORNERS to null to keep Buzz's rounder corners.
const SLACK_CORNERS = {
  "radius-panel": 12, // dialogs and large panels
  "radius-container": 10, // menus and containers
  "radius-card": 12,
  "radius-control": 8, // buttons and inputs
  "radius-row": 6, // list and menu rows
  "radius-icon-button": 6,
  "radius-chip": 4,
};

// Slack's row of tabs under the channel name: 메시지, 파일, 캔버스. 파일 lists
// the files posted in the channel (built by this plugin) and 캔버스 opens
// Buzz's own channel canvas; both open in the pane on the right. Set to
// false to hide the row.
const CHANNEL_TABS = true;
// How many recent messages 파일 reads at a time when looking for files.
const FILES_PAGE = 200;

// Height (px) of the search box in the top bar (Slack: 28; Buzz: 36).
const SEARCH_HEIGHT = 28;

// Weight of unread channel names in the sidebar (Buzz: 600).
const UNREAD_WEIGHT = 700;

// Height (px) of the rows pinned at the top of the sidebar (Slack: 28).
const PINNED_ROW_HEIGHT = 28;

// Extra left indent (px) of channel rows under a section title.
const SECTION_INDENT = 10;

// Menus (right-click, ⋯) styled like Slack's, with this row color under the
// pointer. Set SLACK_MENUS to false to keep Buzz's menus.
const SLACK_MENUS = true;
const MENU_HIGHLIGHT = "#1264A3";
// Current choice in "다음에 대해 알림…" (light and dark mode).
const MENU_SELECTED = "#1264A3";
const MENU_SELECTED_DARK = "#1D9BD1";
// @mention chips in messages (Slack's colors).
const MENTION_CHIP = {
  bg: "rgba(29, 155, 209, 0.1)",
  hover: "rgba(29, 155, 209, 0.2)",
  text: "#1264A3",
  textDark: "#1D9BD1",
  selfBg: "rgba(242, 199, 68, 0.4)",
  selfHover: "rgba(242, 199, 68, 0.6)",
};
// Presence dot on sidebar pictures: size in px, active and away colors.
const PRESENCE = { size: 9, active: "#2BAC76", away: "rgba(255, 255, 255, 0.65)" };
// Sidebar marker for channels with a mention or a DM (Slack's red).
const MENTION_DOT = "#E01E5A";

// Corner radius of sidebar rows (Slack is about 6px; Buzz uses a pill).
const ROW_RADIUS = 6;

// Text and row sizes in px, matched to Slack's desktop app.
const SIZES = {
  sidebarRow: 28, // channel row height
  sidebarText: 15, // channel, pinned row and section title text
  messageText: 15, // message body and author name
  messageLine: 22, // message line height
  messageTime: 12, // time next to the name
  messageAvatar: 36, // picture beside a message
  channelTitle: 18, // channel name above the conversation
};

// People in the sidebar's direct-message list: picture size and corner
// radius in px (Slack: a 20px rounded square; Buzz: a larger circle).
const DM_AVATAR = 20;
const DM_AVATAR_RADIUS = 5;
// How far (px) sidebar row names are raised to sit at the row's centre.
const NAME_NUDGE = 1;

// Message avatars: corner radius in px (Slack ~8; a large number = circle).
const AVATAR_RADIUS = 8;
// Left margin (px) of each message row, measured so the avatar lines up with
// the message box edge as in Slack (Buzz centers rows instead). Raise it to
// move messages right, lower it to move them left.
const MESSAGE_INDENT = 5;
// Gap (px) between avatar and text.
const AVATAR_GAP = 8;

// Space above/below each message in a run from one person (Buzz: 4).
const STACK_GAP = 4;

// Dock labels to replace, keyed by part of the dock tab's page id:
// Messages (buzz.channels) becomes 홈 like Slack; "Create an agent" (the
// bestie page) becomes bot.
const DOCK_RENAMES = { channels: t("홈", "Home"), bestie: "bot" };
// Extra dock apps, shown below Home in this order. Each opens Buzz's
// Activity page on the given tab. Remove a line to hide it.
const DOCK_APPS = [
  { id: "dm", label: t("DM", "DMs"), activity: "dms", icon: "M7.9 20A9 9 0 1 0 4 16.1L2 22z" },
  { id: "activity", label: t("내 활동", "Activity"), activity: "all", icon: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" },
];

// Dock icons to replace, keyed by part of the tab's page id (SVG path on a
// 24x24 grid). Messages is Home, so it gets a house.
const DOCK_ICON_OVERRIDES = {
  "buzz.channels": "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H4a1 1 0 0 1-1-1z",
};

// Dock order from the top, by part of each app's page id. Apps not listed
// (Agents, other plugins) follow below.
const DOCK_ORDER = ["bestie", "buzz.channels", "slack-sidebar/dock-dm", "slack-sidebar/dock-activity"];

// Order of the rows pinned under Activity, by their sidebar title.
// (Rows are matched by their title, so this follows ACTIVITY_ROWS labels.)
const PINNED_ORDER = ACTIVITY_ROWS.map((row) => row.label);

// Hide Buzz's own 내 활동 (Activity) row at the top of the sidebar; the left
// bar already has it.
const HIDE_ACTIVITY_ROW = true;

// Slack's 허들 row in the pinned rows, placed after 스레드. It opens a page
// (built by this plugin) listing recent huddles in your channels; choosing
// one opens its channel. Set HUDDLES to false to hide it.
const HUDDLES = true;
const HUDDLES_LABEL = t("허들", "Huddles");
if (HUDDLES) PINNED_ORDER.splice(1, 0, HUDDLES_LABEL);

// Dock icon tile and glyph size in px (Slack's tile is about 36).
const DOCK_TILE = 36;
const DOCK_ICON = 20;

// Move Buzz's round + button from the bottom of the sidebar into the left
// bar, above the workspace button, as in Slack. The number is its distance
// (px) from the bottom of the window.
const DOCK_NEW_BUTTON = true;
const DOCK_NEW_BUTTON_BOTTOM = 106;

// Show dock labels under the icons, like Slack's left bar.
const DOCK_LABELS = true;

// Selected row in the @mention suggestions (Slack's blue).
const MENTION_SELECTED = "#1264A3";
// Text color of inline code in messages (Slack's pinkish red).
const INLINE_CODE_COLOR = "#C01343";
// Color of the "new messages" line in a conversation (Slack's red).
const NEW_LINE_COLOR = "#E01E5A";

// Weight of names above messages: 700 bold, 800 heavier, 900 black.
const AUTHOR_WEIGHT = 800;
// Weight of the channel name in the conversation header.
const CHANNEL_TITLE_WEIGHT = 800;
// Channel header spacing (px): title row height, tab row height, gap between
// tabs, and the left inset shared by the title and the tabs.
const HEADER = { titleRow: 49, tabRow: 40, tabGap: 12, inset: 20 };

// Buzz's Activity row: no title while its hover preview is on, otherwise
// titled "Activity".
const ACTIVITY_ROW = '[data-popup-preview], :not([title]), [title="Activity"]';

const SIDEBAR = ":is(.shell-sidebar, .shell-sidebar-default)";
const CHROME = ":is(.shell-header, .shell-side-dock)";

// Light ink for anything drawn on a dark purple surface.
function darkSurfaceVars(c) {
  return `
  --text-standard: ${c.textStrong};
  --text-primary: ${c.textStrong};
  --text: ${c.textStrong};
  --text-subtle: ${c.textMuted};
  --text-secondary: ${c.textMuted};
  --text-tertiary: ${c.textMuted};
  --text-metadata: ${c.textMuted};
  --text-quiet-control: ${c.textMuted};
  --text-placeholder: ${c.textMuted};
  --scrollbar-thumb: ${c.scrollbar};
  --scrollbar-thumb-quiet: ${c.scrollbar};
  --text-navigation: ${c.text};
  --text-navigation-unread: ${c.textStrong};
  --text-row: ${c.text};
  --text-sidebar-hover: ${c.textStrong};
  --affordance-sidebar-hover: ${c.hover};
  --affordance-navigation-quiet: ${c.hover};
  --affordance-subtle: ${c.hover};
  --affordance-subtle-hover: ${c.hover};
  --affordance-subtle-pressed: ${c.pressed};
  --interaction-hover: ${c.hover};
  --interaction-pressed: ${c.pressed};
  --border: ${c.border};
  --border-subtle: ${c.border};
  --border-standard: ${c.border};`;
}

// Dock tabs keep their label in a screen-reader-only span; this shows it
// under the icon and moves the selected fill onto the icon tile.
function dockLabelCss(c) {
  // The dock wrapper is .buzz-tabs or .buzz-tab-panels depending on the
  // Buzz version, so match it by its variant only.
  const TAB = ".shell-side-dock [role=\"tab\"][data-icon-only]";
  return `
${TAB} {
  width: 56px !important;
  height: auto !important;
  padding: 2px 0 4px !important;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: transparent !important;
}
${TAB} .buzz-tabs-icon {
  display: flex !important;
  align-items: center;
  justify-content: center;
  flex: none !important;
  width: ${DOCK_TILE}px !important;
  min-width: ${DOCK_TILE}px !important;
  max-width: ${DOCK_TILE}px !important;
  height: ${DOCK_TILE}px !important;
  aspect-ratio: 1;
  padding: 0 !important;
  border-radius: 9px;
  color: ${c.textMuted};
}
${TAB} .buzz-tabs-icon svg {
  width: ${DOCK_ICON}px !important;
  height: ${DOCK_ICON}px !important;
  stroke-width: 1.75;
}
${TAB}[data-selected] .buzz-tabs-icon,
${TAB}[aria-selected="true"] .buzz-tabs-icon { color: ${c.textStrong}; }
/* Slack swaps to a filled icon when selected. Buzz ships outline icons
   only, so the selected one is filled with its own stroke color. */
${TAB} .buzz-tabs-icon svg :is(path, rect, circle, ellipse, polygon) {
  transition: fill 120ms ease;
}
/* Icons with inner details (the Agents robot) turn into a blob when filled,
   so they keep their outline. */
${TAB}:is([data-selected], [aria-selected="true"]):not([id*="agent"]) .buzz-tabs-icon svg :is(path, rect, circle, ellipse, polygon) {
  fill: currentColor;
}
${TAB}:hover .buzz-tabs-icon { background: ${c.hover}; }
${TAB}:is([data-selected], [aria-selected="true"]) .buzz-tabs-icon { background: ${c.dockSelected}; }
${TAB} .sr-only {
  clip-path: none !important;
  border: 0 !important;
  position: static !important;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: visible !important;
  clip: auto !important;
  white-space: nowrap;
  font-size: 11px;
  line-height: 13px;
  font-weight: 600;
  color: ${c.textStrong};
}
${TAB} .buzz-tabs-badge { inset-inline-end: 6px !important; }

/* Redrawn dock icons: this plugin's apps (page icons are fixed images) and
   DOCK_ICON_OVERRIDES (Home gets a house). The original glyph is hidden and
   the shape is drawn as a mask in the tab's color: outline normally, filled
   when selected, like Buzz's own icons. */
${[
  ...DOCK_APPS.map((app) => [`[data-tab-value*="slack-sidebar/dock-${app.id}"]`, app.icon]),
  ...Object.entries(DOCK_ICON_OVERRIDES).map(([key, d]) => [`[data-tab-value*="${key}"]`, d]),
].map(([match, d]) => {
  const tab = `${TAB}${match}`;
  const outline = maskUrl(d, false);
  const filled = maskUrl(d, true);
  return `${tab} .buzz-tabs-icon { position: relative; }
${tab} .buzz-tabs-icon > * { opacity: 0 !important; }
${tab} .buzz-tabs-icon::after {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: ${DOCK_ICON}px;
  height: ${DOCK_ICON}px;
  background: currentColor;
  -webkit-mask: ${outline} center / contain no-repeat;
  mask: ${outline} center / contain no-repeat;
}
${tab}:is([data-selected], [aria-selected="true"]) .buzz-tabs-icon::after {
  -webkit-mask-image: ${filled};
  mask-image: ${filled};
}`;
}).join("\n")}

/* DM and 내 활동 forward into Activity, which belongs to Home, so Buzz
   selects Home. While Activity shows the matching tab, draw that dock app
   as selected and Home as not. */
${DOCK_APPS.map((app) => {
  const ACT = '[role="tablist"][aria-label="Activity type"]';
  const showing =
    app.activity === "dms"
      ? `${ACT} [data-tab-value="dms"][aria-selected="true"]`
      : `${ACT} [data-tab-value]:not([data-tab-value="dms"])[aria-selected="true"]`;
  const mine = `body:has(${showing}) ${TAB}[data-tab-value*="slack-sidebar/dock-${app.id}"]`;
  const home = `body:has(${showing}) ${TAB}[data-tab-value*="buzz.channels"]`;
  const homeIcon = DOCK_ICON_OVERRIDES["buzz.channels"];
  return `${mine} .buzz-tabs-icon { background: ${c.dockSelected} !important; color: ${c.textStrong} !important; }
${mine} .buzz-tabs-icon::after { -webkit-mask-image: ${maskUrl(app.icon, true)} !important; mask-image: ${maskUrl(app.icon, true)} !important; }
${home} .buzz-tabs-icon { background: transparent !important; color: ${c.textMuted} !important; }
${home}:hover .buzz-tabs-icon { background: ${c.hover} !important; }
${homeIcon ? `${home} .buzz-tabs-icon::after { -webkit-mask-image: ${maskUrl(homeIcon, false)} !important; mask-image: ${maskUrl(homeIcon, false)} !important; }` : ""}`;
}).join("\n")}

/* Renamed dock labels, matched by part of the dock tab's page id. */
${Object.entries(DOCK_RENAMES)
  .map(
    ([key, label]) => `${TAB}[id*="${key}"] .sr-only { font-size: 0 !important; }
${TAB}[id*="${key}"] .sr-only::after { content: ${JSON.stringify(label)}; font-size: 11px; }`,
  )
  .join("\n")}

/* Dock order. Each tab sits in a display:contents wrapper, so the order
   goes on the tab itself; tabs are matched by their page (data-tab-value). */
.shell-side-dock .buzz-tabs-list [role="tab"] { order: 50; }
${DOCK_ORDER.map(
  (key, i) => `.shell-side-dock .buzz-tabs-list [role="tab"][data-tab-value*="${key}"] { order: ${i}; }`,
).join("\n")}
`;
}

function buildCss(c) {
  return `
/* Buzz renders text with grayscale antialiasing ("antialiased"), which on
   macOS draws glyphs thinner than Slack. "auto" uses the system default. */
${FONT_SMOOTHING ? `:root, :root * { -webkit-font-smoothing: ${FONT_SMOOTHING} !important; -moz-osx-font-smoothing: auto !important; }` : ""}

${SLACK_FONTS ? `${[
  /* Slack ships only Regular and Bold, and draws every heavier weight
     with Bold; Buzz's medium (500) text reads as regular there. */
  ["100 500", "Regular"],
  ["600 900", "Bold"],
].map(([weight, name]) => `@font-face {
  font-family: "Slack Korean";
  font-weight: ${weight};
  src: local("NotoSansKR-${name}"), local("Noto Sans KR ${name}"), local("NotoSansCJKkr-${name}"), local("Noto Sans CJK KR ${name}");
}`).join("\n")}
:root {
  --font-sans: "Slack Korean", "Slack-Lato", "Lato", "Inter Variable", Inter, ui-sans-serif, system-ui, -apple-system, sans-serif !important;
}` : ""}

${SLACK_LETTER_SPACING ? `:root {
${["body", "body-lg", "body-sm", "caption", "heading", "label", "label-sm", "message", "title"]
  .map((name) => `  --text-${name}--letter-spacing: 0em !important;`)
  .join("\n")}
}` : ""}

${SLACK_CORNERS ? `/* Corners everywhere: Slack's small plain-round corners on menus, dialogs,
   cards, buttons and rows, in place of Buzz's large squircles. Pills and
   circles (avatars, round buttons) keep their shape. */
:root {
${Object.entries(SLACK_CORNERS).map(([name, px]) => `  --${name}: ${px}px !important;`).join("\n")}
}
*, *::before, *::after { corner-shape: round !important; }` : ""}

/* Window background behind everything: solid aubergine, no dot texture. */
.shell-background {
  background-color: ${c.chrome} !important;
  background-image: none !important;
}
.shell-background::before, .shell-background::after { display: none; }

/* Top bar and dock: light ink, pills sit on the chrome color. */
${CHROME}, ${CHROME} * {
  --bg-app: ${c.chrome};${darkSurfaceVars(c)}
}
${CHROME} { color: ${c.textStrong}; }
.shell-menu-search > .buzz-button {
  background: ${c.searchFill} !important;
  border-color: transparent !important;
  color: ${c.text} !important;
}
/* Search box in the top bar: Slack's wide, low box with small corners and
   white text from the left (Buzz: a narrower, taller pill with a ⌘K chip). */
.shell-menu-search { max-width: min(52rem, 43vw) !important; }
.shell-menu-search > .buzz-button,
.shell-menu-search > .buzz-button::before,
.shell-menu-search > .buzz-button::after {
  border-radius: 6px !important;
  corner-shape: round !important;
}
.shell-menu-search > .buzz-button {
  height: ${SEARCH_HEIGHT}px !important;
  min-height: ${SEARCH_HEIGHT}px !important;
  padding-inline: 8px !important;
}
.shell-menu-search .shell-search-content { color: ${c.textStrong} !important; font-size: 13px; }
.shell-menu-search .shell-search-content > :nth-child(n + 3) { display: none !important; }

/* The joined outer panel becomes see-through, so the sidebar sits on the
   chrome and only the conversation is a white card. */
.shell-body .panel:has(> .shell-content) {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}
/* Dock never scrolls sideways (that showed a stray white scrollbar). */
.shell-dock-pages {
  overflow-x: hidden !important;
  scrollbar-width: none;
}
.shell-dock-pages::-webkit-scrollbar { display: none; }

/* Sidebar and conversation form one card: rounded only on its outer
   corners, square where they meet. */
#main-content > .panel,
#main-content > .panel::before,
#main-content > .panel::after,
${SIDEBAR} { corner-shape: round !important; }
/* Every panel in the workspace takes its corners from this value: the
   outer joined panel clips the sidebar and conversation to it. */
.shell-body { --radius-container: ${CARD_RADIUS}px; }
.shell-body .panel { corner-shape: round !important; }
#main-content > .panel {
  border-radius: 0 ${CARD_RADIUS}px ${CARD_RADIUS}px 0 !important;
  overflow: hidden;
  box-shadow: var(--shadow-panel);
}

/* Sidebar. Nested panels inside it paint --surface-panel, so that is
   redefined too. */
${SIDEBAR} {
  background: ${c.sidebar};
  color: ${c.text};
  border-radius: ${CARD_RADIUS}px 0 0 ${CARD_RADIUS}px !important;
  margin-inline-end: 0;
}
${SIDEBAR}, ${SIDEBAR} * {
  --surface-panel: ${c.sidebar};
  --surface: ${c.sidebar};
  /* Floating controls in the sidebar ("12 unread" pills, the + button). */
  --surface-popover: ${c.floating};
  --surface-elevated-glass: ${c.floating};
  --affordance-floating-control: ${c.floating};
  --affordance-floating-control-hover: ${c.hover};
  --affordance-floating-control-pressed: ${c.pressed};
  --border-floating-control: transparent;${darkSurfaceVars(c)}
  --surface-sidebar-selected: ${c.selected};
  --surface-navigation-selected: ${c.selected};
  --affordance-navigation-selected: ${c.selected};
  --text-sidebar-selected: ${c.selectedText};
  --text-navigation-selected: ${c.selectedText};
  --text-row-selected: ${c.selectedText};
  --text-row-selected-subtle: ${c.selectedText};
  --text-row-selected-metadata: ${c.selectedText};
}

/* Dock: icon tiles light on purple; the selected one gets a soft tile. */
${CHROME}, ${CHROME} * {
  --text-chrome-subtle: ${c.textMuted};
  --affordance-backdrop-hover: ${c.hover};
  --affordance-backdrop-pressed: ${c.pressed};
  --surface-sidebar-selected: ${c.dockSelected};
  --text-sidebar-selected: ${c.textStrong};
}
${DOCK_LABELS ? dockLabelCss(c) : ""}

/* Message box: Slack's squarer box with a gray border that darkens on focus. */
/* The border is a solid gray, not a see-through one: a see-through 1px
   line thins out around the corners. */
[data-composer-surface] {
  border-radius: 8px !important;
  /* Buzz draws corners as squircles, which thin the border out at a small
     radius; plain round corners keep it even. */
  corner-shape: round !important;
  box-shadow: none !important;
  border-color: color-mix(in srgb, var(--text-standard) ${COMPOSER_BORDER}%, var(--surface-composer, #fff)) !important;
}
[data-composer-surface]:focus-within {
  border-color: color-mix(in srgb, var(--text-standard) ${COMPOSER_BORDER_FOCUS}%, var(--surface-composer, #fff)) !important;
  outline: none !important;
  box-shadow: none !important;
}

${DOCK_NEW_BUTTON ? `/* The round + button floats over the bottom of the sidebar in Buzz; Slack
   keeps it in the left bar above the workspace and profile buttons. Buzz's
   button can't leave the sidebar, so it is made invisible and a copy in the
   left bar (added by addDockNewButton) presses it. */
${SIDEBAR} [aria-label="New options"] { opacity: 0 !important; pointer-events: none !important; }
/* The round backing drawn behind it goes too. */
${SIDEBAR} :has(> [aria-label="New options"]):not(:has(> :nth-child(2))) { opacity: 0 !important; pointer-events: none !important; }
.slack-new-button {
  all: unset;
  position: fixed;
  left: 16px;
  bottom: ${DOCK_NEW_BUTTON_BOTTOM}px;
  width: 36px;
  height: 36px;
  display: none;
  place-items: center;
  border-radius: 50%;
  background: ${c.dockSelected};
  color: ${c.textStrong};
  cursor: pointer;
  z-index: 5;
}
.slack-new-button:hover { background: rgba(255, 255, 255, 0.3); }
.slack-new-button svg { width: 20px; height: 20px; }
body:has(${SIDEBAR} [aria-label="New options"]) .slack-new-button { display: grid; }` : ""}

/* Sidebar rows: Slack's slightly rounded rectangle instead of a pill. */
${SIDEBAR} [data-variant="row"],
${SIDEBAR} [data-variant="row"]::before,
${SIDEBAR} [data-variant="row"]::after {
  border-radius: ${ROW_RADIUS}px !important;
  corner-shape: round !important;
}
${SIDEBAR}, ${SIDEBAR} * {
  --radius-row: ${ROW_RADIUS}px;
  /* Unread channels: Buzz draws them semibold (600); Slack is bolder. */
  --type-weight-semibold: ${UNREAD_WEIGHT};
}

/* Messages: Slack's rounded-square avatars and tighter runs of messages
   from the same person ([data-highlight-surface] is each message row). */
[data-highlight-surface] .buzz-avatar,
[data-highlight-surface] .buzz-avatar :is(img, [data-avatar-fallback]) {
  border-radius: ${AVATAR_RADIUS}px !important;
  corner-shape: round !important;
}
/* Direct-message rows in the sidebar ([data-dm-identity] wraps the picture). */
${SIDEBAR} [data-dm-identity] {
  width: ${DM_AVATAR}px !important;
  height: ${DM_AVATAR}px !important;
  min-width: ${DM_AVATAR}px !important;
  flex: none !important;
}
/* Buzz cuts the picture into a circle with a mask; drop it so the corners
   show, and ring the status dot in the sidebar color instead. */
/* A group DM's square shows how many others are in it. Buzz centres the
   number with line-height, which sits a pixel low in the 20px square;
   centre it as a box instead. */
${SIDEBAR} [data-dm-participant-count] {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  padding: 0 !important;
  font-variant-numeric: tabular-nums;
}
/* Names in this font sit about 1px below the row's centre, while the
   picture, count square and muted bell beside them are centred (measured
   from screenshots). Raise only the name text. */
${SIDEBAR} [data-channel-sidebar-row] [class*="_nameContent_"] > [class*="_label_"] {
  position: relative; top: ${-NAME_NUDGE}px;
}
${SIDEBAR} [data-dm-identity] .buzz-avatar { -webkit-mask: none !important; mask: none !important; }
${SIDEBAR} [data-dm-identity] .buzz-avatar-status-dot { box-shadow: 0 0 0 2px ${c.sidebar}; }
${SIDEBAR} [data-dm-identity],
${SIDEBAR} [data-dm-identity] .buzz-avatar,
${SIDEBAR} [data-dm-identity] .buzz-avatar :is(img, [data-avatar-fallback]) {
  border-radius: ${DM_AVATAR_RADIUS}px !important;
  corner-shape: round !important;
}
/* Slack lines the avatar up with the message box's left edge and keeps the
   name close to it. Every row gets the same shift and gap, so follow-up
   lines stay aligned under the name. */
[data-highlight-surface] {
  margin-inline-start: ${MESSAGE_INDENT}px !important;
  gap: ${AVATAR_GAP}px !important;
}
[data-highlight-surface][data-stack-next] { padding-bottom: ${STACK_GAP}px !important; }
[data-highlight-surface][data-stack-previous] { padding-top: ${STACK_GAP}px !important; }

/* Pinned rows at the top of the sidebar: Activity first, then
   PINNED_ORDER; Buzz itself sorts them by name. */
nav.shell-pages { display: flex; flex-direction: column; gap: 0 !important; row-gap: 0 !important; }
/* Slack's pinned rows are 28px tall with no gap (Buzz: 31px plus a gap). */
nav.shell-pages > * {
  height: ${PINNED_ROW_HEIGHT}px !important;
  min-height: ${PINNED_ROW_HEIGHT}px !important;
  margin-block: 0 !important;
  padding-block: 0 !important;
}
nav.shell-pages > * { order: 50; }
/* Activity is the only pinned row without a title attribute. */
nav.shell-pages > :is(${ACTIVITY_ROW}) { order: 0; }
${HIDE_ACTIVITY_ROW ? `/* 내 활동 is already an app in the left bar, so its sidebar row is hidden. */
nav.shell-pages > :is(${ACTIVITY_ROW}) { display: none !important; }` : ""}

/* Buzz selects Activity for every Activity tab; while a pinned row's tab
   is showing, that row looks selected instead and Activity does not. */
${ACTIVITY_ROWS.map((row) => {
  const showing = `[role="tablist"][aria-label="Activity type"] [data-tab-value="${row.id}"][aria-selected="true"]`;
  const mine = `body:has(${showing}) nav.shell-pages > [title=${JSON.stringify(row.label)}]`;
  const activity = `body:has(${showing}) nav.shell-pages > :is(${ACTIVITY_ROW})`;
  return `${mine} { background: ${c.selected} !important; color: ${c.selectedText} !important; --text-row: ${c.selectedText}; --text-navigation: ${c.selectedText}; }
${mine} .shell-page-icon img { filter: brightness(0.3); }
${activity} { background: transparent !important; color: ${c.text} !important; --text-row-selected: ${c.text}; --text-navigation-selected: ${c.text}; --surface-navigation-selected: transparent; --affordance-navigation-selected: transparent; --interaction-selected: transparent; }
${activity}:hover { background: ${c.hover} !important; }`;
}).join("\n")}
/* A selected pinned row is light lilac, so its light icon is darkened to
   stay visible (page icons are fixed images, not text-colored). */
nav.shell-pages > [data-selected] .shell-page-icon img { filter: brightness(0.3); }
${PINNED_ORDER.map(
  (title, i) => `nav.shell-pages > [title=${JSON.stringify(title)}] { order: ${i + 1}; }`,
).join("\n")}

/* Rows inside a sidebar section sit further right than its title, as in
   Slack. The title is a <details> and the rows sit in a sibling after it,
   so the indent goes inside each row: the selected and hover colors still
   run the full width, only the icon or picture and the name move over. */
${SIDEBAR} [data-sidebar-section] [data-channel-sidebar-row] [data-variant="row"] {
  padding-inline-start: calc(var(--space-2) + var(--space-half) + ${SECTION_INDENT}px) !important;
}

/* Slack's sizes, measured from its screenshots. */
/* Channel rows: 28px each, no gap between them (Buzz: 25px plus a gap). */
:has(> [data-channel-sidebar-row]) { gap: 0 !important; row-gap: 0 !important; }
[data-channel-sidebar-row] {
  margin-block: 0 !important;
  padding-block: 0 !important;
  min-height: ${SIZES.sidebarRow}px !important;
}
[data-channel-sidebar-row] [data-variant="row"] {
  min-height: ${SIZES.sidebarRow}px !important;
  height: ${SIZES.sidebarRow}px !important;
}
${SIDEBAR} :is([data-channel-sidebar-row], nav.shell-pages) .navigation-item-label {
  font-size: ${SIZES.sidebarText}px !important;
}
/* Unread channels are white and bold in every section. Stated outright
   because the section-title rule below otherwise wins inside 즐겨찾기
   (Starred), whose rows sit differently from the other sections. */
${SIDEBAR} [data-ordinary]:not([data-selected]) :is(.navigation-item-label, .navigation-item-label *) {
  color: ${c.textStrong} !important;
  font-weight: ${UNREAD_WEIGHT} !important;
}
${SIDEBAR} [data-ordinary][data-selected] :is(.navigation-item-label, .navigation-item-label *) {
  color: ${c.selectedText} !important;
  font-weight: ${UNREAD_WEIGHT} !important;
}
/* Section titles read like rows in Slack: same size, regular ink. */
${SIDEBAR} details > summary,
${SIDEBAR} details > summary :not(svg, svg *) {
  font-size: ${SIZES.sidebarText}px !important;
  color: ${c.text} !important;
  font-weight: 400 !important;
}
/* Message text, bylines and pictures at Slack's fixed sizes, so they stay
   the same whatever Buzz's Interface size is. Buzz sizes message text with
   --text-message (a size and a unitless line-height ratio). */
[data-highlight-surface] {
  --text-message: ${SIZES.messageText}px;
  --text-message--line-height: ${(SIZES.messageLine / SIZES.messageText).toFixed(4)};
  --text-body: ${SIZES.messageText}px;
  --text-body--line-height: ${SIZES.messageLine}px;
}
[data-highlight-surface] [data-copy-author] strong { font-size: ${SIZES.messageText}px !important; }
/* The message box uses the same --text-message size as messages. */
[data-composer-surface] {
  --text-message: ${SIZES.messageText}px;
  --text-message--line-height: ${(SIZES.messageLine / SIZES.messageText).toFixed(4)};
}
[data-highlight-surface] [data-copy-author] time,
[data-highlight-surface] [class*="_continuationTime_"] {
  font-size: ${SIZES.messageTime}px !important;
}
/* Picture column: the picture and the empty column of follow-up lines are
   the same width, so text stays aligned under the name. */
[data-highlight-surface] :is([class*="_messageAvatar_"], [class*="_messageGutter_"]) {
  flex: 0 0 ${SIZES.messageAvatar}px !important;
  width: ${SIZES.messageAvatar}px !important;
  min-width: ${SIZES.messageAvatar}px !important;
}
[data-highlight-surface] [class*="_messageAvatar_"] :is(button, .buzz-avatar-status, .buzz-avatar, .buzz-avatar img) {
  width: ${SIZES.messageAvatar}px !important;
  height: ${SIZES.messageAvatar}px !important;
  min-width: 0 !important;
}
/* Agents' "available" pill beside their picture (and its notch cut into
   the picture) is not something Slack shows; hidden in messages and cards.
   The "thinking" animation stays. People's presence dots are hidden in
   messages too, as in Slack. */
:is([data-highlight-surface], [aria-label$=" profile preview"]) .badge-pill-root:not([data-thinking]) :is(.badge-pill-canvas, .badge-pill-cutout, .badge-pill-notch, .badge-pill-ink, .badge-pill-measure) {
  display: none !important;
}
:is([data-highlight-surface], [aria-label$=" profile preview"]) .badge-pill-root:not([data-thinking]) .badge-motion-artwork {
  mask: none !important;
  -webkit-mask: none !important;
  clip-path: none !important;
}
:is([data-highlight-surface], [aria-label$=" profile preview"]) .buzz-avatar-status-dot { display: none !important; }

/* Every message picture is also the profile-card button; size the button
   and the picture inside it (not its container: in agent messages that
   container is the whole message). */
[data-highlight-surface] [data-preview-card-trigger]:not([data-thread-summary] *),
[data-highlight-surface] [data-preview-card-trigger]:not([data-thread-summary] *) :is(.buzz-avatar-status, .buzz-avatar, .buzz-avatar img) {
  width: ${SIZES.messageAvatar}px !important;
  height: ${SIZES.messageAvatar}px !important;
  min-width: 0 !important;
  max-width: none !important;
}
[data-highlight-surface] [data-preview-card-trigger]:not([data-thread-summary] *) { padding: 0 !important; }
/* Buzz wraps the picture in a padded round button; drop the padding so the
   picture itself is the full size. */
[data-highlight-surface] [class*="_messageAvatar_"] button {
  padding: 0 !important;
  --size-icon-button: ${SIZES.messageAvatar}px;
}

/* Hover toolbar on a message: Slack's rounded rectangle with square-ish
   buttons instead of Buzz's pill. */
/* Measured from Slack: 41px tall, 12px corners, a #CBCBCB border. */
[role="group"][aria-label="Message actions"] {
  border-radius: ${TOOLBAR_RADIUS}px !important;
  corner-shape: round !important;
  padding: 3px !important;
  gap: 0 !important;
  background: ${FILE_CARD_BG} !important;
  border: 1px solid ${TOOLBAR_BORDER} !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
}
:root[data-color-mode="dark"] [role="group"][aria-label="Message actions"] { background: ${FILE_CARD_BG_DARK} !important; border-color: rgba(255, 255, 255, 0.14) !important; }
/* Slack's icons are darker and a little larger than Buzz's. */
[role="group"][aria-label="Message actions"] :is(button, [role="button"]) { color: var(--text-standard) !important; }
[role="group"][aria-label="Message actions"] :is(button, [role="button"]) svg { width: 18px !important; height: 18px !important; }
/* The toolbar's icons, Slack's thin ones (TOOLBAR_ICONS): Buzz's own SVG is
   hidden and the box holding it paints the mask instead. */
.slack-forward-button { display: inline-flex; align-items: center; justify-content: center; border: 0; background: transparent; cursor: pointer; padding: 0; }
.slack-forward-button:hover { background: color-mix(in srgb, var(--text-standard) 8%, transparent) !important; }
[role="group"][aria-label="Message actions"] [data-slack-icon] svg { visibility: hidden !important; }
[role="group"][aria-label="Message actions"] [data-slack-icon] :has(> svg),
.slack-forward-button::before {
  width: 18px !important; height: 18px !important; display: inline-block; background: currentColor !important;
}
.slack-forward-button::before { content: ""; }
${Object.entries(TOOLBAR_ICONS).map(([label, d]) => {
  const mask = toolbarMask(d, label === "More message actions" ? 2.6 : 1.6);
  const where = label === "share" ? `.slack-forward-button::before` : `[role="group"][aria-label="Message actions"] [data-slack-icon=${JSON.stringify(label)}] :has(> svg)`;
  return `${where} { -webkit-mask: ${mask} center / contain no-repeat; mask: ${mask} center / contain no-repeat; }`;
}).join("\n")}
[role="group"][aria-label="Message actions"] :is(button, [role="button"]) {
  width: 32px !important;
  height: 32px !important;
  border-radius: 6px !important;
  corner-shape: round !important;
}
[role="group"][aria-label="Message actions"] :is(button, [role="button"])::before,
[role="group"][aria-label="Message actions"] :is(button, [role="button"])::after {
  border-radius: 6px !important;
  corner-shape: round !important;
}

/* Message box rows sit closer together, as in Slack. */
[data-composer-surface] { --composer-gap: 4px; }
${FORMAT_BAR ? `/* Slack's formatting bar across the top of the message box (added by
   addFormatBars below). Buzz's own Aa toolbar would replace the bottom row
   of buttons, so its toggle is hidden. */
[data-composer-surface]:has(> .slack-format-bar) {
  padding-top: ${FORMAT_BAR_HEIGHT + 4}px !important;
}
/* Buzz's Aa button shows and hides this bar instead (see addFormatBars);
   it is underlined while the bar is showing, as in Slack. */
:root[data-slack-format-bar="hidden"] .slack-format-bar { display: none; }
:root[data-slack-format-bar="hidden"] [data-composer-surface]:has(> .slack-format-bar) {
  padding-top: var(--space-3, 12px) !important;
}
:root:not([data-slack-format-bar="hidden"]) [data-composer-surface] button[aria-label="Toggle formatting"] svg {
  border-bottom: 1.5px solid currentColor;
}
.slack-format-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${FORMAT_BAR_HEIGHT}px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: ${COMPOSER_BUTTON_GAP}px;
  padding-inline: 4px;
  z-index: 1;
  background: color-mix(in srgb, var(--text-standard) 4%, var(--surface-composer, transparent));
  border-bottom: 1px solid color-mix(in srgb, var(--text-standard) 8%, transparent);
  border-radius: 7px 7px 0 0;
  corner-shape: round;
}
.slack-format-bar > button {
  all: unset;
  box-sizing: border-box !important;
  flex: none !important;
  width: 28px !important;
  height: 28px !important;
  min-width: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  display: grid !important;
  place-items: center;
  border-radius: 4px;
  color: color-mix(in srgb, var(--text-standard) 70%, transparent);
  font-size: 17px;
  line-height: 1;
  cursor: pointer;
}
.slack-format-bar > button:hover { background: color-mix(in srgb, var(--text-standard) 8%, transparent); color: var(--text-standard); }
.slack-format-bar > button svg { display: block; width: ${COMPOSER_ICON}px; height: ${COMPOSER_ICON}px; }
.slack-format-bar > span {
  flex: none;
  width: 1px;
  height: 20px;
  margin: 0 5px;
  background: color-mix(in srgb, var(--text-standard) 13%, transparent);
}
/* Bottom row (marked by addFormatBars): Slack packs its buttons closer and
   draws the icons larger inside them. */
.slack-composer-row { gap: ${COMPOSER_BUTTON_GAP}px !important; }
.slack-composer-row :is(button, [role="button"]) {
  width: 28px !important;
  height: 28px !important;
  min-width: 0 !important;
  min-height: 0 !important;
  padding: 0 !important;
}
.slack-composer-row :is(button, [role="button"]) svg {
  width: ${COMPOSER_ICON}px !important;
  height: ${COMPOSER_ICON}px !important;
}
/* Slack grays the formatting buttons out until the message box is in use. */
[data-composer-surface]:not(:focus-within) .slack-format-bar > button { opacity: 0.45; }` : ""}
${PLACEHOLDER_SUFFIX ? `/* Empty channel message box: Buzz draws "Message", the channel icon and
   the name; Slack's order is icon, name, then the words. */
${Object.entries(PLACEHOLDERS)
  .map(
    ([start, text]) =>
      `[data-composer-surface] [data-placeholder^=${JSON.stringify(start)}]::before { content: ${JSON.stringify(text)} !important; }`,
  )
  .join("\n")}
[data-composer-surface] [data-lead="Message"][data-name]::before { content: "" !important; }
[data-composer-surface] [data-lead="Message"][data-name]::after {
  content: attr(data-name) ${JSON.stringify(PLACEHOLDER_SUFFIX)} !important;
}` : ""}

/* Date divider: Slack's line across the conversation with the date in a
   bordered pill (Buzz: a small calendar icon and gray caption). The divider
   is the element holding the [data-day] label. */
:has(> span > [data-day]) {
  gap: 0 !important;
  color: var(--text-standard) !important;
}
:has(> span > [data-day])::before,
:has(> span > [data-day])::after {
  height: 1px !important;
  background: color-mix(in srgb, var(--text-standard) 13%, transparent) !important;
}
span:has(> [data-day]) {
  height: 28px;
  padding: 0 16px;
  border: 1px solid color-mix(in srgb, var(--text-standard) 13%, transparent);
  border-radius: 24px;
  corner-shape: round;
  font-size: 13px;
  line-height: 27px;
  font-weight: 700;
}
span:has(> [data-day]) > :not([data-day]) { display: none !important; }

/* "New messages" line: Slack draws one red line with a red label at its
   right end. */
[data-new-messages-boundary] {
  color: ${NEW_LINE_COLOR} !important;
  font-weight: 700;
  font-size: 13px;
  gap: 8px !important;
}
[data-new-messages-boundary]::before { background: ${NEW_LINE_COLOR} !important; }
[data-new-messages-boundary]::after { display: none !important; }

/* Code in messages. Block: Slack's full-width light gray box with a thin
   border and small corners (Buzz: a narrow box with large corners). */
[data-highlight-surface] pre,
[data-composer-surface] [contenteditable] pre {
  display: block !important;
  width: auto !important;
  min-width: 100% !important;
  align-self: stretch !important;
  justify-self: stretch !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  margin-block: 4px !important;
  padding: 0 !important;
  background: color-mix(in srgb, var(--text-standard) 4%, transparent) !important;
  border: 1px solid color-mix(in srgb, var(--text-standard) 13%, transparent) !important;
  border-radius: 4px !important;
  corner-shape: round !important;
  box-shadow: none !important;
  font-size: 12px !important;
  line-height: 18px !important;
}
/* The text holding a code block spans the message, so the box does too. */
[data-highlight-surface] :has(pre) { width: 100% !important; box-sizing: border-box; }
[data-highlight-surface] pre code,
[data-composer-surface] [contenteditable] pre code {
  padding: 8px !important;
  font-size: 12px !important;
  line-height: 18px !important;
}
/* Copy button on a code block: smaller, so it fits inside a one-line block
   instead of being cut off at the bottom. */
[data-highlight-surface] pre > span:has(> [aria-label="Copy code block"]) {
  top: 4px !important;
  inset-inline-end: 4px !important;
  border-radius: 4px !important;
  corner-shape: round !important;
  background: var(--surface-panel, #fff) !important;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--text-standard) 13%, transparent);
}
[data-highlight-surface] pre [aria-label="Copy code block"] {
  width: 24px !important;
  height: 24px !important;
  min-width: 0 !important;
  min-height: 0 !important;
  padding: 0 !important;
  border-radius: 4px !important;
  corner-shape: round !important;
}
[data-highlight-surface] pre [aria-label="Copy code block"] svg { width: 14px !important; height: 14px !important; }
/* While typing, the code block is one box with no inner one: the padding
   goes on the box itself, and the line height matches the text so the
   cursor is as tall as the line, not taller than the box. */
[data-composer-surface] [contenteditable] pre {
  padding: 8px !important;
  line-height: 18px !important;
  min-height: 0 !important;
}
[data-composer-surface] [contenteditable] pre :is(code, span, div) {
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  background: transparent !important;
  font-size: 12px !important;
  line-height: 18px !important;
}
/* Inline code: Slack's pinkish red on a light gray chip. */
[data-highlight-surface] :not(pre) > code,
[data-composer-surface] [contenteditable] :not(pre) > code {
  padding: 2px 3px 1px !important;
  background: color-mix(in srgb, var(--text-standard) 4%, transparent) !important;
  border: 1px solid color-mix(in srgb, var(--text-standard) 13%, transparent) !important;
  border-radius: 3px !important;
  corner-shape: round !important;
  color: ${INLINE_CODE_COLOR} !important;
  font-size: 12px !important;
}

/* @mention suggestions: Slack's flat list of 32px rows, edge to edge, with
   the bold name and its detail on one line and a blue selected row (Buzz:
   padded rounded rows with the detail on a second line). */
${(() => {
  const POP = '[data-mention]:has(> [role="listbox"])';
  return `${POP} {
  padding: 8px 0 !important;
  border-radius: 8px !important;
  corner-shape: round !important;
}
${POP} [role="listbox"] { gap: 0 !important; }
${POP} [role="option"] {
  min-height: 32px;
  box-sizing: border-box;
  padding: 2px 20px 2px 16px !important;
  gap: 8px !important;
  border-radius: 0 !important;
  font-size: 15px;
}
${POP} [role="option"] > [aria-hidden="true"]:first-child {
  flex: none !important;
  width: 20px !important;
  height: 20px !important;
  overflow: hidden;
  border-radius: 4px;
}
/* The picture keeps its own larger size otherwise and spills out. */
${POP} [role="option"] > [aria-hidden="true"]:first-child :is(.buzz-avatar-status, .buzz-avatar, img, svg) {
  width: 20px !important;
  height: 20px !important;
  min-width: 0 !important;
  max-width: 20px !important;
}
${POP} [role="option"] > [aria-hidden="true"]:first-child [data-avatar-fallback] { font-size: 11px !important; }
${POP} [role="option"] .buzz-avatar,
${POP} [role="option"] .buzz-avatar :is(img, [data-avatar-fallback]) {
  border-radius: 4px !important;
  corner-shape: round !important;
}
${POP} [data-completion-label] {
  display: flex !important;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
}
${POP} [data-completion-label] > :first-child { font-weight: 700; flex: none; }
${POP} [data-completion-label] small {
  display: block !important;
  font-size: 15px !important;
  line-height: inherit !important;
  overflow: hidden;
  text-overflow: ellipsis;
}
${POP} [role="option"][aria-selected="true"] {
  background: ${MENTION_SELECTED} !important;
  color: #fff !important;
}
${POP} [role="option"][aria-selected="true"] small { color: #fff !important; }`;
})()}

/* Mentions inside the message box: Buzz keeps each one as a token whose
   data-source is the Nostr address; shown as the same chip as in messages. */
[data-composer-surface] [data-source^="nostr:npub"],
[data-composer-surface] [data-source^="nostr:nprofile"] {
  border-radius: 3px;
  padding: 0 2px;
  background: ${MENTION_CHIP.bg};
  color: ${MENTION_CHIP.text};
}
:root[data-color-mode="dark"] [data-composer-surface] :is([data-source^="nostr:npub"], [data-source^="nostr:nprofile"]) {
  color: ${MENTION_CHIP.textDark};
}
/* @here / @channel / @everyone are plain text, so they are painted with a
   text highlight (no change to the text itself): yellow, as they notify you. */
::highlight(slack-broadcast) {
  background-color: ${MENTION_CHIP.selfBg};
}

/* Profile card (hovering a picture or a name in a message), like Slack's:
   no color backdrop; a large rounded-square picture beside the name and
   local time; bordered buttons with their words below. Buzz's card is
   [aria-label="<name> profile preview"] > content > lockup + actions. */
${(() => {
  const CARD = '[aria-label$=" profile preview"]';
  // Real structure (from the diagnostic): card > content > [lockup > backdrop,
  // artwork > portrait, identity > name, local time p, time zone p], actions.
  // content becomes a grid and lockup/identity are flattened into it.
  const CONTENT = `${CARD} > div:first-child`;
  const LOCKUP = `${CONTENT} > div:first-child`;
  const IDENTITY = `${LOCKUP} > div:nth-child(3)`;
  const CLOCK = "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2";
  const clock = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${CLOCK}"/></svg>`)}")`;
  return `.buzz-preview-card-positioner[data-slack-card]:has(${CARD}) {
  position: fixed !important;
  top: var(--slack-card-top) !important;
  left: var(--slack-card-left) !important;
  right: auto !important;
  bottom: auto !important;
  transform: none !important;
}
${CARD} {
  width: 340px !important;
  max-width: 340px !important;
  border-radius: 8px !important;
  corner-shape: round !important;
  padding: 0 !important;
}
${CONTENT} {
  display: grid !important;
  grid-template-columns: 96px 1fr;
  column-gap: 14px;
  row-gap: 0;
  align-items: center;
  padding: 16px !important;
}
${LOCKUP}, ${IDENTITY} { display: contents !important; }
${LOCKUP} > div:first-child { display: none !important; }
${LOCKUP} > div:nth-child(2) {
  grid-column: 1;
  grid-row: 1;
  position: static !important;
  width: 96px !important;
  height: 96px !important;
  margin: 0 !important;
  padding: 0 !important;
  transform: none !important;
  background: none !important;
  box-shadow: none !important;
}
${LOCKUP} > div:nth-child(2) > *,
${LOCKUP} > div:nth-child(2) :is(.agent-motion-avatar, .badge-pill-root, .badge-motion-artwork, .buzz-avatar-status, .buzz-avatar, .buzz-avatar img, [data-avatar-fallback]) {
  width: 100% !important;
  height: 100% !important;
}
${LOCKUP} > div:nth-child(2) :is(.buzz-avatar, .buzz-avatar img, [data-avatar-fallback]) {
  border-radius: 8px !important;
  corner-shape: round !important;
  mask: none !important;
}
${LOCKUP} > div:nth-child(2) .buzz-avatar-status-dot { display: none !important; }
/* Name beside the picture, bold, left-aligned. */
${IDENTITY} > div:first-child {
  grid-column: 2;
  grid-row: 1;
  justify-content: flex-start !important;
  text-align: left !important;
  font-size: 18px !important;
  font-weight: 800 !important;
  margin: 0 !important;
}
/* Your own card has no Message button: name it "(나)", as Slack does. */
${CARD}:not(:has([data-profile-action="message"])) ${IDENTITY} > div:first-child::after {
  content: ${JSON.stringify(t(" (나)", " (you)"))};
}
/* Local time on its own row under a divider, with a clock icon. */
${IDENTITY} > p:nth-of-type(1) {
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex !important;
  align-items: center;
  gap: 8px;
  margin: 16px -16px 0 !important;
  padding: 14px 16px 0 !important;
  border-top: 1px solid color-mix(in srgb, var(--text-standard) 12%, transparent);
  font-size: 15px !important;
  color: var(--text-standard) !important;
  text-align: left !important;
}
${IDENTITY} > p:nth-of-type(1)::before {
  content: "";
  flex: none;
  width: 18px;
  height: 18px;
  background: currentColor;
  -webkit-mask: ${clock} center / contain no-repeat;
  mask: ${clock} center / contain no-repeat;
}
${IDENTITY} > p:nth-of-type(n + 2) { display: none !important; }
${IDENTITY} > :not(div:first-child, p) { grid-column: 1 / -1; }
${CONTENT} > div:nth-child(2) {
  grid-column: 1 / -1;
  grid-row: 3;
  display: flex !important;
  gap: 8px !important;
  padding: 14px 0 0 !important;
  margin: 0 !important;
}
${CARD} [data-profile-action] {
  flex: 1 1 0 !important;
  width: auto !important;
  height: 32px !important;
  padding: 0 12px !important;
  border-radius: 6px !important;
  corner-shape: round !important;
  background: transparent !important;
  border: 1px solid color-mix(in srgb, var(--text-standard) 30%, transparent) !important;
  font-size: 14px !important;
  font-weight: 700 !important;
}
${CARD} [data-profile-action]:hover { background: color-mix(in srgb, var(--text-standard) 6%, transparent) !important; }
${CARD} [data-profile-action] span[aria-hidden="true"] {
  display: inline !important;
  width: auto !important;
  opacity: 1 !important;
  max-width: none !important;
  margin-left: 6px;
}`;
})()}

/* @here / @channel rows added to the top of the @ suggestions, and the
   small list of our own shown when Buzz has no suggestions. */
.slack-broadcast-popup {
  position: fixed;
  z-index: 1000;
  min-width: 300px;
  padding: 8px 0;
  border-radius: 8px;
  background: var(--surface-popover, var(--surface-panel, #fff));
  color: var(--text-standard);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--text-standard) 13%, transparent), 0 4px 12px rgba(0, 0, 0, 0.12);
  font-size: 15px;
}
.slack-broadcast-popup [role="option"] { gap: 8px; padding: 4px 16px; min-height: 32px; box-sizing: border-box; }
.slack-broadcast-popup [data-completion-label] { display: flex; gap: 8px; align-items: baseline; white-space: nowrap; }
.slack-broadcast-popup small { font-size: 15px; color: var(--text-subtle); }
.slack-broadcast-popup [role="option"][aria-selected="true"] {
  background: ${MENTION_SELECTED};
  color: #fff;
}
.slack-broadcast-popup [role="option"][aria-selected="true"] small { color: #fff; }
[data-slack-broadcast] { cursor: default; display: flex; align-items: center; }
[data-slack-broadcast] .slack-broadcast-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; flex: none;
}
[data-slack-broadcast]:hover {
  background: ${MENTION_SELECTED} !important;
  color: #fff !important;
}
[data-slack-broadcast]:hover small { color: #fff !important; }

/* New message (DM) recipient list, like Slack's: a wide list under the
   "대상:" field with flat 32px rows, small rounded pictures and a light
   gray highlight. Rows are [data-recipient-key] (people and channels). */
[data-slack-list]:has([data-recipient-key]) {
  position: fixed !important;
  top: var(--slack-list-top) !important;
  left: var(--slack-list-left) !important;
  right: auto !important;
  bottom: auto !important;
  transform: none !important;
}
[class*="_picker_"]:has([data-recipient-key]) {
  width: var(--slack-list-width, min(900px, var(--available-width, 900px))) !important;
  max-width: none !important;
  padding: 4px 0 !important;
  border-radius: 0 0 8px 8px !important;
  corner-shape: round !important;
  border: 0 !important;
  background: color-mix(in srgb, var(--text-standard) 3%, var(--surface-panel, #fff)) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
}
[data-recipient-key] {
  min-height: 32px !important;
  height: auto !important;
  padding: 2px 20px !important;
  gap: 10px !important;
  border-radius: 0 !important;
  corner-shape: round !important;
  font-size: 15px !important;
}
[data-recipient-key] :is(.buzz-avatar-status, .buzz-avatar, .buzz-avatar img) {
  width: 20px !important;
  height: 20px !important;
  min-width: 0 !important;
}
[data-recipient-key] .buzz-avatar,
[data-recipient-key] .buzz-avatar :is(img, [data-avatar-fallback]) {
  border-radius: 4px !important;
  corner-shape: round !important;
  mask: none !important;
}
[data-recipient-key] [data-avatar-fallback] { font-size: 11px !important; }
[data-recipient-key] .flex-col {
  flex-direction: row !important;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap !important;
}
[data-recipient-key] .flex-col > :first-child,
[data-recipient-key] .navigation-item-label { font-weight: 700; }
[data-recipient-key] small { font-size: 15px !important; font-weight: 400; }
[data-recipient-key]:is([data-selected], [data-highlighted], [aria-selected="true"], :hover) {
  background: color-mix(in srgb, var(--text-standard) 8%, transparent) !important;
}
[aria-label="Recipients"] { font-size: 15px; }
/* Title row "새 메시지" on top (Buzz has none), shaped like the channel
   header, and Slack's 48px "대상:" row under it. */
section[aria-label="New message"]::before {
  content: ${JSON.stringify(t("새 메시지", "New message"))};
  display: flex;
  align-items: center;
  flex: none;
  box-sizing: border-box;
  height: ${HEADER.titleRow}px;
  padding: 0 ${HEADER.inset}px;
  font-size: ${SIZES.channelTitle}px;
  font-weight: ${CHANNEL_TITLE_WEIGHT};
  color: var(--text-standard);
  border-bottom: 1px solid var(--border-standard);
}
section[aria-label="New message"] [aria-label="Recipients"] {
  min-height: 48px !important;
  padding: 0 ${HEADER.inset}px !important;
  display: flex !important;
  align-items: center !important;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border-standard);
}
section[aria-label="New message"] [aria-label="Recipients"] label { color: var(--text-subtle); }
section[aria-label="New message"] [aria-label="Recipients"] input { font-size: 15px !important; }
/* Empty message box before anyone is chosen: Slack's "새 메시지 시작". */
section[aria-label="New message"] [data-composer-surface] [data-placeholder=""]::before {
  content: ${JSON.stringify(t("새 메시지 시작", "Start a new message"))} !important;
  color: var(--text-metadata);
}

/* Mention picker opened from the @ button: the same flat Slack list as the
   @ suggestions (32px rows, 20px rounded pictures, bold name with its detail
   on one line, blue selected row) under one rounded search box. */
${(() => {
  const PICK = '[aria-label="Mention a member or agent"]';
  const ROW = `${PICK} [data-mention-choice]`;
  return `${PICK} {
  border-radius: 8px !important;
  corner-shape: round !important;
}
${PICK} .search-field {
  height: 36px !important;
  border-radius: 8px !important;
  corner-shape: round !important;
  border: 1px solid color-mix(in srgb, var(--text-standard) 30%, transparent) !important;
}
${PICK} .search-field:has(input:focus) {
  border-color: #1264A3 !important;
  box-shadow: 0 0 0 3px rgba(29, 155, 209, 0.3) !important;
}
${PICK} .search-field input { font-size: 15px !important; }
${ROW} {
  min-height: 32px !important;
  height: auto !important;
  padding: 2px 16px !important;
  gap: 8px !important;
  border-radius: 0 !important;
  corner-shape: round !important;
  font-size: 15px !important;
}
${ROW} :is(.buzz-avatar-status, .buzz-avatar, .buzz-avatar img) {
  width: 20px !important;
  height: 20px !important;
  min-width: 0 !important;
}
${ROW} .buzz-avatar,
${ROW} .buzz-avatar :is(img, [data-avatar-fallback]) {
  border-radius: 4px !important;
  corner-shape: round !important;
}
${ROW} [data-avatar-fallback] { font-size: 11px !important; }
${ROW} .flex-col {
  flex-direction: row !important;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap !important;
  overflow: hidden;
}
${ROW} .flex-col > :first-child { font-weight: 700; flex: none; }
${ROW} .flex-col small {
  font-size: 15px !important;
  line-height: inherit !important;
  overflow: hidden;
  text-overflow: ellipsis;
}
${ROW}:is([data-selected], [data-highlighted], [aria-selected="true"], :hover):not([disabled]) {
  background: ${MENTION_SELECTED} !important;
  color: #fff !important;
  --text-standard: #fff;
  --text-subtle: #fff;
}
${ROW}:is([data-selected], [data-highlighted], [aria-selected="true"], :hover) small { color: #fff !important; }`;
})()}

${CHANNEL_TABS ? `/* Tab row under the channel name (added by addChannelTabs), placed right
   after the header; the dividing line moves below the row. */
.panel-header:has(+ .slack-channel-tabs) { border-block-end-color: transparent !important; }
/* Slack's roomier header: a 49px title row and a 40px tab row. */
.panel-header:has(+ .slack-channel-tabs) {
  height: ${HEADER.titleRow}px !important;
  min-height: ${HEADER.titleRow}px !important;
  padding-inline: ${HEADER.inset}px 16px !important;
  box-sizing: border-box;
}
.slack-channel-tabs {
  flex: none;
  width: 100%;
  border-bottom: 1px solid var(--border-standard);
  display: flex;
  align-items: stretch;
  gap: ${HEADER.tabGap}px;
  height: ${HEADER.tabRow}px;
  padding-inline: ${HEADER.inset - 8}px;
  box-sizing: border-box;
}
.slack-channel-tabs > button {
  all: unset;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  border-bottom: 2px solid transparent;
  color: color-mix(in srgb, var(--text-standard) 72%, transparent);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
.slack-channel-tabs > button:hover { color: var(--text-standard); }
.slack-channel-tabs > button[data-active] {
  color: var(--text-standard);
  border-bottom-color: var(--text-standard);
}
.slack-channel-tabs > button svg { width: 16px; height: 16px; flex: none; }
/* The selected tab's icon is filled, as in Slack; lines inside it are drawn
   in the background color so they stay visible. */
.slack-channel-tabs > button[data-active] svg path:first-child { fill: currentColor; }
.slack-channel-tabs > button[data-active] svg path + path { stroke: var(--surface-panel, #fff); }

/* 허들 page. */
.slack-huddles { max-width: 720px; margin: 0 auto; padding: 24px 16px; font-size: 15px; }
.slack-huddles h1 { font-size: 22px; font-weight: 800; margin: 0 0 16px; }
.slack-huddles-live { color: #007A5A; font-weight: 700; }

/* 파일 panel. */
.slack-files { padding: 8px 0; font-size: 14px; overflow-y: auto; height: 100%; box-sizing: border-box; }
.slack-files-note { padding: 12px 16px; color: color-mix(in srgb, var(--text-standard) 60%, transparent); }
.slack-files-row {
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  cursor: pointer;
}
.slack-files-row:hover { background: color-mix(in srgb, var(--text-standard) 5%, transparent); }
.slack-files-thumb {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--text-standard) 8%, transparent);
  color: color-mix(in srgb, var(--text-standard) 60%, transparent);
  font-size: 10px;
  font-weight: 700;
}
.slack-files-text { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 2px; }
.slack-files-name { font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.slack-files-meta { font-size: 12px; color: color-mix(in srgb, var(--text-standard) 60%, transparent); }
.slack-files-more {
  all: unset;
  margin: 8px 16px;
  padding: 4px 12px;
  border: 1px solid color-mix(in srgb, var(--text-standard) 25%, transparent);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}` : ""}

/* Menus (right-click, ⋯ and submenus) shaped like Slack's: 8px corners,
   full-width 28px rows, 15px text, a blue row under the pointer. */
${SLACK_MENUS ? `
.buzz-menu-popup {
  border-radius: 8px !important;
  corner-shape: round !important;
  padding: 10px 0 !important;
  min-width: 280px !important;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--text-standard) 13%, transparent), 0 4px 12px rgba(0, 0, 0, 0.12) !important;
}
.buzz-menu-popup .buzz-menu-item {
  min-height: 28px !important;
  margin: 0 !important;
  padding: 0 24px 0 24px !important;
  border-radius: 0 !important;
  corner-shape: round !important;
  font-size: 15px !important;
}
.buzz-menu-popup .buzz-menu-item:is([data-highlighted], [data-popup-open], .slack-notify-option:hover, .slack-dm-menu-item:hover):not([data-disabled]) {
  background: ${MENU_HIGHLIGHT} !important;
  color: #fff !important;
  --text-standard: #fff;
  --text-subtle: #fff;
  --text-metadata: #fff;
}
.buzz-menu-popup .buzz-menu-separator { margin: 8px 0 !important; }
.buzz-menu-popup .buzz-menu-group-label {
  padding: 4px 24px 2px 24px !important;
  font-size: 13px !important;
  color: var(--text-subtle) !important;
}
` : ""}
/* "다음에 대해 알림…" items added to a channel's right-click menu: a check
   column, an icon, and Slack's blue for the current choice. */
.slack-notify-option { cursor: default; display: flex; align-items: center; position: relative; }
.slack-notify-check {
  position: absolute; left: 6px; top: 0; bottom: 0; width: 14px;
  display: inline-flex; align-items: center; justify-content: center;
}
.slack-notify-check svg { width: 12px; height: 12px; }
.slack-notify-icon svg { width: 16px; height: 16px; stroke-width: 2; }
.slack-notify-option[aria-checked="true"],
.slack-notify-option[aria-checked="true"] .slack-notify-icon { color: ${MENU_SELECTED} !important; }
:root[data-color-mode="dark"] .slack-notify-option[aria-checked="true"],
:root[data-color-mode="dark"] .slack-notify-option[aria-checked="true"] .slack-notify-icon { color: ${MENU_SELECTED_DARK} !important; }
.buzz-menu-popup .buzz-menu-item.slack-notify-option:hover,
.buzz-menu-popup .buzz-menu-item.slack-notify-option:hover .slack-notify-icon { color: #fff !important; }
.slack-notify-label { padding-top: 2px; }
/* Link preview card under a message, like Slack's: a bordered card with the
   title, description and site, and the page's picture on the right. */
.slack-link-card {
  display: flex; align-items: stretch;
  width: ${LINK_PREVIEW_WIDTH}px; max-width: 100%; min-height: 0;
  border: 1px solid color-mix(in srgb, var(--text-standard) 13%, transparent);
  border-radius: 8px; corner-shape: round; overflow: hidden;
  background: var(--surface-panel, transparent);
  color: var(--text-standard) !important; text-decoration: none !important;
  margin-top: 4px;
}
.slack-link-card-bare { width: ${LINK_PREVIEW_WIDTH}px; max-width: 100%; }
.slack-link-card-bare[hidden] { display: none !important; }
.slack-link-card:hover { border-color: color-mix(in srgb, var(--text-standard) 25%, transparent); }
.slack-link-card-text { flex: 1; min-width: 0; padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; }
.slack-link-card-title { font-size: 15px; font-weight: 700; line-height: 22px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.slack-link-card-description { font-size: 14px; line-height: 20px; color: var(--text-standard); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
.slack-link-card-site { display: flex; align-items: center; gap: 6px; font-size: 13px; line-height: 18px; color: var(--text-subtle); margin-top: 2px; }
.slack-link-card-icon { width: 16px; height: 16px; border-radius: 3px; object-fit: contain; flex: none; }
.slack-link-card-image { width: 80px; height: 80px; margin: 12px 12px 12px 0; flex: none; object-fit: cover; border-radius: 6px; }
/* A wide picture: the card's right column, flush to its edges, full card
   height; fitWide sets its width from its shape so little or nothing is cut. */
.slack-link-card[data-wide-image] .slack-link-card-image {
  height: auto; align-self: stretch; max-width: 45%;
  margin: 0; border-radius: 0; object-fit: cover;
  border-left: 1px solid color-mix(in srgb, var(--text-standard) 8%, transparent);
}
/* File cards, in messages and in the message box, as in Slack: a white card
   with a light border and 12px corners, a 36px coloured square with the
   file's icon, the name in bold and the type ("HTML") under it. */
:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"]),
[data-composer-surface] section[aria-label="Attachments"] li:not([data-media]):not([data-voice-draft]) {
  width: ${FILE_CARD_WIDTH}px; max-width: 100% !important;
  min-height: 62px !important;
  background: ${FILE_CARD_BG} !important;
  border: 1px solid ${FILE_CARD_BORDER} !important;
  border-radius: ${FILE_CARD_RADIUS}px !important; corner-shape: round !important;
  box-shadow: none !important;
}
:root[data-color-mode="dark"] :is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"]),
:root[data-color-mode="dark"] [data-composer-surface] section[aria-label="Attachments"] li:not([data-media]):not([data-voice-draft]) {
  background: ${FILE_CARD_BG_DARK} !important;
  border-color: rgba(255, 255, 255, 0.14) !important;
}
/* Buzz paints the card's inside (a navigation row) grey, partly through
   ::before; all of that stays off so the card is white, as in Slack. */
[class*="_filePreviewMain_"] *:not([data-kind]):not([data-kind] *),
[class*="_filePreviewMain_"] *:not([data-kind])::before,
[class*="_filePreviewMain_"] *:not([data-kind])::after,
[class*="_fileAttachment_"]:is(:hover, :active) {
  background: transparent !important; background-color: transparent !important;
}
[class*="_filePreviewMain_"] *:not([data-kind])::before { opacity: 0 !important; }
/* Slack: 8px between cards. */
[class*="_fileGroup_"] { gap: ${FILE_CARD_GAP}px !important; }
/* "N개의 첨부 파일 ▾  ⤓ 모두 다운로드" above two or more files (fileGroupHeaders). */
.slack-file-header { display: flex; align-items: center; gap: 12px; margin: 4px 0 6px; font-size: 13px; color: var(--text-subtle); }
.slack-file-header button {
  display: inline-flex; align-items: center; gap: 4px; padding: 0; border: 0; background: none;
  color: inherit; font: inherit; cursor: pointer;
}
.slack-file-header button:hover { color: var(--text-standard); text-decoration: underline; }
.slack-file-header .slack-file-caret { transition: transform 120ms ease; }
.slack-file-header[data-collapsed] .slack-file-caret { transform: rotate(-90deg); }
.slack-file-header .slack-file-sep { width: 1px; height: 12px; background: color-mix(in srgb, var(--text-standard) 20%, transparent); }
[class*="_fileGroup_"][data-slack-collapsed] { display: none !important; }
[class*="_fileAttachment_"], [data-composer-surface] section[aria-label="Attachments"] li:not([data-media]):not([data-voice-draft]) {
  padding: 12px !important; gap: 12px !important;
}
:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"]) { width: ${FILE_CARD_WIDTH}px !important; }
[data-composer-surface] section[aria-label="Attachments"] li:not([data-media]):not([data-voice-draft]) { width: ${COMPOSER_FILE_WIDTH}px !important; border-radius: 12px !important; }
[class*="_filePreviewAttachment_"] { position: relative; }
/* Hover: Slack darkens the border to mid grey. */
:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"]):hover { border-color: ${FILE_CARD_BORDER_HOVER} !important; }
[class*="_filePreviewMain_"] > * {
  min-height: 65px !important; padding: 12px !important; gap: 12px !important;
  border-radius: ${FILE_CARD_RADIUS}px !important; background: transparent !important;
}
/* The whole card opens the preview; the download button only shows on hover. */
/* The download button shows on hover as Slack's small floating toolbar: a
   white pill with a light border and shadow, 32px buttons. */
[class*="_filePreviewAttachment_"] [class*="_fileDownloadAction_"] {
  position: absolute; top: 50%; right: 12px; transform: translateY(-50%);
  opacity: 0; transition: opacity 120ms ease;
  padding: 2px; border-radius: 8px; corner-shape: round;
  background: ${FILE_CARD_BG};
  border: 1px solid ${FILE_CARD_BORDER};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
:root[data-color-mode="dark"] [class*="_filePreviewAttachment_"] [class*="_fileDownloadAction_"] { background: ${FILE_CARD_BG_DARK}; border-color: rgba(255, 255, 255, 0.14); }
[class*="_filePreviewAttachment_"]:is(:hover, :focus-within) [class*="_fileDownloadAction_"] { opacity: 1; }
[class*="_filePreviewAttachment_"] [class*="_fileDownloadAction_"] > * {
  width: 32px !important; height: 32px !important; min-height: 0 !important;
  background: transparent !important; border: 0 !important; border-radius: 6px !important;
}
[class*="_filePreviewAttachment_"] [class*="_fileDownloadAction_"] > *:hover { background: color-mix(in srgb, var(--text-standard) 8%, transparent) !important; }
:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"], [data-composer-surface] section[aria-label="Attachments"]) [class*="_slot_"] {
  width: 36px !important; height: 36px !important; margin: 0 !important; border-radius: 8px !important;
}
:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"], [data-composer-surface] section[aria-label="Attachments"]) [data-kind] {
  width: 36px !important; height: 36px !important; border-radius: 8px !important; corner-shape: round !important;
  color: #fff !important; background: ${FILE_KIND_COLORS.text} !important;
}
/* Code files get Slack's </> mark instead of Buzz's file-with-braces icon. */
:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"], [data-composer-surface] section[aria-label="Attachments"]) [data-kind="code"] svg { display: none !important; }
:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"], [data-composer-surface] section[aria-label="Attachments"]) [data-kind="code"]::before {
  content: ""; width: 18px; height: 18px; background: currentColor;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16'/%3E%3C/svg%3E") center / contain no-repeat;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16'/%3E%3C/svg%3E") center / contain no-repeat;
}
${Object.entries(FILE_KIND_COLORS).map(([kind, color]) => `:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"], [data-composer-surface] section[aria-label="Attachments"]) [data-kind="${kind}"] { background: ${color} !important; }`).join("\n")}
:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"]) [class*="_fileAttachmentName_"],
[data-composer-surface] section[aria-label="Attachments"] li:not([data-media]) [class*="_name_"] {
  font-size: 15px !important; font-weight: 700 !important; line-height: 22px !important; color: var(--text-standard) !important;
}
:is([class*="_filePreviewAttachment_"], [class*="_fileAttachment_"]) [class*="_fileAttachmentMeta_"],
[data-composer-surface] section[aria-label="Attachments"] li:not([data-media]) [class*="_hint_"] {
  font-size: 13px !important; line-height: 18px !important; color: var(--text-subtle) !important;
}
/* In the message box the type replaces "13 KB · Ready"; an error keeps its text. */
/* font-size 0 hides Buzz's text; letter-spacing and word gaps would still
   push the type right, so they go to 0 too. */
[data-composer-surface] section[aria-label="Attachments"] li[data-slack-type]:not([data-upload-error]) [class*="_hint_"] { font-size: 0 !important; letter-spacing: 0 !important; word-spacing: 0 !important; display: flex !important; }
[data-composer-surface] section[aria-label="Attachments"] li[data-slack-type]:not([data-upload-error]) [class*="_hint_"]::after {
  content: attr(data-slack-type); font-size: 13px;
}
[data-composer-surface] section[aria-label="Attachments"] li[data-slack-type] [class*="_hint_"] { display: block; }
/* Clicking anywhere on a chip opens Buzz's preview of it, as in Slack. */
[data-composer-surface] section[aria-label="Attachments"] li:not([data-media]) button[data-draft-preview] { position: static !important; }
[data-composer-surface] section[aria-label="Attachments"] li:not([data-media]) button[data-draft-preview]::after {
  content: ""; position: absolute; inset: 0; border-radius: 12px;
}
[data-composer-surface] section[aria-label="Attachments"] li:not([data-media]) [class*="_actions_"] { z-index: 1; }
[data-composer-surface] section[aria-label="Attachments"] li:not([data-media]):hover { background: color-mix(in srgb, var(--text-standard) 3%, var(--surface-composer, #fff)) !important; }

/* The pencil on a sidebar row with an unsent message (draftMarks), at the
   row's right end; hidden while you are in that conversation, as in Slack. */
${SIDEBAR} [data-channel-sidebar-row] { position: relative; }
${SIDEBAR} [data-channel-sidebar-row][data-slack-draft]:not([data-selected])::after {
  content: ""; position: absolute; right: 10px; top: 50%; width: 14px; height: 14px; transform: translateY(-50%);
  background: currentColor; opacity: 0.8; pointer-events: none;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4'/%3E%3C/svg%3E") center / contain no-repeat;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4'/%3E%3C/svg%3E") center / contain no-repeat;
}
${SIDEBAR} [data-channel-sidebar-row][data-slack-draft]:not([data-selected]) [class*="navigation-item-label"] { padding-right: 22px; }

/* Reactions under a message, as in Slack: 24px pills with 12px corners, light
   grey; yours light blue with a blue ring and a blue count. The add-reaction
   button is the same grey pill. */
[data-message-reactions] [class*="_reactionItem_"],
[data-message-reactions][class*="_inlineReactionTool_"] {
  --reaction-surface: ${REACTION.bg};
  --reaction-self-surface: ${REACTION.mineBg};
  --reaction-self-ink: ${REACTION.mineInk};
  --reaction-ink: var(--text-standard);
  border-radius: 12px !important; corner-shape: round !important;
  box-shadow: inset 0 0 0 1px transparent;
}
[data-message-reactions] [class*="_reactionItem_"][data-mine] { box-shadow: inset 0 0 0 1px ${REACTION.mineRing}; }
[data-message-reactions] [class*="_reactionItem_"]:hover,
[data-message-reactions][class*="_inlineReactionTool_"]:hover { box-shadow: inset 0 0 0 1px ${REACTION.hoverRing}; }
/* Buzz sizes these as fixed square controls; Slack's pill grows with its
   emoji and count. */
[data-message-reactions] [class*="_reactionItem_"] button,
[data-message-reactions][class*="_inlineReactionTool_"] button {
  width: auto !important; min-width: 0 !important; max-width: none !important;
  height: 24px !important; min-height: 24px !important; padding: 0 8px !important; border-radius: 12px !important;
  display: inline-flex !important; align-items: center !important; justify-content: center !important;
  background: transparent !important; overflow: visible !important;
}
/* The button's icon and label slots are fixed squares too; let them fit
   the emoji and count instead of letting the count spill out. */
[data-message-reactions] [class*="_reactionItem_"] button > *,
[data-message-reactions] [class*="_reactionItem_"] button > * > :not(img) {
  width: auto !important; min-width: 0 !important; max-width: none !important;
  height: auto !important; overflow: visible !important;
  display: inline-flex !important; align-items: center !important;
}
[data-message-reactions] [class*="_reactionGlyph_"] { display: inline-flex !important; align-items: center; }
[data-message-reactions] [class*="_reactionGlyph_"] [class*="_reactionNativeEmoji_"] { padding: 0 !important; line-height: 1 !important; }
[data-message-reactions][class*="_inlineReactionTool_"] button { padding: 0 6px !important; min-width: 32px !important; }
[data-message-reactions] [class*="_reactionCount_"] { font-size: 12px !important; font-weight: 700; }
/* Buzz shows a count only when several people reacted; Slack always does,
   so a single reaction gets its "1". */
[data-message-reactions] [class*="_reactionGlyph_"]:not([data-grouped])::after {
  content: "1"; margin-left: 4px; font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums;
}
[data-message-reactions] [class*="_reactionGlyph_"] { max-width: none !important; gap: 4px; }
[data-message-reactions] [class*="_reactionItem_"][data-mine] [class*="_reactionCount_"] { color: ${REACTION.mineInk}; }
[data-message-reactions] [class*="_reactionNativeEmoji_"] { font-size: 16px !important; max-width: none !important; }
[data-message-reactions] :is([class*="_reactionCustomEmoji_"], [class*="_reactionPlaceholder_"]) { width: 16px !important; height: 16px !important; scale: 1 !important; }
:root[data-color-mode="dark"] [data-message-reactions] :is([class*="_reactionItem_"], [class*="_inlineReactionTool_"]) {
  --reaction-surface: rgba(255, 255, 255, 0.08);
  --reaction-self-surface: rgba(29, 155, 209, 0.2);
}

/* Slack's toolbar over a hovered file card (this plugin's cards): a white
   pill of 32px buttons with dark tooltips; it replaces Buzz's own download
   button there. */
.slack-file-card-wrap { position: relative; display: inline-flex; max-width: 100%; }
.slack-file-card-wrap [class*="_fileDownloadAction_"] { display: none !important; }
.slack-file-tools {
  position: absolute; top: 50%; right: 12px; transform: translateY(-50%);
  display: flex; gap: 2px; padding: 3px;
  background: ${FILE_CARD_BG}; border: 1px solid ${FILE_CARD_BORDER}; border-radius: 10px; corner-shape: round;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  opacity: 0; pointer-events: none; transition: opacity 120ms ease;
}
.slack-file-card-wrap:is(:hover, :focus-within) .slack-file-tools { opacity: 1; pointer-events: auto; }
.slack-file-card-wrap:hover [class*="_filePreviewAttachment_"] { border-color: ${FILE_CARD_BORDER_HOVER} !important; }
.slack-file-tool {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border: 0; border-radius: 6px; background: transparent;
  color: var(--text-standard); cursor: pointer;
}
.slack-file-tool:hover { background: color-mix(in srgb, var(--text-standard) 8%, transparent); }
.slack-file-tool::before {
  content: ""; width: 18px; height: 18px; display: block; flex: none; background: var(--text-standard, #1D1C1D);
}
${Object.entries(FILE_TOOL_ICONS).map(([name, d]) => {
  const url = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='${d}'/></svg>`)}")`;
  return `.slack-file-tool[data-icon="${name}"]::before { -webkit-mask: ${url} center / contain no-repeat; mask: ${url} center / contain no-repeat; }`;
}).join("\n")}
.slack-file-tool[data-tip]:hover::after {
  content: attr(data-tip); position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
  padding: 7px 12px; border-radius: 10px; background: #1D1C1D; color: #fff;
  font-size: 13px; font-weight: 700; line-height: 18px; white-space: nowrap; pointer-events: none; z-index: 2;
}
.slack-file-details {
  position: absolute; top: calc(100% + 6px); right: 12px; z-index: 3; min-width: 240px;
  padding: 12px 14px; border-radius: 8px; background: ${FILE_CARD_BG}; color: var(--text-standard);
  border: 1px solid ${FILE_CARD_BORDER}; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); font-size: 13px;
}
.slack-file-details-name { font-weight: 700; font-size: 15px; margin-bottom: 8px; overflow-wrap: anywhere; }
.slack-file-details dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; margin: 0; }
.slack-file-details dt { color: var(--text-subtle); }
.slack-file-details dd { margin: 0; }
:root[data-color-mode="dark"] :is(.slack-file-tools, .slack-file-details) { background: ${FILE_CARD_BG_DARK}; border-color: rgba(255, 255, 255, 0.14); }

/* The file drop overlay (slackDropOverlay): the whole pane fades to white,
   no dashed box; Buzz's own icon and words give way to Slack's. */
[class*="_fileDropOverlay_"][data-slack-drop] {
  inset: 0 !important; border: 0 !important; border-radius: 0 !important; padding: 24px !important;
  background: rgba(255, 255, 255, 0.92) !important; gap: 0 !important;
  display: flex !important; flex-direction: column; align-items: center; justify-content: center;
}
:root[data-color-mode="dark"] [class*="_fileDropOverlay_"][data-slack-drop] { background: rgba(26, 29, 33, 0.92) !important; }
[class*="_fileDropOverlay_"][data-slack-drop] > :not([class^="slack-drop-"]) { display: none !important; }
.slack-drop-art { margin-bottom: 16px; line-height: 0; }
.slack-drop-title { font-size: 28px; font-weight: 800; line-height: 36px; color: var(--text-standard); text-align: center; }
.slack-drop-sub { margin-top: 8px; font-size: 15px; line-height: 22px; color: var(--text-standard); text-align: center; }

/* A dark Slack tooltip placed by script outside any clipping box. */
/* Slack's tooltip: 32px tall, 10px corners, white bold 13px on near-black. */
.slack-floating-tip {
  position: fixed; z-index: 100000; pointer-events: none;
  padding: 7px 12px; border-radius: 10px; corner-shape: round; background: #1D1C1D; color: #fff;
  font-size: 13px; font-weight: 700; line-height: 18px; white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* The file viewer: Slack's full-window dark frame with the page inside. */
/* Slightly smaller than the window, as in Slack: the app shows dimmed around
   it, the frame has rounded corners and the page fills it under the bar. */
.slack-file-viewer {
  position: fixed; inset: 40px 14px 14px; z-index: var(--layer-popover, 1000);
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: 10px; corner-shape: round;
  background: #1A1D21; color: #fff;
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.45), 0 12px 40px rgba(0, 0, 0, 0.35);
}
.slack-file-viewer-bar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; min-height: 52px; }
.slack-file-viewer-title { flex: 1; min-width: 0; display: flex; flex-direction: column; font-size: 13px; line-height: 18px; }
.slack-file-viewer-title strong { font-size: 15px; }
.slack-file-viewer-title span { opacity: 0.8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.slack-file-viewer-button {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 8px; border: 0;
  background: transparent; color: #fff !important; cursor: pointer;
}
.slack-file-viewer-button:hover { background: rgba(255, 255, 255, 0.12); }
.slack-file-viewer-body {
  flex: 1; min-height: 0; margin: 0; border-radius: 0; overflow: hidden;
  background: #fff; color: #1D1C1D; display: flex; align-items: center; justify-content: center;
  font-size: 15px;
}
.slack-file-viewer-frame { width: 100%; height: 100%; border: 0; background: #fff; }
.slack-file-viewer-text {
  align-self: stretch; width: 100%; margin: 0; padding: 20px 24px; overflow: auto;
  font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; word-break: break-word;
}

/* Attached files sit under the text in the message box, as in Slack
   (Buzz puts them above it). The box's content is a flex column. */
[data-composer-surface] section[aria-label="Attachments"] {
  order: 1;
  margin-block: 2px 0 !important;
}
/* An attached picture or video: Slack's rounded square (60px, 8px plain
   round corners, a thin border) instead of Buzz's 76px tile. */
[data-composer-surface] section[aria-label="Attachments"] li[data-media] {
  width: ${ATTACHMENT_THUMB}px !important;
  height: ${ATTACHMENT_THUMB}px !important;
  border-radius: ${ATTACHMENT_RADIUS}px !important;
  corner-shape: round !important;
}
[data-composer-surface] section[aria-label="Attachments"] li[data-media] [data-media-preview],
[data-composer-surface] section[aria-label="Attachments"] li[data-media] [data-media-preview] :is(img, video) {
  border-radius: ${ATTACHMENT_RADIUS}px !important;
  corner-shape: round !important;
}
[data-composer-surface] section[aria-label="Attachments"] li[data-media] [data-media-preview]::after {
  border-color: color-mix(in srgb, var(--text-standard) 13%, transparent) !important;
}
/* Hovering the tile dims the picture slightly, as in Slack. The preview's
   ::after is already its border layer, so it carries the dimmer too. */
[data-composer-surface] section[aria-label="Attachments"] li[data-media] [data-media-preview]::after {
  transition: background-color 120ms ease;
}
[data-composer-surface] section[aria-label="Attachments"] li[data-media]:hover [data-media-preview]::after {
  background: rgba(0, 0, 0, 0.18);
}
/* The remove button of an attached file or picture, as in Slack: a black 20px circle with a white X and a
   white ring, sitting on the tile's top-right corner. The list scrolls
   sideways, so it gets room for the part that sticks out. */
[data-composer-surface] section[aria-label="Attachments"] ul {
  padding-top: 8px !important;
  padding-right: 8px !important;
}
[data-composer-surface] section[aria-label="Attachments"] li [class*="_actions_"] {
  top: -8px !important;
  right: -8px !important;
}
[data-composer-surface] section[aria-label="Attachments"] li [class*="_actions_"] button {
  width: 20px !important; height: 20px !important;
  min-width: 0 !important; min-height: 0 !important; padding: 0 !important;
  border-radius: 50% !important; corner-shape: round !important;
  background: #1D1C1D !important; color: #fff !important;
  box-shadow: 0 0 0 2px #fff !important; border: 0 !important;
  display: inline-flex !important; align-items: center; justify-content: center;
}
[data-composer-surface] section[aria-label="Attachments"] li [class*="_actions_"] button svg {
  width: 12px !important; height: 12px !important;
}
/* While uploading, the same spot shows the turning ring on white, as in
   Slack; hovering it still shows the black X to cancel. */
[data-composer-surface] section[aria-label="Attachments"] li:not(:hover) [class*="_actions_"] button:has([role="progressbar"]) {
  background: #fff !important;
}
[data-composer-surface] section[aria-label="Attachments"] li [class*="_actions_"] button:has([role="progressbar"]) svg {
  width: 16px !important; height: 16px !important;
}
:root[data-color-mode="dark"] [data-composer-surface] section[aria-label="Attachments"] li [class*="_actions_"] button {
  box-shadow: 0 0 0 2px var(--surface-composer, #1A1D21) !important;
}
/* Upload progress on an attachment: Slack's blue arc on a light ring that
   keeps turning until the upload ends (Buzz turns it only while preparing). */
[data-composer-surface] section[aria-label="Attachments"] [role="progressbar"] { color: ${MENU_HIGHLIGHT}; }
[data-composer-surface] section[aria-label="Attachments"] [role="progressbar"] svg {
  animation: slack-upload-spin 800ms linear infinite;
}
[data-composer-surface] section[aria-label="Attachments"] [role="progressbar"] circle:not([data-upload-progress]) {
  stroke: color-mix(in srgb, var(--text-standard) 15%, transparent); opacity: 1;
}
@keyframes slack-upload-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  [data-composer-surface] section[aria-label="Attachments"] [role="progressbar"] svg { animation: none; }
}
/* Undo send: the message turns pink, then folds to nothing (Slack's look). */
/* clip-path, not overflow: hidden, which would change how the row's margins
   meet its neighbours and nudge it. */
[data-slack-unsending] {
  clip-path: inset(0);
  animation: slack-unsend ${UNDO_SEND_FOLD_MS}ms ease-in-out forwards;
}
/* Measured from Slack: solid #EC7F95 for about 85ms, then the row folds to
   nothing in about 150ms without fading. */
[data-slack-unsending] [data-highlight-surface] { background: #EC7F95 !important; }
@keyframes slack-unsend {
  0%, 36% { max-height: var(--slack-unsend-height); }
  100% { max-height: 0; }
}
/* The 다이렉트 메시지 title's right-click menu, built by this plugin. */
/* It uses Buzz's own menu classes (buzz-menu-popup text-body-sm, as Buzz's
   menus do), so only the placement is set here. */
.slack-dm-menu {
  position: fixed; z-index: var(--layer-popover, 1000);
  max-height: calc(100vh - 16px);
  display: flex; flex-direction: column;
}
.slack-dm-menu .buzz-menu-item { display: flex; align-items: center; cursor: default; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.slack-dm-menu .slack-dm-menu-empty { color: var(--text-subtle); }
.slack-dm-menu-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.slack-dm-menu-item[data-unread] .slack-dm-menu-name { font-weight: ${UNREAD_WEIGHT}; }

/* @mentions in messages: Slack's light blue chip with blue text, and
   yellow when it mentions you (Buzz: a black pill). */
[data-mention-kind] {
  border-radius: 3px !important;
  corner-shape: round !important;
  padding: 0 2px !important;
  font-weight: 400 !important;
  background: ${MENTION_CHIP.bg} !important;
  color: ${MENTION_CHIP.text} !important;
  --link-text: ${MENTION_CHIP.text};
}
[data-mention-kind]:hover { background: ${MENTION_CHIP.hover} !important; text-decoration: none !important; }
[data-mention-kind][data-mention-self] {
  background: ${MENTION_CHIP.selfBg} !important;
  color: var(--text-standard) !important;
}
[data-mention-kind][data-mention-self]:hover { background: ${MENTION_CHIP.selfHover} !important; }
:root[data-color-mode="dark"] [data-mention-kind]:not([data-mention-self]) { color: ${MENTION_CHIP.textDark} !important; }

/* Mention and DM marker on a sidebar row: Buzz draws a black dot; Slack
   marks these in red. */
${SIDEBAR} [data-channel-priority] {
  background: ${MENTION_DOT} !important;
  box-shadow: none !important;
}
/* A DM with unread messages shows their number in a red pill, as in Slack,
   instead of Buzz's dot. Buzz keeps the number only in a hidden label;
   dmUnreadCounts copies it into data-slack-count. */
${SIDEBAR} [data-channel-unread][data-slack-count] {
  position: static !important;
  width: auto !important; height: 18px !important;
  min-width: 20px; padding: 0 6px !important; margin: 0 0 0 auto !important;
  clip: auto !important; overflow: visible !important;
  border-radius: 9px; corner-shape: round;
  display: inline-flex !important; align-items: center; justify-content: center; flex: none;
  background: ${MENTION_DOT} !important; color: #fff !important;
  font-size: 12px; font-weight: 700; line-height: 1;
}
${SIDEBAR} [data-channel-unread][data-slack-count]::after { content: attr(data-slack-count); }
${SIDEBAR} [data-channel-sidebar-row]:has([data-slack-count]) [data-channel-priority] { display: none !important; }

/* Presence on sidebar pictures, as in Slack's DM list: a small dot at the
   bottom-right corner ringed in the sidebar color; green when active, a
   hollow ring when away or offline. */
${SIDEBAR} .buzz-avatar-status-dot {
  width: ${PRESENCE.size}px !important;
  height: ${PRESENCE.size}px !important;
  top: auto !important;
  left: auto !important;
  right: -2px !important;
  bottom: -2px !important;
  transform: none !important;
  border-radius: 50% !important;
  mask: none !important;
  box-shadow: 0 0 0 2px ${c.sidebar} !important;
  background: ${PRESENCE.active} !important;
}
${SIDEBAR} .buzz-avatar-status .buzz-avatar-status-dot::after { display: none !important; }
/* The DM picture's box is clipped to rounded corners; let the dot, which
   sits on the corner, show outside it. */
${SIDEBAR} [data-dm-identity],
${SIDEBAR} [data-dm-identity] .buzz-avatar-status {
  overflow: visible !important;
  -webkit-mask: none !important;
  mask: none !important;
  clip-path: none !important;
}
${SIDEBAR} .buzz-avatar-status:is([data-status="away"], [data-status="offline"]) .buzz-avatar-status-dot {
  background: ${c.sidebar} !important;
  box-shadow: 0 0 0 2px ${c.sidebar}, inset 0 0 0 1.5px ${PRESENCE.away} !important;
}

/* Translated thread summaries: the original text stays (Buzz updates it)
   and the Korean label from data-slack-ko is drawn in its place. */
[data-thread-summary] [data-slack-ko] { font-size: 0 !important; }
[data-thread-summary] [data-slack-ko]::after { content: attr(data-slack-ko); font-size: 13px; }

/* "… is typing" above the message box: Buzz fixes it to one line height and
   clips the rest, which cuts off the bottom of Korean glyphs. */
[data-conversation-activity] {
  height: auto !important;
  min-height: 1lh;
  overflow: visible !important;
  padding-bottom: 2px !important;
}

/* Buzz hides the sidebar (visibility) while a page without one is open,
   such as Agents. Coming back, that hidden state can stay stuck after the
   sidebar has opened again, leaving it blank. While it is open it is always
   shown. */
.shell-navigation[data-sidebar-open],
.shell-navigation[data-sidebar-open] > .shell-navigation-content {
  visibility: visible !important;
}

/* Message author names: Buzz uses medium (500); Slack shows them bold. */
[data-copy-author] strong,
[data-copy-author] strong * {
  font-weight: ${AUTHOR_WEIGHT} !important;
}
/* Channel name at the top of a conversation. Buzz gives this button no stable
   class, so it is matched by its access-dialog label (English UI). */
[aria-haspopup="dialog"]:is(
  [aria-label^="Manage members of "],
  [aria-label^="Channel access for "],
  [aria-label^="Share access to "],
  [aria-label^="Chat access for "]
) .text-body-sm {
  font-weight: ${CHANNEL_TITLE_WEIGHT};
  font-size: ${SIZES.channelTitle}px !important;
}
`;
}

// Page icons must be image data URLs, so the stroke color is fixed here.
function iconUrl(d, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// A CSS url() for an icon used as a mask; only its shape matters.
function maskUrl(d, filled) {
  const fill = filled ? "black" : "none";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}" stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

// Same address Buzz's own Cmd+Shift+T / M / K shortcuts open.
function activityTarget(activity) {
  return {
    version: 1,
    kind: "page",
    pluginId: "buzz.inbox",
    pageId: "inbox",
    route: { version: 1, params: { activity } },
  };
}

// Primary pages are the only rows a plugin can pin at the top of the
// sidebar. Each page just forwards to the matching Activity tab.
function registerActivityShortcuts(ctx) {
  const React = ctx.react;
  for (const row of ACTIVITY_ROWS) {
    const target = activityTarget(row.id);
    ctx.pages.register({
      id: `activity-${row.id}`,
      title: row.label,
      primary: true,
      placement: "sidebar",
      icon: iconUrl(row.icon, COLORS.text),
      component: function OpenActivityTab() {
        React.useEffect(() => {
          void ctx.navigation.open(target);
        }, []);
        return null;
      },
    });
  }
}

// A dock app is a primary page placed in the dock; each forwards to an
// Activity tab.
function registerDockApps(ctx) {
  const React = ctx.react;
  for (const app of DOCK_APPS) {
    const target = activityTarget(app.activity);
    ctx.pages.register({
      id: `dock-${app.id}`,
      title: app.label,
      primary: true,
      placement: "dock",
      icon: iconUrl(app.icon, COLORS.textStrong),
      component: function OpenActivity() {
        React.useEffect(() => {
          void ctx.navigation.open(target);
        }, []);
        return null;
      },
    });
  }
}

// Korean names for Buzz's own interface text. Only whole labels that match
// exactly are replaced, and never inside messages, the composer or code.
// Add or change entries freely; a pattern entry uses $1 for the number.
const TRANSLATIONS = LANG === "en" ? {} : {
  Activity: t("내 활동", "Activity"),
  Search: t("검색", "Search"),
  All: t("전체", "All"),
  Threads: t("스레드", "Threads"),
  Mentions: t("멘션", "Mentions"),
  DMs: "DM",
  Reactions: t("반응", "Reactions"),
  From: t("보낸 사람", "From"),
  Unread: t("읽지 않음", "Unread"),
  Solo: t("개인", "Solo"),
  Starred: t("즐겨찾기", "Starred"),
  Team: t("팀", "Team"),
  Channels: t("채널", "Channel"),
  Forums: t("포럼", "Forums"),
  "Direct messages": t("다이렉트 메시지", "Direct messages"),
  "Show fewer": t("간단히 보기", "Show fewer"),
  "Show more": t("더 보기", "Show more"),
  Agents: t("에이전트", "Agents"),
  "New messages": t("새 항목", "New messages"),
  Today: t("오늘", "Today"),
  Yesterday: t("어제", "Yesterday"),
  "Add emoji": "이모티콘 추가",
  // Profile card.
  Profile: "프로필",
  Message: "메시지",
  // New message (DM) screen.
  "To:": "대상:",
  "Find a person…": "사람 이름으로 찾기…",
  "Find a person or channel…": "#채널, @사람 이름으로 찾기…",
  "Add another person…": "다른 사람 추가…",
  "Sending message…": "메시지 보내는 중…",
  "Uploading files…": "파일 올리는 중…",
  "Loading messages…": "메시지 불러오는 중…",
  "New message": "새 메시지",
  "Private channel": "비공개 채널",
  Channel: "채널",
  "No matching people.": "일치하는 사람이 없습니다.",
  Unavailable: "사용할 수 없음",
  // Channel right-click menu.
  "Move to…": "이동…",
  "Move to...": "이동…",
  Mute: "음소거",
  Unmute: "음소거 해제",
  "Mark as unread": "읽지 않음으로 표시",
  "Mark as read": "읽음으로 표시",
  "Copy link": "링크 복사",
  "Leave channel": "채널 나가기",
  "Leave conversation": "대화 나가기",
  "Close conversation": "대화 닫기",
  "Create new…": "새로 만들기…",
  "Create new...": "새로 만들기…",
  Unfiled: "미분류",
  "Archive channel": "채널 보관",
  "Delete channel": "채널 삭제",
  "Rename…": "이름 바꾸기…",
  "Remove message": "메시지 삭제",
};
const TRANSLATION_PATTERNS = LANG === "en" ? [] : [
  [/^(\d+) (?:person|people) selected$/, "$1명 선택됨"],
  [/^Type at least (\d+) characters to search people\.$/, "사람을 찾으려면 $1자 이상 입력하세요."],
  [/^No people or channels match "(.+)"\.$/, "\"$1\"과(와) 일치하는 사람이나 채널이 없습니다."],
  // Buzz writes "A is typing", "A, B are typing", "A, B and 3 others are typing".
  [/^(.+) and (\d+) others are typing$/, "$1 외 $2명이 입력 중입니다"],
  [/^(.+) (?:is|are) typing$/, "$1 님이 입력 중입니다"],
  [/^(.+) (?:is|are) working$/, "$1 작업 중"],
  [/^(.+) local time$/, "현지 시간 $1"],
  [/^Managed by (.+)$/, "$1 님이 관리"],
  [/^(\d+) repl(?:y|ies)$/, "답글 $1개"],
  [/^Last reply (.+)$/, "마지막 답글 $1"],
  [/^Remove from (.+)$/, "$1에서 제거"],
  [/^(\d+) unread$/, t("$1개 안 읽음", "$1 unread")],
  [/^(\d+) more$/, t("$1개 더 보기", "$1 more")],
];
// Inside a message row only the thread summary ("4 replies") is translated.
const TRANSLATE_INSIDE = "[data-thread-summary]";
const SKIP_TEXT = "[data-highlight-surface], [data-composer-surface], [contenteditable], input, textarea, pre, code";

function translateText(node) {
  const raw = node.nodeValue;
  const text = raw && raw.trim();
  if (!text || text.length > 80) return;
  const parent = node.parentElement;
  if (!parent || (parent.closest(SKIP_TEXT) && !parent.closest(TRANSLATE_INSIDE))) return;
  let next = Object.hasOwn(TRANSLATIONS, text) ? TRANSLATIONS[text] : undefined;
  if (next === undefined) {
    for (const [pattern, replacement] of TRANSLATION_PATTERNS) {
      if (pattern.test(text)) {
        next = text.replace(pattern, replacement);
        break;
      }
    }
  }
  if (next !== undefined && next !== text) node.nodeValue = raw.replace(text, next);
}

function translated(text) {
  if (Object.hasOwn(TRANSLATIONS, text)) return TRANSLATIONS[text];
  for (const [pattern, replacement] of TRANSLATION_PATTERNS) {
    if (pattern.test(text)) return text.replace(pattern, replacement);
  }
  return undefined;
}

// Menu items whose label Buzz builds from several pieces ("Leave" +
// "channel", "Remove from" + a section name) are matched by their whole
// label; the first piece gets the translation and the rest are emptied.
function translateMenuItems(root) {
  // Thread summaries ("4 replies") change as replies arrive, so their text
  // is left alone and the translation is shown over it (data-slack-ko).
  const LABEL = '[data-thread-summary] [class~="buzz-button-label"]';
  const labels = root.matches?.(LABEL) ? [root] : [...(root.querySelectorAll?.(LABEL) ?? [])];
  for (const label of labels) {
    const next = translated(label.textContent.replace(/\s+/g, " ").trim());
    if (next === undefined) label.removeAttribute("data-slack-ko");
    else if (label.getAttribute("data-slack-ko") !== next) label.setAttribute("data-slack-ko", next);
  }
  const items = root.matches?.(".buzz-menu-item") ? [root] : [...(root.querySelectorAll?.(".buzz-menu-item") ?? [])];
  for (const item of items) {
    if (item.classList.contains("slack-notify-option")) continue;
    const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
    const nodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) if (!n.parentElement?.closest("svg")) nodes.push(n);
    if (nodes.length < 2) continue;
    const label = nodes.map((n) => n.nodeValue).join("").replace(/\s+/g, " ").trim();
    const next = translated(label);
    if (next === undefined || next === label) continue;
    const first = nodes.find((n) => n.nodeValue.trim());
    nodes.forEach((n) => {
      const value = n === first ? next : "";
      if (n.nodeValue !== value) n.nodeValue = value;
    });
  }
}

function translatePlaceholders(root) {
  const inputs = root.matches?.("input[placeholder]") ? [root] : [...(root.querySelectorAll?.("input[placeholder]") ?? [])];
  for (const input of inputs) {
    const value = input.getAttribute("placeholder");
    const next = value && translated(value);
    if (next && next !== value) input.setAttribute("placeholder", next);
  }
}

function translateTree(root) {
  if (root.nodeType === Node.TEXT_NODE) return translateText(root);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  if (LANG !== "en") translatePlaceholders(root);
  // A message row as a whole is skipped, except its thread summary.
  if (root.closest?.(SKIP_TEXT) && !root.closest?.(TRANSLATE_INSIDE)) {
    root.querySelectorAll?.(TRANSLATE_INSIDE).forEach((summary) => translateTree(summary));
    return;
  }
  if (LANG !== "en") translateMenuItems(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) translateText(n);
}

// Buzz re-renders often, so new and changed text is translated as it appears.
function startTranslations(ctx) {
  ctx.effect(() => {
    translateTree(document.body);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") {
          translateText(record.target);
          const item = record.target.parentElement?.closest?.('.buzz-menu-item, [data-thread-summary] [class~="buzz-button-label"]');
          if (item && LANG !== "en") translateMenuItems(item);
        }
        else for (const added of record.addedNodes) translateTree(added);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  });
}

// Slack keeps a formatting bar above the message box and its other buttons
// below. Buzz's own formatting toolbar replaces its bottom row instead, so
// this adds a separate bar to each message box. A button sends the matching
// Buzz keyboard shortcut to that box's editor.
function addFormatBars(ctx) {
  if (!FORMAT_BAR) return;
  ctx.effect(() => {
    const apple = /Mac|iPhone|iPad/.test(navigator.platform);
    const press = (editor, b) => {
      editor.focus();
      const digit = /^\d$/.test(b.key);
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: b.key,
          code: digit ? `Digit${b.key}` : `Key${b.key.toUpperCase()}`,
          metaKey: apple,
          ctrlKey: !apple,
          shiftKey: !!b.shift,
          altKey: !!b.alt,
          bubbles: true,
          cancelable: true,
        }),
      );
    };
    const build = (surface) => {
      const bar = document.createElement("div");
      bar.className = "slack-format-bar";
      bar.setAttribute("role", "toolbar");
      bar.setAttribute("aria-label", t("서식", "Formatting"));
      for (const b of FORMAT_BUTTONS) {
        if (b === "|") {
          bar.appendChild(document.createElement("span"));
          continue;
        }
        const button = document.createElement("button");
        button.type = "button";
        button.title = b.label;
        button.setAttribute("aria-label", b.label);
        if (b.icon) {
          button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${b.icon}"/></svg>`;
        } else {
          button.textContent = b.text;
          button.style.cssText = b.style || "";
        }
        // Keep the text selection in the editor.
        button.addEventListener("mousedown", (event) => event.preventDefault());
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const editor = surface.querySelector('[contenteditable="true"]');
          if (editor) press(editor, b);
        });
        bar.appendChild(button);
      }
      return bar;
    };
    // Buzz's Aa button would swap the bottom row for Buzz's own formatting
    // toolbar. It shows or hides this bar instead, remembered across chats.
    const STORE = "slack-style:format-bar";
    const root = document.documentElement;
    if (localStorage.getItem(STORE) === "hidden") root.dataset.slackFormatBar = "hidden";
    const onClick = (event) => {
      const toggle = event.target.closest?.('[data-composer-surface] button[aria-label="Toggle formatting"]');
      if (!toggle) return;
      event.preventDefault();
      event.stopPropagation();
      const hide = root.dataset.slackFormatBar !== "hidden";
      if (hide) root.dataset.slackFormatBar = "hidden";
      else delete root.dataset.slackFormatBar;
      localStorage.setItem(STORE, hide ? "hidden" : "shown");
      toggle.title = hide ? t("서식 표시", "Show formatting") : t("서식 숨기기", "Hide formatting");
    };
    document.addEventListener("click", onClick, true);
    // Bottom row in Slack's order. The row is the closest element holding
    // all of the listed buttons; a box grouping several of them is opened
    // (display: contents) so its buttons can be ordered with the rest.
    const orderRow = (surface) => {
      const found = COMPOSER_BUTTON_ORDER.map((label) => surface.querySelector(`[aria-label="${label}"]`));
      const present = found.filter(Boolean);
      if (present.length < 2) return;
      let row = present[0].parentElement;
      while (row && row !== surface && !present.every((el) => row.contains(el))) row = row.parentElement;
      if (!row || row === surface) return;
      const set = (el, prop, value) => {
        if (el.style[prop] !== value) el.style[prop] = value;
      };
      const place = (box) => {
        for (const child of box.children) {
          const held = found.map((el, i) => (el && child.contains(el) ? i : -1)).filter((i) => i >= 0);
          if (held.length > 1) {
            set(child, "display", "contents");
            place(child);
          } else {
            set(child, "order", String(held.length ? held[0] + 1 : 9));
          }
        }
      };
      place(row);
      row.classList.add("slack-composer-row");
    };
    const scan = () => {
      // A Buzz toolbar left open earlier is closed, so the bottom row returns.
      for (const close of document.querySelectorAll('[data-composer-surface] [data-formatting-open] button[aria-label="Close formatting"]')) {
        close.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 }));
      }
      for (const toggle of document.querySelectorAll('[data-composer-surface] button[aria-label="Toggle formatting"]')) {
        const title = root.dataset.slackFormatBar === "hidden" ? t("서식 표시", "Show formatting") : t("서식 숨기기", "Hide formatting");
        if (toggle.title !== title) toggle.title = title;
      }
      for (const surface of document.querySelectorAll("[data-composer-surface]")) {
        orderRow(surface);
        if (surface.querySelector(":scope > .slack-format-bar")) continue;
        if (!surface.querySelector("[contenteditable]")) continue;
        surface.appendChild(build(surface));
      }
    };
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
      delete root.dataset.slackFormatBar;
      document.querySelectorAll(".slack-composer-row").forEach((row) => row.classList.remove("slack-composer-row"));
      document.querySelectorAll(".slack-format-bar").forEach((bar) => bar.remove());
    };
  });
}

// Slack's + button in the left bar. It presses Buzz's own (now invisible) +
// button at the bottom of the sidebar, so the same menu opens.
function addDockNewButton(ctx) {
  if (!DOCK_NEW_BUTTON) return;
  ctx.effect(() => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slack-new-button";
    button.title = t("새로 만들기", "New");
    button.setAttribute("aria-label", t("새로 만들기", "New"));
    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
    button.addEventListener("click", () => {
      const target = document.querySelector(`${SIDEBAR} [aria-label="New options"]`);
      if (!target) return;
      const options = { bubbles: true, cancelable: true, button: 0, detail: 1 };
      target.dispatchEvent(new PointerEvent("pointerdown", { ...options, pointerType: "mouse" }));
      target.dispatchEvent(new MouseEvent("mousedown", options));
      target.dispatchEvent(new PointerEvent("pointerup", { ...options, pointerType: "mouse" }));
      target.dispatchEvent(new MouseEvent("mouseup", options));
      target.dispatchEvent(new MouseEvent("click", options));
    });
    document.body.appendChild(button);
    // Buzz's button sits in a round backing of its own. Hide the largest box
    // around it that is still button-sized, so no empty circle is left.
    const hidden = new Set();
    const hideBacking = () => {
      const target = document.querySelector(`${SIDEBAR} [aria-label="New options"]`);
      if (!target) return;
      let box = target;
      while (box.parentElement) {
        const rect = box.parentElement.getBoundingClientRect();
        if (rect.width > 72 || rect.height > 72) break;
        box = box.parentElement;
      }
      if (box.style.visibility !== "hidden") {
        box.style.visibility = "hidden";
        hidden.add(box);
      }
    };
    hideBacking();
    const observer = new MutationObserver(hideBacking);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      hidden.forEach((box) => (box.style.visibility = ""));
      button.remove();
    };
  });
}

// ---- Channel tabs: 메시지 / 파일 / 캔버스 --------------------------------

const TAB_ICONS = {
  // [outline, lines drawn inside it]
  messages: ["M7.9 20A9 9 0 1 0 4 16.1L2 22z", ""],
  files: ["M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z", "M14 3v5h5"],
  canvas: ["M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z", "M8 9h8M8 13h8M8 17h5"],
};
const FILES_TARGET = "slack-style:files";

// What the 파일 launcher last received from Buzz for the channel on screen:
// its toggle and whether the 파일 tab is showing.
const filesLauncher = { props: null, listeners: new Set() };

// Files attached to a message, read from its imeta tags
// (["imeta", "url …", "m image/png", "size 123", "filename a.png", …]).
function messageFiles(event) {
  const files = [];
  for (const tag of event.tags || []) {
    if (tag[0] !== "imeta") continue;
    const file = { messageId: event.id, author: event.pubkey, at: event.created_at };
    for (const part of tag.slice(1)) {
      const space = String(part).indexOf(" ");
      if (space < 0) continue;
      const key = part.slice(0, space);
      const value = part.slice(space + 1);
      if (key === "url") file.url = value;
      else if (key === "m") file.type = value;
      else if (key === "size") file.size = Number(value);
      else if (key === "filename") file.name = value;
      else if (key === "x") file.sha256 = value;
      else if (key === "dim") file.dim = value;
    }
    if (!file.url) continue;
    if (!file.name) file.name = decodeURIComponent(file.url.split("/").pop() || t("파일", "Files"));
    files.push(file);
  }
  return files;
}

function fileSize(bytes) {
  if (!Number.isFinite(bytes)) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function registerFilesPanel(ctx) {
  const React = ctx.react;
  const h = React.createElement;

  // Buzz mounts this in the channel header and hands it the channel and a
  // toggle for the 파일 tab. It draws nothing; the tab row uses what it got.
  function FilesLauncher(props) {
    React.useEffect(() => {
      filesLauncher.props = props;
      filesLauncher.listeners.forEach((listener) => listener());
    });
    React.useEffect(
      () => () => {
        if (filesLauncher.props && filesLauncher.props.context === props.context) {
          filesLauncher.props = null;
          filesLauncher.listeners.forEach((listener) => listener());
        }
      },
      [],
    );
    return null;
  }

  function FilesPanel({ channelContext, context }) {
    if (typeof ctx.panels.useTabTitle === "function") ctx.panels.useTabTitle(t("파일", "Files"));
    const relay = React.useSyncExternalStore(ctx.relay.subscribe, ctx.relay.snapshot);
    const ready = relay && relay.status === "ready" && channelContext && relay.scope === channelContext.scope;
    const session = ready ? relay.session : null;
    const channelId = channelContext && channelContext.channelId;
    const [state, setState] = React.useState({ files: [], loading: true, error: "", oldest: null, done: false });

    const load = React.useCallback(
      (before, previous, signal) => {
        if (!session || !channelId) return;
        setState((current) => ({ ...current, loading: true, error: "" }));
        const filter = { kinds: [9], "#h": [channelId], limit: FILES_PAGE };
        if (before) filter.until = before;
        Promise.resolve()
          .then(() => session.read([filter], signal ? { signal } : undefined))
          .then((events) => {
            if (signal && signal.aborted) return;
            const list = Array.isArray(events) ? events : [];
            const seen = new Set(previous.map((file) => `${file.messageId}:${file.url}`));
            const found = [];
            let oldest = before || null;
            for (const event of list) {
              if (oldest === null || event.created_at < oldest) oldest = event.created_at;
              for (const file of messageFiles(event)) {
                const key = `${file.messageId}:${file.url}`;
                if (!seen.has(key)) {
                  seen.add(key);
                  found.push(file);
                }
              }
            }
            const files = [...previous, ...found].sort((a, b) => b.at - a.at);
            setState({ files, loading: false, error: "", oldest: oldest === null ? null : oldest - 1, done: list.length < FILES_PAGE });
          })
          .catch((error) => {
            if (signal && signal.aborted) return;
            setState((current) => ({ ...current, loading: false, error: String((error && error.message) || error) }));
          });
      },
      [session, channelId],
    );

    React.useEffect(() => {
      const controller = new AbortController();
      setState({ files: [], loading: true, error: "", oldest: null, done: false });
      load(null, [], controller.signal);
      return () => controller.abort();
    }, [load]);

    if (!session) return h("div", { className: "slack-files" }, h("p", { className: "slack-files-note" }, t("연결되는 중입니다…", "Connecting…")));

    const profiles = session.profiles && typeof session.profiles.snapshot === "function" ? session.profiles.snapshot() : null;
    const authorName = (pubkey) => {
      const profile = profiles && typeof profiles.get === "function" ? profiles.get(pubkey) : null;
      return (profile && (profile.displayName || profile.name)) || "";
    };
    const open = (file) => {
      const media = /^(image|video)\//.test(file.type || "");
      const attachment = { url: file.url, type: file.type, name: file.name, size: file.size, sha256: file.sha256, dim: file.dim };
      try {
        if (media && context && typeof context.openMedia === "function" && context.openMedia(file.messageId, attachment)) return;
        if (context && typeof context.open === "function" && context.open(file.url)) return;
      } catch (error) {
        // Fall through to the note below.
      }
      setState((current) => ({ ...current, error: t("이 파일은 여기서 열 수 없습니다. 대화에서 열어 주세요.", "This file can't be opened here. Open it from the conversation.") }));
    };
    const thumb = (file) => {
      if (/^image\//.test(file.type || "") && typeof session.media === "function") {
        let src = "";
        try {
          src = session.media(file.url, 72);
        } catch (error) {
          src = "";
        }
        if (typeof src === "string" && src) return h("img", { className: "slack-files-thumb", src, alt: "", loading: "lazy" });
      }
      const ext = (file.name.split(".").pop() || "").slice(0, 4).toUpperCase();
      return h("span", { className: "slack-files-thumb" }, ext || "FILE");
    };

    return h(
      "div",
      { className: "slack-files" },
      state.files.map((file) =>
        h(
          "button",
          { type: "button", className: "slack-files-row", key: `${file.messageId}:${file.url}`, onClick: () => open(file) },
          thumb(file),
          h(
            "span",
            { className: "slack-files-text" },
            h("span", { className: "slack-files-name" }, file.name),
            h(
              "span",
              { className: "slack-files-meta" },
              [authorName(file.author), new Date(file.at * 1000).toLocaleDateString(t("ko-KR", "en-US")), fileSize(file.size)].filter(Boolean).join(" · "),
            ),
          ),
        ),
      ),
      state.error ? h("p", { className: "slack-files-note" }, state.error) : null,
      state.loading ? h("p", { className: "slack-files-note" }, t("불러오는 중…", "Loading…")) : null,
      !state.loading && !state.files.length && !state.error ? h("p", { className: "slack-files-note" }, t("최근 메시지에 파일이 없습니다.", "No files in recent messages.")) : null,
      !state.loading && !state.done
        ? h("button", { type: "button", className: "slack-files-more", onClick: () => load(state.oldest, state.files) }, t("이전 메시지에서 더 찾기", "Search older messages"))
        : null,
    );
  }

  ctx.panels.register({
    id: "files",
    title: t("파일", "Files"),
    matches: () => false,
    channelLauncher: FilesLauncher,
    channelPlacement: "tab",
    component: FilesPanel,
  });
}

// ---- 허들: recent huddles across your channels ----------------------------

const HUDDLE_ICON = "M3 14v-2a9 9 0 0 1 18 0v2M3 14h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2zM21 14h-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2z";

// A huddle start (kind 48100) and end (48103) name their room in the JSON
// content and their channel in an "h" tag.
function huddleRoom(event) {
  try {
    const id = JSON.parse(event.content).ephemeral_channel_id;
    return typeof id === "string" ? id : "";
  } catch (error) {
    return "";
  }
}

function registerHuddlesPage(ctx) {
  if (!HUDDLES) return;
  const React = ctx.react;
  const h = React.createElement;

  function HuddlesPage() {
    const relay = React.useSyncExternalStore(ctx.relay.subscribe, ctx.relay.snapshot);
    const session = relay && relay.status === "ready" ? relay.session : null;
    const scope = relay && relay.scope;
    const [state, setState] = React.useState({ rows: [], loading: true, error: "" });

    React.useEffect(() => {
      if (!session) return undefined;
      const controller = new AbortController();
      const signal = controller.signal;
      setState({ rows: [], loading: true, error: "" });
      (async () => {
        const listed = session.channels && typeof session.channels.list === "function" ? session.channels.list() : null;
        const channels = (listed && listed.channels) || [];
        const names = new Map(channels.map((channel) => [channel.id, channel.name]));
        const ids = [...names.keys()];
        const events = [];
        // Ask for a batch of channels at a time.
        for (let i = 0; i < ids.length; i += 40) {
          const batch = ids.slice(i, i + 40);
          const found = await session.read(
            [
              { kinds: [48100], "#h": batch, limit: 100 },
              { kinds: [48103], "#h": batch, limit: 200 },
            ],
            { signal },
          );
          if (Array.isArray(found)) events.push(...found);
        }
        if (signal.aborted) return;
        const ended = new Map();
        for (const event of events) {
          if (event.kind !== 48103) continue;
          const room = huddleRoom(event);
          if (room && (!ended.has(room) || event.created_at < ended.get(room))) ended.set(room, event.created_at);
        }
        const rooms = new Map();
        for (const event of events) {
          if (event.kind !== 48100) continue;
          const room = huddleRoom(event);
          const tag = (event.tags || []).find((t) => t[0] === "h");
          if (!room || !tag) continue;
          const previous = rooms.get(room);
          if (!previous || event.created_at < previous.at)
            rooms.set(room, { room, channelId: tag[1], author: event.pubkey, at: event.created_at });
        }
        const now = Date.now() / 1000;
        const rows = [...rooms.values()]
          .map((row) => {
            const end = ended.get(row.room);
            return { ...row, name: names.get(row.channelId) || "", end, live: !end && row.at + 3600 > now };
          })
          .sort((a, b) => b.at - a.at)
          .slice(0, 100);
        try {
          if (session.profiles && typeof session.profiles.ensure === "function")
            await session.profiles.ensure([...new Set(rows.map((row) => row.author))]);
        } catch (error) {
          // Names are optional.
        }
        if (!signal.aborted) setState({ rows, loading: false, error: "" });
      })().catch((error) => {
        if (!signal.aborted) setState({ rows: [], loading: false, error: String((error && error.message) || error) });
      });
      return () => controller.abort();
    }, [session, scope]);

    if (!session) return h("div", { className: "slack-huddles" }, h("p", { className: "slack-files-note" }, t("연결되는 중입니다…", "Connecting…")));
    const profiles = session.profiles && typeof session.profiles.snapshot === "function" ? session.profiles.snapshot() : null;
    const authorName = (pubkey) => {
      const profile = profiles && typeof profiles.get === "function" ? profiles.get(pubkey) : null;
      return (profile && (profile.displayName || profile.name)) || "";
    };
    const openChannel = (channelId) => {
      const at = String(scope || "").lastIndexOf(":");
      if (at < 0) return;
      void ctx.navigation.open({
        version: 1,
        kind: "conversation",
        scope: { communityOrigin: scope.slice(0, at), viewer: scope.slice(at + 1) },
        channelId,
      });
    };
    const when = (row) => {
      const start = new Date(row.at * 1000).toLocaleString(t("ko-KR", "en-US"), { month: "long", day: "numeric", hour: "numeric", minute: "2-digit" });
      if (row.end) return `${start} · ${Math.max(1, Math.round((row.end - row.at) / 60))}${t("분", " min")}`;
      return start;
    };
    return h(
      "div",
      { className: "slack-huddles" },
      h("h1", null, HUDDLES_LABEL),
      state.rows.map((row) =>
        h(
          "button",
          { type: "button", className: "slack-files-row", key: row.room, onClick: () => openChannel(row.channelId) },
          h("span", { className: "slack-files-thumb" }, "🎧"),
          h(
            "span",
            { className: "slack-files-text" },
            h("span", { className: "slack-files-name" }, row.name || t("채널", "Channel")),
            h(
              "span",
              { className: "slack-files-meta" },
              row.live ? h("span", { className: "slack-huddles-live" }, t("진행 중 · ", "Live · ")) : null,
              [authorName(row.author) && t(`${authorName(row.author)} 님이 시작`, `started by ${authorName(row.author)}`), when(row)].filter(Boolean).join(" · "),
            ),
          ),
        ),
      ),
      state.error ? h("p", { className: "slack-files-note" }, state.error) : null,
      state.loading ? h("p", { className: "slack-files-note" }, t("불러오는 중…", "Loading…")) : null,
      !state.loading && !state.rows.length && !state.error ? h("p", { className: "slack-files-note" }, t("최근 허들이 없습니다.", "No recent huddles.")) : null,
    );
  }

  ctx.pages.register({
    id: "huddles",
    title: HUDDLES_LABEL,
    primary: true,
    placement: "sidebar",
    icon: iconUrl(HUDDLE_ICON, COLORS.text),
    component: HuddlesPage,
  });
}

// The row itself is plain DOM added after the channel header, like the
// formatting bar: Buzz has no slot for a row under the channel name.
function addChannelTabs(ctx) {
  if (!CHANNEL_TABS) return;
  registerFilesPanel(ctx);
  ctx.effect(() => {
    const HEADER =
      '.panel-header:has([aria-label^="Manage members of "], [aria-label^="Channel access for "], [aria-label^="Share access to "], [aria-label^="Chat access for "])';
    const icon = ([outline, lines]) =>
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="${outline}"/>${lines ? `<path d="${lines}"/>` : ""}</svg>`;
    const click = (el) => {
      const options = { bubbles: true, cancelable: true, button: 0, detail: 1 };
      el.dispatchEvent(new PointerEvent("pointerdown", { ...options, pointerType: "mouse" }));
      el.dispatchEvent(new MouseEvent("mousedown", options));
      el.dispatchEvent(new PointerEvent("pointerup", { ...options, pointerType: "mouse" }));
      el.dispatchEvent(new MouseEvent("mouseup", options));
      el.dispatchEvent(new MouseEvent("click", options));
    };
    // 캔버스 has no direct way in: open Buzz's "Channel actions" menu and
    // choose "View canvas" there.
    const openCanvas = (header) => {
      const menu = header.querySelector('[aria-label="Channel actions"]');
      if (!menu) return;
      click(menu);
      let tries = 0;
      const find = () => {
        const item = [...document.querySelectorAll('[role="menuitem"]')].find((el) => /view canvas/i.test(el.textContent || ""));
        if (item) return click(item);
        if (++tries < 30) return void setTimeout(find, 30);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      };
      setTimeout(find, 30);
    };
    const build = (header) => {
      const row = document.createElement("div");
      row.className = "slack-channel-tabs";
      row.setAttribute("role", "toolbar");
      row.setAttribute("aria-label", t("채널 탭", "Channel tabs"));
      const add = (id, label, run) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.tab = id;
        button.innerHTML = `${icon(TAB_ICONS[id])}<span>${label}</span>`;
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          run();
        });
        row.appendChild(button);
      };
      const files = () => filesLauncher.props;
      add("messages", t("메시지", "Messages"), () => {
        const props = files();
        if (props && props.pressed && props.available()) props.toggle(FILES_TARGET);
      });
      add("files", t("파일", "Files"), () => {
        const props = files();
        if (props && props.available()) props.toggle(FILES_TARGET);
      });
      add("canvas", t("캔버스", "Canvas"), () => openCanvas(header));
      return row;
    };
    const paint = () => {
      const pressed = !!(filesLauncher.props && filesLauncher.props.pressed);
      // Buzz's canvas is showing when its tab in the side pane is selected.
      const canvas =
        !pressed &&
        [...document.querySelectorAll('[role="tab"][aria-selected="true"]')].some((tab) => /^\s*Canvas\b/.test(tab.textContent || ""));
      for (const row of document.querySelectorAll(".slack-channel-tabs")) {
        for (const button of row.children) {
          const active = button.dataset.tab === "files" ? pressed : button.dataset.tab === "canvas" ? canvas : !pressed && !canvas;
          if (active) button.dataset.active = "";
          else delete button.dataset.active;
        }
      }
    };
    const scan = () => {
      for (const header of document.querySelectorAll(HEADER)) {
        const next = header.nextElementSibling;
        if (!next || !next.classList.contains("slack-channel-tabs")) header.insertAdjacentElement("afterend", build(header));
      }
      paint();
    };
    scan();
    filesLauncher.listeners.add(paint);
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      filesLauncher.listeners.delete(paint);
      document.querySelectorAll(".slack-channel-tabs").forEach((row) => row.remove());
    };
  });
}

// ---------------------------------------------------------------------------
// Channel message alerts, like Slack's "All new messages".
// Buzz alerts only for mentions, DMs and thread replies. This adds a
// "채널 메시지" alert for every new message in a channel. It appears in
// Settings → Notifications, where it can be turned off or given a sound.
//
// It listens to the same live message feed Buzz's own alerts use
// (session.subscribeIncoming). That feed is not a documented plugin API, so
// every step checks it exists; if a Buzz update changes it, channel alerts
// simply stop and nothing else is affected.
const CHANNEL_ALERTS = {
  enabled: true,
  // Default for people who have not picked channels in
  // Settings → 채널 메시지 알림: "all", or a list of channel names without #,
  // e.g. ["공지", "질문"]. Each person's own choice wins.
  channels: "all",
  // Stay quiet for the channel you are looking at right now.
  skipWhileViewing: true,
};

function previewText(text) {
  return String(text || "")
    .replace(/nostr:[a-z0-9]+/gi, "")
    .replace(/[*_~`>#]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

// The Buzz window is in front and this channel is the one open (its sidebar
// row is selected). Buzz's own "viewing" flag only turns on once the new
// message has been drawn, which is too late for a fresh arrival.
function isViewingChannel(channelId) {
  if (document.visibilityState !== "visible" || !document.hasFocus()) return false;
  const id = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(channelId) : channelId;
  // The row carries data-selected; the button inside it carries the id.
  return !!document.querySelector(`[data-channel-sidebar-row][data-selected] button[data-channel-id="${id}"]`);
}

// Settings → 채널 메시지 알림: each person picks the channels that alert.
function registerAlertSettings(ctx) {
  const cards = ctx.settingsCards;
  if (!cards?.register) return;
  const React = ctx.react;
  const h = React.createElement;
  const relay = ctx.relay;

  function useLive() {
    const [, bump] = React.useReducer((n) => n + 1, 0);
    React.useEffect(() => {
      let stopList = () => {};
      const watch = () => {
        stopList();
        const session = relay.snapshot()?.session;
        const subs = [session?.channels?.subscribeList?.(bump), session?.sidebarPreferences?.subscribe?.(bump)];
        stopList = () => subs.forEach((stop) => typeof stop === "function" && stop());
        bump();
      };
      watch();
      const stopRelay = relay.subscribe(watch);
      alertChoice.listeners.add(bump);
      return () => {
        stopList();
        if (typeof stopRelay === "function") stopRelay();
        alertChoice.listeners.delete(bump);
      };
    }, []);
  }

  function ChannelAlertSettings() {
    useLive();
    const snap = relay.snapshot();
    const session = snap?.status === "ready" ? snap.session : undefined;
    const scope = typeof session?.scope === "string" ? session.scope : "";
    const channels = alertableChannels(session, snap?.viewer);
    const saved = scope ? alertChoice.read(scope) : undefined;
    const choice = saved ?? {
      mode: CHANNEL_ALERTS.channels === "all" ? "all" : "selected",
      ids: channels.filter((c) => channelWanted(scope, c)).map((c) => c.id),
    };
    const muted = new Set(session?.sidebarPreferences?.snapshot?.().data?.muted ?? []);
    const set = (next) => scope && alertChoice.write(scope, next);
    const toggle = (id, on) => {
      const ids = new Set(choice.ids);
      if (on) ids.add(id);
      else ids.delete(id);
      set({ mode: "selected", ids: [...ids] });
    };
    const row = { display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "4px 0", cursor: "pointer" };

    return h(
      "section",
      { style: { display: "flex", flexDirection: "column", gap: "var(--space-3)", padding: "var(--space-panel-inset)" } },
      h("h2", null, t("채널 메시지 알림", "Channel message alerts")),
      h(
        "p",
        { style: { color: "var(--text-subtle)" } },
        t("채널에 새 메시지가 오면 알림을 받을 채널을 고릅니다. 채널을 우클릭해 '다음에 대해 알림'에서 바꿔도 같습니다. 음소거한 채널은 알리지 않습니다. 멘션·DM·스레드 답글은 Buzz 기본 알림으로 옵니다.", "Pick the channels whose new messages alert you; right-clicking a channel and using 'Notify me about' does the same. Muted channels never alert. Mentions, DMs and thread replies use Buzz's own alerts."),
      ),
      !session
        ? h("p", null, t("커뮤니티에 연결되면 채널 목록이 나타납니다.", "The channel list appears once you are connected to a community."))
        : h(
            React.Fragment,
            null,
            h(
              "label",
              { style: row },
              h("input", {
                type: "radio",
                name: "slack-style-alert-mode",
                checked: choice.mode === "all",
                onChange: () => set({ mode: "all", ids: choice.ids }),
              }),
              t("모든 채널", "All channels"),
            ),
            h(
              "label",
              { style: row },
              h("input", {
                type: "radio",
                name: "slack-style-alert-mode",
                checked: choice.mode === "selected",
                onChange: () => set({ mode: "selected", ids: choice.ids }),
              }),
              t(`고른 채널만 (${choice.ids.filter((id) => channels.some((c) => c.id === id)).length}개)`, `Selected channels only (${choice.ids.filter((id) => channels.some((c) => c.id === id)).length})`),
            ),
            h(
              "div",
              {
                className: "ui-card",
                style: {
                  padding: "var(--space-2) var(--space-3)",
                  maxHeight: "360px",
                  overflowY: "auto",
                  opacity: choice.mode === "all" ? 0.5 : 1,
                },
              },
              channels.length === 0
                ? h("p", null, t("채널이 없습니다.", "No channels."))
                : channels.map((c) =>
                    h(
                      "label",
                      { key: c.id, style: row },
                      h("input", {
                        type: "checkbox",
                        disabled: choice.mode === "all" || muted.has(c.id),
                        checked: !muted.has(c.id) && (choice.mode === "all" || choice.ids.includes(c.id)),
                        onChange: (e) => toggle(c.id, e.target.checked),
                      }),
                      `# ${c.name}`,
                      muted.has(c.id)
                        ? h("span", { style: { fontSize: "12px", color: "var(--text-subtle)" } }, t("음소거됨", "Muted"))
                        : null,
                    ),
                  ),
            ),
          ),
    );
  }

  cards.register({ id: "channel-alerts", title: t("채널 메시지 알림", "Channel message alerts"), component: ChannelAlertSettings });
}

// Alert for @here / @channel / @everyone in any channel that isn't muted.
const BROADCAST_MENTIONS = true;

// Each person's channel choice, saved on this computer per community and
// account: { mode: "all" | "selected", ids: [channelId, ...] }.
const alertChoice = {
  listeners: new Set(),
  key: (scope) => `slack-style.channel-alerts.v1:${scope}`,
  read(scope) {
    try {
      const saved = JSON.parse(localStorage.getItem(this.key(scope)) || "null");
      if (saved && (saved.mode === "all" || saved.mode === "selected") && Array.isArray(saved.ids)) return saved;
    } catch {}
    return undefined;
  },
  write(scope, choice) {
    try {
      localStorage.setItem(this.key(scope), JSON.stringify(choice));
    } catch {}
    this.listeners.forEach((listener) => listener());
  },
};

// Whether a channel should alert for this person: their saved choice, else
// the file default in CHANNEL_ALERTS.channels.
function channelWanted(scope, channel) {
  const choice = alertChoice.read(scope);
  if (choice) return choice.mode === "all" || choice.ids.includes(channel.id);
  const names = CHANNEL_ALERTS.channels;
  return names === "all" || (Array.isArray(names) && names.includes(channel.name));
}

// ---------------------------------------------------------------------------
// Slack's "다음에 대해 알림…" in a channel's right-click menu: All new posts,
// Mentions only, or Mute. Buzz has no plugin hook for this menu, so the group
// is added to the open menu in place of Buzz's own Mute item (which it then
// clicks to mute or unmute). Mouse only: arrow keys skip these items.
const NOTIFY_MENU = true;
// The older Settings → 채널 메시지 알림 channel list (same data as the menu).
const ALERT_SETTINGS_SCREEN = false;

function addChannelNotifyMenu(ctx) {
  if (!NOTIFY_MENU || !CHANNEL_ALERTS.enabled) return;
  const relay = ctx.relay;
  if (!relay?.snapshot) return;
  const CHECK = "M20 6 9 17l-5-5";
  const svg = (d) =>
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  const BELL = "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0";
  const options = [
    { id: "all", label: t("모든 새 포스트", "All new posts"), icon: `${BELL}M4 2C2.8 3.7 2 5.7 2 8M22 8c0-2.3-.8-4.3-2-6` },
    { id: "mentions", label: t("멘션만", "Mentions only"), icon: BELL },
    {
      id: "mute",
      label: t("음소거", "Mute"),
      icon: "M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7M10.3 21a1.94 1.94 0 0 0 3.4 0M2 2l20 20",
    },
  ];

  const muteItemOf = (popup) =>
    [...popup.querySelectorAll(".buzz-menu-item:not(.slack-notify-option)")].find((el) =>
      /^(Mute|Unmute|음소거|음소거 해제)$/.test(el.textContent.trim()),
    );

  // The channel whose menu is open: the row marked as having a context menu,
  // or else the channel named in the menu's "Actions for <name>" label.
  const channelOf = (popup, session) => {
    const channels = session?.channels?.list?.().channels ?? [];
    const marked = document.querySelector("[data-context-menu-present]");
    const idEl = marked && (marked.closest("[data-channel-id]") || marked.querySelector("[data-channel-id]"));
    const id = idEl?.getAttribute("data-channel-id");
    if (id) return channels.find((c) => c.id === id);
    const name = (popup.getAttribute("aria-label") || "").replace(/^Actions for /, "");
    const named = channels.filter((c) => c.name === name);
    return named.length === 1 ? named[0] : undefined;
  };

  const closeMenu = (popup) => {
    popup.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  };

  // Only touches the DOM when something changed: this runs from a
  // MutationObserver, and writing unconditionally would trigger it again.
  const paint = (popup, state) => {
    popup.querySelectorAll(".slack-notify-option").forEach((el) => {
      const on = el.dataset.option === state ? "true" : "false";
      if (el.getAttribute("aria-checked") === on) return;
      el.setAttribute("aria-checked", on);
      el.querySelector(".slack-notify-check").innerHTML = on === "true" ? svg(CHECK) : "";
    });
  };

  const enhance = (popup) => {
    const snap = relay.snapshot();
    const session = snap?.status === "ready" ? snap.session : undefined;
    if (!session) return;
    const mute = muteItemOf(popup);
    if (!mute) return;
    const channel = channelOf(popup, session);
    if (!channel || channel.huddle || channel.channelType === "solo") return;
    const dm = channel.channelType === "dm";
    // A group DM has three or more people; a 1:1 DM has no "멘션만".
    const group = dm && Array.isArray(channel.members) && channel.members.length > 2;
    const scope = typeof session.scope === "string" ? session.scope : "";
    const isMuted = () => /^(Unmute|음소거 해제)$/.test(mute.textContent.trim());
    const mentionsOnly = () => (dm ? dmMentionsOnly.read(scope).has(channel.id) : !channelWanted(scope, channel));
    const state = () => (isMuted() ? "mute" : mentionsOnly() ? "mentions" : "all");
    const shown = options.filter((o) => !(dm && o.id === "mentions" && !group));
    // In a DM, Slack's last choice also hides the conversation from the
    // sidebar; it comes back from the 다이렉트 메시지 title's right-click menu.
    const dmLabel = (o) =>
      !dm ? o.label
      : o.id === "all" ? t("모든 새 메시지", "All new messages")
      : o.id === "mute" ? t("음소거 및 숨기기", "Mute and hide")
      : o.label;
    const closeItem = () =>
      [...popup.querySelectorAll(".buzz-menu-item:not(.slack-notify-option)")].find((el) =>
        /^(Close conversation|대화 닫기)$/.test(el.textContent.trim()),
      );

    let box = popup.querySelector(".slack-notify-group");
    if (!box || box.dataset.channel !== channel.id) {
      box?.remove();
      box = document.createElement("div");
      box.className = "slack-notify-group";
      box.dataset.channel = channel.id;
      box.setAttribute("role", "group");
      box.innerHTML =
        `<div class="buzz-menu-separator" role="separator"></div>` +
        `<div class="buzz-menu-group-label slack-notify-label">${t("다음에 대해 알림…", "Notify me about…")}</div>` +
        shown
          .map(
            (o) =>
              `<div class="buzz-menu-item slack-notify-option" role="menuitemradio" tabindex="-1" data-option="${o.id}">` +
              `<span class="slack-notify-check" aria-hidden="true"></span>` +
              `<span class="buzz-menu-icon slack-notify-icon" aria-hidden="true">${svg(o.icon)}</span>${dmLabel(o)}</div>`,
          )
          .join("") +
        `<div class="buzz-menu-separator" role="separator"></div>`;
      box.addEventListener("click", (event) => {
        const option = event.target.closest(".slack-notify-option")?.dataset.option;
        if (!option) return;
        event.preventDefault();
        event.stopPropagation();
        const muted = isMuted();
        if (option === "mute") {
          if (!muted) mute.click();
          if (dm) slackHiddenDms.set(scope, channel.id, true);
        } else {
          if (muted) mute.click();
          if (dm) slackHiddenDms.set(scope, channel.id, false);
          if (dm) dmMentionsOnly.set(scope, channel.id, option === "mentions");
          else setChannelAlert(scope, relay.snapshot().session, relay.snapshot().viewer, channel.id, option === "all");
        }
        paint(popup, option);
        setTimeout(() => closeMenu(popup), 120);
      });
      mute.before(box);
    }
    if (mute.style.display !== "none") mute.style.display = "none";
    // Buzz's own "대화 닫기" removes the row for good until a new message;
    // this plugin's hiding instead keeps the DM in the sidebar while it is
    // open, as Slack does, so the item hides it the same way.
    const close = dm ? closeItem() : undefined;
    if (close && !close.dataset.slackHide) {
      close.dataset.slackHide = "";
      const hide = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        slackHiddenDms.set(scope, channel.id, true);
        closeMenu(popup);
      };
      close.addEventListener("click", hide, true);
      close.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") hide(event);
      }, true);
    }
    paint(popup, state());
  };

  ctx.effect(() => {
    const scan = () => document.querySelectorAll(".buzz-menu-popup[data-context-menu], .buzz-menu-popup").forEach((popup) => {
      if (/^Actions for /.test(popup.getAttribute("aria-label") || "")) enhance(popup);
    });
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    scan();
    return () => {
      observer.disconnect();
      document.querySelectorAll(".slack-notify-group").forEach((el) => el.remove());
    };
  });
}

// DMs hidden with "음소거 및 숨기기" or "대화 닫기", saved per community on this
// computer. Slack keeps a hidden DM out of the sidebar except while it is
// open, so this hides the row with CSS unless it is the selected one, rather
// than using Buzz's own hiding, which drops the row until a new message.
const slackHiddenDms = {
  listeners: new Set(),
  key: (scope) => `slack-style.hidden-dms.v1:${scope}`,
  read(scope) {
    try {
      const ids = JSON.parse(localStorage.getItem(this.key(scope)) || "[]");
      return new Set(Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : []);
    } catch {
      return new Set();
    }
  },
  set(scope, id, on) {
    if (!scope) return;
    const ids = this.read(scope);
    if (ids.has(id) === on) return;
    if (on) ids.add(id);
    else ids.delete(id);
    try {
      localStorage.setItem(this.key(scope), JSON.stringify([...ids]));
    } catch {}
    for (const listener of this.listeners) listener();
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
};

// Buzz's own closed DMs (buzz-view.v1:[scope,"hidden-dms"]), from before
// this plugin hid DMs itself or from a menu it did not reach.
function buzzHiddenDmIds(scope) {
  try {
    const raw = JSON.parse(localStorage.getItem(`buzz-view.v1:${JSON.stringify([scope, "hidden-dms"])}`) || "[]");
    return (Array.isArray(raw) ? raw : []).map((entry) => (typeof entry === "string" ? entry : entry?.id)).filter(Boolean);
  } catch {
    return [];
  }
}

// A DM's name as the sidebar shows it: the other people's names. Relay DMs
// carry a placeholder name such as "Group DM (3)", so that is not used.
function dmTitle(channel, session) {
  const profiles = session.profiles?.snapshot?.();
  const people = (channel.participants ?? []).map((key) => {
    const p = profiles?.get?.(key);
    return p?.displayName || p?.name || "";
  });
  if (people.length && people.every(Boolean)) return people.join(", ");
  if (channel.name && !/^(Group )?DM( \(\d+\))?$/i.test(channel.name)) return channel.name;
  return people.filter(Boolean).join(", ") || channel.name || channel.id.slice(0, 10);
}

function hiddenDmRows(ctx) {
  const relay = ctx.relay;
  if (!relay?.snapshot) return;
  const style = document.createElement("style");
  style.id = "slack-style-hidden-dms";
  let scope = "";
  const paint = () => {
    const ids = scope ? [...slackHiddenDms.read(scope)] : [];
    const esc = (id) => (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(id) : id);
    const css = ids.length
      ? `${ids.map((id) => `[data-channel-sidebar-row]:not([data-selected]):not([data-slack-draft]):has(button[data-channel-id="${esc(id)}"])`).join(",\n")} { display: none !important; }`
      : "";
    if (style.textContent !== css) style.textContent = css;
  };
  ctx.effect(() => {
    document.head.append(style);
    let stopIncoming;
    const attach = () => {
      const snap = relay.snapshot();
      const session = snap?.status === "ready" ? snap.session : undefined;
      const next = typeof session?.scope === "string" ? session.scope : "";
      if (next !== scope) {
        scope = next;
        stopIncoming?.();
        stopIncoming = undefined;
        // As in Slack, a new message brings a hidden DM back unless it is muted.
        if (session?.subscribeIncoming) {
          const viewer = scope.slice(scope.lastIndexOf(":") + 1);
          stopIncoming = session.subscribeIncoming((messages) => {
            const hidden = slackHiddenDms.read(scope);
            if (!hidden.size) return;
            const muted = new Set(session.sidebarPreferences?.snapshot?.().data?.muted ?? []);
            for (const m of messages ?? []) {
              const author = m.authorId ?? m.pubkey ?? m.author;
              if (hidden.has(m.channelId) && !muted.has(m.channelId) && author !== viewer)
                slackHiddenDms.set(scope, m.channelId, false);
            }
          });
        }
      }
      paint();
    };
    const stopStore = slackHiddenDms.subscribe(paint);
    const stopRelay = relay.subscribe?.(attach);
    attach();
    return () => {
      stopStore();
      stopRelay?.();
      stopIncoming?.();
      style.remove();
    };
  });
}

// Slack shows how many messages a DM has unread; Buzz shows a dot and keeps
// the number in the row's hidden label ("3 observed unread messages…").
// Muted DMs and ones marked unread by hand (no number) keep Buzz's look.
function dmUnreadCounts(ctx) {
  const COUNT = /^(\d+) observed unread messages/;
  const sync = () => {
    for (const mark of document.querySelectorAll("[data-channel-sidebar-row] [data-channel-unread]")) {
      const row = mark.closest("[data-channel-sidebar-row]");
      const dm = !!row?.querySelector("[data-dm-identity], [data-dm-participant-count]");
      const n = dm && !mark.hasAttribute("data-channel-muted") ? Number(COUNT.exec(mark.getAttribute("aria-label") || "")?.[1]) : 0;
      const want = n > 0 ? (n > 99 ? "99+" : String(n)) : null;
      if (mark.getAttribute("data-slack-count") === want) continue;
      if (want) mark.setAttribute("data-slack-count", want);
      else mark.removeAttribute("data-slack-count");
    }
  };
  ctx.effect(() => {
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        sync();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-label", "data-channel-muted"] });
    sync();
    return () => {
      observer.disconnect();
      document.querySelectorAll("[data-slack-count]").forEach((el) => el.removeAttribute("data-slack-count"));
    };
  });
}

// Slack marks a conversation with a pencil in the sidebar when you left an
// unsent message in it; Buzz shows nothing. Drafts are saved per community
// under buzz-view.v1:[scope,"draft:<channel>"], checked here every couple of
// seconds (writes in this window raise no event). The pencil shows only when
// you are not in that conversation, and a hidden DM with a draft shows too.
const DRAFT_MARKS = true;
const DRAFT_SCAN_MS = 1500;

function draftHasContent(value) {
  if (typeof value === "string") return !!value.trim();
  if (!value || typeof value !== "object") return false;
  if (value.forward || value.chatCards?.length || value.gifs?.length) return true;
  if (typeof value.text === "string" && value.text.trim()) return true;
  // The editor snapshot: any text node with something in it.
  let found = false;
  const walk = (node, depth) => {
    if (found || !node || typeof node !== "object" || depth > 40) return;
    if (typeof node.text === "string" && node.text.trim() && node.type === "text") found = true;
    if (Array.isArray(node.content)) node.content.forEach((child) => walk(child, depth + 1));
    else if (node.content && typeof node.content === "object") walk(node.content, depth + 1);
  };
  walk(value.document, 0);
  return found;
}

function draftMarks(ctx) {
  const relay = ctx.relay;
  if (!DRAFT_MARKS || !relay?.snapshot) return;
  let last = "";
  const scan = () => {
    const snap = relay.snapshot();
    const scope = snap?.status === "ready" && typeof snap.session?.scope === "string" ? snap.session.scope : "";
    const ids = new Set();
    if (scope) {
      const prefix = "buzz-view.v1:";
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key?.startsWith(prefix)) continue;
          let pair;
          try {
            pair = JSON.parse(key.slice(prefix.length));
          } catch {
            continue;
          }
          if (!Array.isArray(pair) || pair[0] !== scope || typeof pair[1] !== "string") continue;
          const match = /^draft:([^:]+)$/.exec(pair[1]);
          if (!match) continue;
          const raw = localStorage.getItem(key);
          if (!raw || raw.length > 500000) continue;
          try {
            if (draftHasContent(JSON.parse(raw))) ids.add(match[1]);
          } catch {}
        }
      } catch {}
    }
    for (const row of document.querySelectorAll("[data-channel-sidebar-row]")) {
      const id = row.querySelector("button[data-channel-id]")?.getAttribute("data-channel-id");
      const want = !!id && ids.has(id);
      if (row.hasAttribute("data-slack-draft") !== want) row.toggleAttribute("data-slack-draft", want);
    }
    const now = [...ids].sort().join(",");
    if (now !== last) last = now;
  };
  ctx.effect(() => {
    const timer = setInterval(scan, DRAFT_SCAN_MS);
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-selected"] });
    scan();
    return () => {
      clearInterval(timer);
      observer.disconnect();
      document.querySelectorAll("[data-slack-draft]").forEach((el) => el.removeAttribute("data-slack-draft"));
    };
  });
}

// Right-clicking the 다이렉트 메시지 title opens Slack's section menu: start a
// DM and the hidden conversations ("음소거 및 숨기기" or "대화 닫기"), muted
// or not, in one list. Picking one opens it; a hidden DM shows in the
// sidebar only while it is open.
const DM_SECTION_MENU = true;
const DM_MENU_LIMIT = 10;

function dmSectionMenu(ctx) {
  if (!DM_SECTION_MENU || !ctx.relay?.snapshot) return;
  const relay = ctx.relay;
  const esc = (text) => String(text).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

  let open = null;
  const close = () => {
    open?.remove();
    open = null;
  };

  const show = (x, y, section) => {
    close();
    const snap = relay.snapshot();
    const session = snap?.status === "ready" ? snap.session : undefined;
    if (!session) return false;
    const scope = typeof session.scope === "string" ? session.scope : "";
    const at = scope.lastIndexOf(":");
    const dms = (session.channels?.list?.().channels ?? []).filter((c) => c.channelType === "dm");
    const byId = new Map(dms.map((c) => [c.id, c]));
    const buzzHidden = new Set(buzzHiddenDmIds(scope));
    const hidden = [...new Set([...slackHiddenDms.read(scope), ...buzzHidden])].filter((id) => byId.has(id));
    const startButton = [...section.querySelectorAll("button")].find(
      (b) => !b.closest("summary") && /new|start|message|메시지/i.test(b.getAttribute("aria-label") || b.title || ""),
    );

    // Unread DMs are bold, as in Slack's menu (no count there).
    const unread = (id) => {
      try {
        const snap = session.unread?.snapshot?.({ kind: "channel", channelId: id });
        const n = (snap?.row ?? snap)?.observedCount;
        return Number.isFinite(n) && n > 0 ? n : 0;
      } catch {
        return 0;
      }
    };
    const row = (id) => {
      const n = unread(id);
      return (
        `<div class="buzz-menu-item slack-dm-menu-item" role="menuitem" tabindex="-1" data-channel="${esc(id)}"${n ? " data-unread=\"\"" : ""}>` +
        `<span class="slack-dm-menu-name">${esc(dmTitle(byId.get(id), session))}</span>` +
        `</div>`
      );
    };
    const list = (label, ids, empty) =>
      `<div class="buzz-menu-separator" role="separator"></div>` +
      `<div class="buzz-menu-group-label">${label}</div>` +
      (ids.length
        ? ids.slice(0, DM_MENU_LIMIT).map(row).join("")
        : `<div class="buzz-menu-item slack-dm-menu-empty" data-disabled="" aria-disabled="true">${empty}</div>`);

    const menu = document.createElement("div");
    menu.className = "buzz-menu-popup text-body-sm slack-dm-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", t("다이렉트 메시지", "Direct messages"));
    menu.innerHTML =
      (startButton
        ? `<div class="buzz-menu-item slack-dm-menu-item" role="menuitem" tabindex="-1" data-start="">${t("다이렉트 메시지 시작", "Start a direct message")}</div>`
        : "") +
      list(t("숨긴 대화", "Hidden conversations"), hidden, t("숨긴 대화가 없습니다", "No hidden conversations"));
    if (!startButton) menu.querySelector(".buzz-menu-separator")?.remove();

    // Names of people not loaded yet fill in once their profiles arrive.
    const shownIds = hidden.slice(0, DM_MENU_LIMIT);
    const missing = [...new Set(shownIds.flatMap((id) => byId.get(id)?.participants ?? []))].filter(
      (key) => !session.profiles?.snapshot?.().get?.(key),
    );
    if (missing.length && typeof session.profiles?.ensure === "function") {
      Promise.resolve(session.profiles.ensure(missing))
        .catch(() => {})
        .then(() => {
          if (open !== menu) return;
          menu.querySelectorAll(".slack-dm-menu-item[data-channel]").forEach((el) => {
            const channel = byId.get(el.dataset.channel);
            const name = el.querySelector(".slack-dm-menu-name");
            if (channel && name) name.textContent = dmTitle(channel, session);
          });
        });
    }

    menu.addEventListener("click", (event) => {
      const item = event.target.closest(".slack-dm-menu-item");
      if (!item) return;
      close();
      if (item.hasAttribute("data-start")) startButton?.click();
      else if (item.dataset.channel && at >= 0) {
        const id = item.dataset.channel;
        // Opening a DM Buzz itself closed brings its row back; taking it into
        // this plugin's hiding keeps it hidden again once you leave it.
        if (buzzHidden.has(id)) slackHiddenDms.set(scope, id, true);
        void ctx.navigation.open({
          version: 1,
          kind: "conversation",
          scope: { communityOrigin: scope.slice(0, at), viewer: scope.slice(at + 1) },
          channelId: id,
        });
      }
    });
    document.body.append(menu);
    const box = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(x, innerWidth - box.width - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(y, innerHeight - box.height - 8))}px`;
    open = menu;
    return true;
  };

  ctx.effect(() => {
    const onContext = (event) => {
      const summary = event.target.closest?.('[data-sidebar-section="dms"] details > summary');
      if (!summary) return;
      if (show(event.clientX, event.clientY, summary.closest("[data-sidebar-section]"))) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const onDown = (event) => {
      if (open && !open.contains(event.target)) close();
    };
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("contextmenu", onContext, true);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey, true);
    addEventListener("blur", close);
    return () => {
      document.removeEventListener("contextmenu", onContext, true);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey, true);
      removeEventListener("blur", close);
      close();
    };
  });
}

// Cmd+Z (Ctrl+Z on Windows) in an empty message box right after sending
// takes the message back, as in Slack: it is deleted and its text returns to
// the box to edit and send again. It works for the last message sent from
// that box, until you type or send something else there. Messages with files
// are left alone, since the files cannot be put back.
// Width (px) of a file card in messages (measured from Slack: 328).
const FILE_CARD_WIDTH = 328;
// Corner radius and gap (px) of file cards in messages (measured from Slack:
// the border runs straight from 8px in, which a 12px round corner gives).
const FILE_CARD_RADIUS = 12;
const FILE_CARD_GAP = 8;
// Icons of the file card toolbar (24px SVG paths), drawn as stylesheet masks.
const FILE_TOOL_ICONS = {
  download: "M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 8a4 4 0 0 1 0 8M12 11v9m0 0-3-3m3 3 3-3",
  open: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  share: "M14 6l6 6-6 6M20 12H9a5 5 0 0 0-5 5v1",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
  };

// Reaction pills under messages (Slack's colours).
const REACTION = { bg: "rgba(29, 28, 29, 0.06)", mineBg: "rgba(29, 155, 209, 0.1)", mineRing: "#1D9BD1", mineInk: "#1264A3", hoverRing: "rgba(29, 28, 29, 0.3)" };

// Width (px) of a file chip in the message box (Slack: ~234).
const COMPOSER_FILE_WIDTH = 234;
// File card colours: white with a light grey border, mid grey on hover (Slack).
const FILE_CARD_BG = "#FFFFFF";
const FILE_CARD_BG_DARK = "#1A1D21";
const FILE_CARD_BORDER = "#E7E7E7";
const FILE_CARD_BORDER_HOVER = "#ADADAE";
// Colours of a file card's type square, by Buzz's file kind (Slack's palette).
const FILE_KIND_COLORS = { code: "#CB512D", pdf: "#D93F3F", sheet: "#2BAC76", archive: "#616061", text: "#3C8DDE" };

// Size (px) of an attached picture's square in the message box. Measured
// side by side with Slack at the same window size: 60.
const ATTACHMENT_THUMB = 60;
// Corner radius (px) of that square (Slack: about 8, plain round corners).
const ATTACHMENT_RADIUS = 8;

const UNDO_SEND = true;
const UNDO_SEND_WINDOW_MS = 5 * 60 * 1000;
const UNDO_SEND_FOLD_MS = 240;

function undoSend(ctx) {
  const relay = ctx.relay;
  if (!UNDO_SEND || !relay?.snapshot) return;
  const EDITOR = '[data-composer-surface] [contenteditable="true"]';
  let last = null;

  const isEmpty = (editor) => !editor.textContent.trim() && !editor.querySelector("img, [data-mention-kind], [data-recipient-key]");
  const selectedChannel = () =>
    document.querySelector("[data-channel-sidebar-row][data-selected] button[data-channel-id]")?.getAttribute("data-channel-id");

  // Paste the message's Markdown, as copying it from a message would: the
  // box turns its @mention links back into chips.
  const putBack = (editor, text) => {
    editor.focus();
    let handled = false;
    try {
      const data = new DataTransfer();
      data.setData("text/plain", text);
      const event = new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true });
      editor.dispatchEvent(event);
      handled = event.defaultPrevented;
    } catch {}
    if (!handled) document.execCommand("insertText", false, text);
  };

  ctx.effect(() => {
    let stopSend;
    let session;
    const attach = () => {
      const snap = relay.snapshot();
      const next = snap?.status === "ready" ? snap.session : undefined;
      if (next === session) return;
      stopSend?.();
      stopSend = undefined;
      session = next;
      last = null;
      if (typeof session?.outbox?.observeSend !== "function") return;
      stopSend = session.outbox.observeSend((event) => {
        if (event?.kind !== 9) return undefined;
        const surface = document.activeElement?.closest?.("[data-composer-surface]");
        const editor = surface?.querySelector('[contenteditable="true"]');
        const channelId = event.tags?.find?.(([name]) => name === "h")?.[1];
        if (!editor || !channelId) return undefined;
        const files = event.tags.some(([name]) => name === "imeta");
        last = files ? null : { id: event.id, channelId, content: event.content, editor, at: Date.now(), thread: event.tags.some(([name]) => name === "e") };
        return undefined;
      });
    };
    const onKey = (event) => {
      if (!last || event.key.toLowerCase() !== "z" || event.shiftKey || event.altKey) return;
      if (!(event.metaKey || event.ctrlKey)) return;
      const editor = event.target.closest?.(EDITOR);
      if (!editor || editor !== last.editor || !editor.isConnected || !isEmpty(editor)) return;
      if (Date.now() - last.at > UNDO_SEND_WINDOW_MS) return;
      // The main box is reused across conversations; only undo in the one it was sent to.
      if (!last.thread && selectedChannel() && selectedChannel() !== last.channelId) return;
      if (typeof session?.messages?.remove !== "function") return;
      event.preventDefault();
      event.stopPropagation();
      const taken = last;
      last = null;
      putBack(editor, taken.content || "");
      // As in Slack, the message turns pink and folds away, then is deleted.
      const row = document.querySelector(`[data-message-id="${CSS.escape(taken.id)}"]`);
      const remove = () => {
        try {
          session.messages.remove([taken.id]);
        } catch {
          if (row) row.removeAttribute("data-slack-unsending");
        }
      };
      if (!row || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        remove();
        return;
      }
      row.style.setProperty("--slack-unsend-height", `${row.offsetHeight}px`);
      row.setAttribute("data-slack-unsending", "");
      setTimeout(remove, UNDO_SEND_FOLD_MS);
    };
    // Typing or sending something else ends the chance to undo.
    const onInput = (event) => {
      if (last && event.target.closest?.(EDITOR) === last.editor && !isEmpty(last.editor)) last = null;
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("input", onInput, true);
    const stopRelay = relay.subscribe?.(attach);
    attach();
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("input", onInput, true);
      stopRelay?.();
      stopSend?.();
    };
  });
}

// File cards in messages, as in Slack: clicking the card opens a viewer for
// HTML pages and text files, which Buzz cannot preview (it only downloads
// them). The viewer reads the file through Buzz's own media address and
// shows an HTML page in a sandboxed frame that runs no scripts.
const FILE_PREVIEWS = true;
const FILE_PREVIEW_MAX_BYTES = 5 * 1024 * 1024;
const PREVIEW_HTML = new Set(["html", "htm"]);
const PREVIEW_TEXT = new Set(["txt", "md", "markdown", "json", "csv", "tsv", "log", "xml", "yml", "yaml", "js", "ts", "tsx", "jsx", "py", "rs", "go", "java", "kt", "swift", "rb", "sh", "css", "sql", "diff", "patch", "toml", "ini"]);
const fileExtension = (name) => {
  const parts = String(name || "").toLowerCase().split(".");
  return parts.length > 1 ? parts.at(-1) : "";
};

function filePreviews(ctx) {
  const conversation = ctx.conversation;
  if (!FILE_PREVIEWS || typeof conversation?.registerAttachment !== "function") return;
  const h = ctx.react.createElement;
  const kindOf = (attachment) => {
    if (attachment?.kind !== "file") return null;
    const ext = fileExtension(attachment.name);
    if (PREVIEW_HTML.has(ext) || attachment.mime === "text/html") return "html";
    if (PREVIEW_TEXT.has(ext) || /^text\//.test(attachment.mime || "")) return "text";
    return null;
  };

  let viewer = null;
  const closeViewer = () => {
    viewer?.remove();
    viewer = null;
  };
  const openViewer = async (attachment, source, author) => {
    closeViewer();
    const name = attachment.name || t("파일", "File");
    const box = document.createElement("div");
    box.className = "slack-file-viewer";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", name);
    const bar = document.createElement("div");
    bar.className = "slack-file-viewer-bar";
    const title = document.createElement("div");
    title.className = "slack-file-viewer-title";
    const who = document.createElement("strong");
    who.textContent = author || "";
    const file = document.createElement("span");
    file.textContent = name;
    title.append(who, file);
    const download = document.createElement("a");
    download.className = "slack-file-viewer-button";
    download.href = source;
    download.download = name;
    download.title = t("다운로드", "Download");
    download.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>';
    // A link styled as a button, like the download link next to it: a real
    // <button> here was shrunk to a dot by the app's own button styles.
    const close = document.createElement("a");
    close.href = "#";
    close.setAttribute("role", "button");
    close.className = "slack-file-viewer-button";
    close.title = t("닫기", "Close");
    close.setAttribute("aria-label", t("닫기", "Close"));
    close.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    close.addEventListener("click", (event) => {
      event.preventDefault();
      closeViewer();
    });
    bar.append(title, download, close);
    const body = document.createElement("div");
    body.className = "slack-file-viewer-body";
    body.textContent = t("불러오는 중…", "Loading…");
    box.append(bar, body);
    box.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeViewer();
    });
    document.body.append(box);
    viewer = box;
    close.focus();
    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error(String(response.status));
      const size = Number(response.headers.get("content-length"));
      if (size > FILE_PREVIEW_MAX_BYTES) throw new Error("too big");
      const text = await response.text();
      if (viewer !== box) return;
      body.textContent = "";
      if (kindOf(attachment) === "html") {
        const frame = document.createElement("iframe");
        frame.className = "slack-file-viewer-frame";
        // No allow-scripts and no allow-same-origin: the page is drawn, never run.
        frame.setAttribute("sandbox", "");
        frame.setAttribute("referrerpolicy", "no-referrer");
        frame.title = name;
        frame.srcdoc = text;
        body.append(frame);
      } else {
        const pre = document.createElement("pre");
        pre.className = "slack-file-viewer-text";
        pre.textContent = text;
        body.append(pre);
      }
    } catch {
      if (viewer === box) body.textContent = t("이 파일은 미리 볼 수 없습니다. 다운로드해서 열어 주세요.", "This file can't be previewed. Download it to open it.");
    }
  };
  ctx.effect?.(() => {
    const onKey = (event) => {
      if (event.key === "Escape" && viewer) closeViewer();
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      closeViewer();
    };
  });

  const React = ctx.react;
  // Each icon is a stylesheet mask (FILE_TOOL_ICONS); inline SVG and inline
  // mask styles both stayed invisible inside Buzz's messages.
  // Drawn by the button's own ::before, the way the card's </> mark is.
  const formatSize = (bytes) =>
    !Number.isFinite(bytes) ? "" : bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  const formatTime = (secs) => {
    if (!Number.isFinite(secs)) return "";
    try {
      return new Date(secs * (secs < 1e12 ? 1000 : 1)).toLocaleString(LANG === "ko" ? "ko-KR" : undefined, { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return "";
    }
  };
  // Buzz's forward lives in the message's ⋯ menu; open it and pick Forward.
  const forwardMessage = (wrap) => {
    const row = wrap.closest("[data-message-id]");
    const more = row?.querySelector('[aria-label="More message actions"]');
    if (!more) return;
    more.click();
    let tries = 0;
    const pick = () => {
      const item = [...document.querySelectorAll(".buzz-menu-popup .buzz-menu-item")].find((el) => /^(Forward message|메시지 전달)$/.test(el.textContent.trim()));
      if (item) item.click();
      else if (tries++ < 10) setTimeout(pick, 50);
    };
    setTimeout(pick, 30);
  };

  // Slack's floating toolbar on a file card: download, open, share, details.
  function SlackFileCard({ attachment, source, message, FileCard }) {
    const [details, setDetails] = React.useState(false);
    const wrap = React.useRef(null);
    if (!FileCard) return null;
    const author = (() => {
      try {
        const snap = ctx.relay?.snapshot?.();
        const profile = snap?.session?.profiles?.snapshot?.().get?.(message?.authorId ?? message?.pubkey);
        return profile?.displayName || profile?.name || "";
      } catch {
        return "";
      }
    })();
    const type = (fileExtension(attachment.name) || "file").toUpperCase();
    const open = () => void openViewer(attachment, source, author);
    const button = (tip, name, onClick) =>
      h("button", { type: "button", className: "slack-file-tool", "data-icon": name, "data-tip": tip, "aria-label": tip, onClick: (event) => { event.stopPropagation(); onClick(event); } });
    return h(
      "div",
      { ref: wrap, className: "slack-file-card-wrap", onMouseLeave: () => setDetails(false) },
      // Slack shows only the type ("HTML"), not the size.
      h(FileCard, {
        attachment: { ...attachment, size: undefined },
        source,
        onOpenLink: () => false,
        typeLabel: type,
        onPreview: open,
      }),
      h(
        "div",
        { className: "slack-file-tools", role: "toolbar", "aria-label": t("파일 작업", "File actions") },
        button(t("다운로드", "Download"), "download", () => wrap.current?.querySelector('[class*="_fileDownloadAction_"] :is(button, a)')?.click()),
        button(t("새 창에서 열기", "Open"), "open", open),
        button(t("파일 공유…", "Share file…"), "share", () => wrap.current && forwardMessage(wrap.current)),
        button(t("파일 세부정보 보기", "View file details"), "info", () => setDetails((v) => !v)),
      ),
      details &&
        h(
          "div",
          { className: "slack-file-details", role: "dialog", "aria-label": t("파일 세부정보", "File details") },
          h("div", { className: "slack-file-details-name" }, attachment.name || ""),
          h("dl", null,
            h("dt", null, t("종류", "Type")), h("dd", null, type),
            attachment.size !== undefined && h("dt", null, t("크기", "Size")), attachment.size !== undefined && h("dd", null, formatSize(attachment.size)),
            author && h("dt", null, t("보낸 사람", "Shared by")), author && h("dd", null, author),
            message?.createdAt !== undefined && h("dt", null, t("보낸 시간", "Shared")), message?.createdAt !== undefined && h("dd", null, formatTime(message.createdAt)),
          ),
        ),
    );
  }

  conversation.registerAttachment({
    id: "slack-file-preview",
    title: t("파일 미리보기", "File preview"),
    order: 100,
    matches: (attachment) => !!kindOf(attachment),
    component: SlackFileCard,
  });
}

// Reaction pills: Buzz fixes these buttons at 36×36 in a way stylesheet
// rules cannot override (checked in the app: the rules match but lose), so
// the pill's size is set on each button itself.
const REACTION_PILL = {
  button: { width: "auto", "min-width": "0", "max-width": "none", height: "24px", "min-height": "24px", padding: "0 8px", "border-radius": "12px", display: "inline-flex", "align-items": "center", "justify-content": "center", overflow: "visible", background: "transparent" },
  add: { padding: "0 6px", "min-width": "32px" },
  slot: { width: "auto", "min-width": "0", "max-width": "none", height: "auto", overflow: "visible", display: "inline-flex", "align-items": "center" },
  item: { height: "24px", "border-radius": "12px" },
  // Buzz draws the emoji at 7/6 of its size; Slack's is a 16px picture,
  // which a 14px colour emoji glyph matches.
  // Buzz also clips the emoji's box (overflow: hidden), which cut a colour
  // glyph's top and bottom once its line got shorter; let it show whole.
  emoji: { "font-size": "14px", "line-height": "18px", height: "18px", scale: "1", padding: "0", "max-width": "none", overflow: "visible", "text-overflow": "clip" },
  picture: { width: "16px", height: "16px", scale: "1" },
};
function reactionPills(ctx) {
  const set = (el, styles) => {
    for (const [name, value] of Object.entries(styles))
      if (el.style.getPropertyValue(name) !== value || el.style.getPropertyPriority(name) !== "important") el.style.setProperty(name, value, "important");
  };
  const sync = () => {
    for (const item of document.querySelectorAll('[data-message-reactions] [class*="_reactionItem_"], [data-message-reactions][class*="_inlineReactionTool_"]')) {
      set(item, REACTION_PILL.item);
      const button = item.querySelector("button");
      if (!button) continue;
      set(button, REACTION_PILL.button);
      if (item.matches('[class*="_inlineReactionTool_"]')) set(button, REACTION_PILL.add);
      for (const slot of button.children) {
        set(slot, REACTION_PILL.slot);
        for (const inner of slot.children) if (inner.tagName !== "IMG" && !inner.matches('[class*="_reactionNativeEmoji_"]')) set(inner, REACTION_PILL.slot);
      }
      for (const emoji of button.querySelectorAll('[class*="_reactionNativeEmoji_"]')) set(emoji, REACTION_PILL.emoji);
      for (const picture of button.querySelectorAll('[class*="_reactionCustomEmoji_"], [class*="_reactionPlaceholder_"]')) set(picture, REACTION_PILL.picture);
    }
  };
  ctx.effect(() => {
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        sync();
      });
    });
    // style too: if Buzz rewrites a button's own style, put the pill back
    // (set() only writes when a value differs, so this cannot loop).
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
    sync();
    return () => observer.disconnect();
  });
}

// Dragging files over a conversation: Slack fades the whole pane to white and
// shows a picture, "<대화>(으)로 업로드" and a line under it. Buzz draws a dashed
// box saying "Drop files into this conversation"; that box is restyled here
// and given Slack's picture and words.
const DROP_ART = `<svg width="164" height="140" viewBox="0 0 164 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<circle cx="82" cy="70" r="68" fill="#F4F4F4"/>
<rect x="44" y="20" width="76" height="62" rx="6" fill="#36C5F0"/><rect x="50" y="28" width="64" height="46" rx="3" fill="#7FD6F5"/>
<rect x="96" y="34" width="10" height="16" rx="2" fill="#fff"/><path d="M100 52v12M98 56h4M98 60h4" stroke="#fff" stroke-width="2"/>
<rect x="18" y="52" width="66" height="54" rx="6" fill="#9B51E0"/><rect x="24" y="58" width="54" height="42" rx="3" fill="#B57BF0"/><path d="M45 70l14 9-14 9z" fill="#fff"/>
<g transform="rotate(-12 110 92)"><rect x="70" y="62" width="80" height="60" rx="6" fill="#fff" stroke="#E8E8E8"/><rect x="76" y="68" width="68" height="48" rx="3" fill="#B6E3F2"/><circle cx="128" cy="82" r="7" fill="#F2C744"/><path d="M76 112l22-22 14 12 10-8 22 18H76z" fill="#2EB67D"/></g>
</svg>`;

function slackDropOverlay(ctx) {
  const titleOf = () => {
    const row = document.querySelector("[data-channel-sidebar-row][data-selected] .navigation-item-label");
    return (row?.textContent || "").trim();
  };
  const sync = () => {
    for (const overlay of document.querySelectorAll('[class*="_fileDropOverlay_"]:not([data-slack-drop])')) {
      overlay.setAttribute("data-slack-drop", "");
      const name = titleOf();
      const art = document.createElement("div");
      art.className = "slack-drop-art";
      art.innerHTML = DROP_ART;
      const title = document.createElement("div");
      title.className = "slack-drop-title";
      title.textContent = name ? t(`${name}(으)로 업로드`, `Upload to ${name}`) : t("이 대화로 업로드", "Upload to this conversation");
      const sub = document.createElement("div");
      sub.className = "slack-drop-sub";
      sub.textContent = t("여기에 놓으면 메시지에 첨부됩니다", "Drop here to attach to your message");
      overlay.append(art, title, sub);
    }
  };
  ctx.effect(() => {
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    sync();
    return () => observer.disconnect();
  });
}

// The hover toolbar on a message, as in Slack: a dark tooltip naming each
// button (Buzz shows the browser's slow plain one), and a 공유… button that
// forwards the message (Buzz keeps Forward inside its ⋯ menu).
// Slack-like icons for the toolbar buttons, by Buzz's aria-label (thin
// 24px strokes; ⋮ instead of ⋯). Drawn as stylesheet masks.
const TOOLBAR_ICONS = {
  "Add reaction": "M20 12.5a8 8 0 1 1-6.5-7.86M8.5 14.5s1.2 1.6 3.5 1.6 3.5-1.6 3.5-1.6M9 10h.01M15 10h.01M18.5 2.5v6M15.5 5.5h6",
  Reply: "M20 11.5a7.5 7.5 0 0 1-11.1 6.6L4 19.5l1.2-4.4A7.5 7.5 0 1 1 20 11.5zM8.5 10h7M8.5 13.5h4.5",
  "Copy link": "M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1",
  "More message actions": "M12 5.5h.01M12 12h.01M12 18.5h.01",
  share: "M14 6l6 6-6 6M20 12H9a5 5 0 0 0-5 5v1",
};
const toolbarMask = (d, width = 1.6) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='${width}' stroke-linecap='round' stroke-linejoin='round'><path d='${d}'/></svg>`)}")`;

// The toolbar's corners and border, and its tooltips (measured from Slack).
const TOOLBAR_RADIUS = 12;
const TOOLBAR_BORDER = "#CBCBCB";

const TOOLBAR_TIPS = {
  "Add reaction": t("반응 추가...", "Add reaction..."),
  Reply: t("스레드에 답장", "Reply in thread"),
  "Copy link": t("링크 복사", "Copy link"),
  "More message actions": t("추가 작업", "More actions"),
  Edit: t("메시지 편집", "Edit message"),
  "Edit message": t("메시지 편집", "Edit message"),
};
function messageToolbar(ctx) {
  const tipFor = (button) => {
    const label = button.getAttribute("aria-label") || button.getAttribute("title") || "";
    return TOOLBAR_TIPS[label] || TRANSLATIONS[label] || label;
  };
  const forward = (group) => {
    const more = group.querySelector('[aria-label="More message actions"]');
    if (!more) return;
    more.click();
    let tries = 0;
    const pick = () => {
      const item = [...document.querySelectorAll(".buzz-menu-popup .buzz-menu-item")].find((el) => /^(Forward message|메시지 전달)$/.test(el.textContent.trim()));
      if (item) item.click();
      else if (tries++ < 10) setTimeout(pick, 50);
    };
    setTimeout(pick, 30);
  };
  const sync = () => {
    for (const group of document.querySelectorAll('[role="group"][aria-label="Message actions"]')) {
      // Buzz's 36px buttons beat stylesheet sizes (as with reactions), so
      // Slack's 32px is set on each button and the bar itself.
      for (const [prop, value] of [["padding", "3px"], ["gap", "0px"], ["border-radius", `${TOOLBAR_RADIUS}px`]])
        if (group.style.getPropertyValue(prop) !== value) group.style.setProperty(prop, value, "important");
      for (const button of group.querySelectorAll(':scope > button, :scope > * > button, :scope [aria-label="More message actions"]')) {
        for (const [prop, value] of [["width", "32px"], ["height", "32px"], ["min-width", "32px"], ["min-height", "32px"], ["padding", "0"], ["border-radius", "6px"]])
          if (button.style.getPropertyValue(prop) !== value) button.style.setProperty(prop, value, "important");
        const label = button.getAttribute("aria-label") || "";
        const icon = button.classList.contains("slack-forward-button") ? "share" : TOOLBAR_ICONS[label] ? label : null;
        if (icon && button.getAttribute("data-slack-icon") !== icon) button.setAttribute("data-slack-icon", icon);
        const tip = tipFor(button);
        if (tip && button.getAttribute("data-slack-tip") !== tip) button.setAttribute("data-slack-tip", tip);
        // The browser's own tooltip would show on top of this one.
        if (button.hasAttribute("title")) {
          button.setAttribute("data-slack-title", button.getAttribute("title"));
          button.removeAttribute("title");
        }
      }
      const copy = group.querySelector(':scope > [aria-label="Copy link"]');
      if (copy && !group.querySelector(".slack-forward-button")) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `${copy.className} slack-forward-button`;
        button.setAttribute("aria-label", t("공유…", "Share…"));
        button.setAttribute("data-slack-tip", t("공유…", "Share…"));
        button.setAttribute("data-slack-icon", "share");
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          forward(group);
        });
        copy.before(button);
      }
    }
  };
  ctx.effect(() => {
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        sync();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    sync();
    return () => {
      observer.disconnect();
      document.querySelectorAll(".slack-forward-button").forEach((el) => el.remove());
    };
  });
}

// Above two or more files in a message, Slack shows "2개의 첨부 파일 ▾" (folds
// and unfolds them) and "모두 다운로드" (downloads each one). Buzz shows only
// the cards, so this adds that line before each group of cards.
function fileGroupHeaders(ctx) {
  const CARD = ':scope > [class*="_filePreviewAttachment_"], :scope > [class*="_fileAttachment_"], :scope > * > [class*="_filePreviewAttachment_"], :scope > * > [class*="_fileAttachment_"]';
  const caret = '<svg class="slack-file-caret" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 8h14l-7 9z"/></svg>';
  const cloud = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 8a4 4 0 0 1 0 8M12 11v9m0 0-3-3m3 3 3-3"/></svg>';
  const downloadOne = (card) => {
    const button = card.querySelector('[class*="_fileDownloadAction_"] :is(button, a)');
    if (button) button.click();
    else if (card.matches("a, button")) card.click();
  };
  const sync = () => {
    for (const group of document.querySelectorAll('[data-highlight-surface] [class*="_fileGroup_"]')) {
      const cards = [...group.querySelectorAll(CARD)];
      const header = group.previousElementSibling?.classList.contains("slack-file-header") ? group.previousElementSibling : null;
      if (cards.length < 2) {
        header?.remove();
        continue;
      }
      const label = t(`${cards.length}개의 첨부 파일`, `${cards.length} files`);
      if (header) {
        const text = header.querySelector(".slack-file-count-label");
        if (text && text.textContent !== label) text.textContent = label;
        continue;
      }
      const line = document.createElement("div");
      line.className = "slack-file-header";
      line.innerHTML =
        `<button type="button" class="slack-file-toggle" aria-expanded="true"><span class="slack-file-count-label"></span>${caret}</button>` +
        `<span class="slack-file-sep" aria-hidden="true"></span>` +
        `<button type="button" class="slack-file-all">${cloud}<span>${t("모두 다운로드", "Download all")}</span></button>`;
      line.querySelector(".slack-file-count-label").textContent = label;
      line.querySelector(".slack-file-toggle").addEventListener("click", (event) => {
        const folded = !group.hasAttribute("data-slack-collapsed");
        group.toggleAttribute("data-slack-collapsed", folded);
        line.toggleAttribute("data-collapsed", folded);
        event.currentTarget.setAttribute("aria-expanded", String(!folded));
      });
      line.querySelector(".slack-file-all").addEventListener("click", () => {
        // One at a time, so the browser does not drop downloads started together.
        [...group.querySelectorAll(CARD)].forEach((card, i) => setTimeout(() => downloadOne(card), i * 400));
      });
      group.before(line);
    }
  };
  ctx.effect(() => {
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        sync();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    sync();
    return () => {
      observer.disconnect();
      document.querySelectorAll(".slack-file-header").forEach((el) => el.remove());
      document.querySelectorAll("[data-slack-collapsed]").forEach((el) => el.removeAttribute("data-slack-collapsed"));
    };
  });
}

// The file chips in the message box show the file's type ("HTML") under its
// name, as in Slack, instead of its size; the type comes from the name.
function composerFileTypes(ctx) {
  const setAttr = (el, name, value) => {
    if (!el || el.getAttribute(name) === value) return;
    if (value === null) el.removeAttribute(name);
    else el.setAttribute(name, value);
  };
  const sync = () => {
    for (const item of document.querySelectorAll('[data-composer-surface] section[aria-label="Attachments"] li:not([data-media])')) {
      const name = item.querySelector('[class*="_name_"]')?.textContent || "";
      const type = (fileExtension(name) || "").toUpperCase() || null;
      setAttr(item, "data-slack-type", type);
      // attr() in CSS reads the element's own attribute, so the hint carries it too.
      setAttr(item.querySelector('[class*="_hint_"]'), "data-slack-type", type);
    }
    // The list scrolls sideways, so it clips what sticks out of it: room on
    // top and right for the remove button on each tile's corner. Set on the
    // element itself, as Buzz's own list padding wins over stylesheet rules.
    for (const list of document.querySelectorAll('[data-composer-surface] section[aria-label="Attachments"] ul')) {
      for (const [prop, value] of [["padding-top", "12px"], ["padding-right", "12px"]])
        if (list.style.getPropertyValue(prop) !== value) list.style.setProperty(prop, value, "important");
    }
    for (const button of document.querySelectorAll('[data-composer-surface] section[aria-label="Attachments"] li [class*="_actions_"] button'))
      setAttr(button, "data-slack-tip", t("파일 제거", "Remove file"));
  };
  // Tooltips over the remove buttons, drawn outside the clipping list.
  let tip = null;
  const showTip = (button) => {
    tip?.remove();
    tip = document.createElement("div");
    tip.className = "slack-floating-tip";
    tip.textContent = button.getAttribute("data-slack-tip");
    document.body.append(tip);
    const r = button.getBoundingClientRect();
    const w = tip.offsetWidth;
    tip.style.left = `${Math.max(4, Math.min(innerWidth - w - 4, r.left + r.width / 2 - w / 2))}px`;
    tip.style.top = `${Math.max(4, r.top - tip.offsetHeight - 8)}px`;
  };
  const hideTip = () => {
    tip?.remove();
    tip = null;
  };
  ctx.effect(() => {
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        sync();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const over = (event) => {
      const button = event.target.closest?.("[data-slack-tip]");
      if (button) showTip(button);
    };
    const out = (event) => {
      if (event.target.closest?.("[data-slack-tip]")) hideTip();
    };
    document.addEventListener("pointerover", over, true);
    document.addEventListener("pointerout", out, true);
    document.addEventListener("pointerdown", hideTip, true);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("pointerover", over, true);
      document.removeEventListener("pointerout", out, true);
      document.removeEventListener("pointerdown", hideTip, true);
      hideTip();
    };
  });
}

// Link previews: a Slack-style card under a message for each web link, with
// the page's title, description, site name and picture. Buzz 1.0.6 has no
// card for ordinary web links. Buzz itself reads the page (host.readPage,
// granted by host.publicPages in manifest.json): it fetches only the page's
// head and hands back these fields, never the page, with no cookies. The
// picture and icon come the same way (host.publicImages). Nothing else is
// sent anywhere. Set LINK_PREVIEWS to false to turn the cards off.
const LINK_PREVIEWS = true;
const LINK_PREVIEW_MAX_IMAGE = 5 * 1024 * 1024;
const LINK_PREVIEW_HOPS = 4;
// Width (px) of a link card; narrower conversations shrink it (Slack: ~720).
const LINK_PREVIEW_WIDTH = 720;

function linkPreviewCards(ctx) {
  const conversation = ctx.conversation;
  const host = ctx.host;
  if (!LINK_PREVIEWS || typeof conversation?.registerLinkPreview !== "function" || typeof host?.readPage !== "function") return;
  const React = ctx.react;
  const h = React.createElement;
  const pages = new Map();
  const images = new Map();

  const https = (url) => {
    try {
      return new URL(url).protocol === "https:";
    } catch {
      return false;
    }
  };
  // Buzz follows no redirect; each Location is checked here before asking again.
  const readPage = async (url) => {
    let at = url;
    for (let hop = 0; hop < LINK_PREVIEW_HOPS; hop++) {
      const page = await host.readPage(at, { timeoutMs: 8000 });
      if (page?.location) {
        const next = new URL(page.location, at).href;
        if (!https(next)) return null;
        at = next;
        continue;
      }
      const p = page?.status >= 200 && page.status < 300 ? page.preview : undefined;
      return p && (p.title || p.description) ? p : null;
    }
    return null;
  };
  const page = (url) => {
    if (!pages.has(url)) pages.set(url, readPage(url).catch(() => null));
    return pages.get(url);
  };
  const readImage = async (url) => {
    if (typeof host.requestBytes !== "function") return null;
    let at = url;
    for (let hop = 0; hop < LINK_PREVIEW_HOPS; hop++) {
      const res = await host.requestBytes({ url: at, maxBytes: LINK_PREVIEW_MAX_IMAGE, timeoutMs: 8000 });
      const headers = Object.fromEntries(Object.entries(res?.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
      if (res?.status >= 300 && res.status < 400 && headers.location) {
        const next = new URL(headers.location, at).href;
        if (!https(next)) return null;
        at = next;
        continue;
      }
      if (!(res?.status >= 200 && res.status < 300) || !res.body?.length) return null;
      const type = String(headers["content-type"] || "").split(";")[0].trim();
      if (!/^image\/(png|jpeg|gif|webp|avif)$/.test(type)) return null;
      return URL.createObjectURL(new Blob([res.body], { type }));
    }
    return null;
  };
  // Buzz's window may show https: images directly (its img-src allows them),
  // so a picture Buzz could not read for us is shown from its own address.
  const image = (url) => {
    if (!url || !https(url)) return Promise.resolve(null);
    if (!images.has(url)) images.set(url, readImage(url).catch(() => null).then((blob) => blob || url));
    return images.get(url);
  };
  // A wide picture (most og:images are 1200×630) is the card's second
  // column, as in Slack: flush to the right edge, as tall as the text beside
  // it, and as wide as its own shape needs at that height (at most 45% of the
  // card), so it is cut only when that limit is reached. A square-ish one is
  // an 80px thumbnail there.
  const sizers = new WeakMap();
  const fitWide = (card, img) => {
    const text = card.querySelector(".slack-link-card-text");
    const ratio = img.naturalWidth / img.naturalHeight;
    if (!text || !ratio) return;
    // A wider picture narrows the text, which may then wrap to one more
    // line; a few passes settle on a width that fits the final height.
    for (let pass = 0; pass < 4; pass++) {
      const width = Math.round(Math.min(text.offsetHeight * ratio, card.clientWidth * 0.45));
      if (img.style.width === `${width}px`) break;
      img.style.width = `${width}px`;
    }
  };
  const shapeCard = (img) => {
    const card = img.closest(".slack-link-card");
    if (!card || !img.naturalWidth || !img.naturalHeight) return;
    const wide = img.naturalWidth / img.naturalHeight > 1.3;
    if ((card.dataset.wideImage !== undefined) !== wide) {
      if (wide) card.dataset.wideImage = "";
      else delete card.dataset.wideImage;
    }
    if (!wide) {
      img.style.width = "";
      return;
    }
    fitWide(card, img);
    if (!sizers.has(card) && typeof ResizeObserver === "function") {
      // Refit only when the card's width changes (the window or pane was
      // resized): the picture's own width changes the text's height, and
      // reacting to that would keep growing the picture.
      let lastWidth = card.clientWidth;
      const observer = new ResizeObserver(() => {
        if (!card.isConnected) return observer.disconnect();
        if (card.clientWidth === lastWidth) return;
        lastWidth = card.clientWidth;
        const current = card.querySelector(".slack-link-card-image");
        if (current && card.dataset.wideImage !== undefined) fitWide(card, current);
      });
      observer.observe(card);
      sizers.set(card, observer);
    }
  };
  const useAsync = (load, key) => {
    const [value, set] = React.useState(null);
    React.useEffect(() => {
      let live = true;
      set(null);
      load(key).then((v) => live && set(v));
      return () => {
        live = false;
      };
    }, [key]);
    return value;
  };

  function SlackLinkCard({ url, open }) {
    const preview = useAsync(page, url);
    const picture = useAsync(image, preview?.image ?? "");
    const icon = useAsync(image, preview?.icon ?? "");
    if (!preview) return null;
    let site = preview.siteName;
    if (!site) {
      try {
        site = new URL(url).hostname.replace(/^www\./, "");
      } catch {}
    }
    const go = (event) => {
      event.preventDefault();
      open();
    };
    return h(
      "a",
      {
        className: "slack-link-card",
        href: url,
        onClick: go,
        title: url,
        "data-has-image": picture ? "" : undefined,
      },
      h(
        "div",
        { className: "slack-link-card-text" },
        preview.title && h("div", { className: "slack-link-card-title" }, preview.title),
        preview.description && h("div", { className: "slack-link-card-description" }, preview.description),
        site &&
          h(
            "div",
            { className: "slack-link-card-site" },
            icon && h("img", { className: "slack-link-card-icon", src: icon, alt: "" }),
            h("span", null, site),
          ),
      ),
      picture &&
        h("img", {
          className: "slack-link-card-image",
          src: picture,
          alt: preview.imageAlt || "",
          onLoad: (event) => shapeCard(event.currentTarget),
          // Hidden, not removed: React still owns this element.
          onError: (event) => { event.currentTarget.style.display = "none"; },
        }),
    );
  }

  conversation.registerLinkPreview({
    id: "slack-link-card",
    title: t("링크 미리보기", "Link preview"),
    // Other plugins' cards for their own links (GitHub and so on) win.
    order: 100,
    matches: https,
    component: SlackLinkCard,
  });
  // Buzz offers only links written with https:// to link previews. A link
  // typed without it (example.com) still shows as a link, so its card is
  // added here, under the message, from the same page reader.
  const bareCard = (href, link) => {
    const card = document.createElement("a");
    card.className = "slack-link-card slack-link-card-bare";
    card.href = href;
    card.title = href;
    card.hidden = true;
    card.addEventListener("click", (event) => {
      event.preventDefault();
      link.click();
    });
    page(href).then(async (preview) => {
      if (!preview || !card.isConnected) return;
      let site = preview.siteName;
      if (!site) {
        try {
          site = new URL(href).hostname.replace(/^www\./, "");
        } catch {}
      }
      const [picture, icon] = await Promise.all([image(preview.image ?? ""), image(preview.icon ?? "")]);
      const text = document.createElement("div");
      text.className = "slack-link-card-text";
      const add = (cls, value) => {
        if (!value) return null;
        const el = document.createElement("div");
        el.className = cls;
        el.textContent = value;
        text.append(el);
        return el;
      };
      add("slack-link-card-title", preview.title);
      add("slack-link-card-description", preview.description);
      const siteEl = add("slack-link-card-site", " ");
      if (siteEl) {
        siteEl.textContent = "";
        if (icon) {
          const img = document.createElement("img");
          img.className = "slack-link-card-icon";
          img.src = icon;
          img.alt = "";
          siteEl.append(img);
        }
        const name = document.createElement("span");
        name.textContent = site || "";
        siteEl.append(name);
      }
      card.append(text);
      if (picture) {
        const img = document.createElement("img");
        img.className = "slack-link-card-image";
        img.src = picture;
        img.alt = preview.imageAlt || "";
        img.addEventListener("error", () => img.remove());
        img.addEventListener("load", () => shapeCard(img));
        card.append(img);
        card.dataset.hasImage = "";
      }
      card.hidden = false;
    });
    return card;
  };
  const BARE = /^(?!https?:\/\/)[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?([/?#]\S*)?$/i;
  const scanBare = () => {
    for (const link of document.querySelectorAll("[data-highlight-surface] a[href]")) {
      if (link.closest(".slack-link-card, [data-link-previews], [data-composer-surface]") || link.dataset.slackBare !== undefined) continue;
      const label = link.textContent.trim();
      if (!BARE.test(label)) continue;
      link.dataset.slackBare = "";
      const href = `https://${label}`;
      if (!https(href)) continue;
      // Below the message text: after the outermost block the link sits in.
      let block = link.closest("p, li, blockquote, h1, h2, h3, h4, h5, h6") ?? link;
      while (block.parentElement?.matches("ul, ol, li, blockquote")) block = block.parentElement;
      const holder = block.parentElement;
      if (!holder || holder.querySelector(`:scope > .slack-link-card-bare[href="${CSS.escape(href)}"]`)) continue;
      let after = block;
      while (after.nextElementSibling && !after.nextElementSibling.matches(".slack-link-card-bare")) after = after.nextElementSibling;
      while (after.nextElementSibling?.matches(".slack-link-card-bare")) after = after.nextElementSibling;
      after.after(bareCard(href, link));
    }
  };
  ctx.effect?.(() => {
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scanBare();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    scanBare();
    return () => {
      observer.disconnect();
      document.querySelectorAll(".slack-link-card-bare").forEach((el) => el.remove());
      document.querySelectorAll("[data-slack-bare]").forEach((el) => delete el.dataset.slackBare);
    };
  });
  ctx.effect?.(() => () => {
    for (const p of images.values()) p.then((u) => u?.startsWith("blob:") && URL.revokeObjectURL(u));
  });
}

// Group DMs set to "멘션만": saved per community on this computer.
const dmMentionsOnly = {
  key: (scope) => `slack-style.dm-mentions-only.v1:${scope}`,
  read(scope) {
    try {
      const ids = JSON.parse(localStorage.getItem(this.key(scope)) || "[]");
      return new Set(Array.isArray(ids) ? ids : []);
    } catch {
      return new Set();
    }
  },
  set(scope, id, on) {
    const ids = this.read(scope);
    if (on) ids.add(id);
    else ids.delete(id);
    try {
      localStorage.setItem(this.key(scope), JSON.stringify([...ids]));
    } catch {}
  },
};

// Buzz alerts for every message in a DM. For group DMs set to "멘션만", a
// notification gate (a check Buzz runs before every alert) lets only
// messages that mention you through.
function groupDmMentionGate(ctx) {
  const relay = ctx.relay;
  if (typeof ctx.notifications?.gate !== "function" || !relay?.snapshot) return;
  ctx.notifications.gate({
    id: "group-dm-mentions-only",
    allows(target) {
      if (!target || target.kind !== "conversation" || !target.channelId) return true;
      const snap = relay.snapshot();
      const session = snap?.status === "ready" ? snap.session : undefined;
      const scope = typeof session?.scope === "string" ? session.scope : "";
      if (!scope || !dmMentionsOnly.read(scope).has(target.channelId)) return true;
      if (!target.messageId) return false;
      const attention = session.unread?.attention?.(target.channelId, target.messageId);
      return !!attention?.mentioned;
    },
  });
}

// Turn channel alerts on or off for one channel, keeping everything else.
function setChannelAlert(scope, session, viewer, channelId, on) {
  if (!scope) return;
  const all = alertableChannels(session, viewer).map((c) => c.id);
  const choice = alertChoice.read(scope) ?? {
    mode: CHANNEL_ALERTS.channels === "all" ? "all" : "selected",
    ids: alertableChannels(session, viewer).filter((c) => channelWanted(scope, c)).map((c) => c.id),
  };
  const ids = new Set(choice.mode === "all" ? all : choice.ids);
  if (on) ids.add(channelId);
  else ids.delete(channelId);
  const everyone = all.every((id) => ids.has(id));
  alertChoice.write(scope, everyone ? { mode: "all", ids: [...ids] } : { mode: "selected", ids: [...ids] });
}

function alertableChannels(session, viewer) {
  const list = session?.channels?.list?.().channels ?? [];
  return list
    .filter(
      (c) =>
        !c.huddle &&
        c.channelType !== "dm" &&
        c.channelType !== "solo" &&
        (!Array.isArray(c.members) || c.members.includes(viewer)),
    )
    .sort((a, b) => String(a.name).localeCompare(String(b.name), LANG));
}

function startChannelAlerts(ctx) {
  if (!CHANNEL_ALERTS.enabled) return;
  const relay = ctx.relay;
  const service = ctx.notifications;
  if (!relay?.snapshot || !relay?.subscribe || !service?.register) return;
  const category = service.register({ id: "channel-messages", label: t("채널 메시지", "Channel messages") });
  // Channels are now chosen from each channel's right-click menu
  // ("다음에 대해 알림…"), so the separate Settings screen is not shown.
  if (ALERT_SETTINGS_SCREEN) registerAlertSettings(ctx);
  const submit = category?.submit;
  if (typeof submit !== "function") return;

  ctx.effect(() => {
    let session;
    let stopIncoming = () => {};
    let closed = false;
    const timers = new Set();

    // Decide one message. Returns "wait" while Buzz is still working out
    // whether it is a mention/DM/reply (those get Buzz's own alert).
    const decide = (owned, viewer, message) => {
      const channel = owned.channels?.list?.().channels?.find((c) => c.id === message.channelId);
      if (!channel || channel.huddle || channel.channelType === "dm" || channel.channelType === "solo") return false;
      // @here / @channel / @everyone: Buzz has no broadcast mention, so the
      // plugin treats these words as one. They alert even in channels set to
      // "멘션만" (but not muted ones, checked below).
      const broadcast = BROADCAST_MENTIONS && /(^|[\s(])@(here|channel|everyone)(?=$|[\s.,!?)])/i.test(message.previewContent || "");
      if (!broadcast && !channelWanted(owned.scope, channel)) return false;
      const prefs = owned.sidebarPreferences?.snapshot?.();
      if (prefs?.data?.muted?.includes?.(message.channelId)) return false;
      const attention = owned.unread?.attention?.(message.channelId, message.messageId);
      if (attention) {
        if (attention.pending || attention.status === "unknown") return "wait";
        // Mentions, DMs and thread replies already get Buzz's own alert.
        if (attention.category || attention.mentioned) return false;
        // Replies inside threads are not channel messages in Slack either.
        if (attention.rootId && attention.rootId !== message.messageId) return false;
        if (CHANNEL_ALERTS.skipWhileViewing && attention.viewing) return false;
        // Buzz's own rule: by now a message you are looking at (in any pane)
        // has been marked read. Only trusted while Buzz is in front, since a
        // channel Buzz does not track also reports "not unread".
        if (
          CHANNEL_ALERTS.skipWhileViewing &&
          attention.unread === false &&
          document.visibilityState === "visible" &&
          document.hasFocus()
        )
          return false;
      }
      if (CHANNEL_ALERTS.skipWhileViewing && isViewingChannel(message.channelId)) return false;
      return channel;
    };

    const send = (owned, viewer, message, channel) => {
      const scope = typeof owned.scope === "string" ? owned.scope : "";
      const at = scope.lastIndexOf(":");
      if (at < 0) return;
      const members = channel.members ?? [];
      let name = "";
      try {
        name = owned.names?.resolve?.(message.workflowOwnerId ?? message.authorId, undefined, members) ?? "";
      } catch {}
      if (!name) name = owned.profiles?.snapshot?.().get?.(message.authorId)?.name ?? message.authorId.slice(0, 10);
      void Promise.resolve(
        submit({
          sourceKey: message.messageId,
          title: `#${channel.name} · ${name}`,
          body: previewText(message.previewContent),
          target: {
            version: 1,
            kind: "conversation",
            scope: { viewer, communityOrigin: scope.slice(0, at) },
            channelId: message.channelId,
            messageId: message.messageId,
          },
        }),
      ).catch(() => {});
    };

    const consider = (owned, viewer, message, tries) => {
      if (closed || session !== owned) return;
      const age = Date.now() - message.createdAt * 1000;
      if (age < -30000 || age > 120000) return;
      const verdict = tries === 0 ? "wait" : decide(owned, viewer, message);
      if (verdict === "wait") {
        if (tries >= 6) return;
        const timer = setTimeout(() => {
          timers.delete(timer);
          consider(owned, viewer, message, tries + 1);
        }, tries === 0 ? 1200 : 800);
        timers.add(timer);
        return;
      }
      if (verdict) send(owned, viewer, message, verdict);
    };

    const update = () => {
      const snap = relay.snapshot();
      const next = snap?.status === "ready" ? snap.session : undefined;
      if (next === session) return;
      stopIncoming();
      stopIncoming = () => {};
      session = next;
      const viewer = snap?.viewer;
      if (!session || !viewer || typeof session.subscribeIncoming !== "function") return;
      const owned = session;
      stopIncoming = owned.subscribeIncoming((messages) => {
        for (const message of messages) {
          if (!message || message.authorId === viewer || message.audience) continue;
          consider(owned, viewer, message, 0);
        }
      });
    };

    update();
    const stopRelay = relay.subscribe(update);
    return () => {
      closed = true;
      stopIncoming();
      if (typeof stopRelay === "function") stopRelay();
      timers.forEach(clearTimeout);
    };
  });
}

// Settings → Slack Style: pick the language. Labels are built when the
// plugin loads, so a change applies after the Buzz window reloads.
function registerLanguageSettings(ctx) {
  const cards = ctx.settingsCards;
  if (!cards?.register) return;
  const React = ctx.react;
  const h = React.createElement;

  const PEN = "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z";
  const sectionTitle = (text) => h("h3", { style: { margin: 0, fontSize: "15px", fontWeight: 700 } }, text);
  const hint = (text) => h("p", { style: { margin: 0, fontSize: "13px", color: "var(--text-subtle)" } }, text);

  function LanguageSettings() {
    const [choice, setChoice] = React.useState(() => savedLanguage() ?? "auto");
    const [theme, setTheme] = React.useState(savedTheme);
    const [custom, setCustom] = React.useState(savedCustomColor);
    const [applied, setApplied] = React.useState(false);

    const pickTheme = (id) => {
      setTheme(id);
      try {
        localStorage.setItem(THEME_KEY, id);
      } catch {}
      switchTheme(id);
    };
    const pickCustom = (color) => {
      if (!/^#[0-9a-f]{6}$/i.test(color)) return;
      setCustom(color);
      try {
        localStorage.setItem(CUSTOM_COLOR_KEY, color);
      } catch {}
      THEMES.custom = customTheme(color);
      pickTheme("custom");
    };
    const pickLanguage = (next) => {
      setChoice(next);
      try {
        if (next === "auto") localStorage.removeItem(LANGUAGE_KEY);
        else localStorage.setItem(LANGUAGE_KEY, next);
      } catch {}
    };
    const needsReload = (choice === "auto" ? pickAutoLanguage() : choice) !== LANG;

    // Mini preview of a theme: left bar, sidebar and a selected row.
    const preview = (colors) =>
      h("span", {
        "aria-hidden": "true",
        style: { display: "flex", width: "100%", height: "100%", borderRadius: "7px", overflow: "hidden" },
      },
        h("span", { style: { width: "26%", background: colors.chrome } }),
        h("span", {
          style: { flex: 1, background: colors.sidebar, display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px", padding: "0 7px" },
        },
          h("span", { style: { height: "5px", width: "70%", borderRadius: "2px", background: colors.text, opacity: 0.55 } }),
          h("span", { style: { height: "7px", borderRadius: "2px", background: colors.selected } }),
          h("span", { style: { height: "5px", width: "55%", borderRadius: "2px", background: colors.text, opacity: 0.55 } })));

    const tile = (id) => {
      const colors = { ...BASE_COLORS, ...THEMES[id] };
      const active = theme === id;
      const isCustom = id === "custom";
      const frame = {
        position: "relative", display: "block", width: "76px", height: "50px", borderRadius: "10px", padding: "3px",
        boxShadow: active ? "0 0 0 2px var(--text-standard)" : "0 0 0 1px color-mix(in srgb, var(--text-standard) 14%, transparent)",
        cursor: "pointer",
      };
      const label = h("span", {
        style: { fontSize: "12px", fontWeight: active ? 700 : 400, color: active ? "var(--text-standard)" : "var(--text-subtle)" },
      }, THEMES[id].name);
      const wrap = { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" };
      if (!isCustom) {
        return h("button", {
          key: id, type: "button", "aria-pressed": active, title: THEMES[id].name, onClick: () => pickTheme(id),
          style: { ...wrap, border: 0, padding: 0, background: "transparent", color: "inherit", cursor: "pointer" },
        }, h("span", { style: frame }, preview(colors)), label);
      }
      // The custom tile is the color picker itself: clicking it opens the
      // system color panel, and every change applies at once.
      return h("label", { key: id, title: THEMES[id].name, style: { ...wrap, cursor: "pointer" } },
        h("span", { style: frame },
          active
            ? preview(colors)
            : h("span", {
                "aria-hidden": "true",
                style: {
                  display: "block", width: "100%", height: "100%", borderRadius: "7px",
                  background: "conic-gradient(from 200deg, #e0457b, #f2a33a, #f2d94e, #4cc38a, #3fa7e0, #7a5af0, #e0457b)",
                },
              }),
          h("span", {
            "aria-hidden": "true",
            style: {
              position: "absolute", right: "-6px", bottom: "-6px", width: "22px", height: "22px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--surface-panel, #fff)", color: "var(--text-standard)",
              boxShadow: "0 0 0 1px color-mix(in srgb, var(--text-standard) 18%, transparent), 0 1px 3px rgba(0,0,0,0.15)",
            },
          }, h("svg", { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" },
            h("path", { d: PEN }))),
          h("input", {
            type: "color",
            value: custom,
            "aria-label": THEMES[id].name,
            onClick: () => theme !== "custom" && pickTheme("custom"),
            onInput: (e) => pickCustom(e.target.value),
            onChange: (e) => pickCustom(e.target.value),
            style: { position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", border: 0, padding: 0 },
          })),
        label);
    };

    const segment = (value, text) => {
      const active = choice === value;
      return h("button", {
        key: value, type: "button", "aria-pressed": active, onClick: () => pickLanguage(value),
        style: {
          border: 0, borderRadius: "6px", padding: "6px 14px", fontSize: "13px", cursor: "pointer",
          fontWeight: active ? 700 : 400,
          background: active ? "var(--surface-panel, #fff)" : "transparent",
          color: active ? "var(--text-standard)" : "var(--text-subtle)",
          boxShadow: active ? "0 1px 2px rgba(0,0,0,0.12), 0 0 0 1px color-mix(in srgb, var(--text-standard) 10%, transparent)" : "none",
        },
      }, text);
    };

    return h(
      "section",
      { style: { display: "flex", flexDirection: "column", gap: "28px", padding: "var(--space-panel-inset)", maxWidth: "640px" } },
      h("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } },
        h("h2", { style: { margin: 0 } }, "Slack Style"),
        hint(t("Buzz를 슬랙처럼 보이게 하는 설정입니다. 이 컴퓨터에만 저장됩니다.", "Settings for the Slack-like look. Saved on this computer only."))),

      h("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } },
        sectionTitle(t("색상", "Color")),
        hint(t("사이드바와 위·왼쪽 막대 색입니다. 다크 모드에서는 자동으로 더 어두워집니다.", "Colors of the sidebar and the top and left bars. They get darker automatically in dark mode.")),
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: "18px 14px", paddingTop: "4px" } }, Object.keys(THEMES).map(tile))),

      h("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } },
        sectionTitle(t("언어 · Language", "Language · 언어")),
        hint(t("플러그인이 추가한 메뉴와 Buzz 메뉴 이름을 표시할 언어입니다.", "Language of this plugin's labels and of Buzz's menu names.")),
        h("div", {
          role: "group",
          style: {
            display: "inline-flex", alignSelf: "flex-start", gap: "2px", padding: "3px", borderRadius: "8px",
            background: "color-mix(in srgb, var(--text-standard) 7%, transparent)",
          },
        },
          segment("ko", "한국어"),
          segment("en", "English"),
          segment("auto", t("시스템 언어", "System"))),
        needsReload
          ? h("div", {
              style: {
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                padding: "10px 12px", borderRadius: "8px", fontSize: "13px",
                background: "color-mix(in srgb, var(--text-standard) 5%, transparent)",
              },
            },
              h("span", null, t("Buzz 화면을 다시 불러오면 적용됩니다.", "Reload the Buzz window to apply.")),
              h("button", {
                type: "button", onClick: () => window.location.reload(),
                style: {
                  border: 0, borderRadius: "6px", padding: "6px 12px", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  background: "var(--text-standard)", color: "var(--surface-panel, #fff)",
                },
              }, t("다시 불러오기", "Reload")))
          : null),

      h("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } },
        sectionTitle(t("슬랙 권장 설정", "Slack-like settings")),
        hint(t("메시지 밀도를 Compact로, 스레드를 옆 패널에서 열리도록 바꿉니다. 처음 설치할 때 한 번 적용되며, 바꾼 설정을 되돌리고 싶을 때 누르세요.", "Sets message density to Compact and opens threads in the side pane. Applied once on install; use this to apply it again.")),
        h("div", { style: { display: "flex", alignItems: "center", gap: "12px" } },
          h("button", {
            type: "button",
            onClick: () => {
              applyRecommendedSettings();
              setApplied(true);
            },
            style: {
              border: "1px solid color-mix(in srgb, var(--text-standard) 30%, transparent)", borderRadius: "6px",
              padding: "6px 12px", fontSize: "13px", fontWeight: 700, cursor: "pointer", background: "transparent", color: "var(--text-standard)",
            },
          }, t("다시 적용", "Apply again")),
          applied
            ? h("span", { style: { fontSize: "13px", color: "var(--text-subtle)" } },
                t("적용했어요. 설정 화면 표시는 Buzz를 다시 불러오면 맞춰집니다.", "Applied. The Settings screen catches up after a reload."))
            : null)),
    );
  }
  cards.register({ id: "language", title: "Slack Style", component: LanguageSettings });
}

// ---------------------------------------------------------------------------
// Emoji picker like Slack's. Buzz uses Emoji Mart, which draws inside its own
// shadow root, so page styles can't reach it: a stylesheet is added inside
// each picker, and its category names are translated there too.
const SLACK_EMOJI_PICKER = true;
const EMOJI_TRANSLATIONS = {
  "Frequently used": "자주 사용됨",
  "Smileys & People": "표정 및 사람",
  "Smileys & Emotion": "표정 및 감정",
  "People & Body": "사람 및 신체",
  "Animals & Nature": "동물 및 자연",
  "Food & Drink": "음식 및 음료",
  Activity: "활동",
  "Travel & Places": "여행 및 장소",
  Objects: "사물",
  Symbols: "기호",
  Flags: "깃발",
  Custom: "사용자 지정",
  "Search results": "검색 결과",
  Search: "모든 이모티콘 검색",
  "Search emoji": "모든 이모티콘 검색",
  "Search emojis": "모든 이모티콘 검색",
};

function emojiPickerCss() {
  return `
    /* Category tabs on top, as in Slack, with a rounded-square selection. */
    #nav { order: -1; border-bottom: 1px solid color-mix(in srgb, var(--text-standard) 12%, transparent); height: 44px !important; }
    #nav .bar { display: none !important; }
    #nav button::before { border-radius: 6px !important; width: 32px !important; height: 32px !important; }
    #nav button:hover::before { background: color-mix(in srgb, var(--text-standard) 8%, transparent) !important; }
    #nav button[aria-selected]::before { background: color-mix(in srgb, var(--text-standard) 12%, transparent) !important; }
    /* Search: Buzz draws the box on .search-field around the input. Make
       that one box Slack's rounded rectangle, blue while typing; the input
       itself stays borderless. */
    .search-field {
      height: 36px !important;
      border-radius: 8px !important;
      border: 1px solid color-mix(in srgb, var(--text-standard) 30%, transparent) !important;
    }
    .search-field:has(input:focus) {
      border-color: #1264A3 !important;
      box-shadow: 0 0 0 3px rgba(29, 155, 209, 0.3) !important;
    }
    .search-field input[type="search"] {
      border: 0 !important;
      box-shadow: none !important;
      outline: none !important;
      background: transparent !important;
      font-size: 15px !important;
    }
    /* Bold section titles; rounded-square hover on emoji. */
    .category .sticky {
      font-size: 15px !important;
      font-weight: 700 !important;
      color: var(--text-standard) !important;
    }
    .category button .background, .category button:hover .background { border-radius: 6px !important; }
  `;
}

function enhanceEmojiPickers(ctx) {
  if (!SLACK_EMOJI_PICKER) return;
  const ko = LANG !== "en";
  const fix = (root) => {
    // Text, tooltips and the search placeholder; each write only when it
    // changes, since this runs from a MutationObserver.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = n.nodeValue.trim();
      if (Object.hasOwn(EMOJI_TRANSLATIONS, text)) n.nodeValue = n.nodeValue.replace(text, EMOJI_TRANSLATIONS[text]);
    }
    root.querySelectorAll("[title], [aria-label], input[placeholder]").forEach((el) => {
      for (const attr of ["title", "aria-label", "placeholder"]) {
        const value = el.getAttribute(attr);
        if (value && Object.hasOwn(EMOJI_TRANSLATIONS, value)) el.setAttribute(attr, EMOJI_TRANSLATIONS[value]);
      }
    });
  };
  const watched = new WeakSet();
  const observers = [];
  const attach = (picker) => {
    const root = picker.shadowRoot;
    if (!root || watched.has(root)) return;
    watched.add(root);
    const style = document.createElement("style");
    style.dataset.plugin = "team.slack-sidebar";
    style.textContent = emojiPickerCss();
    root.appendChild(style);
    if (!ko) return;
    fix(root);
    const observer = new MutationObserver(() => fix(root));
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["title", "aria-label", "placeholder"] });
    observers.push(observer);
  };
  ctx.effect(() => {
    const scan = () => document.querySelectorAll("em-emoji-picker").forEach(attach);
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    scan();
    return () => {
      observer.disconnect();
      observers.forEach((o) => o.disconnect());
      document.querySelectorAll("em-emoji-picker").forEach((p) =>
        p.shadowRoot?.querySelectorAll('style[data-plugin="team.slack-sidebar"]').forEach((el) => el.remove()),
      );
    };
  });
}

// ---------------------------------------------------------------------------
// The @ button under the message box types "@" at the cursor, as in Slack,
// so Buzz's own @ suggestions open in place. Buzz would otherwise open a
// separate picker with a search box. The click is stopped before Buzz sees
// it and "@" goes in as typed text.
const MENTION_BUTTON_TYPES_AT = true;

function slackMentionButton(ctx) {
  if (!MENTION_BUTTON_TYPES_AT) return;
  const atButton = (event) =>
    event.target?.closest?.('[data-composer-surface] button[aria-label="Mention a member"]');
  // Keep focus and the cursor in the editor while the button is pressed.
  const hold = (event) => {
    if (!atButton(event)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const press = (event) => {
    const button = atButton(event);
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const surface = button.closest("[data-composer-surface]");
    const editor = surface?.querySelector('[role="textbox"][contenteditable="true"]') || surface?.querySelector('[contenteditable="true"]');
    if (!editor || button.disabled) return;
    const selection = window.getSelection();
    const inside = selection?.rangeCount && editor.contains(selection.getRangeAt(0).startContainer);
    if (!inside) {
      editor.focus();
      const end = document.createRange();
      end.selectNodeContents(editor);
      end.collapse(false);
      selection.removeAllRanges();
      selection.addRange(end);
    } else if (document.activeElement !== editor && !editor.contains(document.activeElement)) {
      editor.focus();
    }
    // A space first when the cursor sits right after a word.
    let before = "";
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0).cloneRange();
      range.setStart(editor, 0);
      before = range.toString();
    }
    document.execCommand("insertText", false, before && !/\s$/.test(before) ? " @" : "@");
  };
  ctx.effect(() => {
    document.addEventListener("pointerdown", hold, true);
    document.addEventListener("mousedown", hold, true);
    document.addEventListener("click", press, true);
    return () => {
      document.removeEventListener("pointerdown", hold, true);
      document.removeEventListener("mousedown", hold, true);
      document.removeEventListener("click", press, true);
    };
  });
}

// ---------------------------------------------------------------------------
// @here / @channel at the top of the @ suggestions, as in Slack. Buzz has no
// broadcast mention; choosing one types "@here " and the channel alerts of
// people with this plugin pick it up (see BROADCAST_MENTIONS). Mouse only:
// the arrow keys and Enter still move through Buzz's own rows.
const BROADCAST_SUGGESTIONS = [
  { word: "here", detail: t("이 채널 멤버에게 알림 (Slack Style 사용자)", "Notify this channel (Slack Style users)") },
  { word: "channel", detail: t("이 채널 멤버에게 알림 (Slack Style 사용자)", "Notify this channel (Slack Style users)") },
];
const MEGAPHONE = "M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a3 3 0 0 1 0 6M18 6a7 7 0 0 1 0 12";

function broadcastSuggestions(ctx) {
  if (!BROADCAST_MENTIONS || !BROADCAST_SUGGESTIONS.length) return;
  // The "@query" right before the cursor in the focused message box. Buzz
  // may wrap a mention being typed in its own element, so the whole text
  // from the start of the box to the cursor is read, not one text node.
  const typedQuery = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount || !sel.isCollapsed) return undefined;
    const caret = sel.getRangeAt(0);
    const editor = (caret.startContainer.nodeType === Node.ELEMENT_NODE ? caret.startContainer : caret.startContainer.parentElement)
      ?.closest?.('[data-composer-surface] [contenteditable="true"]');
    if (!editor) return undefined;
    const before = caret.cloneRange();
    before.setStart(editor, 0);
    const match = /(^|\s)@([^\s@]*)$/.exec(before.toString());
    return match ? { editor, caret, query: match[2] } : undefined;
  };
  const choose = (word) => {
    const at = typedQuery();
    if (!at) return;
    // Select back over "@query" from the cursor, then type the word.
    const sel = window.getSelection();
    for (let i = 0; i < at.query.length + 1; i++) sel.modify("extend", "backward", "character");
    document.execCommand("insertText", false, `@${word} `);
  };
  const svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${MEGAPHONE}"/></svg>`;
  // When no person matches (e.g. "@he"), Buzz removes its list altogether,
  // so the rows go in a small list of our own above the cursor instead.
  let own;
  const closeOwn = () => {
    own?.remove();
    own = undefined;
  };
  const showOwn = (at, want) => {
    if (!own) {
      own = document.createElement("div");
      own.className = "slack-broadcast-popup";
      own.setAttribute("role", "listbox");
      document.body.appendChild(own);
    }
    const key = want.map((b) => b.word).join(",");
    if (own.dataset.key !== key) {
      own.dataset.key = key;
      own.innerHTML = "";
      own.append(...want.map((b, i) => makeRow(b, i === 0)));
    }
    const rect = at.caret.getBoundingClientRect().width || at.caret.getBoundingClientRect().height
      ? at.caret.getBoundingClientRect()
      : at.editor.getBoundingClientRect();
    const height = own.offsetHeight || 80;
    own.style.left = `${Math.max(8, rect.left - 12)}px`;
    own.style.top = `${Math.max(8, rect.top - height - 8)}px`;
  };
  const makeRow = (b, active) => {
    const row = document.createElement("div");
    row.setAttribute("role", "option");
    row.setAttribute("aria-selected", active ? "true" : "false");
    row.dataset.slackBroadcast = b.word;
    row.innerHTML =
      `<span aria-hidden="true" class="slack-broadcast-icon">${svg}</span>` +
      `<span data-completion-label><span><b>@${b.word}</b></span><small>${b.detail}</small></span>`;
    row.addEventListener("pointerdown", (event) => event.preventDefault());
    row.addEventListener("mousedown", (event) => event.preventDefault());
    row.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      choose(b.word);
      closeOwn();
    });
    return row;
  };
  // Enter or Tab picks the highlighted row of our own list (Buzz has none).
  const onKey = (event) => {
    if (!own || !["Enter", "Tab", "Escape"].includes(event.key) || event.isComposing) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.key !== "Escape") {
      const word = own.querySelector('[aria-selected="true"]')?.dataset.slackBroadcast;
      if (word) choose(word);
    }
    closeOwn();
  };
  const sync = () => {
    const list = document.querySelector('[data-mention] [role="listbox"]');
    const typed = typedQuery();
    const typedWant = typed
      ? BROADCAST_SUGGESTIONS.filter((b) => b.word.startsWith(typed.query.toLowerCase()))
      : [];
    if (!list && typed && typed.query && typedWant.length) showOwn(typed, typedWant);
    else closeOwn();
    const at = list && typed;
    const want = at ? BROADCAST_SUGGESTIONS.filter((b) => b.word.startsWith(at.query.toLowerCase())) : [];
    const current = list ? [...list.querySelectorAll(":scope > [data-slack-broadcast]")] : [];
    const key = want.map((b) => b.word).join(",");
    if (current.map((el) => el.dataset.slackBroadcast).join(",") === key) return;
    current.forEach((el) => el.remove());
    if (!list || !want.length) return;
    const model = list.querySelector('[role="option"]:not([data-slack-broadcast])');
    const label = model?.querySelector("[data-completion-label]");
    const rows = want.map((b) => {
      const row = makeRow(b, false);
      if (model) row.className = model.className;
      const rowLabel = row.querySelector("[data-completion-label]");
      if (label && rowLabel) rowLabel.className = label.className;
      return row;
    });
    list.prepend(...rows);
  };
  ctx.effect(() => {
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("selectionchange", sync);
    document.addEventListener("keydown", onKey, true);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("selectionchange", sync);
      document.removeEventListener("keydown", onKey, true);
      closeOwn();
      document.querySelectorAll("[data-slack-broadcast]").forEach((el) => el.remove());
    };
  });
}

// Paints @here / @channel / @everyone in the message box and in messages
// with the CSS Custom Highlight API, which marks text ranges without touching
// Buzz's DOM. Skipped on WebKit versions without it.
function broadcastHighlights(ctx) {
  if (!BROADCAST_MENTIONS || typeof Highlight === "undefined" || !globalThis.CSS?.highlights) return;
  const highlight = new Highlight();
  CSS.highlights.set("slack-broadcast", highlight);
  const WORD = /(^|[\s(])(@(?:here|channel|everyone))(?=$|[\s.,!?)])/gi;
  let queued = false;
  const paint = () => {
    queued = false;
    highlight.clear();
    const roots = document.querySelectorAll('[data-composer-surface] [contenteditable="true"], [data-highlight-surface]');
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = n.nodeValue;
        if (!text || text.indexOf("@") < 0) continue;
        WORD.lastIndex = 0;
        for (let m = WORD.exec(text); m; m = WORD.exec(text)) {
          const start = m.index + m[1].length;
          const range = new Range();
          range.setStart(n, start);
          range.setEnd(n, start + m[2].length);
          highlight.add(range);
        }
      }
    }
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(paint);
  };
  ctx.effect(() => {
    const observer = new MutationObserver(queue);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    queue();
    return () => {
      observer.disconnect();
      CSS.highlights.delete("slack-broadcast");
    };
  });
}

// ---------------------------------------------------------------------------
// Hovering a sender's name opens the same profile card as hovering their
// picture, as in Slack. Buzz only opens it from the picture, so the hover is
// passed on to the picture's card trigger in the same message row.
const NAME_HOVER_CARD = true;
const NAME_HOVER_DELAY = 500;

function nameHoverProfileCard(ctx) {
  if (!NAME_HOVER_CARD) return;
  let timer;
  let active;
  const triggerFor = (name) =>
    name.closest("[data-highlight-surface]")?.querySelector("[data-preview-card-trigger]");
  const send = (el, type, related) => {
    const Ctor = type.startsWith("pointer") ? PointerEvent : MouseEvent;
    el.dispatchEvent(new Ctor(type, { bubbles: true, cancelable: true, composed: true, relatedTarget: related, pointerType: "mouse" }));
  };
  const enter = (trigger) => {
    send(trigger, "pointerover", document.body);
    send(trigger, "mouseover", document.body);
    send(trigger, "pointermove", null);
    send(trigger, "mousemove", null);
  };
  const leave = (trigger) => {
    send(trigger, "pointerout", document.body);
    send(trigger, "mouseout", document.body);
  };
  const over = (event) => {
    const name = event.target?.closest?.("[data-message-author]");
    if (!name || name === active) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const trigger = triggerFor(name);
      if (!trigger) return;
      active = name;
      enter(trigger);
    }, NAME_HOVER_DELAY);
  };
  const out = (event) => {
    const name = event.target?.closest?.("[data-message-author]");
    if (!name || name.contains(event.relatedTarget)) return;
    clearTimeout(timer);
    if (active === name) {
      const trigger = triggerFor(name);
      active = undefined;
      // Let the pointer reach the card itself before treating this as leaving.
      if (trigger && !event.relatedTarget?.closest?.('[aria-label$=" profile preview"]')) leave(trigger);
    }
  };
  ctx.effect(() => {
    document.addEventListener("pointerover", over, true);
    document.addEventListener("pointerout", out, true);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerover", over, true);
      document.removeEventListener("pointerout", out, true);
    };
  });
}

// Profile cards open right above the picture, as in Slack (below it only
// when there is no room above). Buzz places them to the right; the
// positioner's place is overridden through CSS variables, which Buzz's own
// positioning code never writes.
function profileCardAbove(ctx) {
  const place = () => {
    const card = document.querySelector('[aria-label$=" profile preview"]');
    const positioner = card?.closest(".buzz-preview-card-positioner") || card?.parentElement;
    const trigger = document.querySelector("[data-preview-card-trigger][data-popup-open]");
    if (!card || !positioner || !trigger) return;
    const anchor = trigger.getBoundingClientRect();
    const height = card.offsetHeight;
    const width = card.offsetWidth;
    let top = anchor.top - height - 8;
    if (top < 8) top = anchor.bottom + 8;
    const left = Math.min(Math.max(8, anchor.left), window.innerWidth - width - 8);
    const set = (name, value) => {
      if (positioner.style.getPropertyValue(name) !== value) positioner.style.setProperty(name, value);
    };
    set("--slack-card-top", `${Math.round(top)}px`);
    set("--slack-card-left", `${Math.round(left)}px`);
    if (!positioner.hasAttribute("data-slack-card")) positioner.setAttribute("data-slack-card", "");
  };
  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      place();
    });
  };
  ctx.effect(() => {
    const observer = new MutationObserver(queue);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", queue, true);
    window.addEventListener("resize", queue);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", queue, true);
      window.removeEventListener("resize", queue);
    };
  });
}

// ---------------------------------------------------------------------------
// Slack-like Buzz settings, set once when the plugin first runs (afterwards
// each person's own changes are left alone) and again from the button in
// Settings → Slack Style. Keys and values are Buzz's own (v1.0.6).
const RECOMMENDED_SETTINGS = [
  // Appearance → Message density: Compact (flat list, no bubbles).
  { key: "buzz-message-density.v1", value: "compact", apply: () => (document.documentElement.dataset.messageDensity = "compact") },
  // Open threads in: Side pane.
  { key: "buzz-thread-placement.v1", value: "side", apply: () => window.dispatchEvent(new Event("buzz-thread-placement-changed")) },
];
const RECOMMENDED_APPLIED_KEY = "slack-style.recommended-applied.v1";

function applyRecommendedSettings() {
  for (const setting of RECOMMENDED_SETTINGS) {
    try {
      localStorage.setItem(setting.key, setting.value);
      setting.apply();
    } catch {}
  }
  try {
    localStorage.setItem(RECOMMENDED_APPLIED_KEY, "1");
  } catch {}
}

function applyRecommendedOnce() {
  try {
    if (localStorage.getItem(RECOMMENDED_APPLIED_KEY)) return;
  } catch {
    return;
  }
  applyRecommendedSettings();
}

// New message: the recipient list sits right under the "대상:" row and
// stretches to the right edge, as in Slack (Buzz floats a 380px box below
// the field). Placed through CSS variables, like the profile card.
function recipientListPlacement(ctx) {
  const place = () => {
    const page = document.querySelector('section[aria-label="New message"]');
    const row = page?.querySelector('[aria-label="Recipients"]');
    const input = row?.querySelector('input[role="combobox"]');
    const list = document.querySelector('[class*="_picker_"]:has([data-recipient-key])');
    const positioner = list?.parentElement;
    if (!page || !row || !input || !list || !positioner) return;
    const pageBox = page.getBoundingClientRect();
    const left = Math.max(pageBox.left, input.getBoundingClientRect().left - 22);
    const top = row.getBoundingClientRect().bottom;
    const width = Math.max(280, pageBox.right - left - 8);
    const set = (name, value) => {
      if (positioner.style.getPropertyValue(name) !== value) positioner.style.setProperty(name, value);
    };
    set("--slack-list-top", `${Math.round(top)}px`);
    set("--slack-list-left", `${Math.round(left)}px`);
    set("--slack-list-width", `${Math.round(width)}px`);
    if (!positioner.hasAttribute("data-slack-list")) positioner.setAttribute("data-slack-list", "");
  };
  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      place();
    });
  };
  ctx.effect(() => {
    const observer = new MutationObserver(queue);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", queue);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", queue);
    };
  });
}

// ---------------------------------------------------------------------------
// Forum channels as a list of post cards, as in Buzz's earlier forum view
// (each post a rounded card with its author, time, text and reply count;
// clicking a card opens its replies). Buzz 1.0.6 draws forums like any
// chat channel. Only the main list of a forum channel changes; chat
// channels, DMs and the thread pane stay as they are. Set FORUM_CARDS to
// false to show forums like chat channels again.
const FORUM_CARDS = true;

function forumCards(ctx) {
  if (!FORUM_CARDS) return;
  const relay = ctx.relay;
  // Buzz marks a channel's message list with its id; forum ids come from the
  // channel list, so the cards follow channels being added or changed.
  const POST_ROW = "[data-message-id]:not([data-membership-row]) > [data-highlight-surface]";
  const forumTimelines = (ids) => ids.map((id) => `[data-channel-timeline=${JSON.stringify(id)}]`).join(", ");
  const css = (ids) => {
    if (!ids.length) return "";
    const F = `:is(${forumTimelines(ids)})`;
    // Only post rows: join/leave notes and agent-addressed entries also carry
    // data-highlight-surface. The doubled attribute outranks the general
    // message spacing rules above.
    const ROW = `${F} ${POST_ROW}[data-highlight-surface]`;
    const line = "color-mix(in srgb, var(--text-standard) 13%, transparent)";
    return `
/* Forum channels: every post is its own card. */
${ROW} {
  box-sizing: border-box !important;
  width: auto !important;
  margin: 6px 16px !important;
  padding: 12px 16px 12px 12px !important;
  border: 1px solid ${line} !important;
  border-radius: 12px !important;
  corner-shape: round !important;
  cursor: pointer;
  transition: border-color 0.12s ease;
}
${ROW}:hover, ${ROW}[data-thread-open] {
  border-color: color-mix(in srgb, var(--text-standard) 26%, transparent) !important;
}
/* Buzz's row hover paint fills the card instead of a full-width band. */
${ROW}::before, ${ROW}::after {
  inset: 0 !important;
  border-radius: 12px !important;
}
/* Posts by the same person a few minutes apart are separate cards too:
   show the name Buzz hides on a follow-up line, and its time in the
   picture column (Buzz draws no picture there). */
${ROW}[data-stack-previous] [data-copy-author] {
  position: static !important;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
  clip: auto !important;
  clip-path: none !important;
  overflow: visible !important;
  white-space: normal !important;
  user-select: auto !important;
}
${ROW}[data-stack-previous] [class*="_continuationTime_"] { opacity: 1 !important; }
/* Reply count under the post. */
${ROW} [data-thread-summary] { margin-top: 6px !important; }
`;
  };

  let style;
  let ids = [];
  const update = () => {
    const session = relay.snapshot()?.session;
    const list = session?.channels?.list?.().channels ?? [];
    const next = list.filter((c) => c && c.channelType === "forum" && typeof c.id === "string").map((c) => c.id).sort();
    if (next.join() === ids.join()) return;
    ids = next;
    if (style) style.textContent = css(ids);
  };

  // Clicking a card (not a link, button, picture or selected text) opens its
  // replies: the "N replies" line if it has one, otherwise its Reply button.
  const SKIP = 'a, button, [role="button"], input, textarea, select, summary, label, video, audio, img, [contenteditable="true"], pre, code, table, [data-preview-card-trigger], [role="group"], [role="menu"], [role="dialog"]';
  const onClick = (event) => {
    if (!ids.length || event.button !== 0 || event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    if (!(target instanceof Element) || target.closest(SKIP)) return;
    const row = target.closest("[data-highlight-surface]");
    if (!row?.matches(POST_ROW)) return;
    const timeline = row?.closest("[data-channel-timeline]");
    if (!row || !timeline || !ids.includes(timeline.getAttribute("data-channel-timeline"))) return;
    const selection = document.getSelection?.();
    if (selection && !selection.isCollapsed && row.contains(selection.anchorNode)) return;
    const own = (el) => el && el.closest("[data-highlight-surface]") === row;
    const summary = [...row.querySelectorAll("[data-thread-summary]")].find(own);
    const reply = [...row.querySelectorAll('[role="group"] button[aria-label="Reply"]:not(:disabled)')].find(own);
    const open = summary || reply;
    if (open) open.click();
  };

  ctx.effect(() => {
    style = document.createElement("style");
    style.dataset.plugin = "team.slack-sidebar.forum";
    document.head.appendChild(style);
    ids = [];
    let stopList = () => {};
    const watch = () => {
      stopList();
      const session = relay.snapshot()?.session;
      const stop = session?.channels?.subscribeList?.(update);
      stopList = () => typeof stop === "function" && stop();
      update();
    };
    watch();
    const stopRelay = relay.subscribe?.(watch);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      stopList();
      if (typeof stopRelay === "function") stopRelay();
      style.remove();
      style = undefined;
    };
  });
}

export function apply(ctx) {
  recipientListPlacement(ctx);
  applyRecommendedOnce();
  profileCardAbove(ctx);
  nameHoverProfileCard(ctx);
  broadcastHighlights(ctx);
  broadcastSuggestions(ctx);
  slackMentionButton(ctx);
  enhanceEmojiPickers(ctx);
  switchTheme(savedTheme());
  registerLanguageSettings(ctx);
  startChannelAlerts(ctx);
  addChannelNotifyMenu(ctx);
  groupDmMentionGate(ctx);
  hiddenDmRows(ctx);
  draftMarks(ctx);
  dmUnreadCounts(ctx);
  dmSectionMenu(ctx);
  linkPreviewCards(ctx);
  forumCards(ctx);
  undoSend(ctx);
  filePreviews(ctx);
  composerFileTypes(ctx);
  fileGroupHeaders(ctx);
  messageToolbar(ctx);
  slackDropOverlay(ctx);
  reactionPills(ctx);
  addFormatBars(ctx);
  addDockNewButton(ctx);
  addChannelTabs(ctx);
  registerActivityShortcuts(ctx);
  registerHuddlesPage(ctx);
  registerDockApps(ctx);
  startTranslations(ctx);
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "team.slack-sidebar";
    style.textContent = buildThemedCss();
    document.head.appendChild(style);
    themeStyle = style;
    return () => {
      if (themeStyle === style) themeStyle = undefined;
      style.remove();
    };
  });
}
