# M3 component: navigation-rail

_Archive: `m3-archive/spec/components/navigation-rail/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/navigation-rail/…_

## Overview (full text)

Navigation rail – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 Use navigation rails in medium, expanded, large, or extra-large window sizes Can contain 3-7 destinations plus an optional FAB Always put the rail in the same place, even on different screens of an app pause Collapsed and expanded navigation rails can transition between each other on any device, including:  1. Large or medium window size classes like tablets 2. Compact window size classes like phones in portrait orientation Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Available language Web Unavailable language Web: Expressive Unavailable Close M3 Expressive update May 2025 A collapsed and expanded navigation rail have been introduced to replace the baseline nav rail. The expanded nav rail is meant to replace the
 navigation drawer
 Navigation drawers let people switch between UI views on larger devices. In the expressive update, use an expanded navigation rail.
 More on navigation drawers
 . More on M3 Expressive Variants and naming: The baseline navigation rail is no longer recommended Added two wider navigation rails: Collapsed: replaces baseline nav rail Expanded : replaces
 navigation drawer
 Navigation drawers let people switch between UI views on larger devices. In the expressive update, use an expanded navigation rail.
 More on navigation drawers
 Configurations: Expanded rail modality: Non-modal Modal Expanded behavior: Transition to collapsed navigation rail Hide when collapsed Color: Active label on vertical items changed from on surface variant to secondary The collapsed and expanded navigation rails match visually and can transition into each other Differences from M2 Behavior: Predictive back interaction Color: New color mappings and compatibility with dynamic color States: The active destination can be indicated with a pill shape in a contrasting color M2: The navigation rail uses icon color, weight, and fill to communicate which destination is active M3: The navigation rail uses a pill-shaped active indicator to communicate which destination is active

## Key measurements (dp, extracted)

- Window widths from 600dp to 839dp, such as a tablet or foldable
- Window widths 1600dp and larger, such as ultra-wide monitors
- Window widths smaller than 600dp, such as a phone in portrait orientatio

## Accessibility (full text)

Navigation rail – Material Design 3
 Use cases Interaction & style Keyboard navigation Labeling elements Use cases People should be able to do the following using the assistive technology: Navigate between navigation destinations Select a particular navigation destination from a set Get appropriate feedback based on input type Interaction & style When a navigation item is tapped, the active indicator appears, providing the following feedback to the user that it is selected: A ripple passes through the indicator The icon switches from outlined to filled The icon and text change color When hovered, the hover state appears, providing a visual cue that the destination is interactive. Touch: Tap Cursor: Hover, Click The target area for expanded navigation rails spans the full width of the container, even though the active indicator visually hugs the content. Touch: Tap Use a filled icon for the active destination and outlined icons for inactive destinations. Active and inactive icon colors need sufficient contrast against the container. check Do Use the default color scheme to ensure proper contrast and emphasis on the active destination close Don’t Don’t use more than two colors for destinations or low-contrast colors in the navigation rail. This will make distinguishing active items difficult. If an icon doesn’t have a filled style, use the semibold icon weight instead. An icon with no filled option should use the semibold weight when active Text scaling and truncation When someone sets their device to show a larger text size, the navigation rail items should grow vertically to accommodate larger labels while retaining the default padding. It’s okay for scaled text to wrap in navigation items. To remain accessible, ensure the full label is always visible on-screen at up to 2x text sizing. Beyond this size, text can truncate. Text scaled to 1.5 size Text scaled to 2x size Initial focus Initial focus lands directly on the first interactive item, whether it’s the menu, the FAB, or the first navigation item. From the FAB or menu, Tab brings the person to the navigation items. Tab or Arrows then navigate between items. Use arrows to move between navigation items Use space/enter to activate the focused navigation item Visual indicators Icons give the dominant cue of the navigation state. Use a filled icon for the selected destination to contrast with outlined icons for the non-selected destinations. check Do Use a filled icon variant on the selected navigation item to differentiate from inactive navigation items close Don’t Avoid using the same unfilled icon style for both selected and unselected items because it lacks important visual feedback cue Keyboard navigation Keys Actions Tab / Arrows Navigate between interactive elements Space / Enter Selects an interactive element Labeling elements The accessibility label for a navigation item is typically the same as the adjacent text label. When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a navigation item visibly labeled Recent would benefit from additional information in its accessibility label to clarify the destination's intent. Note: On Android Views (MDC-Android), a more descriptive accessibility label is not available and the role is not announced. While the visible label text reads Recent , the accessibility label for this switch clarifies its function: Recent images

## Specs (full text)

Navigation rail – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color States Measurements Common layouts Baseline navigation rail Variants Collapsed navigation rail Expanded navigation rail Baseline variants The baseline navigation rail is no longer recommended, and should be replaced by the collapsed navigation rail. View baseline tokens The baseline navigation rail is no longer recommended Variant M3 M3 Expressive Collapsed navigation rail -- Available Expanded navigation rail -- Available Navigation rail (baseline) Available Not recommended. Use collapsed navigation rail . Configurations Expanded layout: standard Expanded layout: modal Category Configuration M3 M3 Expressive Expanded layout Standard (default) Available as
 navigation drawer
 Navigation drawers let people switch between UI views on larger devices. In the expressive update, use an expanded navigation rail.
 More on navigation drawers
 Available Modal Available as
 navigation drawer
 Navigation drawers let people switch between UI views on larger devices. In the expressive update, use an expanded navigation rail.
 More on navigation drawers
 Available Expanded behavior Hide when collapsed -- Available Tokens & specs Browse the component elements, attributes, tokens, and their values. Learn about design tokens Nav rail - Common arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed keyboard_arrow_down Close Anatomy Collapsed and expanded navigation rail elements: Container Menu (optional) FAB or Extended FAB (optional) Icon Active indicator Label text Large badge (optional) Large badge label (optional) Small badge (optional) Color Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. Learn more about design tokens Navigation rail color roles used for light and dark schemes: Surface container (optional) On secondary container Secondary container Secondary (vertical), On secondary container (horizontal) On surface variant On surface variant Error On error Error States
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or an interactive element. The navigation item’s target area always spans the full width of the nav rail, even if the item container hugs its contents. Enabled Hovered Focused Pressed Measurements Navigation rail padding and size measurements Common layouts Three navigation items Three navigation items with a menu Three navigation items with a FAB Three navigation items with a menu and FAB Baseline navigation rail Container Menu icon (optional) Icon Active indicator Label text Large badge label (optional) Large badge (optional) Badge (optional) Tokens & specs Navigation rail (baseline) arrow_drop_down search expand_all folder Enabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Navigation rail color roles used for light and dark themes: On secondary container Secondary container On surface On surface variant On surface variant Error On error Error States States are visual representations used to communicate the status of a component or interactive element. Navigation rail states: Enabled (on active destination) Hovered (on active destination) Focused (on active destination) Pressed (on active destination) Enabled (on inactive destination) Hovered (on inactive destination) Focused (on inactive destination) Pressed (on inactive destination) Measurements Navigation rail size measurements Navigation rail padding and margin measurements Configurations Common arrangements of elements within a navigation rail. With a menu With a FAB With menu and FAB, without labels All destinations with text labels With menu, FAB, and label text for all destinations

## Guidelines (full text)

Navigation rail – Material Design 3
 Usage Anatomy Placement Adaptive design Behavior Use the menu icon to transition between collapsed and expanded navigation rails Usage The navigation rail can display navigation items, a menu, and a
 floating action button
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 (FAB) in a vertical orientation. There are two variants of navigation rails, collapsed and expanded , which can easily transform into each other when the menu button is selected. Collapsed The collapsed nav rail runs along the leading edge of the window, and should contain 3–7 navigation items. It should not be hidden. It can be used in
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 to
 extra large breakpoints
 Window widths 1600dp and larger, such as ultra-wide monitors.
 More on extra-large breakpoints
 , such as tablets and desktop. In medium windows with few destinations, consider using a
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 instead.
 Compact windows
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 should always use a navigation bar. A navigation rail should be the only visible navigation element Expanded The expanded navigation rail can be standard or modal, and should always open from a menu icon. An expanded rail can reveal secondary destinations not visible when collapsed. The standard configuration is placed beside body content. It’s best for larger windows with lots of available space. The modal configuration overlaps the body content, and should be opened from a menu icon. Use the modal configuration for: Information dense layouts where space is limited Products with many navigation items A navigation rail can be expanded by default on larger screen sizes, or can be expanded over content on smaller screen sizes In immersive experiences, the expanded navigation rail can be hidden entirely, appearing only when the menu icon is selected. The collapsed navigation rail should not be hidden. The expanded navigation rail can also be hidden, appearing only when the menu icon is selected Anatomy Container Menu (optional) Floating action button (FAB) (optional) Icon - active Label text - active Active indicator Icon - inactive Large badge (optional) Large badge label Small badge Label text - inactive Container The navigation rail should be placed on the leading edge of the window. This is the left side for left-to-right languages, and the right side for right-to-left languages. The container fill can be turned off so the nav rail appears directly on the surface. When doing this, make sure all items have a minimum of 3:1 color contrast. The navigation rail should be placed on the leading edge of the window The navigation rail should always run vertically along the side of a layout. Don’t make it horizontal. Use a
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 for horizontal navigation. close Don’t Don’t use the navigation rail horizontally. Use a navigation bar instead. Navigation rail items can be aligned as a group to the top or center of a layout. On tablets, use center alignment to make it easier to reach items. The menu icon and FAB should always be top-aligned. Top and center aligned rail destination placement Menu (optional) The menu button can transition between the collapsed and expanded navigation rails. Once expanded, the rail can reveal secondary destinations. When the navigation rail is expanded, the menu icon should change to represent that it can be collapsed. A navigation rail can expand to reveal more destinations Floating action button (FAB) (optional) The container of the navigation rail is ideal for anchoring the FAB to the top of a screen, placing the app’s key action above navigation destinations. When nested within another component, such as the navigation rail, the FAB's resting elevation should be level 0 . check Do A top-aligned FAB in the navigation rail close Don’t Avoid placing the FAB below navigation items The top of the rail can also be used for a logo, however avoid using logos that could be mistaken as buttons. Don’t use a logo as a menu button to expand the navigation rail. exclamation Caution Use caution when placing logos in the rail where they might be confused with an action or destination Active indicator The active indicator shows which page is being displayed. check Do Use the active indicator only for the current open page close Don’t Don’t use the active indicator for more than one navigation item at a time The active indicator hugs the label text in the expanded nav rail. To achieve a similar style to the baseline
 navigation drawer
 Navigation drawers let people switch between UI views on larger devices. In the expressive update, use an expanded navigation rail.
 More on navigation drawers
 , consider modifying the active indicator to fill the container. The target area should always span the full width. The active indicator hugs contents in the expanded nav rail Override the indicator to fill the container to more closely resemble the baseline navigation drawer Icons Navigation rail items must use icons that symbolize the content of their page. Browse popular icons on Google Fonts . Icons should symbolize the content of the page they open When a destination is selected, the icon fills and changes color. An active indicator appears behind the icon. Selected navigation items have an active indicator, a filled icon, and a more prominent color Label text The label text should be a short, meaningful description of each navigation destination and another way for users to understand an icon’s meaning. All navigation items require a one word label text. check Do Write clear and concise labels that describe the destination page Avoid wrapping long labels when possible. If necessary, create a line break between words, or hyphenate longer words. exclamation Caution Break up longer phrases into two text lines if necessary Labels should be short enough to not be truncated. Don’t shrink the type scale to fit longer text labels. close Don’t Don’t truncate or display an ellipsis in place of label text close Don’t Don’t reduce the type size to fit more characters into a destination label Badges Navigation rail icons can include badges to communicate dynamic information about the destination, such as counts or status. In compact nav rails, the badge is placed in the upper right corner of the icon. In expanded nav rails, the badge should be placed next to the label text. 1. Small badge on a rail destination 2. Large badge with a number 3. Large badge with a maximum character count Divider (optional) A vertical divider can help separate the rail from app content. The divider should be positioned on the edge of the rail container that’s adjacent to the app’s content area. A divider can make the navigation rail container distinct from other on-screen content Placement In adaptive layouts, the navigation rail should be placed outside any
 panes
 Panes are layout containers that house other components and elements within a single app. A pane can be: fixed, flexible, floating, or semi permanent.
 More on panes
 , always along the leading edge of the window. Don’t place it within body content. When the navigation rail is hidden, the body content can fill in the remaining space as long as the menu icon is still accessible.
 Tabs
 Tabs organize content across different screens and views.
 More on tabs
 can be used alongside a navigation rail to create an extra layer of visible navigation. pause Expanded navigation rails can open from menu buttons on mobile Adaptive design For more, see adaptive design . Resizing When moving from a large screen to a small screen, a navigation rail can transform into a navigation bar, providing the same quick access in a configuration that’s easier to use on smaller displays. Never use the navigation rail and navigation bar simultaneously. Only use navigation rails for medium breakpoints and larger. Don’t use a navigation bar. If there are more than five destinations, consider using a modal expanded nav rail instead. Compact: Don’t use a standard navigation rail for compact layouts due to space constraints. Use a navigation bar instead. Medium: Use a navigation rail, especially if prioritizing persistent vertical navigation over maximizing vertical content space. Expanded to extra-large: Use a navigation rail, not a navigation bar. Consider available horizontal space and the number of destinations when choosing between standard and modal. On smaller devices, use a navigation bar. On larger displays, use a navigation rail. Presentation When the navigation rail transitions from collapsed to expanded, the contents of the page should automatically adjust to fit. The contents of the navigation rail also expand to fill the space. For example, the FAB should transition into an extended FAB. Extra destinations can be shown in an expanded nav rail. pause Use a standard expanded rail when there are secondary destinations or actions that have lower priority than the main navigation items Behavior Scrolling Destinations in the navigation rail should remain visible and fixed when scrolling vertically. pause Rail destinations remain fixed while on-screen content scrolls vertically If a layout scrolls horizontally, the rail can scroll off-screen or remain fixed. To distinguish that content is scrolling underneath the rail, use a divider or add elevation to the rail. pause A divider and color fill change create visual distinction between the rail and horizontally scrolling content pause Elevating the rail to level 1 creates visual distinction between the rail and horizontally scrolling content Selection When a destination is tapped, the destination screen uses a top level transition pattern. In addition, the icon becomes filled and the active indicator expands from the center of the icon. pause Tapping a destination uses a top level transition pattern Back On Android, a gesture called predictive back allows people to swipe left or right on the screen to go back or dismiss modal components. Previous screen is revealed in a preview to signal the destination Predictive back only applies to the modal expanded navigation rail. A list of compatible components is available on the gestures page . pause The nav rail pops off the edge of the window during the predictive back gesture

## [overview] illustrations

- `b0a0f2d37ad34006.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dtdapc-3.p
- `f82951281904a0e7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fsz2c4-2.p
- `af1b23c9755a92d9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fszcgl-4.p
- `219254e2cee06818.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmbs2h57x-GM3
- `576869bdce5df1a1.png` ← https://lh3.googleusercontent.com/KqqwKGiGfJCWHJWGsrQHkJBLSbY73iXVlD9VhRbarTDDCbN870mBCFyDm9F8zqx8DeREGmWfa8mG

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmbs2h57x-GM3_Expressive_Nav-Rail`

