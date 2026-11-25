# Slack Style for Buzz

[한국어](README.md) | **English**

A plugin that makes the Buzz desktop app look and feel like Slack.

- Aubergine sidebar and left app bar, with the conversation as a white card
- Left app bar: labels under the icons, order **bot → Home → DM → Activity → Agents**, icons that fill in when selected
- Rows pinned at the top of the sidebar: **Threads · Huddles · Mentions · DMs · Reactions**
- Korean menu names (Activity → 내 활동, Team → 팀, Direct messages → 다이렉트 메시지, and so on)
- Slack's text sizes and spacing, bold names, rounded-square profile pictures
- A formatting bar (bold, italic, link, lists…) across the top of the message box, and Slack-style placeholder text ("#채널에 메시지 보내기")
- A tab row under the channel name: **Messages · Files · Canvas**, with a list of the channel's files
- **Alerts for every new channel message**, like Slack's "All new messages" (Buzz alone only alerts for mentions, DMs and thread replies)
- Finer details: the message hover toolbar, selected channel rows, date dividers, the new-messages line, code blocks and more

## Install

1. In Buzz, open **Settings → Plugins → Manage plugins**.
2. Click **Add** and choose **Add from Git**.
3. Paste the address below and add it. Leave Branch and Folder empty.

   ```
   https://github.com/pango-gy/buzz-slack-style
   ```
4. Check that **Slack Style** is turned on in the list.

When a new version is published, open the same screen and click **Update** (or **Check for updates**) on Slack Style.

Recommended: **Settings → Appearance → Message density → Compact**
(shows every message on the left without bubbles, as in Slack).

### Language and color

Each person picks these under **Settings → Slack Style**.

- **Language**: 한국어 / English / Automatic (computer language). English keeps Buzz's menus in their original English and shows this plugin's own labels in English too. Click **Reload** after changing it.
- **Color**: Aubergine · Navy · Jade · Burgundy · Graphite. Applies right away.
- In Buzz's dark mode the sidebar and the top and left bars turn darker automatically.

### Turn it off or remove it

Click **Disable** under **Manage plugins → Slack Style** and Buzz returns to its original look right away.

## Channel message alerts

- When someone else posts in a channel, a macOS alert shows **"#channel · sender"** with a preview of the message. Clicking it opens that message.
- No alert for mentions, DMs and thread replies (Buzz already alerts for those), muted channels, your own messages, or messages older than two minutes (catch-up after reconnecting).
- No alert for a message Buzz marks read while its window is in front (the channel you have open). When Buzz is in the background, that channel alerts too. Alerts arrive about a second late so this can be checked.
- **Settings → Notifications → 채널 메시지** turns these alerts on or off and sets their sound.
- Each person picks their channels under **Settings → 채널 메시지 알림** (all channels, or only selected ones). The choice is saved on their own computer.
- People who have not picked yet get the default from `CHANNEL_ALERTS.channels` in `plugin.js` (`"all"` or a list of channel names).
- Only the community that is currently open can alert.
- This relies on Buzz's internal live message feed, which is not a documented plugin API. If a Buzz update changes it, channel alerts stop; nothing else is affected.

## Good to know

- Tuned for Buzz **1.0.6 with the English interface**. On other versions some styles may not apply. The app does not break; those parts just fall back to Buzz's default look.
- Some styling depends on Buzz's internal page structure, so a Buzz update can shift parts of it. Please report anything that looks off.
- Threads, Mentions, DMs and Reactions in the sidebar, and DM and Activity in the left bar, are shortcuts that open Buzz's Activity page on that tab.
- While the formatting bar is open, Buzz hides the @, file and emoji buttons. Close the bar with the **X** on its left to bring them back.
- Message text and what you type are never translated or changed.
- Korean text uses Noto Sans KR only on computers that have it installed; others keep the system font.
- Buzz plugins run inside the app without restrictions. This plugin changes how Buzz looks and adds the alerts above; it does not send any data outside Buzz.

