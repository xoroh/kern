# M3 component: snackbar

_Archive: `m3-archive/spec/components/snackbar/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/snackbar/…_

## Overview (full text)

Snackbar - Material Design 3
 Availability & resources Differences from M2 Snackbars shouldn’t interrupt the user’s experience Usually appear at the bottom of the UI Can disappear on their own or remain on screen until the user takes action Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Unavailable Close Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Behavior: Clarified that snackbars can either appear temporarily (dismissive) or persist until the user takes an action (non-dismissive) Snackbars have new color mappings

## Key measurements (dp, extracted)

- Window widths smaller than 600dp, such as a phone in portrait orientatio
- , snackbars should expand vertically from 48dp to 64dp to accommodate one or two lines
- Window widths from 600dp to 839dp, such as a tablet or foldable
- Window widths 840dp to 1199dp, such as a tablet or foldable

## Accessibility (full text)

Snackbar - Material Design 3
 Skip to main content menu_open arrow_back Main menu pause Pause animations dark_mode Switch to dark mode menu material_design Material Design 3 search Snackbar Snackbars show short updates about app processes at the bottom of the screen Resources android flutter android info Overview style Specs design_services Guidelines accessibility_new Accessibility Use cases Users should be able to: Be alerted, but not disrupted, when a snackbar appears Move focus to an actionable snackbar Take action on a snackbar using assistive technology Interaction & style Snackbars with actions shouldn't auto-dismiss. This way, users can read and interact with it at their own pace. Snackbars without actions can auto-dismiss after a sufficient amount of time, however this can still present difficulties on web without additional feedback. Each platform has its own requirements for auto-dismiss durations, however common acceptable durations are 4–10 seconds. Auto-dismissing snackbars should remain on screen long enough to read the information Snackbars use a color intended to stand out against UI elements. Use the default color mapping to avoid color conflict issues. Snackbar should visually stand out Accessibility requirements on web On web, auto-dismissing snackbars can be difficult to navigate for people with low vision or who require additional time to perceive information. This information can be made clearer for all users in two ways: 1. Add inline feedback Information in auto-dismissing snackbars must also be communicated inline or near the action that triggered the snackbar. For example, update the label on a "Save" button to “Saved”, and trigger an auto-dismissing snackbar that communicates the same message. 2. Make the snackbar actionable Alternatively, add actions to the snackbar so it doesn't dismiss until acted on. Actionable snackbars shouldn't auto-dismiss. Communicate snackbar information near the action that triggered the snackbar Note: Material Web doesn't yet include the snackbar component. This guidance still applies to custom-made snackbars. Focus Snackbars have the following focus requirements: When a snackbar appears, announce the message but don't move focus. Don't automatically move focus. Don't trap focus in the snackbar. Users should be able to freely navigate in and out. On web, a shortcut should exist for users to move focus to snackbars with actions (like Alt+G). Ensure that this shortcut is clearly documented, like in a help article. pause Focus returns from the snackbar (1) to the previously focused element (2) Focus exits the snackbar differently per platform: Ideally, focus should either return to the element that triggered the snackbar, or go to the next most logical element on the page. On Android Compose, focus may move to the nearest visible element, or to the first actionable item on the page. pause If the previously focused element is no longer on the page, focus should move from the snackbar (1) to the next most logical element (2) Keyboard navigation Keys Actions Tab Moves focus between interactive elements Esc Dismisses the snackbar when in focus Labeling elements Snackbars should be announced once they appear on the screen, but shouldn’t grab focus or prevent people from completing their current task. On Android and web, use a live region with a polite (queued) announcement instead of an assertive announcement. On iOS 17+, snackbars use polite announcements by default. If a snackbar appears when the app is launched, it should be announced after the page’s title, but not receive focus. Snackbars are announced when they appear, but don't trap focus

## Specs (full text)

Snackbar - Material Design 3
 Tokens and specs Color Measurements Configurations Container Icon (optional close affordance) Action (optional) Supporting text Tokens and specs Browse the component elements, attributes, tokens, and their values. Learn more about design tokens Snackbars arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Snackbar color roles used for light and dark schemes: Inverse surface Inverse on surface Inverse primary Inverse on surface Measurements Snackbar padding and size measurements Configurations Single line Single line with action Two lines Two lines with action Two lines with longer action

## Guidelines (full text)

Snackbar - Material Design 3
 Usage Anatomy Placement Responsive layout Behavior Usage Snackbars inform users of a process that an app has performed or will perform. They appear temporarily, towards the bottom of the screen. They shouldn't interrupt the user experience. People can browse the page content without being required to interact with the snackbar. Frequency Only one snackbar may be displayed at a time. Actions A snackbar can contain a single action. "Dismiss" or "cancel" actions are optional. Similar components
 Dialogs
 Dialogs provide important prompts in a user flow.
 More on dialogs
 are also designed to show important messages. Choose the right component based on the importance of the message. This component messaging strategy can help avoid overusing snackbars. Dialogs require immediate action When to use snackbars Snackbars communicate messages that are minimally interruptive and don’t require user action. Component Priority User action Snackbar Low priority Optional: Snackbars disappear automatically Dialog High priority Required: Dialogs block app usage until the user takes a dialog action or exits the dialog (if available) Accessibility requirements for web On web, auto-dismissing snackbars are inaccessible for people with low vision or who require additional time to perceive information. This can be solved in 2 ways: 1. Add inline feedback Information in auto-dismissing snackbars must also be communicated using another accessible method inline or near the action that triggered the snackbar. For example, update the label on a "Save"
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 to “Saved”, and trigger an auto-dismissing snackbar that communicates the same message. 2. Make the snackbar actionable Alternatively, add actions to the snackbar so it doesn't dismiss until acted on. Also communicate snackbar information near the action that triggered the snackbar Anatomy Container Supporting text Action (optional) Close button (optional) Text label Snackbars contain a text label that directly relates to the process being performed. In
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , the text label can contain up to two lines of text. Text labels are short, clear updates on processes that have been performed check Do Keep the snackbar text label to one line long when possible check Do On mobile, the text label can be up to two lines long exclamation Caution Avoid adding icons to snackbars. If your message needs an icon, consider using a different component such as a dialog. close Don’t Avoid using stylized text or inline links in snackbars; they can add unwanted complexity. If your message needs a link, add a button instead, or use a different component. Container Snackbars are displayed in rectangular containers with a grey background. Containers should be completely opaque, so that text labels remain legible. Snackbar containers use a solid background color with a shadow to stand out against content close Don’t The text label shouldn’t share the same color as the text button close Don’t Don’t use a filled or elevated button in a snackbar, as it draws too much attention check Do In wide layouts, extend the container width to accommodate longer text labels exclamation Caution An app can apply slight transparency to the container background, as long as text remains clearly legible close Don’t Avoid significantly altering the shape of a snackbar container Action Snackbars can display a single text button that lets users take action on a process performed by the app. Snackbars shouldn’t be the only way to access a core use case, to make an app usable. To distinguish the action from the text label, text buttons should display colored text check Do If an action is long, it can be displayed on a third line check Do To allow users to amend choices, display an "Undo" action exclamation Caution A dismiss action is unnecessary, as snackbar disappears on their own by default Placement At the bottom of a UI Snackbars should be placed at the bottom of a UI, in front of the main content. In some cases, snackbars can be nudged upwards to avoid overlapping with other UI elements near the bottom, such as
 FABs
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 or
 docked toolbars
 Docked toolbars (formerly bottom app bars) are placed at the bottom of the page.
 . Avoid placing a snackbar in front of frequently used touch targets or navigation. check Do Place a snackbar in front of the main content close Don’t Avoid placing snackbars in front of navigation components To ensure accessibility for keyboard users on the web, avoid positioning the snackbar in a way that completely obscures actionable elements. Blocking elements makes it difficult to know what is being focused and selected. check Do Adjust the size of the snackbar to avoid blocking elements in focus close Don’t Don’t let the snackbar fully cover elements in focus Snackbars can span the entire width of the screen only when a UI does not use persistent navigation components like app bars or
 navigation bars
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 . Snackbars that span the entire width of a UI can push up
 FABs
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 when they appear. exclamation Caution Snackbars can span the entire width of a UI. However, they should not appear in front of navigation or other important UI elements like floating action buttons. Snackbars and floating action buttons (FABs) Snackbars should appear above
 FABs
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 . Snackbar above a FAB close Don’t Don’t place a snackbar in front of a FAB close Don’t Don’t place a snackbar behind a FAB Responsive layout Compact breakpoint In
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , snackbars should expand vertically from 48dp to 64dp to accommodate one or two lines of text, while maintaining a fixed distance from the leading, trailing, and bottom edges of the screen. Medium & expanded breakpoints On
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , like tablet and desktop, snackbars should scale horizontally to accommodate longer text strings, keeping in mind that the ideal line length for text is typically between 40-60 characters. Snackbars use a flexible distance from the trailing edge of the screen. Whenever possible, snackbars on medium and large displays should aim for a single line of text with an optional
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 . In wider
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 , snackbars can be left-aligned or center-aligned if they are consistently placed on the same spot at the bottom of the screen. Left-aligned snackbar Center-aligned snackbar close Don’t Don’t place snackbars flush to one edge of the layout close Don’t Don’t place consecutive snackbars side by side or next to one another Behavior Appearing and disappearing Snackbars appear without warning, but they don’t block users from interacting with page content. Snackbars without actions can auto-dismiss after 4–10 seconds, depending on platform. Avoid using auto-dismissing snackbars on web unless there's also inline feedback. pause Snackbars with actions should remain on the screen until the user takes an action on the snackbar, or dismisses it. pause Consecutive snackbars Consecutive snackbars must appear one at a time. Snackbars without actions appear and disappear automatically, while those with actions remain on screen until dismissed. However, a snackbar with updated information can immediately replace an outdated snackbar. pause pause close Don’t Don’t stack snackbars on top of one another pause close Don’t Don’t animate other components along with snackbar animations, such as the floating action button

## [overview] illustrations

- `93d0c89d733c44fb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwow6ukp-1.p
- `57f2ed3b7c24c5da.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwow95bc-2.p
- `94cd5630f3a6f7f3.png` ← https://lh3.googleusercontent.com/MCljoGyPcLqjCzgUIbJLevRR157ih2wAieRDwAlhNvtaivJj4aSqeUrEXcR2PkahZD8sd2S-0Uge

## [specs] illustrations

- `94cd5630f3a6f7f3.png` ← https://lh3.googleusercontent.com/MCljoGyPcLqjCzgUIbJLevRR157ih2wAieRDwAlhNvtaivJj4aSqeUrEXcR2PkahZD8sd2S-0Uge
- `3f36626c34579b92.png` ← https://lh3.googleusercontent.com/Pd1qLYMI80pcYjx89JXrogC_QiOljw2S1pbGruxLf1oJu_bQnZBwoBxb7V3AnPcV-piQUix6mCFt
- `a31567d16e6ac31a.png` ← https://lh3.googleusercontent.com/TqN2bvamEg2OcfPTmDLrFjMzDjDhfoX3dVbCgn4qqFArx765sDUaubGeUw0RiTFP6y83dAh3XIhj
- `9b2cde15780e1a00.png` ← https://lh3.googleusercontent.com/n1bxJJHcB0rD_PQuOaQL4U-nFlVYJ27WJyM-bsxB1Es0KgiWp-4UDnXLHUIMA42rrSWGNZ7nYCQG
- `b2cffd1874e94ec1.png` ← https://lh3.googleusercontent.com/oe-jEgmWKP97u0jsjhWPp2985Zn00p4FweCCB7iQbvx_xh1kkNRctD67TGEeJU_on8ch67ncdBPf

## [guidelines] illustrations

- `9940e0d33d728def.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoxyec0-5.p
- `f26411b74fb6dd19.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoy0ibw-6.p
- `ca7e648553a974cc.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoy1q93-7.p
- `92b2fab3c594c063.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoy2p4f-8.p
- `253e80e321c37eef.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoy3zcx-9.p
- `a2fabe2e40957bb7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoy4zjx-10.
- `59bebc743561dcaf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoy6dj7-11.
- `6d130694674a4cd5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoy7luk-12.
- `fe8ef61d970ca68f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoyabsh-13.
- `283efc485951d75e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoyc9yp-14.
- `2c9aa75dd8f825b5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoydoed-15.
- `7807484b494df8c6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoyf085-16.
- `ed465e22e17d6aa0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoz8scg-20.
- `db5dfabe50ceb2c6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoza8yz-21.
- `10c9a03f12470c0b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoztb40-29.
- `6db4fa3157b09d73.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwozw4lz-30.
- `b10bfc0a897190e1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwozx768-31.
- `9de03eed917328e3.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp03p7p-GM3
- `7f6798e81a144c3e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp06c42-GM3
- `c098ab3bf827baf5.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp08dxf-GM3
- `8ade742060886f17.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp0a03k-GM3
- `bef540fd05ee6f3d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flxktjsxn-19.
- `d7d8aa63e32937d0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flxktk5oy-28.
- `f2dddf945f19e160.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm6a9x4e1-1.p
- `ff78b02561d3c1b4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm6a9y0k8-2.p

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp03p7p-GM3-Components-Snackbar`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp06c42-GM3-Components-Snackbar`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp08dxf-GM3-Components-Snackbar`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp0a03k-GM3-Components-Snackbar`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm7ca02x7-m6f92ux5-GM3-Components-Snackbar-Behav`

## [accessibility] illustrations

- `0f09f41bb15717ae.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp0eako-GM3
- `0ed9c3ad31091c64.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp0g1ed-GM3
- `2dca445137d312d4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp0j72d-1.p
- `92dd40fb69b4cae2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp0k0la-2.p
- `e922e23de5ad5121.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp0kqjx-3.p
- `94cd5630f3a6f7f3.png` ← https://lh3.googleusercontent.com/MCljoGyPcLqjCzgUIbJLevRR157ih2wAieRDwAlhNvtaivJj4aSqeUrEXcR2PkahZD8sd2S-0Uge
- `5a931d9433b6d39e.png` ← https://lh3.googleusercontent.com/T_KwPf_rpSE3ree_3mFMt2C53xtXu1NZ67-FWB7-dRxb8jIeyk4T3J2-evC6G3Jly9WNV_gjKI-h

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp0eako-GM3-Components-Snackbar`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwp0g1ed-GM3-Components-Snackbar`