## [specs] illustrations

- `ace9ff18bb3f2acb.png` ← https://lh3.googleusercontent.com/0ArxFOIUj1oF4bmcdt98kcylfvstmfHlWXRI2sVpFC5UG246qn6yr4185ERKim5I5IYDjTqDnWX_
- `b0428a8ff85099e1.png` ← https://lh3.googleusercontent.com/1IxCo2XIMga54ROSNhrWET0gIRcndin6fwUN_DdJMu2VZ4PFpdW1-c-vio2nIOXxmj3p_tGkbBc1
- `a617a08ce81fe701.png` ← https://lh3.googleusercontent.com/ADBFvMHXuRRv0_6Z-N3tRHlMrh88FQQszAdMrNhAM-p2IdU_v8QQRA0cezT6n2vPpVmhQ7R8saOY
- `a3e5f2f6e5045b92.png` ← https://lh3.googleusercontent.com/HCDSa0-MhFtUTT-jj2x4OG8rghWPku3boxc3_KKZzParDgXb2n-nNyXxh-eq8DyOgLXlqmxFHoc2
- `576869bdce5df1a1.png` ← https://lh3.googleusercontent.com/KqqwKGiGfJCWHJWGsrQHkJBLSbY73iXVlD9VhRbarTDDCbN870mBCFyDm9F8zqx8DeREGmWfa8mG
- `de84732f2622c398.png` ← https://lh3.googleusercontent.com/PsBusqTr-OE5bCxYRV_i7_t-UpABd6wh-bbKu-mzMDv5-O3eoKvh-B144jLbqI5sf4B63G0hAv5k
- `432c511a287190b5.png` ← https://lh3.googleusercontent.com/Q6opw4o2Z-4QOi0ydyk2R1MLywKayfVfAMWjKN6nvzz6OZzoJOGsl_BvoY_XaQp0dSV2iH4gwgEJ
- `12df4b83147bfe9e.png` ← https://lh3.googleusercontent.com/Q7TK1on1e6Srj9rXvfTaKHDKgYKSh07xaPRGq0zatThZiQkiwf-UMR1-H60g1esYikZSHRedr3h-
- `1cac02e276f395ba.png` ← https://lh3.googleusercontent.com/RTqY8bTqiMpwcsU_pJkWy9rMeFIjRoSs3m15t8w64kdPnvtTTTE6_Dklo68o5dm4vNj_CA14xM6F
- `d1dad2fadde861db.png` ← https://lh3.googleusercontent.com/_GDghBF084KxFoboNpBiBukL7eC9btnn0Mb6Jk_768f3C75CzUZ_lS1sJyKteHLGeR2sa__sSE-b
- `3c1358111883d8b0.png` ← https://lh3.googleusercontent.com/bYdm_ngSm_bDBlh7cCiignDkbte5hHytBrpjYGp_9BfBLH1hF2zPxV-Oqdm6nn8fSHRROojsHBUw
- `310cb1bbd61291e8.png` ← https://lh3.googleusercontent.com/d3PlE8MkpZrvAvwFNjnOiUQXi8R7ep0qmhurwSRvAq_yf3Eb44NIbzr78sGxD1gNgCLxhWdlVv_M
- `0f84f5c5c0ff614a.png` ← https://lh3.googleusercontent.com/iQ9mPuq7sZfsnSF_EfYMxQdypYp9K_fDEGHm0-4zuKdHXU48Kf7zItSC0hxmu3QW_ugdX67kQeQl
- `f7655fad5a890e93.png` ← https://lh3.googleusercontent.com/q4Ce0kmHkUU63AUNns9xbrnQx2UlJBT9dfmW-RzlP1iM5biz8sOwR4G7BU8pEmGTbMSy2nnmyYzP
- `dd216318d1893460.png` ← https://lh3.googleusercontent.com/uvOYTNSaWtfWdqdoR0tVR9eCjmd4f-AEfdMVEacZJc0VwURGK8_8FeAvzOY4Kr3sV9YzZfIF-ggu
- `1e4b473891ebd016.png` ← https://lh3.googleusercontent.com/z_uzDW3EjZiO_WRnWUJem6qKFygJFreR0EX_C_F4b4gyUdaq1KV9KFpJqgJpBWstqQ1O-CdNp0N6
- `a4f927ee12b79fcd.png` ← https://lh3.googleusercontent.com/zju3SaKNZtIg8oswdNqjqbU2pgzAazbfcyzRL_wo1UneMQSp9D6yIVFbPDeEtmh09MwYuYYHofz5

