# M3 component: fab-menu

_Archive: `m3-archive/spec/components/fab-menu/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/fab-menu/…_

## Overview (full text)

FAB menu - Material Design 3
 Availability & resources M3 Expressive update Differences from M2 Opens from a
 FAB
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 to show 2–6 related actions floating on screen One FAB menu size for all sizes of FABs Not used with
 extended FABs
 Extended floating action buttons (extended FABs) help people take primary actions.
 More on extended FABs
 Available in primary, secondary, and tertiary color sets The FAB menu comes in three color sets: primary, secondary, tertiary Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation android Jetpack Compose: Expressive Available android Android Views (MDC-Android): Expressive Unavailable language Web: Expressive Unavailable Close M3 Expressive update May 2025 The FAB menu adds more options to the FAB. It should replace the speed dial and any usage of stacked small FABs. More on M3 Expressive New component added to catalog : One menu size that pairs with any FAB Replaces any usage of stacked small FABs Color: Contrasting close button and item colors Supports dynamic color Compatible with any FAB color style The FAB menu uses contrasting color and large items to focus attention. It can open from any size FAB. Differences from M2 M2: The speed dial used small round FABs M3: The FAB menu uses dynamic color and a larger item size

## Key measurements (dp, extracted)

- specs. The close button should always be 56dp. FAB menu size measurements The FAB men
- AB to ensure a smooth animation. The FAB should always have 16dp margins The close button and FAB share
- ith larger margins underneath. The medium FAB placement has 16dp margins The close button is placed high
- with the top of the medium FAB The large FAB placement has 16dp margins The close button is placed high
- component. The gap between the FAB and menu can vary, but 4dp is recommended. Spacing and interaction
- windows, the FAB and FAB menu margins should increase from 16dp to 24dp. On desktop, use larger FABs an
- n & style FAB menu elements meet the minimum target size of 48dp. FAB menus have 48x48dp minimum width a

## Accessibility (full text)

FAB menu - Material Design 3
 Use cases Interaction & style Initial focus Keyboard navigation Labeling elements Use cases People should be able to do the following using assistive technology: Navigate and interact with the FAB menu Ensure focus is correct when navigating through the menu Interaction & style FAB menu elements meet the minimum target size of 48dp. FAB menus have 48x48dp minimum width and sufficient spacing by default When the FAB menu can scroll, make sure the items scroll behind the close button. The close button should always be easy to access and unobstructed. check Do Allow the menu items to scroll behind the close button close Don’t Don’t obstruct the close button in short screens like horizontal orientation Initial focus When the FAB is selected, the FAB menu opens, and initial focus remains on the close button, which takes the place of the original FAB. Then the focus moves from the top menu item to the bottom. Focus lands on the close button. People can then navigate through all the items. Close button First menu item Second menu item Third menu item Keyboard navigation Keys Actions Tab Navigate to the next interactive element Space or Enter Activate the focused button or item Labeling elements Android On Android, a FAB menu’s close button should include a state to tell screen readers what action will occur when it's toggled. The close button should be labeled: Label: Toggle menu Role: Button State: Expanded or collapsed On Android, the close button accessibility labels should include a toggle menu label, button role, and an expanded or collapsed state FAB menu items should be labeled: Label: Match the item’s UI text, such as Reply all Role: Button Label FAB menu items to match their UI text, like Reply all , and use the button role Web On web, a FAB menu is a combination of a
 FAB
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 and a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 component. The FAB opens the menu. Follow the accessibility guidelines for FABs and menus . The FAB's accessibility label should describe the menu that the FAB will open.

## Specs (full text)

FAB menu - Material Design 3
 Variants Configurations Tokens & specs Anatomy Color States Measurements Variants There’s one variant of FAB menu Variant M3 M3 Expressive FAB menu -- Available Configurations Three color sets: Primary Secondary Tertiary Category Configuration M3 M3 Expressive Color Primary set, secondary set, tertiary set -- Available Tokens & specs Use the table's menu to switch token sets. The FAB menu has a common token set and six color sets, three for each element (close button and menu item). Learn about design tokens FAB menu - Common arrow_drop_down search expand_all folder Close button keyboard_arrow_down folder List item keyboard_arrow_down Close Anatomy Close button Menu item The FAB menu can have up to six items Color Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. Learn more about design tokens On primary container Primary container On primary Primary On secondary container Secondary container On secondary Secondary On tertiary container Tertiary container On tertiary Tertiary States States are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Close button Close button states in light and dark themes: Enabled Hovered Focused Pressed Menu item Menu item states in light and dark themes: Enabled Hovered Focused Pressed Measurements FAB menu items share the same measurements as the medium
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 specs. The close button should always be 56dp. FAB menu size measurements The FAB menu animates from the top trailing edge of the FAB to ensure a smooth animation. The FAB should always have 16dp margins The close button and FAB share the top trailing corner as an anchor and appear in the same place Larger FABs will place the FAB menu slightly higher, with larger margins underneath. The medium FAB placement has 16dp margins The close button is placed higher to align with the top of the medium FAB The large FAB placement has 16dp margins The close button is placed higher to align with the top of the large FAB On web, the FAB menu opens from the FAB, and inherits its states and specs from the baseline
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 component. The gap between the FAB and menu can vary, but 4dp is recommended. Spacing and interaction on FAB menu for web: Enabled Hovered Selected

## Guidelines (full text)

FAB menu - Material Design 3
 Usage Anatomy Adaptive layout Behavior Use the FAB menu to show multiple related actions in a prominent, expressive style Usage A FAB menu opens from a FAB to show multiple related actions. It should always appear in the same place as the FAB that opened it. This makes actions immediately accessible, and keeps the UI clean by concealing actions when they’re not needed. Don’t open a FAB menu from an
 extended FAB
 Extended floating action buttons (extended FABs) help people take primary actions.
 More on extended FABs
 or any other component. The FAB menu should always open from a FAB The FAB menu should be aligned to the trailing edge of the window. In right-to-left (RTL) languages, this means the FAB and FAB menu should be aligned to the left edge, and the layout of elements should be mirrored. In RTL languages, the FAB menu should be left-aligned with the icon and text placement mirrored FAB menus can contain 2–6 items. These should be closely related under a single action, like Share . Avoid grouping unrelated actions in the same FAB menu. check Do FAB menus can have 2-6 items close Don’t Don’t use a FAB menu with one item When a FAB is paired with other components, like the
 floating toolbar
 Floating toolbars float on top of page content and can provide contextual, dynamic actions.
 More on toolbars
 or
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 , don’t use the FAB menu. This prevents cognitive overload and interface clutter. check Do FABs can be placed next to toolbars and other components close Don’t Don't use a FAB menu with a toolbar or navigation rail Color sets FAB menus have three color sets: primary, secondary, and tertiary. Use the color set that best matches the FAB color style.    Use the primary FAB menu color set with the primary or primary container FAB color styles. A primary FAB is paired with a primary FAB menu Use the secondary FAB menu color set with the secondary or secondary container FAB color styles. A secondary FAB is paired with a secondary FAB menu Use the tertiary FAB menu color set with the tertiary or tertiary container FAB color styles. A tertiary FAB is paired with a tertiary FAB menu Anatomy Close button List item FAB menu items should always have label text. The icons shouldn’t be removed since they make each item easy to identify. exclamation Caution Only remove the icon if necessary. The icon provides a differentiation between items. close Don’t Don’t remove the label The list item should always hug its contents and look consistent. Avoid truncating text or setting fixed widths. All FAB menu elements should be rounded. check Do Keep the padding between the container and icon, icon and text, and text and container consistent close Don’t Don’t expand container sizes close Don’t Don’t change FAB menu shapes Adaptive layout The FAB menu can open from any sized
 FAB
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 . Use with a FAB size suitable for the window size class. For example, larger FABs are recommended for larger windows. pause The FAB menu works in any window size. Pair it with the FAB suitable for that window size. The FAB menu should remain anchored to the same corner or edge regardless of window size. In large and extra large windows, the FAB and FAB menu margins should increase from 16dp to 24dp. On desktop, use larger FABs and margins On web, the FAB menu uses a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 component for an experience that's consistent with other desktop apps. The same FAB menu options on both large window (left) and an Android compact window (right) Behavior Appearing The FAB should transform into the close button of the FAB menu. The menu items should appear using the enter and exit transition. Originate the transition from one of the FAB's trailing corners, preferably the top-aligned corner. pause Animate FAB menus from the top-aligned corner of FABs To ensure accessibility for keyboard users on the web, avoid positioning the FAB menu to completely obscure the focus indicator of an actionable element. Partially covering the desired element is fine, as long as the focus indicator is visible. check Do Ensure the actionable element and its focus indicator are visible behind the FAB menu close Don’t Don’t block an actionable element and its focus indicator completely with the FAB menu Scrolling When window height is limited, like when viewing phones in horizontal orientation, FAB menu items can scroll. The items should scroll behind the close button. pause FAB menus can scroll if the window height is too short to contain all the options Expanding Any FAB menu item can expand and adapt to any shape using a container transform transition pattern. This includes a surface that is part of the app structure, or a surface that spans the entire screen. pause FAB menu items can transition into any kind of shape when selected

## [overview] illustrations

- `b607f6222747d473.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0aj37mw-01.
- `4fea8fecc089bb22.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0aj3ip6-02.
- `bddb57a342a31ca4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0aj3w24-Dif
- `17a17538d82a2d0c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0aj42vs-Dif
- `04df96012fa2b99d.png` ← https://lh3.googleusercontent.com/KhRPygbtGBcZarqJE05zq9z1P3CwNUdN_lQQ2zP8AqXIVBK3zS216BhpCAU7gCstvITnD9KZOwrz

## [specs] illustrations

- `7c991fd52e4fa8a4.png` ← https://lh3.googleusercontent.com/6K5OibGh_d83LTRduhambKrHPD8JMVCHm19eHlen8e58fVWnoLyh8wWGZyLrdCPSO8Q3m01icndN
- `bd8ae5caa152b69d.png` ← https://lh3.googleusercontent.com/CsC2u7L3QL6svcrFzmZM2foCzJxzUjF93lwZuZ-oJW7RK-lKsp4Ei0iNdLiNhbFST2y9U34PClKa
- `efdbe8470953ba0f.png` ← https://lh3.googleusercontent.com/EvVSXxIPCIQmi5H_Tf238AlVWE4QCT1NNKDXE9IYMtRbF3FF7S-t0Y_sxaQ1dCGsRSQGM6EkWT2L
- `77db9248f95902f8.png` ← https://lh3.googleusercontent.com/GHST3WLAtYjpsKWjXfoTtSy1pybwjIFPYgrw1GBjynLRHHSxmZWT-t8VhnSMGbOvYWG0O65po5ce
- `c566603dbc8b3ae0.png` ← https://lh3.googleusercontent.com/HWYLNxfsd_aBEZRMazrMRxUthRgVqeA8_evmV1IZrkKg878uq7DK0dg5EZaR8q7n-QP_kLrEaYAL
- `393a762ae4d4ce35.png` ← https://lh3.googleusercontent.com/IBxWcDPavbWf55MsedxQZnCouJM3OZfbOudsfZQNrILcXhsyU_EI9iIEZ1UeKo-BwB7btsT0_0ZA
- `33a4050a144a7b4b.png` ← https://lh3.googleusercontent.com/KIWWfbv6JG0LIK8rzUSHcalH5BrNbW8_o8_U3uLqVkUDcdZNw4VS_nwoQ33DaomQXt95s6R_EY49
- `04df96012fa2b99d.png` ← https://lh3.googleusercontent.com/KhRPygbtGBcZarqJE05zq9z1P3CwNUdN_lQQ2zP8AqXIVBK3zS216BhpCAU7gCstvITnD9KZOwrz
- `6b20188ffe6f3be5.png` ← https://lh3.googleusercontent.com/WhBYTHZseZ9EfjdiU3CqPLeEC36wFENc3fV_9h5eR9T5ze6ooQya6w3-f1JWj7bBOkJnQHFL3Lpb
- `0d33801ffcd18a62.png` ← https://lh3.googleusercontent.com/_9hh4PDq9vnfiJ2AAOX8VKeIFe9De47Av_acmKjjFbTkWQOGjZTLOqGY5cWqLsxkDLWjG4bgquVe
- `01b13585ee937cf9.png` ← https://lh3.googleusercontent.com/aEJrDU0HXKoBxMGFWOq1I7O6QB2fl6EPJGEDSP0L7CVDgvAjMdaM_LX10txGb1GDquvp0R-IiszO
- `42b5a753037a5ba2.png` ← https://lh3.googleusercontent.com/gce3Kgv0OcZSOCiWq672oYOzAE9YJhGCC0oGLAcdxJ59BPnVhlV3HdjJPyrHiJy1LgUNnQkTKyOc
- `f5fcc7f3ab906ba5.png` ← https://lh3.googleusercontent.com/kfovl3xRwL77xd7_XYJlFsLMybMdv16Nd0U9T5f87iZTyW3lo8gU72nkr81ZLumjSbxXIYnkvJX7
- `6f789d163bed2001.png` ← https://lh3.googleusercontent.com/tZxH6WCjbJBIqPlpd4_nt_npacUlh9WWyrIqJWs6Z1BCdGKbGFPt_BaW0CrG9HHNVQzBFYxxGU4h
- `b41a1cb02593b982.png` ← https://lh3.googleusercontent.com/ysJ9Ea896_EYwed_YofScZMv_HuE8BH4IJVkWyw4v2Xw-KInaEtXmOyWaaQNTTAZw0oLB9neXbgO
- `41d54536338674f7.png` ← https://lh3.googleusercontent.com/zGkr1v4xtHihId5hAGO-4ESfqwzsweXE2xqXba2w8m0zl9Hswn3RWimV53apAvslPo7y0G2yrUch

## [guidelines] illustrations

- `c51e438806233b2c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0al2scq-01.
- `cd57a6d758bf6cd3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0al39xa-02.
- `ee28432e7d941e7d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0al3tfx-03.
- `30b464722a9c7be2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0al46l0-04.
- `7facfdb76dcf8378.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0al4jux-05.
- `7f4e837ada234110.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0al73q3-06.
- `047f1aabb2032289.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0al7run-07.
- `ba8f76df03193eb2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0al91ki-08.
- `991c29417092cc3c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0alljh0-09.
- `15168c95564107ac.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0almfyg-10.
- `978ee8c2b4c9a0b6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0alqq5m-11.
- `91e4201b2e97fbe8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0alqzgn-12.
- `2064033843aaf4d6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0alssof-14.
- `1199059202578787.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0alt3lp-15.
- `ed438cee2f6f8b56.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0altd3s-16.
- `397a09f52dda6668.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0alwg82-18.
- `e4cbbd8efd246707.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0feodak-13.
- `d694a0d43245139d.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fevuhp-FAB
- `09c3fe9eda40285a.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0few8ot-FAB
- `5fa22a894ae8e963.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm23g9t73-FAB
- `ff96f691ea84c6b8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4hkgdmm-21.
- `74dfdb5088f5b1bf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4hkgqnr-22.
- `23eef87b08312d6c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc0tzxol-GM3
- `57181daa2d6fcfe5.png` ← https://lh3.googleusercontent.com/JR39TV-vwPs6mYgmYNupLSLvGTNxo5S0wG8x-r0qVa89Q8qAGCVWxuhQLATpYedNHvIvXtfJrhfK
- `04df96012fa2b99d.png` ← https://lh3.googleusercontent.com/KhRPygbtGBcZarqJE05zq9z1P3CwNUdN_lQQ2zP8AqXIVBK3zS216BhpCAU7gCstvITnD9KZOwrz

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fevuhp-FAB-Menu-B.mp4?alt=medi`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0few8ot-FAB-Menu-C.mp4?alt=medi`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm23g9t73-FAB-Menu-A-1.mp4?alt=me`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc0tzxol-GM3_Expressive_FAB_Guid`

## [accessibility] illustrations

- `5c216e2875205885.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0am5xpn-01.
- `1a9f43852eaa7bb8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0am8l9a-02.
- `66814ec95e9f86c4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0am8ym2-03.
- `2ead33bfe7112872.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmaejeaf9-04.
- `9cb339eee81cf79f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmmmksaup-05.
- `9239226faf168bbb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmmmksh30-06.
- `04df96012fa2b99d.png` ← https://lh3.googleusercontent.com/KhRPygbtGBcZarqJE05zq9z1P3CwNUdN_lQQ2zP8AqXIVBK3zS216BhpCAU7gCstvITnD9KZOwrz
