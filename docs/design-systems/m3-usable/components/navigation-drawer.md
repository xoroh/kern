# M3 component: navigation-drawer

_Archive: `m3-archive/spec/components/navigation-drawer/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/navigation-drawer/…_

## Overview (full text)

Navigation drawer – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 star Note: The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an expanded navigation rail , which has mostly the same functionality of the navigation drawer and adapts better across breakpoints. Use standard navigation drawers in
 expanded
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 ,
 large
 Window widths 1200dp to 1599dp, such as desktop.
 More on large breakpoints
 , and
 extra-large breakpoints
 Window widths 1600dp and larger, such as ultra-wide monitors.
 More on extra-large breakpoints
 Use modal navigation drawers in
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 and
 medium breakpoints
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 Can be open or closed by default Two variants: standard and modal Put the most frequent destinations at the top and group related destinations together Standard navigation drawer Modal navigation drawer Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Unavailable Close M3 Expressive update May 2025 The navigation drawer is no longer recommended. Use the
 expanded navigation rail
 Expanded navigation rails show text labels and an extended FAB, and can be default or modal.
 More on navigation rails
 instead. More on M3 Expressive Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Variants: Distinguishes two separate variants of navigation drawer: Standard and modal Shape: Rounded corners at the ending edge of the drawer
 States
 States show the interaction status of a component or UI element.
 More on states
 : Updated color and shape for indicating selected state M2: Navigation drawer had square corners and a rectangular shape indicating the active destination M3: Navigation drawer has rounded corners, new color mappings, and an updated style for indicating the active destination

## Key measurements (dp, extracted)

- Window widths 840dp to 1199dp, such as a tablet or foldable
- Window widths 1200dp to 1599dp, such as desktop.
- Window widths 1600dp and larger, such as ultra-wide monitors
- Window widths smaller than 600dp, such as a phone in portrait orientatio
- Window widths from 600dp to 839dp, such as a tablet or foldable
- rgins Attribute Value Container height 100% Container width 360dp Container shape 0,16,16,0dp corner radi
- i Icon size 24dp Active indicator height 56dp Active ind
- icator shape 28dp Active indicator width 336dp Horizontal
- label alignment Start-aligned Left padding 28dp Right padding 28dp Active indicator pad
- ding 12dp Padding between elements 0dp Modal navi
- rgins Attribute Value Container height 100% Container width 360dp Icon size 24dp Active indicator height
- 56dp Active indicator shape 28dp Active indi
- cator width 336dp Horizontal label alignment Start-aligne
- d Left padding 28dp Right padding 28dp Active indicator pad
- ding 12dp Padding between elements 0dp

## Accessibility (full text)

Navigation drawer – Material Design 3
 Use cases Interaction & style Initial focus Closing Visual indicators Keyboard navigation Labeling elements star Note: The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an expanded navigation rail , which has mostly the same functionality of the navigation drawer and adapts better across window size classes. Use cases Users should be able to: Move between navigation destinations with assistive technology Select a particular navigation destination from a set Get appropriate feedback based on
 input
 Device inputs provide interactive control of an app. Common inputs include a mouse, keyboard, and touchpad.
 More on inputs
 type Interaction & style Touch When a navigation item is tapped, the active indicator appears in place, providing feedback to the user that it is selected A touch ripple passes through the indicator The icon switches from outlined to filled The icon changes color, becoming darker pause Touch: Tap Cursor When hovered, the
 hover
 A hover state communicates when a user has placed a cursor above an interactive element.
 More on hover state
 indicator appears providing a visual cue that the destination is interactive When clicked, a ripple passes through the indicator The icon switches from outlined to filled The icon changes color, becoming darker in light theme and lighter in dark theme, to increase the contrast pause Cursor: Hover, Click Initial focus Initial focus lands directly on the first navigation item, since that is the first interactive element of the component. Focus lands on first navigation item Closing The modal navigation drawer can be dismissed by selecting the scrim that covers the rest of the screen. Select the scrim to close the navigation drawer Visual indicators Icons are the primary focus of the navigation and such give the dominant cue of its
 state
 States show the interaction status of a component or UI element.
 More on states
 . Use a filled icon for the selected destination to differentiate from the outlined icons of non-selected destinations. The navigation item is selected via Space / Enter check Do Use a filled icon for the selected navigation destination to differentiate from the other destinations close Don’t Avoid keeping the icon style for the selected navigation destination the same as unselected destination's icons. This removes an important visual indicator of which destination is active. When selected, the icon fills, darkens in light theme (or lightens in dark theme), and is backed by an active indicator shape Keyboard navigation Keys Actions Tab Focus lands on the first navigation destination Space or Enter Selects the
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 navigation destination, and focus moves to the newly opened section (if applicable) Arrow Navigate between destinations within the navigation drawer Labeling elements The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 label for a navigation item is typically the same as the destination name. If the UI text is correctly linked, assistive tech (such as a screenreader) will read the UI text followed by the component’s role. For Android Views (MDC-Android), a more descriptive accessibility label is not available to be set and the role is not announced. A navigation drawer’s accessibility label can incorporate its adjacent UI text When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a navigation destination visibly labeled Recents would benefit from additional information in its accessibility label to clarify the destination’s intent. While the visible label text reads Recents, the accessibility label for this destination clarifies its function: Recent images

## Specs (full text)

Navigation drawer – Material Design 3
 Tokens & specs Color States Measurements star Note: The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an expanded navigation rail , which has mostly the same functionality of the navigation drawer and adapts better across breakpoints. Container Headline Label text Active indicator Badge label text Scrim Icon Tokens & specs The navigation drawer has one token set. Learn about design tokens Navigation drawers (baseline) arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Navigation drawer color roles used for light and dark schemes: Surface container low On surface variant On secondary container On secondary container Secondary container On secondary container On surface variant On surface variant Scrim For divider color roles, go to divider specs . States
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Navigation drawer states: Enabled Hovered Focused Pressed State specs are in the tokens module above Measurements Standard navigation drawer Element size measurements Padding and margins Attribute Value Container height 100% Container width 360dp Container shape 0,16,16,0dp corner radii Icon size 24dp Active indicator height 56dp Active indicator shape 28dp Active indicator width 336dp Horizontal label alignment Start-aligned Left padding 28dp Right padding 28dp Active indicator padding 12dp Padding between elements 0dp Modal navigation drawer Element size measurements Padding and margins Attribute Value Container height 100% Container width 360dp Icon size 24dp Active indicator height 56dp Active indicator shape 28dp Active indicator width 336dp Horizontal label alignment Start-aligned Left padding 28dp Right padding 28dp Active indicator padding 12dp Padding between elements 0dp

## Guidelines (full text)

Navigation drawer – Material Design 3
 Usage Anatomy Responsive layout Behavior star Note: The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an expanded navigation rail , which has mostly the same functionality of the navigation drawer and adapts better across breakpoints. Usage Navigation drawers provide access to destinations and app functionality, such as switching accounts. They can either be permanently on-screen or opened and closed by a navigation
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 icon. One navigation destination is always active. Navigation drawers are recommended for: Apps with 5 or more top-level destinations Apps with 2 or more levels of navigation hierarchy Quick navigation between unrelated destinations Replacing the
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 or
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 on large screens check Do Use a navigation drawer for 5 or more primary destinations, or more than 1 level of navigation hierarchy Avoid using a navigation drawer with other primary navigation components, such as a navigation bar. Instead, choose a single navigation component based on product requirements and breakpoints:
 Navigation bars
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 for
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 Navigation rails
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 for
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 Standard navigation drawers for expanded,
 large
 Window widths 1200dp to 1599dp, such as desktop.
 More on large breakpoints
 and
 extra-large
 Window widths 1600dp and larger, such as ultra-wide monitors.
 More on extra-large breakpoints
 breakpoints exclamation Caution Avoid using two navigation components on the same screen There are two variants of navigation drawers: Standard navigation drawer Modal navigation drawer Standard navigation drawer Modal navigation drawer Standard navigation drawer Standard navigation drawers provide access to drawer destinations and app content for
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 in
 expanded
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 ,
 large
 Window widths 1200dp to 1599dp, such as desktop.
 More on large breakpoints
 , and
 extra-large
 Window widths 1600dp and larger, such as ultra-wide monitors.
 More on extra-large breakpoints
 breakpoints. Standard drawers can be permanently visible (best for frequently switching destinations) or opened and closed by tapping a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 icon (best for focusing more on screen content). In
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , use modal drawers instead. Standard navigation drawer providing access to drawer destinations next to app content Modal navigation drawer Modal navigation drawers use a scrim to block interaction with the rest of an app’s content, and don’t affect the screen’s
 layout
 Layout is the visual arrangement of elements on the screen.
 More on layout
 grid. Modal navigation drawers can be used in any breakpoint, but are primarily used in compact and medium sizes where space is limited or prioritized for app content. They can be swapped with standard drawers on expanded,
 large
 Window widths 1200dp to 1599dp, such as desktop.
 More on large breakpoints
 , and
 extra-large
 Window widths 1600dp and larger, such as ultra-wide monitors.
 More on extra-large breakpoints
 breakpoints. Modal navigation drawer using a scrim to block interaction with the rest of an app’s content Modal navigation drawers are always opened by an action outside of the drawer, such as clicking a navigation
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 icon in a
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 . Modal drawers can be dismissed by: Selecting a drawer item Tapping the scrim Swiping toward the drawer’s anchoring edge (for example, swiping right-to-left for a left-aligned navigation drawer) A modal drawer opened by an action such as clicking a navigation menu icon (1) Modal drawers can be dismissed by tapping the scrim or swiping the drawer toward its anchoring screen edge. 1. Dismiss by tapping the scrim 2. Dismiss by swiping the drawer Anatomy Navigation drawers are essentially a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 contained within a
 side sheet
 Side sheets show secondary content anchored to the side of the screen.
 More on side sheets
 . They can also include headers, subheads, and
 dividers
 Dividers are thin lines that group content in lists or other containers.
 More on dividers
 to organize longer lists. Navigation drawers can include headers, subheads, and dividers to organize longer lists Active Indicator Icon Label Badge label Sheet Divider Section label (optional) Scrim Sheet A sheet holds all navigation drawer elements.
 Side sheets
 Side sheets show secondary content anchored to the side of the screen.
 More on side sheets
 are used as the container for standard and modal navigation drawers. Navigation drawers that open from the side are always placed on the start edge of the screen, on the left for left-to-right (LTR) languages, and on the right for right-to-left (RTL) languages. check Do A navigation drawer opens from the left side of the screen for left-to-right languages Divider (optional)
 Dividers
 Dividers are thin lines that group content in lists or other containers.
 More on dividers
 can be used to separate groups of destinations within the navigation drawer. check Do Use full-width dividers (1) to separate groups of destinations close Don’t Don’t use dividers to separate individual destinations Active indicator The active indicator is a background shape communicating which destination of the navigation drawer is currently being displayed. The active indicator (1) is a background shape communicating which destination of the navigation drawer is currently being displayed Label text and icons Destinations in a navigation drawer take the form of actionable
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 items. Each item describes its destination using label text and an optional icon. Actionable list items in a navigation drawer describe each destination using (1) an optional icon and (2) required label text Label text should be clear and short enough that it isn’t cut off by the sheet. Navigation drawers can use text labels without icons check Do Keep text labels concise, but truncate them if they extend beyond the container width close Don’t Don’t wrap label text close Don’t Don’t shrink text size in order to fit a text label on a single line Icons can supplement labels as indicators of a destination. When used, they should always be placed before text. Other app components and content should reference these icons. check Do Use recognizable icons when conventions exist close Don’t Don’t apply icons to some destinations and not others. Icons should be used for all destinations, or none. Section label (optional) Short subhead section labels can help group related destinations in the navigation drawer. Related destinations can be grouped using short subhead section labels in the navigation drawer Scrim (modal only) Modal navigation drawers use a scrim to block interaction with the rest of the app. The scrim is placed directly behind the drawer’s sheet and can be tapped or clicked to dismiss the drawer. Scrim applied behind a modal navigation drawer Responsive layout A product’s navigation component should change to suit the
 breakpoint
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 and form factor of the screen. Modal navigation drawers can be used at any breakpoint but are most common in
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 and
 medium breakpoints
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 . Standard navigation drawers are best for
 expanded
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 ,
 large
 Window widths 1200dp to 1599dp, such as desktop.
 More on large breakpoints
 , and
 extra-large
 Window widths 1600dp and larger, such as ultra-wide monitors.
 More on extra-large breakpoints
 breakpoints. Use a transition when swapping components. For example, when switching from a portrait to landscape
 layout
 Layout is the visual arrangement of elements on the screen.
 More on layout
 , the
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 should transform into a navigation drawer. Standard navigation drawers change size to suit the device’s screen Compact breakpoint Use modal navigation drawers in
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 . Or swap the drawer for a navigation bar. On web, when the screen size is smaller than 320
 CSS pixels
 CSS pixels are the most common unit of measurement when developing for the web.
 More on CSS pixels
 , swap the navigation drawer for a navigation bar to ensure
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 . Use a modal navigation drawer on mobile screens Medium & expanded breakpoints Use a modal navigation drawer alone or with a navigation rail on
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 expanded
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 breakpoints. When a
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 and modal navigation drawer are used together, the drawer can repeat destinations in the navigation rail as long as the drawer offers enough visual separation between levels of the navigation hierarchy. A standard navigation drawer can be used in single pane layouts in expanded breakpoints. pause Use a navigation rail on tablet screens, or also allow a drawer to open and close via a menu icon Large and extra-large breakpoints For web experiences on laptop and desktop devices, use either a standard navigation drawer, or a
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 that transitions into a modal navigation drawer. Use a standard navigation drawer on large and desktop screens Behavior Scrolling Navigation drawers can be vertically scrolled, independent of the rest of the screen’s content and UI. If the
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 of navigation destinations is longer than the height of the drawer, the drawer’s contents can be scrolled within the drawer. pause When a navigation drawer is scrolled, the body content should remain stationary Visibility Dismissible standard drawers can be used for
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 that prioritize content (such as a photo gallery) or for apps where users are unlikely to switch destinations often. They should use a visible navigation
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 icon to open and close the drawer. A standard dismissible navigation drawer is opened and closed by tapping the navigation menu icon in the app bar (1), and remains open until the menu icon is tapped again (2) Permanently visible standard drawers allow quick navigation between unrelated destinations. They can’t be closed or dismissed by the user. A permanently-visible standard navigation drawer on desktop Appearing When a navigation drawer animates on screen, it uses an enter and exit transition pattern. pause A navigation drawer animating on screen

## [overview] illustrations

- `80fc7e1dd6c67ada.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fldox2g48-nav
- `3d980077acedd925.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoorr6v-1.p
- `8ba9ead5744cc5d7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flzdbjtd0-4.p
- `15474276779b9dd7.png` ← https://lh3.googleusercontent.com/KW-2sMX9xpyX8ebSlKw431RiEykFgS90SJms8kfWusCoMrEaQMYNyytsHlCAZVoWS8jUjUOA-IRn