## Settings

All settings are constants near the top of `plugin.js`. After editing, reload the plugin in Buzz to apply them.

| Constant | What it controls |
| --- | --- |
| `COLORS` | Base colors of the sidebar, left bar, selection and so on |
| `THEMES`, `DEFAULT_THEME` | Color themes to pick from; the theme for people who have not picked |
| `DARK_MODE_DARKEN` | How much darker the top and left bars and the sidebar get in dark mode |
| `DEFAULT_LANGUAGE` | Language for people who have not picked (`"auto"`, `"ko"`, `"en"`) |
| `SIZES` | Channel row height, sidebar and message text size, channel title size |
| `TRANSLATIONS` | Menu names to show in Korean (`"English": "한글"`) |
| `ACTIVITY_ROWS`, `HIDE_ACTIVITY_ROW` | Shortcuts pinned at the top of the sidebar and their order; hide Buzz's own Activity row |
| `HUDDLES`, `HUDDLES_LABEL` | The Huddles row and recent-huddles page |
| `DOCK_APPS`, `DOCK_ORDER`, `DOCK_RENAMES`, `DOCK_ICON_OVERRIDES` | Left bar buttons, order, names and icons |
| `DOCK_LABELS`, `DOCK_TILE`, `DOCK_ICON` | Left bar labels, icon tile and icon size |
| `DOCK_NEW_BUTTON`, `DOCK_NEW_BUTTON_BOTTOM` | Show the + button in the left bar, and its distance from the window bottom |
| `AUTHOR_WEIGHT`, `UNREAD_WEIGHT`, `CHANNEL_TITLE_WEIGHT` | Weight of names, unread channels and the channel title |
| `AVATAR_RADIUS`, `MESSAGE_INDENT`, `AVATAR_GAP`, `STACK_GAP` | Profile picture corners, message position and spacing |
| `DM_AVATAR`, `DM_AVATAR_RADIUS` | Picture size and corners in the sidebar's direct-message list |
| `FORMAT_BAR`, `FORMAT_BAR_HEIGHT`, `FORMAT_BUTTONS` | Formatting bar above the message box: on/off, height, buttons |
| `COMPOSER_ICON`, `COMPOSER_BUTTON_GAP`, `COMPOSER_BUTTON_ORDER` | Message box button icon size, spacing and bottom-row order |
| `COMPOSER_BORDER`, `COMPOSER_BORDER_FOCUS` | Message box border strength, idle and while typing |
| `PLACEHOLDER_SUFFIX`, `PLACEHOLDERS` | Placeholder text in an empty message box |
| `CHANNEL_TABS`, `FILES_PAGE` | Tab row under the channel name (Messages · Files · Canvas); messages the Files tab reads at a time |
| `CHANNEL_ALERTS` | Channel message alerts: on/off, default channels, quiet while viewing |
| `SLACK_CORNERS`, `CARD_RADIUS` | Corner size of menus, dialogs and buttons; sidebar and conversation corners |
| `SLACK_FONTS`, `SLACK_LETTER_SPACING` | Use Noto Sans KR (where installed); zero letter spacing |
| `FONT_SMOOTHING` | `""` Buzz default (thinner), `"auto"` slightly heavier |
| `ROW_RADIUS`, `SECTION_INDENT`, `PINNED_ROW_HEIGHT` | Sidebar row corners, section indent, pinned row height |
| `MENTION_SELECTED`, `INLINE_CODE_COLOR`, `NEW_LINE_COLOR` | Selected @mention suggestion, inline code text, the new-messages line |
| `SEARCH_HEIGHT` | Height of the search box at the top |

## Development

There is no build step: `manifest.json` and `plugin.js` are the whole plugin.
To edit and check changes locally, add this folder with **Add → Add from folder → Browse**.
(Dragging the folder in installs a copy, so your edits would not show up.)
