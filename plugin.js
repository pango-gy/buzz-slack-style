// Slack-style look for Buzz: aubergine window chrome and sidebar, a white
// rounded conversation area, Slack sizes and spacing, Korean menu names,
// Threads/Mentions/DMs shortcuts and dock apps, and an always-open
// formatting bar. Settings are the constants below; see README.md.
// Overrides Buzz's internal classes and color variables, which can change
// between Buzz versions. If they do, only the affected colors revert.

export const inject = ["react", "pages", "navigation"];

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

// Text rendering: "auto" draws slightly fuller glyphs like Slack; set to ""
// to keep Buzz's thinner "antialiased" rendering.
const FONT_SMOOTHING = "";

// Open Buzz's formatting toolbar (B, I, links, lists...) in every message box.
const FORMATTING_ALWAYS_OPEN = true;
// Height (px) of the formatting bar across the top of the message box.
const FORMAT_BAR_HEIGHT = 38;

// Words after the channel name in an empty message box, like Slack's
// "#채널에 메시지 보내기". Set to "" to keep Buzz's "Message #channel".
const PLACEHOLDER_SUFFIX = "에 메시지 보내기";

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

// Dock icon tile and glyph size in px (Slack's tile is about 36).
const DOCK_TILE = 36;
const DOCK_ICON = 20;

// Show dock labels under the icons, like Slack's left bar.
const DOCK_LABELS = true;

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
#main-content > .panel {
  border-radius: 0 var(--radius-container) var(--radius-container) 0;
  overflow: hidden;
  box-shadow: var(--shadow-panel);
}

/* Sidebar. Nested panels inside it paint --surface-panel, so that is
   redefined too. */
${SIDEBAR} {
  background: ${c.sidebar};
  color: ${c.text};
  border-radius: var(--radius-container) 0 0 var(--radius-container);
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
[data-composer-surface] {
  border-radius: 8px !important;
  box-shadow: none !important;
  border-color: color-mix(in srgb, var(--text-standard) 28%, transparent) !important;
}
[data-composer-surface]:focus-within {
  border-color: color-mix(in srgb, var(--text-standard) 60%, transparent) !important;
  outline: none !important;
  box-shadow: none !important;
}

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

/* Formatting toolbar as a bar across the top of the message box, like
   Slack. Buzz shows it in the bottom row in place of the @, file and emoji
   buttons; those come back when the toolbar is closed with its X. */
[data-composer-surface]:has([data-formatting-open]) {
  padding-top: ${FORMAT_BAR_HEIGHT + 4}px !important;
  /* The bottom row holds only the send button now, so it sits closer. */
  --composer-gap: 2px;
}
/* Slack grays the formatting buttons out until the message box is in use. */
[data-composer-surface]:not(:focus-within) [data-formatting-open] :is(button, [role="button"]) {
  opacity: 0.45;
}
${PLACEHOLDER_SUFFIX ? `/* Empty channel message box: Buzz draws "Message", the channel icon and
   the name; Slack's order is icon, name, then the words. */
[data-composer-surface] [data-lead="Message"][data-name]::before { content: "" !important; }
[data-composer-surface] [data-lead="Message"][data-name]::after {
  content: attr(data-name) ${JSON.stringify(PLACEHOLDER_SUFFIX)} !important;
}` : ""}
[data-composer-surface] [data-formatting-open] {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  height: ${FORMAT_BAR_HEIGHT}px;
  min-height: 0 !important;
  padding-inline: 6px;
  z-index: 1;
  background: color-mix(in srgb, var(--text-standard) 4%, var(--surface-composer, transparent));
  border-bottom: 1px solid color-mix(in srgb, var(--text-standard) 10%, transparent);
  border-radius: 7px 7px 0 0;
}
/* The bar no longer fills the bottom row, so keep the send button right. */
[data-composer-surface] [data-formatting-open] ~ * { margin-inline-start: auto !important; }
[data-composer-surface] :is(:has(> [data-formatting-open]), :has(> * > [data-formatting-open])) {
  justify-content: flex-end !important;
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
const TRANSLATIONS = {
  Activity: "내 활동",
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
  "New messages": "새 메시지",
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

// Slack keeps its formatting toolbar open above the message box. Buzz has
// the same toolbar behind its "Aa" button but forgets it per chat, so each
// new message box gets it opened once. Closing it with Aa is respected until
// that message box goes away.
function keepFormattingOpen(ctx) {
  if (!FORMATTING_ALWAYS_OPEN) return;
  ctx.effect(() => {
    const opened = new WeakSet();
    const openIn = (surface) => {
      if (opened.has(surface)) return;
      const toggle = surface.querySelector('button[aria-label="Toggle formatting"]');
      if (!toggle) return;
      opened.add(surface);
      if (toggle.getAttribute("aria-pressed") === "true") return;
      // detail: 1 marks it as a pointer click, so Buzz keeps focus in the
      // editor instead of moving it to the toolbar.
      toggle.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 }));
    };
    const scan = () => document.querySelectorAll("[data-composer-surface]").forEach(openIn);
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  });
}

export function apply(ctx) {
  keepFormattingOpen(ctx);
  registerActivityShortcuts(ctx);
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
