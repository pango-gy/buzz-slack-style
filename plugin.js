// Slack-style look for Buzz: aubergine window chrome and sidebar, a white
// rounded conversation area, Slack sizes and spacing, Korean menu names,
// Threads/Mentions/DMs shortcuts and dock apps, and an always-open
// formatting bar. Settings are the constants below; see README.md.
// Overrides Buzz's internal classes and color variables, which can change
// between Buzz versions. If they do, only the affected colors revert.

export const inject = ["react", "pages", "navigation", "panels", "relay", "notifications"];

// Slack-style shortcuts pinned at the top of the Messages sidebar, next to
// Activity. Each row opens Buzz's own Activity page with that tab already
// selected. Remove a line to hide it.
const ACTIVITY_ROWS = [
  { id: "threads", label: "스레드", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM7 8h10M7 12h6" },
  { id: "mentions", label: "멘션", icon: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" },
  { id: "dms", label: "DM", icon: "M7.9 20A9 9 0 1 0 4 16.1L2 22z" },
  { id: "reactions", label: "반응", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" },
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
  { label: "굵게", text: "B", style: "font-weight:800", key: "b" },
  { label: "기울임꼴", text: "I", style: "font-style:italic;font-family:Georgia,serif", key: "i" },
  { label: "취소선", text: "S", style: "text-decoration:line-through", key: "x", shift: true },
  "|",
  { label: "링크", key: "u", shift: true, icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" },
  { label: "순서 있는 목록", key: "7", shift: true, icon: "M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" },
  { label: "글머리 기호 목록", key: "8", shift: true, icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
  "|",
  { label: "인용", key: "9", shift: true, icon: "M4 5v14M9 7h11M9 12h11M9 17h7" },
  { label: "코드", key: "e", icon: "m16 18 6-6-6-6M8 6l-6 6 6 6" },
  { label: "코드 블록", key: "c", alt: true, icon: "M4 4h16v16H4zM10 9.5 7.5 12l2.5 2.5M14 9.5l2.5 2.5-2.5 2.5" },
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
const PLACEHOLDER_SUFFIX = "에 메시지 보내기";
// Other empty message boxes, matched by the start of Buzz's English text.
// The person's name can't be kept here, so DMs read just "메시지 보내기".
const PLACEHOLDERS = {
  "Message ": "메시지 보내기",
  "Reply ": "답글...",
  "Edit message": "메시지 편집",
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

// Corner radius of sidebar rows (Slack is about 6px; Buzz uses a pill).
const ROW_RADIUS = 6;

// Text and row sizes in px, matched to Slack's desktop app.
const SIZES = {
  sidebarRow: 28, // channel row height
  sidebarText: 15, // channel, pinned row and section title text
  messageText: 15, // message body and author name
  messageLine: 22, // message line height
  channelTitle: 17, // channel name above the conversation
};

// People in the sidebar's direct-message list: picture size and corner
// radius in px (Slack: a 20px rounded square; Buzz: a larger circle).
const DM_AVATAR = 20;
const DM_AVATAR_RADIUS = 5;

// Message avatars: corner radius in px (Slack ~8; a large number = circle).
const AVATAR_RADIUS = 8;
// Left margin (px) of each message row, measured so the avatar lines up with
// the message box edge as in Slack (Buzz centers rows instead). Raise it to
// move messages right, lower it to move them left.
const MESSAGE_INDENT = 5;
// Gap (px) between avatar and text.
const AVATAR_GAP = 8;

// Space above/below each message in a run from one person (Buzz: 4).
const STACK_GAP = 3;

// Dock labels to replace, keyed by part of the dock tab's page id:
// Messages (buzz.channels) becomes 홈 like Slack; "Create an agent" (the
// bestie page) becomes bot.
const DOCK_RENAMES = { channels: "홈", bestie: "bot" };
// Extra dock apps, shown below Home in this order. Each opens Buzz's
// Activity page on the given tab. Remove a line to hide it.
const DOCK_APPS = [
  { id: "dm", label: "DM", activity: "dms", icon: "M7.9 20A9 9 0 1 0 4 16.1L2 22z" },
  { id: "activity", label: "내 활동", activity: "all", icon: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" },
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
const HUDDLES_LABEL = "허들";
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
const CHANNEL_TITLE_WEIGHT = 700;

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
   Slack. Sections are <details> with the title in <summary>. */
${SIDEBAR} details > summary ~ * {
  padding-inline-start: ${SECTION_INDENT}px !important;
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
/* Message text and bylines. */
[data-highlight-surface] {
  --text-body: ${SIZES.messageText}px;
  --text-body--line-height: ${SIZES.messageLine}px;
}
[data-highlight-surface] [data-copy-author] strong { font-size: ${SIZES.messageText}px !important; }

/* Hover toolbar on a message: Slack's rounded rectangle with square-ish
   buttons instead of Buzz's pill. */
[role="group"][aria-label="Message actions"] {
  border-radius: 8px !important;
  corner-shape: round !important;
  padding: 2px !important;
  gap: 2px !important;
  border: 1px solid color-mix(in srgb, var(--text-standard) 14%, transparent) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
}
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

${CHANNEL_TABS ? `/* Tab row under the channel name (added by addChannelTabs), placed right
   after the header; the dividing line moves below the row. */
.panel-header:has(+ .slack-channel-tabs) { border-block-end-color: transparent !important; }
.slack-channel-tabs {
  flex: none;
  width: 100%;
  border-bottom: 1px solid var(--border-standard);
  display: flex;
  align-items: stretch;
  gap: 4px;
  height: 34px;
  padding-inline: 12px;
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
.slack-channel-tabs > button svg { width: 15px; height: 15px; flex: none; }
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
const TRANSLATIONS = {
  Activity: "내 활동",
  Search: "검색",
  All: "전체",
  Threads: "스레드",
  Mentions: "멘션",
  DMs: "DM",
  Reactions: "반응",
  From: "보낸 사람",
  Unread: "읽지 않음",
  Solo: "개인",
  Starred: "즐겨찾기",
  Team: "팀",
  Channels: "채널",
  Forums: "포럼",
  "Direct messages": "다이렉트 메시지",
  "Show fewer": "간단히 보기",
  "Show more": "더 보기",
  Agents: "에이전트",
  "New messages": "새 항목",
  Today: "오늘",
  Yesterday: "어제",
};
const TRANSLATION_PATTERNS = [
  [/^(\d+) unread$/, "$1개 안 읽음"],
  [/^(\d+) more$/, "$1개 더 보기"],
];
const SKIP_TEXT = "[data-highlight-surface], [data-composer-surface], [contenteditable], input, textarea, pre, code";

function translateText(node) {
  const raw = node.nodeValue;
  const text = raw && raw.trim();
  if (!text || text.length > 40) return;
  const parent = node.parentElement;
  if (!parent || parent.closest(SKIP_TEXT)) return;
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

function translateTree(root) {
  if (root.nodeType === Node.TEXT_NODE) return translateText(root);
  if (root.nodeType !== Node.ELEMENT_NODE || root.closest?.(SKIP_TEXT)) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) translateText(n);
}

// Buzz re-renders often, so new and changed text is translated as it appears.
function startTranslations(ctx) {
  ctx.effect(() => {
    translateTree(document.body);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") translateText(record.target);
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
      bar.setAttribute("aria-label", "서식");
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
      toggle.title = hide ? "서식 표시" : "서식 숨기기";
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
        const title = root.dataset.slackFormatBar === "hidden" ? "서식 표시" : "서식 숨기기";
        if (toggle.title !== title) toggle.title = title;
      }
      for (const surface of document.querySelectorAll("[data-composer-surface]")) {
        orderRow(surface);
        if (surface.querySelector(":scope > .slack-format-bar")) continue;
        if (!surface.querySelector('[contenteditable="true"]')) continue;
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
    button.title = "새로 만들기";
    button.setAttribute("aria-label", "새로 만들기");
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
    if (!file.name) file.name = decodeURIComponent(file.url.split("/").pop() || "파일");
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
    if (typeof ctx.panels.useTabTitle === "function") ctx.panels.useTabTitle("파일");
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

    if (!session) return h("div", { className: "slack-files" }, h("p", { className: "slack-files-note" }, "연결되는 중입니다…"));

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
      setState((current) => ({ ...current, error: "이 파일은 여기서 열 수 없습니다. 대화에서 열어 주세요." }));
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
              [authorName(file.author), new Date(file.at * 1000).toLocaleDateString("ko-KR"), fileSize(file.size)].filter(Boolean).join(" · "),
            ),
          ),
        ),
      ),
      state.error ? h("p", { className: "slack-files-note" }, state.error) : null,
      state.loading ? h("p", { className: "slack-files-note" }, "불러오는 중…") : null,
      !state.loading && !state.files.length && !state.error ? h("p", { className: "slack-files-note" }, "최근 메시지에 파일이 없습니다.") : null,
      !state.loading && !state.done
        ? h("button", { type: "button", className: "slack-files-more", onClick: () => load(state.oldest, state.files) }, "이전 메시지에서 더 찾기")
        : null,
    );
  }

  ctx.panels.register({
    id: "files",
    title: "파일",
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

    if (!session) return h("div", { className: "slack-huddles" }, h("p", { className: "slack-files-note" }, "연결되는 중입니다…"));
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
      const start = new Date(row.at * 1000).toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit" });
      if (row.end) return `${start} · ${Math.max(1, Math.round((row.end - row.at) / 60))}분`;
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
            h("span", { className: "slack-files-name" }, row.name || "채널"),
            h(
              "span",
              { className: "slack-files-meta" },
              row.live ? h("span", { className: "slack-huddles-live" }, "진행 중 · ") : null,
              [authorName(row.author) && `${authorName(row.author)} 님이 시작`, when(row)].filter(Boolean).join(" · "),
            ),
          ),
        ),
      ),
      state.error ? h("p", { className: "slack-files-note" }, state.error) : null,
      state.loading ? h("p", { className: "slack-files-note" }, "불러오는 중…") : null,
      !state.loading && !state.rows.length && !state.error ? h("p", { className: "slack-files-note" }, "최근 허들이 없습니다.") : null,
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
      row.setAttribute("aria-label", "채널 탭");
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
      add("messages", "메시지", () => {
        const props = files();
        if (props && props.pressed && props.available()) props.toggle(FILES_TARGET);
      });
      add("files", "파일", () => {
        const props = files();
        if (props && props.available()) props.toggle(FILES_TARGET);
      });
      add("canvas", "캔버스", () => openCanvas(header));
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
  // "all", or a list of channel names without #, e.g. ["notice_결제", "help_cto"].
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

function startChannelAlerts(ctx) {
  if (!CHANNEL_ALERTS.enabled) return;
  const relay = ctx.relay;
  const service = ctx.notifications;
  if (!relay?.snapshot || !relay?.subscribe || !service?.register) return;
  const category = service.register({ id: "channel-messages", label: "채널 메시지" });
  const submit = category?.submit;
  if (typeof submit !== "function") return;
  const wanted = CHANNEL_ALERTS.channels === "all" ? undefined : new Set(CHANNEL_ALERTS.channels);

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
      if (wanted && !wanted.has(channel.name)) return false;
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
      }
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
      const verdict = decide(owned, viewer, message);
      if (verdict === "wait") {
        if (tries >= 5) return;
        const timer = setTimeout(() => {
          timers.delete(timer);
          consider(owned, viewer, message, tries + 1);
        }, 800);
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

export function apply(ctx) {
  startChannelAlerts(ctx);
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
    style.textContent = buildCss(COLORS);
    document.head.appendChild(style);
    return () => style.remove();
  });
}
