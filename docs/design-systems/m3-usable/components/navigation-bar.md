# M3 component: navigation-bar

_Archive: `m3-archive/spec/components/navigation-bar/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/navigation-bar/…_

## Overview (full text)

Navigation bar – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 Use navigation bars in
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact window size class
 or
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium window size class
 window sizes Can contain 3-5 destinations of equal importance Destinations don't change. They should be consistent across app screens. Navigation bar for compact and medium window sizes Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Available language Web Unavailable language Web: Expressive Unavailable Close M3 Expressive update May 2025 A new flexible navigation bar was introduced to replace the baseline navigation bar. It’s shorter and supports horizontal navigation items in medium windows. More on M3 Expressive Variants and naming: Baseline navigation bar is no longer recommended Added flexible navigation bar Shorter height Can be used in medium window sizes with horizontal navigation items Color: Active label changed from on-surface-variant to secondary The flexible navigation bar is shorter and can be used in medium windows with horizontal nav items Differences from M2 Color: New color mappings and compatibility with dynamic color Elevation: No shadow Layout: Container height is taller States: The active destination can be indicated with a pill shape in a contrasting color Name: Bottom navigation has been renamed navigation bar M2: A drop shadow indicates placement on top of content. Filled and regular weight icons indicate active states. M3: Taller and no drop shadow. Filled icons and an active indicator indicate active state.

## Key measurements (dp, extracted)

- Window widths smaller than 600dp, such as a phone in portrait orientatio
- Window widths from 600dp to 839dp, such as a tablet or foldable

## Accessibility (full text)

Navigation bar – Material Design 3
 Use cases Interaction & style Initial focus Visual indicators Keyboard navigation Labeling elements Use cases People should be able to do the following using the assistive technology: Move between navigation destinations Select a particular navigation destination from a set Get appropriate feedback based on input type Interaction & style Touch When a navigation item is tapped, the active indicator appears in place, providing feedback that it’s selected A touch ripple passes through the indicator The icon switches from outlined to filled The icon changes color pause Touch: Tap Cursor When hovered, the active indicator appears in a reduced state providing a visual cue that the destination is interactive When clicked (in both active and inactive states), a ripple passes through the indicator The icon switches from outlined to filled The icon changes color, becoming darker pause Cursor: Hover, Click Text scaling and truncation When someone sets their device to show a larger text size, the navigation bar should grow vertically to accommodate larger labels while retaining the default padding. It’s okay for scaled text to wrap in navigation items. To remain accessible, ensure the full label is always visible on-screen at up to 2x text sizing. Beyond this size, text can truncate. Text scaled to 1.5 size Text scaled to 2x size Initial focus Initial focus lands directly on the first navigation item, since that is the first interactive element of the component. Focus lands on first navigation item The navigation item is selected with Space/Enter Visual indicators Use a filled icon with a bold label for selected destinations. For unselected destinations use an outlined icon with a medium label. If an icon doesn’t have a filled style, use a thicker or heavier version of the icon instead. check Do Use a filled icon for the selected navigation destination to differentiate from the other destinations close Don’t Don’t use outlined icons on selected nav items When selected, the icon fills, darkens, and is backed by an active indicator shape Keyboard navigation Keys Actions Tab Move between navigation items Space / Enter Selects the focused navigation item Labeling elements The accessibility label for a navigation item is typically the same as the destination name. A navigation bar’s accessibility label can incorporate its adjacent UI text When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a navigation destination visibly labeled Library would benefit from additional information in its accessibility label to clarify the destination’s intent. Note: On Android Views (MDC-Android), a more descriptive accessibility label is not available and the role is not announced. While the visible label text reads Library , the accessibility label for this destination clarifies its function: Music library

## Specs (full text)

Navigation bar – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color States Measurements Baseline navigation bar Measurements Configurations Variants Flexible navigation bar Baseline variants The baseline nav bar is no longer recommended, and should be replaced by the flexible nav bar, which is shorter and supports horizontal navigation items in medium windows. View baseline nav bar specs Navigation bar (not recommended) Variant M3 M3 Expressive Flexible navigation bar -- Available Navigation bar Available Not recommended. Use flexible navigation bar . Configurations In compact windows, navigation bars use vertical items. In medium windows, navigation bars should use horizontal items. Vertical navigation items Horizontal navigation items Category Configuration M3 M3 Expressive Navigation item layout Vertical (default) Available Available Horizontal -- Available Tokens & specs Use the table's menu to switch between token sets for the navigation bar and the nav items. Learn about design tokens Nav bar - Common arrow_drop_down search expand_all Default, Light arrow_drop_down folder Color keyboard_arrow_down folder Nav item keyboard_arrow_down folder Container keyboard_arrow_down Close Anatomy Container Icon Label text Active indicator Small badge (optional) Large badge (optional) Large badge label Color Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. Learn more about design tokens Navigation bar color roles used for light and dark schemes: Surface container On-secondary container Secondary Secondary container On-surface variant On-surface variant For badge color roles, go to badge specs . States States are visual representations used to communicate the status of a component or an interactive element. Enabled Hovered (8% state layer) Focused (10% state layer) Pressed (10% state layer) Measurements The navigation bar stretches the full window width. Navigation bar padding and size measurements Vertical navigation items dynamically change width to equally fit the container. Horizontal navigation items have a fixed width, so extra space is added to the ends of the navigation bar instead. Navigation bar width and margins for compact and medium windows. Vertical navigation item Margin from window edge Horizontal navigation item Baseline navigation bar Container Icon Label text Active indicator Small badge Large badge Large badge label Tokens & specs These tokens are for the baseline navigation bar. Navigation bar (baseline) arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down Close Color Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. Learn more about design tokens Navigation bar color roles used for light and dark schemes: Surface On secondary container On surface Secondary container On surface variant On surface variant For badge color roles, go to badge specs . States States are visual representations used to communicate the status of a component or an interactive element. Navigation bar states: Enabled Hovered Focused Pressed Measurements Navigation bar padding and size measurements Navigation bar target size and margins Configurations 3 destinations 4 destinations 5 destinations

## Guidelines (full text)

Navigation bar – Material Design 3
 Usage Anatomy Placement Adaptive design Behavior Navigation bars adapt to different breakpoints Usage Navigation bars provide access to three to five destinations. The nav bar is positioned at the bottom of windows for convenient access. Each destination is represented by an icon and label text. One navigation destination is always active. When a navigation bar icon is tapped or focused, people are taken to the navigation destination associated with that icon. Navigation bars can have three to five destinations Navigation bars should be used for: Three to five main pages in the product Mobile or tablet only Navigation bars shouldn’t be used for accessing single tasks, such as viewing one email. On mobile or tablet, navigation bars should be used for top-level destinations The navigation items can be vertical or horizontal . Use vertical items in
 compact windows
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , like mobile Use horizontal items in
 medium windows
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 , like tablets Vertical navigation items work best in compact windows. Horizontal items work best in medium windows. For products with more than five navigation items, don’t use a navigation bar; the elements may collide and there likely won’t be enough space for translated text. Instead, consider using
 tabs
 Tabs organize content across different screens and views.
 More on tabs
 to organize similar content within a page, or hide the navigation behind a menu icon using a
 modal expanded navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 . close Don’t Avoid putting more than five navigation items in a navigation bar close Don’t Don’t remove the labels from navigation items close Don’t Don’t use a navigation bar for fewer than three destinations. Instead, use tabs. Use navigation for distinct pages and tabs for related content within a page close Don’t Navigation bar destinations have fixed positions. Don’t scroll them or modify their positions. Anatomy Container Icon Label text Active indicator Large badge (optional) Small badge (optional) Container The container should always be placed at the bottom of the product and span the full length of the window. Navigation items are centered within the container. The container has a color fill to provide separation from other content. The navigation bar container holds all elements Navigation items Navigation items hold all elements for each destination: the icon, label text, and active indicator. They can be vertical , with the text below the icon and indicator, or horizontal , with the icon and text beside each other inside the indicator. Vertical items are best in
 compact windows
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , and horizontal items are best in
 medium windows
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation
 More on medium breakpoints
 . Horizontal items are centered in the nav bar with outer margins. The navigation bar is divided into equal-width segments with padding from the window edge Icons Navigation rail items must use icons that symbolize the content of their page. Browse popular icon . Use a filled icon for the active destination and outlined icons for inactive destinations. If an icon doesn’t have a filled version, apply semibold weight to the icon instead. check Do Use filled icons when the navigation item is active exclamation Caution If a filled version of an icon is unavailable, the icon’s weight must increase Active and inactive icons must have a minimum 3:1 contrast ratio with the container. close Don’t Don’t use multiple or low-contrast colors in a navigation bar, as they make it harder for people to distinguish the active item and navigate to other destinations Active indicator The active indicator shows which page from the nav bar is currently being displayed. check Do Use the active indicator only for the active destination close Don’t Don’t use the active indicator for more than one destination at a time Label text The label text should be a short, meaningful description of each navigation destination and another way for people to understand an icon’s meaning. All navigation items require a label text. It should be 1-2 words. Label text must be brief and clear check Do Use brief text labels to identify the purpose of a destination close Don’t Don’t wrap or truncate text as it can make the label hard to understand close Don’t Don’t shrink longer text to fit on a single line Badges (optional) Navigation bars can display badges in the upper right corners of the destination icon. Badges can contain dynamic information, such as the number of new messages. Use a small badge to indicate an update, and a large badge to show the amount of updates Badges overlap the icon in both vertical and horizontal navigation items Placement The floating action button (FAB) is placed above the navigation bar. Nav bars are always placed at the bottom of the window. check Do The FAB should be right-aligned above the navigation bar close Don’t Don’t cover the navigation bar with a FAB Navigation bars can be temporarily covered by dialogs, bottom sheets, navigation drawers, the on-screen keyboard, or other elements needed to complete a flow. They should not be permanently obstructed on any screen. pause The search feature of the screen triggers the on-screen keyboard, temporarily covering the bottom navigation bar until the search flow is completed Adaptive design Adaptive design allows an interface to respond or change based on context, such as the user, device, and usage. More on adaptive design Resizing Only use navigation bars for
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 and
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 breakpoints. Compact : For narrow windows, use a navigation bar or modal navigation rail. Medium : Use a navigation bar or navigation rail. Decide based on whether horizontal or vertical space is more important. Expanded and extra-large : Use a navigation rail instead. Decide based on available window space and the number of navigation destinations. pause Navigation bars are best suited for compact and medium breakpoints The navigation bar container spans 100% of the window width. Navigation bars use 100% of the screen width The navigation bar is used on smaller devices. It’s not intended for desktop. close Don’t Don’t use navigation bars for desktop layouts. Instead, use a navigation rail or tabs. Presentation In medium breakpoints, use horizontal nav items to better use available space. Horizontal nav items should remain centered with the same padding at each breakpoint. A navigation bar in horizontal orientation keeps the same spacing between destinations Behavior Navigation When selecting a navigation bar item not currently selected, the product navigates to that destination’s screen using a top level transition pattern. It can either remember where you left off, or reset to the default view. Preserve state : If someone has interacted with this destination, it returns to their scroll position, current tab, and in-line search status. Reset state : Any prior user interactions are reset, including scroll position, tab selection, and in-line search. Choose the behavior that best suits the product and user needs. For example, an app that requires frequent switching between sections should preserve each section’s state. pause After selecting an item on the bottom navigation bar, the app navigates to that destination’s screen Re-selecting the currently active destination should reset the scroll position to the top of the page. Don't swipe between destinations Swiping across the screen does not navigate between destinations, and is not supported by the navigation bar. Swipe behavior should be reserved for related items, such as cards in a carousel, or actions such as archiving a list item. pause Selecting the already selected navigation item scrolls to the top of the screen Scrolling Upon scroll, the navigation bar can appear or disappear. Don’t hide the navigation bar on scroll when a screen reader is active. pause Scrolling downward can hide the navigation bar; scrolling upward reveals it Selection The icon becomes filled and the active indicator expands from the center of the icon when switching between destinations. The active indicator animation should only apply on one axis to better represent a flat, shared plane. pause An active indicator appears when the item is selected. When a destination is tapped, the destination screens use a top level transition pattern. In addition, the icon becomes filled and the active indicator expands from the center of the icon. pause Tapping a destination uses a top level transition pattern

## [overview] illustrations

- `b8e7df9680c12850.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0ddmjvm-03.
- `e231057621b06f6d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fodjau-01.
- `bb911ce186155baa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmae7pvz8-04.
- `4a30824f15c067cb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmae7qe43-02.
- `04b8eb27e55e8b24.png` ← https://lh3.googleusercontent.com/n4J4Jub0Z8mMwpNmj68TF-0f6P8_KfxJPC_mVwKxeTLPAyCRKcovkuDTDSzgixYrZA04rWDtKb4i

## [specs] illustrations

- `58492d0fae7f6093.png` ← https://lh3.googleusercontent.com/ALYNjmr0KKRFb33P4hKrUxeXha7V6L7eyz_izrbW4nGMgFfZtYjbLa7cHF3mxpWOr4TiAswFklnd
- `27203f6c8e69d8f5.png` ← https://lh3.googleusercontent.com/Cx_HLEfaqKx72AHNtDdP7raUEXmHCDKOWC40CCuYLkfYn6d93KRaJHBWdxVHOkoU22j4UAJJExrl
- `c1425c1058b15391.png` ← https://lh3.googleusercontent.com/DBrM1eLC6HN2CNBg9Gr9UjPRuBgV0C7N3JLMzR2Y3nemUs8z0I71LTJM36azNtt45cWQiwISFwjA
- `e75f17cda47e93b2.png` ← https://lh3.googleusercontent.com/FTJk0MWbkT2YuqVJl3k8F57gmzTtSUKbQCovcet18WLLqbCMFFYds_DS65Sx8fzuFpEK6G_W5lmD
- `0f83925f6ade6f25.png` ← https://lh3.googleusercontent.com/NkOIeqvJB7WxPg28DI-4uEHBrBfN38qDD2CWuX-NM2tTrxYwRknjdhOMzMCD1D9d65WN-Lzfo1Zg
- `846f4c69dcb08885.png` ← https://lh3.googleusercontent.com/PmEPtOw84s8SQu9KJJ0EX-gTgEL5PDGneaQfz9OVdFSXWjLd7P41B6qpIiWnAOuSfGl7JnCQOqa3
- `61fb6683693b949d.png` ← https://lh3.googleusercontent.com/Tz8X4rigXztIPIhpYB584wZpWuKYAEz4C4mIBNVQksaN4sRvl_eXy8dk9cwcWhM3iOfOJVLvlckz
- `bd487ddce7764592.png` ← https://lh3.googleusercontent.com/UvjUYsyF9gAgVOmfiC9h3zFaS-jU0wYws-HjqFyeiABhm3ubP8ZtHn__4wPEPmw3eR3D4C4O6sUe
- `c5c38de544d10fae.png` ← https://lh3.googleusercontent.com/VMRrzRH_T07zMqRPwp1sLZPmkAVJVwQDqqrhuD-synkhADa-mjbbjtbh_tWZ4QZ9ael3lvNq52dh
- `ad110658223d89e6.png` ← https://lh3.googleusercontent.com/ec6ZkQGVtf5t0AOua9lhgucAZ31inD_mF4vm24sW2MeH8X2dK3xV1rpfoNuX6hlO5rU7wJVfCH0K
- `747456114b197d02.png` ← https://lh3.googleusercontent.com/iFtbyGfchUzulQmxsrcS-I7WwK9b3AywZsdXqs8Z1jIytViyh4uD1UC9qpNKi44ejAswfg-jDNjz
- `04b8eb27e55e8b24.png` ← https://lh3.googleusercontent.com/n4J4Jub0Z8mMwpNmj68TF-0f6P8_KfxJPC_mVwKxeTLPAyCRKcovkuDTDSzgixYrZA04rWDtKb4i
- `cb882d8689dab91c.png` ← https://lh3.googleusercontent.com/p7YCl5pH99g_eM4-BCFHmEgxIdJxmb5UuE-CUwR8M9OjjPkNJpYAwQPZTAxamQBoiRr25F23T4mx
- `c2b456a484fb4fa9.png` ← https://lh3.googleusercontent.com/yZAR82Wh75nazTTTOrRenBXPtuOb1BG45198tsOGQMOTUk0QS_Ety_wa_9wsQRVXkBVii9TYrwCm
- `12e96a3d232dc89f.png` ← https://lh3.googleusercontent.com/zjuYI8XOBcjHmnNU2V9qHk9gbz3xJW9E2cEVE0Ov9Bh2fz8VI7RoISP5ykh9u5mqCXhF1nYKXT69

## [guidelines] illustrations

- `a954b4793cc9d838.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fp4omq-08.
- `9b8ce80106f8cbfb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fp4ti0-09.
- `08796d9fcf3af8d0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fp9y48-13.
- `fa12aa2a40f9b767.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fpa2te-14.
- `3ab7f8c61ca7d516.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fpamvs-18.
- `c64d52ba06d346d2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fpt5k2-30.
- `03bf6223b2ffe48a.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fpu2iy-C%2
- `19378a6ca7fe0a3d.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fq2m3b-G%2
- `50c8c1e3b71f8d59.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm3t918of-10.
- `5b7a60ea27994818.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm3t91cku-11.
- `0dda3595e78368b4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm3t91mur-12.
- `a322ee80d6dcde29.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalnqdza-02.
- `bdfc5c98b5a6269a.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalo6njn-GM3
- `42cc8d9b23b8c8d0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalo8a44-28.
- `afb33e72bfc19ab1.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalo9ujs-GM3
- `c9cc32d6b4d20152.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalod84x-GM3
- `a8155df12cc893c0.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmaloebec-GM3
- `38d62c11b78f598f.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalof0yh-GM3
- `14097fad1523318c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalqgvk7-01.
- `87531e2d32c63a19.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalqhln7-03.
- `279f8154d0b04b60.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalqhs7x-04.
- `d36c4a7562344161.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalqi614-05-
- `d3bf9794b98dee2b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalqimzs-06-
- `bd89112867508552.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalqir51-07-
- `a14d2ece458517b8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalqnpkt-15-

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fpu2iy-C%20-%20Switch%20Destin`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fq2m3b-G%20-%20CU%20Destinatio`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalo6njn-GM3-Expressive_NavBar_G`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalo9ujs-GM3_Expressive_NavBar_G`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalod84x-GM3_Expressive_Nav-Bar_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmaloebec-GM3_Expressive_Nav-Bar_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalof0yh-GM3-Expressive_NavBar_G`

## [accessibility] illustrations

- `d881ff541ba774f8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fr7kb3-03.
- `68cd021d2dc4a045.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fr7nd7-04.
- `19666c46cb17f3c6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fr7qqu-05.
- `e3cda3ef4800f5c1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fr7ugl-06.
- `6dd4d74b76a62a9e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fr7yfn-07.
- `de543f8ec872d699.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fr861i-08.
- `3249b2a2f7bd345b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fr8a8y-09.
- `974b655c1bb67e58.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2kua3ge-03.
- `32992938a79fb801.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2kuaeol-04.
- `93d8b54ef20820f9.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7paivnz-GM3
- `c233c01b1a2e3a9c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7paj7kh-GM3
- `04b8eb27e55e8b24.png` ← https://lh3.googleusercontent.com/n4J4Jub0Z8mMwpNmj68TF-0f6P8_KfxJPC_mVwKxeTLPAyCRKcovkuDTDSzgixYrZA04rWDtKb4i

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7paivnz-GM3-Accessibility_Expre`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7paj7kh-GM3_Expressive_Accessib`