## [specs] illustrations

- `f0ac8d1bdc0d83a1.png` ← https://lh3.googleusercontent.com/0b273CFdNyDt3yEDRLSSICnKHb8rktNAiXmruD2EO82_S9iBxGsq08CPpYTupKoj0SRnuaNR0fo8
- `438879b1905a5ddd.png` ← https://lh3.googleusercontent.com/2T9NqmBF4mES5SgaRMeuXBm0CXnjDhysHSNKT1lr_iIEUZKCbKtRtIXvzyFbVR8RnSZ17O4sK483
- `133956625a311867.png` ← https://lh3.googleusercontent.com/EFOoVjwBffIgl-Gs07m2W5WiNu8brQ2paefKx_U_eQexLGySjgLV_C9FYD7wkTs0o7j3_RvrcTcq
- `15474276779b9dd7.png` ← https://lh3.googleusercontent.com/KW-2sMX9xpyX8ebSlKw431RiEykFgS90SJms8kfWusCoMrEaQMYNyytsHlCAZVoWS8jUjUOA-IRn
- `fed13fc836778396.png` ← https://lh3.googleusercontent.com/bHQAcDd4Vluh3tirhRwnej1hWyUij6O-bjAclp-H5fmSqLHDanyQZsk-RQCLJtCnVYQhYeN1DM4G
- `a4f2361c5dad2739.png` ← https://lh3.googleusercontent.com/invVA4iDTyiHnbFHAMhycwQRAZds3tEMmOOPGaiv1HnriGnDeAV4MSXpQ9gOcnALm0eQcxgml_hz
- `b9f93848618130d5.png` ← https://lh3.googleusercontent.com/wzWoGqZcYHmlxmZaJ6h1mIIrnKAN6-ORvn-bAgZGnzVfSFw35XvFKnVMZ6aKAqVtw5sMblQfd0dN
- `0cfb0370bc5df660.png` ← https://lh3.googleusercontent.com/xCUslUMH4a9wLA0cXIbv622e8KMYHe0R5TPMmzjG0lFKP2hX6vjQcnKVFwxI9HIdk1z3y6BR65wF