## [guidelines] illustrations

- `e80791b26d69bf4c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fueyh1-01.
- `dd6eef2849ed52b9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuf9qz-03.
- `666834168b3a176e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fufhuq-04.
- `f01878714bf22dc8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fug0sy-05.
- `a707b7084faf9507.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fugb5b-06.
- `ff3567149ae0bf17.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuh0i5-08.
- `5f880bc29dc2b05c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuh7km-09.
- `66c75510bd53cf9f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuhrl8-11.
- `102c3bb919fdc329.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuhyto-12.
- `e646bea829d6c1f5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuicr9-13.
- `56e9bd666b1bfd12.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fujiob-14.
- `4c7ff7c6061b410d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fujt7v-15.
- `b005ce5517158ed1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fujxyu-16.
- `1acbe99139db05a2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuk4ze-17.
- `0d19167adb01cc52.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fukavr-18.
- `4baac8524765f8bd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fukhnw-19.
- `df9d238855059aa4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fune8p-20.
- `70ddb1a111b00b5c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0funlrw-21.
- `ff1fca6b00443a9e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0funqlw-22.
- `acbf3a60162ce13b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuomdi-23.
- `206d31762be45708.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuouq0-24.
- `1c00d6f214db9eaf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fupcvd-26.
- `4e37ddbdc4a6c524.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fvmjbe-L%2
- `dcbc4915d3873924.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0gtjndl-K%2
- `2712b317ccf636ae.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm5v1vvd7-J%2

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fvmjbe-L%20-%20NAV%20Selection`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0gtjndl-K%20-%20Side%20Scroll%2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm5v1vvd7-J%20-%20Scrolling%20REN`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalqalnw-GM3_Expressive_Nav-Rail`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmbs2jj48-GM3_Expressive_Nav-Rail`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmapifi58-GM3_Expressive_Nav-Rail_Guidelines_Pre`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmapifwv9-GM3_Expressive_Nav-Rail_Guidelines_32_`

## [accessibility] illustrations

- `5e9239550c6bc3a9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fut28q-04.
- `86b06fb581b6e2fa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fut791-05.
- `0e0476725ca48360.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0futkj8-07.
- `77016bc8267bea62.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0futowb-08.
- `9c231eca994a2e94.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0futxf6-09.
- `b9db88a706a842aa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fuvxlx-11.
- `0adaaba625c34eea.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fv1bxc-10.
- `7f54e0dd7ea0145b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0gud02c-03-
- `c3f7d979fc663de7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0guemtv-01-
- `128ac7e09c888024.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0guep9g-02-
- `0bcead983253e955.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2kvazns-09.
- `84a7846cd07048e5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm36brxfu-04.
- `874f5356df18c83f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm36bs1jw-05.
- `576869bdce5df1a1.png` ← https://lh3.googleusercontent.com/KqqwKGiGfJCWHJWGsrQHkJBLSbY73iXVlD9VhRbarTDDCbN870mBCFyDm9F8zqx8DeREGmWfa8mG