## [guidelines] illustrations

- `88cadce1f2e347f0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopun3e-1.p
- `7fd2cdb1054024d5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopv1qw-2.p
- `6765f7fa611b3832.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopvjco-3.p
- `c67e6aefe92d1409.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopw575-4.p
- `f247f6d3fb2ed6d0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopwhen-5.p
- `377920079be48eea.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopx4a0-6.p
- `5f849d8877b6bb13.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopxvvj-7.p
- `35d755fb7fb69cdf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopy7b1-8.p
- `0cfce10dba45f0b1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopyjta-9.p
- `8b38d8660b02e93b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwopzqbr-10.
- `33c2f84dd78ddabf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq08ti-11.
- `bef11c3d50b7be2a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq1xf0-12.
- `f27fe1a092715ca2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq29df-13.
- `9fc2d6182399becc.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq2qbs-14.
- `13fba0ba19c409fb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq358i-15.
- `7258cf1d4db523ec.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq3i6v-16.
- `16a789e531ef6e93.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq4gjj-17.
- `f413d34542f9d554.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq4tkk-18.
- `9f229978aa72d4e9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq56gb-19.
- `6efff12487d59643.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq67nf-20.
- `48bb3c36f650e829.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq6mto-21.
- `88efcbeaf9fe83b9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq710s-22.
- `a7df10b22939c435.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq7esu-23.
- `c9b010da9faf6531.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq7wck-24.
- `af052c8d417f8e30.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoq8evf-25.

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoqh0d1-GM3-Components-NavDrawe`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoqihhy-GM3-Components-NavDrawe`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoqk3j4-GM3-Components-NavDrawe`

## [accessibility] illustrations

- `cbc5adfbf6d21f40.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoqqvsf-GM3
- `c43370ded4434147.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoqr8nd-GM3
- `1140ec97cd3a0f8a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flworf9hl-3.p
- `a17c8eea8657b815.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flworfw7l-5.p
- `f47443e59458db04.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flworg85u-6.p
- `7835d262e319f7ff.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flworgt4a-4.p
- `8c08fa7a2111d1b6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flworh5ui-7.p
- `7f1057e612016111.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flworho52-8.p
- `05fa1c78236a2c6a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwori08q-9.p
- `c76edc891594c9e2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm36co6ff-nav
- `15474276779b9dd7.png` ← https://lh3.googleusercontent.com/KW-2sMX9xpyX8ebSlKw431RiEykFgS90SJms8kfWusCoMrEaQMYNyytsHlCAZVoWS8jUjUOA-IRn

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoqqvsf-GM3-Components-NavDrawe`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwoqr8nd-GM3-Components-NavDrawe`
