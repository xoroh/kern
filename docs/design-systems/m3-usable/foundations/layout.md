# M3 foundations: layout

_Archive: `m3-archive/spec/foundations/layout/` (21 pages — full texts below)._ 

## foundations/layout/bidirectionality-rtl

Bidirectionality & RTL – Material Design 3
 Mirroring Text rendering Icons & symbols Time Canonical layout examples Component examples Swipe gestures Over 2 billion people read and write in right-to-left (RTL) languages like Arabic, Hebrew, Farsi, and Urdu. Layouts should support both left-to-right (LTR) and RTL languages through mirroring and other best practices to ensure content is easy for global audiences to understand and navigate. Consider the holistic experience including global writing , localizing voice and design principles for culturally appropriate icons . Material's components are built to support RTL, such as naming elements and tokens as "leading" and "trailing." However, extra configuration may be needed to achieve specific RTL situations. Mirroring When a layout is changed from LTR to RTL (or vice-versa), or flipped horizontally, it’s often called mirroring. UI elements and text that typically appear on the left in LTR aligns to the right. Reading flow starts from the top right corner, instead of the top left. Not all elements mirror with RTL languages. For example, graphs and charts maintain a LTR directionality for Persian and Urdu. A mirrored layout in an RTL language reverses the alignment and ordering of elements Text rendering Correct text rendering is foundational for a great user experience, and it’s critical for readability and usability. Text rendering has two parts: Alignment: How the edges of the text box are placed alongside other elements Directionality: How text and other elements flow within a text box, like left-to-right or right-to-left In RTL languages, text is usually right-aligned, and elements flow from right-to-left. Common issues with RTL language rendering are text entry, cursor position, punctuation, phone numbers, and URLs. Improperly rendering text in RTL languages can create cognitive overload and negatively impact user sentiment and trust. close Don’t Don't reverse the order of the email username and domain (@google.com). The domain should always be to the right of the username. Usernames can still be written RTL, with the cursor moving to the left. Note: This example isn’t translated to illustrate a common issue with text rendering. close Don’t Don’t apply LTR directionality to RTL content, because it may scramble word order. To ensure readability across all languages, the content should have both RTL alignment and directionality. Note: This example isn’t translated to illustrate a common issue with text rendering. Icons & symbols In RTL languages, directional UI icons, like back and forward, should be mirrored. However, in Hebrew, timelines and media controls on a page should retain left-to-right directionality. The meaning of icons and symbols can vary significantly across cultures. For additional guidance, refer to design principles for icons . Back and foward icons are mirrored in RTL Send buttons are mirrored in RTL. Help icons are mirrored in some RTL languages, like Urdu and Persian. Time Linear representations of time are often mirrored in RTL language experiences. Linear progress indicators should move from right to left for most RTL languages, except Hebrew where it should remain LTR. Circular representations of time remain the same. RTL linear progress indicator starts to fill progress from the right Circular progress indicators move clockwise Media players Media controls for video or audio players are always LTR. In Urdu, controls and progress for media and a podcast title are shown in LTR, while all other content is RTL Clocks For RTL languages, the directionality of time remains LTR, and clocks still turn clockwise. However, the AM/PM symbols for 12h clocks should be placed to the left. The 24-hour clock is often used in countries where the primary language isn’t English. Clock icons, circular refresh icons, and progress indicators with arrows pointing clockwise shouldn’t be mirrored. 24-hour clocks in RTL move clockwise, but mirror elements such as buttons 12-hour clocks in RTL move clockwise, but mirror UI elements such as AM/PM and buttons Canonical layout examples List-detail The list-detail layout : Is a single-pane at compact
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 , switching between list and detail views Divides the window into two side-by-side panes on large screens Is mirrored in RTL List-detail mirrored for RTL, where text and other elements are aligned to the right and flow from right to left Feed Use a feed layout to arrange content elements like cards in a configurable grid for quick, convenient viewing of a large amount of content. The feed layout is mirrored in RTL. Feed layout mirrored for RTL, where the order of text, grid, and other elements align to the right and flow from right to left Supporting pane Use the supporting pane layout to organize content into primary and secondary display areas. The supporting pane layout is mirrored in RTL. Supporting pane to the left of the primary content. Text and other elements within the pane are aligned to the right and flow from right to left. Component examples Badges Change the position and alignment of badges for RTL languages. Small badge appears on the top left of the icon Large badge appears on the top left of the icon Toolbars Toolbars provide actions related to the current page. For RTL languages, mirror the order of the tools. Mirrored floating toolbar, where the FAB appears on the left App bars App bars are placed at the top of the screen to help people navigate through a product: Mirror an app bar’s layout in RTL Flip appropriate icons, such as arrows RTL center-aligned, small app bars RTL medium, flexible app bar RTL large, flexible app bar Navigation rail The navigation rail is placed on the leading edge of the screen, on the left side for LTR, and on the right for RTL. Based on the language, a navigation rail is set on a screen’s leading edge: Right side for RTL languages Left side for LTR languages Expanded navigation rail Expanded navigation rails that open from the side are always placed on the leading edge of the screen, on the left for LTR languages, and on the right for RTL. RTL expanded navigation rails open from the leading edge and should include mirrored icons Text fields Icons in text fields are optional. Leading and trailing icons change their position based on LTR or RTL contexts. Icons, symbols, and label text for RTL: Icon signifier Valid or error icon Clear icon Voice input icon Dropdown icon Image Chips The leading icon of input chips can be an icon, logo, or circular image. The trailing icon is always aligned to the end side of the container. It’s placed on the right for LTR and on the left for RTL. Filter chips shown in an RTL layout. Note: This example is not translated to help illustrate mirroring. Swipe gestures Gestures are the ways people interact with UI elements using touch or body motion. People can navigate horizontally between peer views like tabs and to complete actions. RTL swiping and gestures should mirror their counterparts in LTR. If a product includes a delete icon revealed when swiped from the right for LTR languages, the same should be possible on the left for RTL languages.  Swiping reveals additional action in RTL list layout On Android, predictive back allows people to swipe left or right on the screen to go back or dismiss modal components. RTL predictive back features should mirror those found in a LTR context. pause The predictive back gesture should adjust for RTL languages

- `ccae7509b0ba01e6.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3l3v9p-GM3
- `3818fec266241a16.png` ← https://lh3.googleusercontent.com/1U-nHFdJxzu17VrF15b_140InoPHof7BeklNesALpU-DvyXkM8f7bP-t0gNVhC_NykZAGJhX315j
- `2a46c44dd23ee5e6.png` ← https://lh3.googleusercontent.com/3-tex9271iuyBH7y1kYRePlY5qW2WEXDag00pyBIZR1qPfwVL_sOjVMK1XbF-5cuFVZxw8_Ubf7_
- `6f476957260c49fd.png` ← https://lh3.googleusercontent.com/4UhQyg-neULcpAl8ueDg_qS_DmeIbWoMGfFrQFz-z6ePNZWCpGmLlfc0yFm_zJ2EXv84t2sMOBTW
- `92e465e3b1a6cdad.png` ← https://lh3.googleusercontent.com/7bXPlBNYMf6eu5JeDb4znscEjXxoaiFtisaLzKCORSaxEZXYMj2NCoh96x0V6Wk-gFKp6SIYCEwm
- `d671527f45da6251.png` ← https://lh3.googleusercontent.com/Cj3dR33eshqEQLZi7uUpXo6GIWl5Gqyjy1jXiuN4gba27J7z7Y9BF99mwyqnDjzmYsk2vuDrF1gu
- `3113c2131ec9a94d.png` ← https://lh3.googleusercontent.com/FK4JXpfD6VunHGYFTDR1KEIXq9PNyCxosIWw2MdMYDi0vKlaz1cmbk3mYSZoREr-Hc4Yud16BDdT
- `038189e67a23fa8c.png` ← https://lh3.googleusercontent.com/GvIIi9efFFifgSytQkM_LydZ9nagyoByO85kHfVyJHacgAAmCSEJfCUkJq69A4m4emhH0Icajp8d
- `823acbb911c351a0.png` ← https://lh3.googleusercontent.com/HKDWDsXNp_CJb84ZQEHNwuu-0oxpPLppPnaJ3o--ObAB4yVeU2kgQWlDryzjDuSgN9aOEaJD_NHP
- `7da2482a2b72a983.png` ← https://lh3.googleusercontent.com/JVlDFjXgPxdC_zdlgXhCZp49ZeyjAiDRVsACglR2IUEhVHPkJA_PlIndveJatddV_T_zwlTWN_IN
- `67af41f822249d61.png` ← https://lh3.googleusercontent.com/JhU530pRqL1O4OoAUKD8KzfKbTWTZ0ppUOZj3oKpLcg2kuBaZUjR9mu465H24RkNMdV11EITG38Q
- `ef80d907b40fa89c.png` ← https://lh3.googleusercontent.com/Mu7Bv9--8PIV0Ipxqn8cVeyO1Jb0SjSGgRw96abLHus4DhJ1bY56xeaT_P32YRxa12piY8d7EaAt
- `f0f00549ba4013ba.png` ← https://lh3.googleusercontent.com/N8FZIDMnkJ3weBDFn0JAV59SMdEjVb2CarDw0rvc-1HcelsLX67gFgp84kK3CfoVJuVrofnOUAPT
- `f85aa674cb5645bc.png` ← https://lh3.googleusercontent.com/NhwHSdtr5w_V2xLINEl8iHRTubLt8Y07M7LPH-I6FMVLPYpJAhWHJcUqv6svxL1sxdFjcj4Uu7q5
- `4c998b7eae99d9bf.png` ← https://lh3.googleusercontent.com/OcbxhQe0dc56YbktUpDHooMEAagt7sqqVp4e58ShtGfStoesFg0yUvuOJzMLoNAXe0Pt51oapqyt
- `a4caba3e328620be.png` ← https://lh3.googleusercontent.com/Wq16Adx940iD1dbLpZPHmNzXEXT4qYJALgLTyECNIPsEjGJvmakDWq3d2TKe4ui1OGnX41Dx7wX-
- `782933e853997400.png` ← https://lh3.googleusercontent.com/ZpQXQ588tQws77tpIHt4DazARMZVa-25ZbMGhT39qqfrD_LSARVYeC5QNZPWbE2M9K2O7OX2eDig
- `5fc0d49b41ba5af6.png` ← https://lh3.googleusercontent.com/g91ADNfx-kybwW9djnX_Bg0UgVl-GDlqK0oTZLyZx2K_TriXig4XZlZZMbo8eCE2gFNudXJg4N-W
- `c12dc174847edbd4.png` ← https://lh3.googleusercontent.com/lV7W9uPzT_HnFVhfZXBOhEO-XmWh6ZyboXsV3lO2ieRQJOGrdI7rhGG_ukjK0iqnZ10P5DBGLwMn
- `c364097693b48a0d.png` ← https://lh3.googleusercontent.com/mpn0hTVDPqfH-Bp9h3FZB4UuqaSuWelq_XMeIUfdhVztf7JYwTektgf-TAlKdl7LZlRm_lP7ZmbF
- `d9d9fbd358f72b36.png` ← https://lh3.googleusercontent.com/s6HIEi9IqqJ1FCd5-qqE4UXx8fyPymG4ac6GBJP--4aCUkk-1USxO5X5nojks0V99BBMsENc11m0
- `850db1110a435b1b.png` ← https://lh3.googleusercontent.com/tLzukatL9UErk2NIb17_gZki0BAQ-Zuopc4FaP9-rWXW2EMerWK-zxDClC9eQzQEq5BGsFjRkUU1
- `706cfe78629efb72.png` ← https://lh3.googleusercontent.com/uUGwZbEfNTrxp-8LV3l6MoSn0mUU_zOoFFHZQTIMgOlcTJiaW4Kh9MVk_0dgRy1CQWJDVHncwlYR

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3l3v9p-GM3_Bidirectionality_In`

## foundations/layout/breakpoints/compact

Breakpoints – Material Design 3
 Navigation Panes Spacing Special considerations Layouts for compact
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 are for screen widths smaller than 600dp. A compact breakpoint focuses on a single view Navigation Use a navigation bar or modal expanded navigation rail. Place navigation components close to the edge of the screen where they’re easier to reach. Place navigation elements near the bottom of a compact window so they’re easy to reach Panes Use a single pane in compact layouts. Single-pane layouts work best for compact breakpoints Spacing Margins are 16dp from the leading and trailing edge of the window. In compact layouts, use 16dp margins Special considerations A compact layout will need to transition dynamically to a medium or expanded layout when: A foldable device is unfolded A mobile device is rotated from portrait to landscape A tablet exits split-screen mode A product is resized to be larger in multi-window mode A free-form window is resized Compact layouts should dynamically transition to larger layouts when a device is unfolded or rotated

- `e339a9d2405b0486.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp40sit1-01.
- `6f0b922325f44cd3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp40u2kw-02.
- `48ca897279ac86f6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp40uzbp-03.
- `71bfa6a83bed0a04.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp40vzj4-04.
- `9753f19386c4ac57.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp40wssg-05.
- `c35db72bf79edf3a.png` ← https://lh3.googleusercontent.com/9IC8KyAT2SkaRgd0oRs6Q9_EThFKVJQomkWlNMfvupqnnafcaoMNDpju-OSuXaKR5pvAwLF1NGQi

## foundations/layout/breakpoints/expanded

Breakpoints – Material Design 3
 Navigation Panes Spacing Special considerations Layouts for expanded
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 are for screen widths from 840dp to 1199dp. Two-pane layouts are often best for expanded breakpoints Navigation Place navigation components close to edges of the window where they’re easier to reach. Use a
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 , either collapsed or expanded. The navigation rail can be hidden in secondary destinations as long as the primary destination can still be accessed using a back button. For sorting, filtering, or secondary navigation, use tabs or other components directly in the pane. Navigation area Single pane Panes Use a single-pane or two-pane layout. A two-pane layout is often best for expanded breakpoints. However, a single-pane layout can work when displaying visually- or information-dense content, such as videos. At an expanded breakpoint, reserve single-pane layouts for information-dense content When using a fixed-and-flexible layout, the fixed pane should have a width of 360dp by default. pause In a fixed-and-flexible layout, the fixed pane is 360dp by default A split-pane layout uses two flexible panes and visually centers the spacer by default. pause The navigation and first pane are 50% of the window width to keep the spacer visually centered Spacing Expanded layouts have a leading and trailing margin of 24dp. The spacer between panes is 24dp. Use 24dp for margins and spacer in an expanded layout Special considerations An expanded layout will need to transition dynamically to a compact or medium layout when: A foldable device is folded A tablet is rotated from landscape to portrait The app goes from full-screen to split-screen Multi-window mode is initiated A free-form window is resized pause Consider how an expanded layout should change at medium and compact breakpoints

- `ad51668eaee7486d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41hvbo-01.
- `65454743e6eeeebf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41iro5-02.
- `74bb337cfaa4bc9b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41jkb5-03.
- `74bdd9d03315d89b.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41knzh-GM3
- `1d7df91a84f34628.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41lyj0-ly7
- `d81f4049fc02e743.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41ofdd-GM3
- `044510ab17239279.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5l3xgt-06.
- `c35db72bf79edf3a.png` ← https://lh3.googleusercontent.com/9IC8KyAT2SkaRgd0oRs6Q9_EThFKVJQomkWlNMfvupqnnafcaoMNDpju-OSuXaKR5pvAwLF1NGQi

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41knzh-GM3_Applaying%20Layout_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41lyj0-ly7433ph-GM3-Styles-Fou`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41ofdd-GM3_Applaying%20Layout_`

## foundations/layout/breakpoints/large-extra-large

Breakpoints – Material Design 3
 Navigation Panes Additional panes Spacing Special considerations These breakpoints are most useful for creating web experiences tailored to laptop and desktop devices. Some products may not need large and extra-large breakpoints. Consider your platform’s conventions and users when making decisions on which breakpoints to design for. Layouts for large
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 are for screen widths from 1200dp to 1599dp Layouts for extra-large breakpoints are for screen widths of 1600dp and larger A two-pane layout is recommended for large and extra-large breakpoints Navigation Use a
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 , either collapsed or expanded, depending on the amount of content.   For sorting, filtering, or secondary navigation, use tabs or other components directly in the pane. Collapsed navigation area Single-pane layout An expanded navigation rail is best suited for extra-large windows, where there's still plenty of room for content. Consider collapsing the navigation rail when space is needed, or when on pages deeper in the page hierarchy. Expanded navigation area Single-pane layout Panes A two-pane layout is often best for large and extra-large breakpoints.    However, a single-pane layout can work when displaying visually- or information-dense content, such as videos. Only use a single-pane layout for dense content or media When using a fixed-and-flexible layout, the fixed pane should have a width of 412dp by default. Fixed panes should be 412dp in large and extra-large layouts When using a split-pane layout , the spacer should be visually centered by default, even when using an expanded navigation rail. In split-pane layouts, navigation components shrink the leading pane, so the spacer remains centered Additional panes The extra-large breakpoint supports using a
 standard side sheet
 Standard side sheets display content without blocking access to the screen’s primary content, such as an audio player at the side of a music app. They're often used in medium and expanded window sizes like tablet or desktop.
 More on side sheets
 as a third pane. When the side sheet is present, the navigation rail can remain visible, collapse, or hide completely. Don't use more than three panes.    Note: Fixed panes in this window size are recommended to be 412dp, but side sheets have a default maximum width of 400dp. Standard side sheet (third pane) Spacing Large and extra-large layouts have a leading and trailing margin of 24dp. The
 spacer
 A spacer is the space between two panes. If panes can be resized, the spacer contains a drag handle.
 between panes is 24dp. Use 24dp for margins and spacers in large and extra-large layouts Special considerations Large and extra-large layouts will need to transition dynamically to a smaller layout when: The app goes from full-screen to split-screen Multi-window mode is initiated A free-form window is resized Pay attention to typographic elements such as line length to ensure readability on large and extra-large layouts. Consider how a large layout should change at smaller breakpoints

- `87e01092c8023566.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41v09e-01.
- `bfbf747da4c428b0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41w5ix-02.
- `9054eceef146aa89.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41xhwl-03.
- `682f019c2105e71a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41y2za-04.
- `e4b0ca3d0068b89c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41yyza-05.
- `b97f83163b108d62.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41zo3h-06.
- `a83d04a88b66cac3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp420iqc-07.
- `af51ce3772505d58.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp42206a-09.
- `33f40c3d8201157f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5lfdh0-08.
- `c35db72bf79edf3a.png` ← https://lh3.googleusercontent.com/9IC8KyAT2SkaRgd0oRs6Q9_EThFKVJQomkWlNMfvupqnnafcaoMNDpju-OSuXaKR5pvAwLF1NGQi

## foundations/layout/breakpoints/medium

Breakpoints – Material Design 3
 Navigation Panes Spacing Special considerations Layouts for medium
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 are for screen widths from 600dp to 839dp. Single-pane layouts can focus attention on one action or view, such as a video call Navigation Place navigation components close to edges of the window where they’re easier to reach: Single-pane layouts:
 Navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 Two-pane layouts:
 Navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 The navigation rail can be hidden in secondary destinations as long as the primary destination can still be accessed using a back button. Navigation area Single pane Panes Single-pane layout   In a medium layout, a single pane is recommended because of limited screen width. A single-pane layout is recommended for medium breakpoints Two-pane layout Limit use of two panes for content with lower information density, such as a settings screen. Each pane in a two-pane layout should take up 50% of the window width. Avoid setting custom widths. A drag handle can be used to expand or collapse panes to be 100% of the window width. Two-pane layouts should use 50% widths for each pane by default When adding navigation to a two-pane layout, use a navigation bar. This allows the panes to fully use the available window width. Two-pane layout with: Navigation bar Spacing Medium layouts have margins of 24dp. The
 spacer
 A spacer is the space between two panes. If panes can be resized, the spacer contains a drag handle.
 between panes is also 24dp. Use 24dp for margins and spacer in a medium layout Special considerations A medium layout will need to transition dynamically to a compact or expanded layout when: A foldable device is folded A tablet is rotated from portrait to landscape A product goes from full-screen to split-screen Multi-window mode is initiated A free-form window is resized Think of how a medium layout should change to a compact or expanded layout Reachability For horizontal tablets and unfolded foldables, the top 25% of the screen is likely out of reach, unless the grip is adjusted. To accommodate device and hand sizes, limit the amount of interactions that are placed in the upper 25% of the screen. Limit interactions in the upper quarter of a screen, as they can be hard to reach Avoid placing essential interactive elements too close to the bottom edge of the screen. Some users, particularly those with larger hands, might struggle to reach this area. Specify interactions in a layout with these ergonomic regions in mind: Users can reach this area by extending their fingers, which makes it inconvenient Users can reach this area comfortably Reaching this area is challenging when holding the device Medium breakpoint ergonomic regions:  Inconvenient Comfortable Challenging

- `abf7af27355c6d22.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp413hn4-01.
- `e1249f67a3c41933.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp414ag3-02.
- `f062d395cc125f8a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp417y7j-03.
- `fbb112158beb11d9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp418umv-04.
- `e9afd7d6b14e1c01.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp419dq9-05.
- `31aee1c7569bb542.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41ahko-06.
- `a3f5412246b02fec.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41cohr-08.
- `9aa220af2d4b1dd5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp41dv1l-09.
- `f36263adaef24308.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5kr0vt-07.
- `c35db72bf79edf3a.png` ← https://lh3.googleusercontent.com/9IC8KyAT2SkaRgd0oRs6Q9_EThFKVJQomkWlNMfvupqnnafcaoMNDpju-OSuXaKR5pvAwLF1NGQi

## foundations/layout/breakpoints/overview

Breakpoints – Material Design 3
 Breakpoints overview Designing across breakpoints Material uses breakpoints to create adaptive designs that work across devices: There are five main
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 : compact, medium, expanded, large, and extra-large Layouts typically transition from a single pane to two or three panes as window size increases When moving across breakpoints, decide which elements to reveal, divide, resize, reposition, or swap Breakpoints overview A breakpoint (previously window size class) is the window size at which a layout needs to change to match available space, device conventions, and ergonomics. These apply to Android and web. All devices fall into one of five Material breakpoints: Compact Medium Expanded Large Extra-large Rather than designing for an ever-increasing number of display states, focusing on breakpoints ensures layouts work across a wide range of devices. Compact Medium Expanded Large and extra-large breakpoints are used on devices like laptops, desktops, and external monitors. Large Extra-large Design for breakpoints instead of specific devices because: The amount of available window space is dynamic and changes based on user behavior, such as multi-window modes or unfolding a foldable device Devices fall into different breakpoints based on orientation Breakpoint Width (dp) Common devices Compact Under 600dp Phone in portrait Medium 600–839dp Tablet in portrait Foldable in portrait (unfolded) Expanded 840–1199dp Phone in landscape Tablet in landscape Foldable in landscape (unfolded) Desktop Large 1200–1599dp Desktop Extra-large 1600dp+ Desktop Ultra-wide monitors Height breakpoints On Android, compact, medium, and expanded breakpoints are also available for height . These can be used to adjust the layout when available vertical space is unusually small or large. However, since most layouts contain vertically scrolling content, it's rare that layouts need to adjust to available height. Designing across breakpoints Products should automatically adapt to any breakpoint A product’s layout should adjust to fit each breakpoint. For example, a large window can have two panes, while an extra-large window can have three. Each product view should have a layout for the breakpoints most appropriate for your platform and users. Different components are recommended for performing the same function across the five layouts. Breakpoint Panes Navigation Communication Action Compact 1 Navigation bar, modal expanded navigation rail Simple dialog Full-screen dialog Bottom sheet Medium 1 (recommended) or 2 Navigation bar, modal expanded navigation rail Simple dialog Menu Expanded 1 or 2 (recommended) Modal or standard expanded navigation rail Simple dialog Menu Large 1 or 2 (recommended) Modal or standard expanded navigation rail Simple dialog Menu Extra-large 1 to 3 (recommended) Modal or standard expanded navigation rail Simple dialog Menu Start by designing for one breakpoint, then adjust the layout for the next size by asking these five questions: 1. What should be revealed? Parts of the UI that are hidden on smaller devices can be revealed in larger layouts. For example: On mobile, the navigation rail is collapsed by default On an expanded device, the navigation rail can be open by default, revealing more actions and features A product’s navigation rail can be revealed in an expanded layout The same can be applied to panes . Larger layouts can simultaneously display an inbox pane and a pane containing a selected conversation. Additional space doesn’t just mean making the same thing bigger. An expanded layout for a messaging app reveals a second pane with the selected conversation 2. How should a screen be divided? When dividing a screen into layout panes, consider the breakpoint:  Compact and medium breakpoints:  A single pane works best Expanded and large breakpoints:  Two panes are recommended Extra-large breakpoints: Consider using three panes Compact and medium breakpoints should use a single pane, while larger breakpoints can use two At medium breakpoints, two panes are useful when they contain low-density content with clear actions.   Don’t use two panes in medium layouts with high information density, as it can reduce usability. A settings view with low-density content and quick actions is a good use of two panes in a medium layout Rotating a device often changes the breakpoint. A layout can have two panes in landscape orientation, and one pane in portrait. Single-pane layouts can focus attention on one action or view, creating a distraction-free environment for a specific goal such as: Playing a game Watching a movie Video calls Creative applications Consider using an immersive single-pane layout for video calls 3. What should be resized? UI elements that are small on compact screens can grow as breakpoints increase. Panes can also expand to rearrange elements and make better use of space. Consider resizing: Cards Feeds Lists Panes Resizing can highlight imagery and improve text readability. This type of adaptation affects the scale of content and the relationship between objects on screen. For example, a vertical card on mobile can adjust its margins, orientation, text size, and density to better fit a tablet. Across all breakpoints, adjust margins and type styles to keep text between 40–60 characters per line. A small card in a compact layout can be resized larger in a medium or expanded layout 4. What should be repositioned? A UI and its components can reflow or reposition to make use of additional space on expanded screens and in resized panes. Repositioning is also a way to match the ergonomic and input needs that change across device sizes, such as shifting actions from the bottom of a compact window to the leading edge of medium and expanded windows. This method is similar to responsive design on the web. Consider: Repositioning cards Adding a second column of content Creating a more complex layout of photos Introducing more negative space Ensuring reachability for navigation and interactive elements Internal elements can be anchored to the left, right, or center as a parent container scales. Internal elements can also maintain fixed positions, such as a floating action button (FAB) in a navigation rail. Tabs can remain anchored to the middle of a layout at both compact and medium breakpoints In the case of a button, the icon and text label within the button container can remain anchored to each other, staying centered as the button container scales horizontally. Button icons and label text can remain anchored to each other no matter the width 5. What should be swapped? As a layout changes across breakpoints, components with similar functions can also be exchanged. This makes it possible to adjust a layout for large-scale changes to the ergonomic and functional qualities of an interface. For example, a bottom navigation bar in a compact layout can be swapped with a navigation rail in a medium layout. check Do Swap a navigation bar in a compact layout for a navigation rail in a medium or expanded layout Likewise, a navigation rail can swap from collapsed to expanded at larger breakpoints. Use caution when swapping components. Make sure:  The interchangeable components are functionally equivalent The component swap serves a functional and ergonomic purpose Don’t swap a button for a chip. Be careful when changing between list items and cards. check Do A collapsed navigation rail in medium or expanded layouts can become an expanded navigation rail in large or extra-large layouts close Don’t Don’t arbitrarily swap components that aren’t functionally equivalent, such as swapping a button with a menu Common swappable components Component type Compact Medium Expanded Navigation
 Navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 Collapsed navigation rail
 Collapsed navigation rails take up minimal space and are best for medium windows and larger.
 More on navigation rails
 Collapsed navigation rail
 Collapsed navigation rails take up minimal space and are best for medium windows and larger.
 More on navigation rails
 Navigation Modal
 expanded navigation rail
 Expanded navigation rails show text labels and an extended FAB, and can be default or modal.
 More on navigation rails
 Modal
 expanded navigation rail
 Expanded navigation rails show text labels and an extended FAB, and can be default or modal.
 More on navigation rails
 Standard
 expanded navigation rail
 Expanded navigation rails show text labels and an extended FAB, and can be default or modal.
 More on navigation rails
 Communication Basic or
 full-screen dialog
 Full-screen dialogs fill the entire screen, displaying actions that require a series of tasks to complete. They're often used for creating a calendar entry.
 More on full-screen dialogs
 Basic dialog
 Basic dialogs interrupt users with urgent information, details, or actions. They're often used for alerts, quick selection, or confirmation.
 More on basic dialogs
 Basic dialog
 Basic dialogs interrupt users with urgent information, details, or actions. They're often used for alerts, quick selection, or confirmation.
 More on basic dialogs
 Supplemental selection
 Bottom sheet
 Bottom sheets show secondary content anchored to the bottom of the screen.
 More on bottom sheets
 Menu
 Menus display a list of choices on a temporary surface.
 More on menus
 Menu
 Menus display a list of choices on a temporary surface.
 More on menus

- `b5e8c1834442f75b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3zlnnl-01.
- `da67479df4608b8a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3zmg9g-02.
- `022f70516329c6f0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3znkbk-03-
- `14ff618151add29a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3zoh5f-04-
- `39347dc7b925c982.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3zwt8a-05.
- `2b2d64785bdaeb93.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3zxlki-06.
- `3fee07a98227bbdf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3zyjaf-07.
- `e20d990244f70c7c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp400qwl-09.
- `09fbb219b951c333.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp401fhs-10.
- `33be01b700ac772c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp402bv2-11.
- `b151013306fd1812.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp4067x5-16.
- `bcb8e058387ea9d1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp40fx5f-12.
- `6f59114ec7cd30c8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp40h750-13.
- `dff824bf50477ad5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp40iha0-14.
- `2f73a79d6a8e30d6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp40ja5v-15.
- `1a82f81062ad6b3d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5k02j7-08.
- `c35db72bf79edf3a.png` ← https://lh3.googleusercontent.com/9IC8KyAT2SkaRgd0oRs6Q9_EThFKVJQomkWlNMfvupqnnafcaoMNDpju-OSuXaKR5pvAwLF1NGQi

## foundations/layout/canonical-examples/feed

Material Design
 Usage Dividing space Across breakpoints A feed layout uses a grid composition to enable quick content browsing and discovery. Key use cases include news, photos, and social media. Feed layouts help people quickly browse and discover content Usage Use a feed layout to show different pieces of content through cards and lists. Feeds support displays of almost any size as grids can adapt from single to multi-column. Feed layouts can adapt the number of columns across breakpoints Dividing space A feed composition is flexible enough to allow for content with varying proportions and sizing. Feeds can organize content of different sizes, like using small and large cards Use size and position to establish relationships among content elements.   Feed items should reflow when the amount of available space changes like: Rotating or unfolding a device Entering multi-window mode The order of items is determined by their position.    More on adaptive design for cards Feed items can change size to group content Across breakpoints Compact A feed layout should stack vertically, like a list of cards with individual items filling the width of the pane. In compact windows, the cards in a feed stack vertically, filling the full width:  Compact breakpoint Expanded breakpoint Medium A feed layout can support components with different widths and be split across multiple columns. Feed layouts can add columns in a medium window Expanded, large, & extra-large A feed layout can support components with different widths and be split across multiple columns. The number of columns should usually increase at expanded breakpoints. Column width can increase at larger breakpoints

- `b3917d55e2fb2851.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp51zufq-02.
- `84c995ac4ce89463.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp521zfz-03.
- `b143554ea12b3b65.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp528i2s-04.
- `91d92bcdee275b1e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp52hmfv-05.
- `f20268d470d3945a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp52jmhc-06.
- `daaf3ff1e1ccc054.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp52lhar-07.
- `60e740f947ea3530.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp736am6-Fee
- `fb4c06dc4e36cb9b.jpg` ← https://m3.material.io/static/assets/m3-social.jpg

## foundations/layout/canonical-examples/list-detail

Material Design
 Usage Across breakpoints Behavior Many layouts can be split into a list view and a detail view. Key use cases for this layout include parent-child pairings of information like: Text message + conversation File browser + open folder Musical artist + album detail Settings + category detail Email inbox + selected email List Detail Usage Use the list-detail layout for quickly accessing details of an item from a long list of content.   Examples include: Showing a series of conversations and a text message Browsing files and seeing their details Browsing multiple albums and seeing individual track information Simplified diagram of: List area Detail area Dividing space The most basic list-detail views for compact, medium, and expanded layouts A list-detail layout uses two panes. Depending on the breakpoint, the two panes may appear together in the same layout or across separate layouts.   List-detail layouts use the same pane guidance as all single and two-pane layouts, including special behavior for foldables. Breakpoint (dp) Visible panes Compact (0-599) 1 pane Medium (600-839) 1 (recommended) or 2 panes Expanded (840+) 2 panes Large (1200-1599) 2 panes Extra-large (1600+) 2 panes Across breakpoints Compact Use a single-pane layout Only one view is visible at a time, either list or detail Phone in portrait orientation Closed foldable Tablet in split-screen mode Medium Use a single-pane layout for information-dense content or deep focus Foldable open flat Tablet in portrait orientation Use a two-pane layout to browse collections and switch between items quickly To maximize horizontal space for two-pane layouts, use a bottom
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 or modal
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 Foldable open flat Tablet in portrait orientation Expanded, large, & extra-large Use a two-pane layout Phone in landscape orientation Tablet in landscape orientation Behavior Single vs two-pane Back button: Appears in detail view only for single-pane layouts Selected state: Appears only in list view for two-pane layouts Visual focus: Use explicit and implicit grouping to direct focus in two-pane layouts Use a selection state in two-pane layouts only Use a back button in single-pane layouts only Transitioning between layouts The amount of available space is dynamic and changes based on how someone uses a device, such as rotating or unfolding it, or entering multi-window mode. pause A two-pane layout adapts to a single-pane layout when a device rotates from an expanded to medium breakpoint No selected list item A single-pane layout shows a list view, while a two-pane layout shows placeholder content in the detail pane. In some cases, such as multi-select, the most recently used pane should stay visible when switching to single-pane layout. pause If no item is selected when a foldable opens, the detail pane displays an empty state Selected list item When switching from a single- to two-pane layout, both panes should be shown and the selected item’s details are visible. When going from a two- to single-pane layout, the view depends on the product: The detail pane should typically show in a single-pane layout, and an app bar appears If the product supports selection without deep navigation, like multi-select, the list view can show with the item selected Consistency is key: If a layout showed the list view previously, it should return to that view when returning to a single pane pause If an item is selected when a foldable opens, the detail pane shows that item pause When a foldable closes with an item selected, the single pane shows the detail view Persistent states In most cases, a state should be saved when navigating between detail views. This includes read and unread content. pause Detail views should retain their scroll position when navigating to other items

- `47f17cf075ed57de.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flxyh497r-Can
- `d08df53d189bf3bf.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flxyhcqmk-Can
- `17e08c166f3e225b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp52v68p-02.
- `577f3bcd71f2a2e1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp52wfuu-03.
- `195362952aaf1b79.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp533vzf-04.
- `080bc47d4ee234e8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp535cbt-05.
- `daf96085b2a2fd3f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp537scf-06.
- `b861353812fe170b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp538uu5-07.
- `6c5b0eb7be9c34b0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp53b085-08.
- `54748e464d02f35c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp53duna-lxy
- `b32d5dae85423a83.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54burn-lxy
- `2bb50559a1ff9404.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54fy4m-lxy
- `6e3fca75cd32eb3b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp7394ub-LD%
- `fb4c06dc4e36cb9b.jpg` ← https://m3.material.io/static/assets/m3-social.jpg

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flxyh497r-Canonical_List-Detail_2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flxyhcqmk-Canonical_List-Detail_4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp53duna-lxygxf8i-Canonical_List`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54burn-lxyh80t8-Canonical_List`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54fy4m-lxyhgczm-Canonical_List`

## foundations/layout/canonical-examples/overview

Material Design
 Availability & resources Examples Advanced custom layouts Canonical layout examples demonstrate how to implement the layout
 scaffold
 A scaffold is a fundamental UI design structure that provides a standard platform for assembling key screen components.
 More on scaffold
 . They’re also available in code to provide a strong starting point for your product. Each layout example considers common use cases and components to address expectations and user needs for how products adapt across
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 (previously window size classes). A layout scaffold can include bar, rail, and pane regions Availability & resources Type Resource Status Design M3 Design Kit (Figma) Available Implementation Jetpack Compose: Canonical layouts Available Android Views (MDC-Android): Canonical layouts Available Examples There are three canonical layout examples: feed, list-detail, and supporting pane. Each example has configurations for compact, medium, and expanded breakpoints. Use these canonical examples as a starting point to create layouts for a product. Feed Use a feed layout to arrange elements like cards in a configurable grid for a quick, convenient view of a large amount of content.   More on feed layouts List-detail Use a list-detail layout to display explorable lists of items alongside each item’s details. This layout divides the window into two side-by-side panes. More on list-detail layouts Supporting pane Use a supporting pane layout to organize content into primary and secondary sections: Primary display area: Contains the main content and occupies the majority of the window (typically about two-thirds) Secondary display area: Presents supporting content in a panel that takes up the remainder of the space More on supporting pane layouts Advanced custom layouts To create a custom layout, build on top of canonical layouts or layer
 scaffold
 A scaffold is a fundamental UI design structure that provides a standard platform for assembling key screen components.
 More on scaffold
 elements. Layering Use the levitate adaptive strategy to create a layered layout. Layering panes above other content can create a focused, task-oriented experience such as: Reviewing a shopping basket Responding to comments Creating a calendar event Layering panes helps people focus on a specific task

- `931dce183f21276f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp72kkvb-LD%
- `e7472e58790490b3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp72yab6-Fee
- `e210029fb6075ff8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp72ypkq-LD%
- `9f11317655b8b2ee.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp72z1no-SP%
- `d050027ba715df13.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp731djr-ACL
- `fb4c06dc4e36cb9b.jpg` ← https://m3.material.io/static/assets/m3-social.jpg

## foundations/layout/canonical-examples/supporting-pane

Material Design
 Usage Dividing space Across breakpoints The supporting pane layout organizes content into primary and secondary areas.    The primary area contains the main content and occupies the majority of the space. The secondary area contains supporting content.   Key use cases for supporting pane layouts include: Productivity Document editing and commenting Content and media browsing Supporting pane layouts organize content into primary and secondary areas Usage Use the supporting pane layout when the secondary content is only meaningful in relation to the primary content.    For content with a parent-child relationship, use a list-detail layout instead. Supporting panes provide contextual info for the primary area Dividing space The window is divided between a focus pane and a supporting pane.   Depending on the breakpoint, the supporting pane may appear below or beside the focus pane. Supporting panes can appear beside or below the primary area Supporting pane placement Pane width Breakpoint Below Flexible Compact or Medium Leading or trailing Fixed (360 dp) Expanded Across breakpoints Compact The supporting pane should appear below the focus pane. A bottom sheet can be useful for keeping focus on the primary pane while providing access to supporting information. Bottom sheets can provide supporting information in compact windows Medium The supporting pane should appear below the focus pane. Supporting panes appear below the focus pane in medium windows Expanded The supporting pane should appear on the leading or trailing side of the focus pane. Supporting panes appear beside the focus pane in expanded windows

- `72d175883a3d0160.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54jbnh-01.
- `90e0d1087225ff89.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54n3m1-02.
- `dd9ef77d3d6895de.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54omgc-03.
- `f387563232bfee5b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54tfu7-05.
- `a452b63ae4d1286e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp73c5cw-04.
- `3f268e7dd1e9ffd1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp73dr78-6.p
- `fb4c06dc4e36cb9b.jpg` ← https://m3.material.io/static/assets/m3-social.jpg

## foundations/layout/grids-spacing/density

Grids & spacing – Material Design 3
 Information density Component scaling Targets Pixel density Information density is the consideration of the amount of information visible on the screen The default target size should be at least 48x48 CSS pixels People can change density as long as the density controls are accessible Apply density thoughtfully; not every layout needs it Layout and component scaling (component adaptation or component density) can allow people to scan, view, or compare more information at once pause Information density can change based on context and preference pause Consider whether components should scale Information density Information density can be achieved through layout and design decisions without using component scaling Some people may not benefit from increased density Component scaling Components can adapt and change dimensions to help people scan, view, or compare different amounts of information Don't apply component scaling by default if it would result in a target below 48x48 CSS pixels pause Information density and component scaling can be used together to provide more information and additional user control Information density Information density refers to the amount of content (such as text, images, or videos) in a given space. A layout’s spacing dimensions, including margins, spacers, and padding, can change to increase or decrease its information density. High density layouts are useful when people need to scan, view, or compare a lot of information, such as in a data table. Increasing the layout density of lists, tables, and long forms makes more content available on-screen. Consider density settings in the context of a device. Although a person may prefer a denser layout for desktop, they may not for mobile. Density shouldn’t automatically change across
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 or orientation unless a person changes it. check Do Consider using higher density information design when people need to scan lots of information Consider the amount and priority of information on-screen. Higher density can be useful for data-rich products where people expect to scan lots of information quickly. Examples: News, financial portals, dashboards Lower density can be better for sites prioritizing aesthetics, a focused message, less information, or easier navigation Component scaling The component density scale controls the internal spacing of individual components. The density scale is numbered, starting at 0 for a component’s default density. The scale moves to negative numbers (-1, -2, -3) as space decreases, creating higher density. Higher density is typically applied by decreasing the top and bottom padding or overall height by 4dp. Apply component density based on the needs and layout of a design Center the grouped element within the component container. Text size shouldn’t change as the container size scales. The measurement between the label and input is 20dp The label and input are centered within their parent container close Don’t Don’t increase density in UIs that involve focused tasks, such as selecting from a menu. It reduces usability by limiting selectable space. close Don’t Don't increase the density in components that alert a person of changes, such as snackbars or dialogs Avoid applying component scaling by default People should be able to opt in to dense layouts and components. To ensure density settings can be easily reverted, settings interactions must use default target sizes (48x48 CSS pixels).   Don't scale layouts below 48x48dp by default. pause People can opt in to dense layouts in settings Targets Dense components can be less accessible because interactive elements are smaller, so use caution when increasing information density. exclamation Caution Use caution when applying component scaling where selectable targets will be reduced to less than 48x48dp. Only apply density where it provides a better experience. Use caution when applying density to interaction targets. Accessible targets should retain a minimum of 48x48dp, even if the visual element, such as an icon, is smaller. The target should remain 48x48dp, even if the icon is smaller The interaction target of a common button can be larger, as long as it meets the 48x48dp minimum size Pixel density Pixel density is the number of pixels per inch. High-density screens have more pixels per inch than low-density ones. Elements with the same pixel dimensions appear larger on low-density screens and smaller on high-density screens. To calculate pixel density: Pixel density = Screen width (or height) in pixels / Screen width (or height) in inches High-density elements have more pixels per inch Low-density elements have fewer pixels per inch Density-independent pixels Density-independent pixels, written as dp, are flexible units that scale to have uniform dimensions on any screen. They provide a flexible way to accommodate a design across devices. The Material design system uses density-independent pixels to display elements consistently on screens with different densities. A dp is equal to one physical pixel on a screen with a density of 160. To calculate dp: dp = (width in pixels * 160) / screen density Low-density screen displayed with density independence High-density screen displayed with density independence Screen physical width Screen density Screen width in pixels Screen width in dps 1.5 in 120 180 px 240dp 1.5 in 160 240 px 1.5 in 240 360 px

- `9b874e3de6c75efd.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7fb8wiw-GM3
- `292903e7682aa70d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp57upl7-18.
- `a7aafc0f98d24290.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp57w9fy-19.
- `18581a752fa413ae.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp586kzq-16.
- `be57fc400d1c8395.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp587qzn-17.
- `d1a217235e7ef35b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp58gdij-14.
- `de5838f4f17c9f4d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp58i79t-15.
- `9800b091f4d2d3f3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp58kiob-13-
- `53de07d29a097742.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5b2pqp-10-
- `cbf0f08ccc1b10fb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5b47ji-11-
- `fb79053a50bbf210.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5b68d4-08.
- `b633b701b9fd8c88.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5b7f5f-09.
- `eb605df25ce556b7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5b9chq-07.
- `fb0f652591172575.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5bh69d-04.
- `202e466283e6b48c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5bi6cs-05.
- `6ed4fa4670835b19.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5bjd4j-03.
- `36c805d404300980.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5but2k-m6f
- `2794a47a3ed17ebb.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5c4fqq-m6f
- `2d513114ed156bc9.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5c5sj5-m6f
- `d0fd8d6b00d6b77d.png` ← https://lh3.googleusercontent.com/rj2mxQ2OOOkXBNSqH0v_EygOCSFiJ3gWHUimBMQ0rq0X1A-0ME7ENXaZ4oc_PBMpLU-doQF19kE3

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7fb8wiw-GM3_Expressive_Density_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5but2k-m6feg3jn-GM3-Components`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5c4fqq-m6fec25z-GM3-Components`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5c5sj5-m6fedlg1-GM3-Components`

## foundations/layout/grids-spacing/grids

Grids & spacing – Material Design 3
 How to use grids Rulers & alignment Layouts in Material are based on a grid that adapts across all
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 (previously window size classes) Parts of the layout
 scaffold
 A scaffold is a fundamental UI design structure that provides a standard platform for assembling key screen components.
 More on scaffold
 like rails and panes are positioned on this grid to create consistent adaptive layouts The structure and spacing values used in a grid can add personality to a product’s layout How to use grids Start with placing grid columns Grids adapt across
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 . As the size increases, column count, width, and spacing change as well. The number and size of columns changes based on breakpoints When moving between sizes, column count may increase to show more content or controls. On compact screens, fewer columns are used to create a focused layout As screen size increases, for example when a foldable screen is unfolded, additional columns allow for a richer layout Place bars & rails Populate regions of the layout
 scaffold
 A scaffold is a fundamental UI design structure that provides a standard platform for assembling key screen components.
 More on scaffold
 that are closest to the edges of the screen’s usable space first. This may include: Bars like the
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 and
 rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 Components like
 toolbars
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 and
 app bars
 App bars contain page navigation and information at the top of a screen.
 More on app bars
 The bar region can contain a toolbar The rail region on larger screens usually contains a navigation rail Place panes Next, populate the main region of the screen with panes with content and components, based on available space and structure. See the canonical layout examples for ideas on which panes are appropriate for a product. Primary pane Supporting pane Rulers & alignment Rulers are a set of recommended global alignment lines that help create consistent focal points in a product, while keeping content and components consistently aligned. How to implement rulers in Compose Margin Bar or safety region Title Content 1 Content 2 Content 3 Content 4 Bar or safety region Rail Bar & safety rulers Bar and safety rulers reserve space for system UI elements like the status bar and gesture navigation. They ensure actionable content like
 app bars
 App bars contain page navigation and information at the top of a screen.
 More on app bars
 aren’t covered by system UI. Bar and safety rulers align to the edges of a screen’s usable space, providing a reference for where system UI like the status bar or gesture navigation appear Title rulers The title ruler creates consistency for the screen’s title, aligning the text, icons, and other components in an app bar. The title ruler aligns with the title in an app bar Content rulers Use content rulers to align and anchor key content, such as headlines and
 carousels
 Carousels show a collection of items that can be scrolled on and off the screen.
 More on carousels
 . First content ruler: Emphasizes major blocks like hero images, headlines, or primary components Secondary rulers: Determine where supplementary text or actions begin Content rulers offer flexible alignment options to help create a consistent layout across a product pause Realigning primary components or content to a content ruler can create strong hierarchy and visual rhythm across a product Ruler options Margin rulers come with some wiggle room to determine how tight or loose a product’s content feels on-screen. The standard ruler can be adjusted to the left or right. Choosing a narrower or wider margin can create or remove negative space, or create expressive moments in a content-forward product. pause Margin rulers can adjust to create more or less negative space Rulers can also be used to create more immersive experiences. For example, a photo grid can take the full width of the screen, while components like
 Search lets people enter a keyword or phrase to get relevant information.
 More on search
 use wider margins. Rulers allow components and media to use different margin widths

- `91018c7b072673f0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54500h-03.
- `39289f2d05886a08.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54dby8-04.
- `f92faeee620691cc.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp54ejyh-05.
- `11e0e2f5a14fd209.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp55v0r6-06.
- `d868c2183a808bf6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp55w2g9-07.
- `ac0b24088c46f986.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp55yqda-08.
- `816db471f477781b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp56n0pg-09.
- `5007873a48dd88de.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp573btr-10.
- `749ad329612b007b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp574ab3-11-
- `f7143d63c0f17068.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp575wo3-12-
- `4ef95e6cb8aa6289.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5778zb-GM3
- `a622094d4bd1622c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp578joa-GM3
- `0727244836580a0b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp579mwo-15.
- `d0fd8d6b00d6b77d.png` ← https://lh3.googleusercontent.com/rj2mxQ2OOOkXBNSqH0v_EygOCSFiJ3gWHUimBMQ0rq0X1A-0ME7ENXaZ4oc_PBMpLU-doQF19kE3

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5778zb-GM3%20-Layout%20-%20Gri`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp578joa-GM3%20-Layout%20-%20Gri`

## foundations/layout/grids-spacing/overview

Grids & spacing – Material Design 3
 Availability & resources What’s new Grids create a consistent foundation and adapt across
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 (previously window size classes) Use spacing to group related information and direct people’s attention to key actions Density helps people see and compare more information in data-heavy views Layouts in Material are based on a grid that adapts across all screen sizes Availability & resources Type Resource Status Design M3 Design Kit (Figma) Available Spacing system & tokens Available Implementation Jetpack Compose: Rulers Available What’s new May 2026 How to use grids and rulers to adapt layouts across devices Expressive spacing guidelines As screen size increases, additional columns allow for a richer layout

- `5fa7eab5274fd76f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp4if1f9-01.
- `7ba1eb06b9fe7959.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp4int8e-02.
- `d0fd8d6b00d6b77d.png` ← https://lh3.googleusercontent.com/rj2mxQ2OOOkXBNSqH0v_EygOCSFiJ3gWHUimBMQ0rq0X1A-0ME7ENXaZ4oc_PBMpLU-doQF19kE3

## foundations/layout/grids-spacing/spacing

Grids & spacing – Material Design 3
 Spacing to group content Spacing to direct attention Spacing as expression Spacing helps group content, direct attention, and shape the personality of a product A denser layout can feel more serious and focused, while a more spacious layout can feel calm and open Material’s spacing system can adapt to
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 and density settings. More on the spacing system Desktop layouts can use more generous spacing than mobile layouts Spacing to group content Grouping connects related elements that share context, such as an image and its caption. Use spacing to visually tie elements together and establish boundaries between unrelated items. Placing a caption under an image creates an implicit group Explicit grouping uses visual boundaries like outlines, dividers, and shadows to group related elements in an enclosed area. It can also indicate that an item is interactive, such as: List items between dividers A card displaying an image and its caption Outlines define clear boundaries to explicitly group elements Implicit grouping uses close proximity and open space (rather than lines and shadows) to group related items. For example, the items in a carousel are placed close together, with space around the composition to separate them from other content. Close spacing implicitly groups carousel images Spacing to direct attention Use rhythm, similarity, and other grouping principles to distinguish and highlight important elements. Rhythm Consistent spacing between related elements or groups makes them easier to navigate with the eye. Cards should maintain consistent horizontal spacing to establish a strong rhythm when their height varies Similarity Similar elements should have the same spacing and sizing in a layout to show they’re related. Leading elements like thumbnails, avatars, or icons should always be aligned. Thumbnails in a shopping basket should use identical sizes and styles to signal that each one represents a product, even if the original photos have different aspect ratios Proximity Place components near each other to create cohesive groups. This helps people understand the relationships between information and actions. For example, buttons should be close to the content they’re affecting. Placing two buttons as a group near content implies they’ll both affect it in similar ways Continuity Place related elements in a container, row, or column to establish a clear group or relationship. Use a row of chips to signal a single, unified control Spacing as expression Give the most important content, tasks, or actions visual prominence with generous spacing and the brightest surfaces. Focal points Consistent placement of key actions and information helps build recognizable focal points across a product. Carousel images, categories, and titles should appear in a consistent location across pages Negative space Allow negative space to give form and meaning to elements on screen. Framing important actions or content with generous spacing creates emphasis. Negative space gives shape and emphasis to the course header

- `16401c059027135a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp51ef8p-01.
- `bae1c73f0f2cf518.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp51khdt-02.
- `9c662c974b6ff178.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5334mv-03.
- `7e06a673c3e83392.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5346br-04.
- `2198078750e07198.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp53c1l8-05.
- `3d187e31fd5fc81d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp53g651-06.
- `530d57646c39df9d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp53i2w6-08.
- `cd6354696b775c92.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp53roq5-09.
- `c7a424979eba4442.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp53ttu6-10.
- `96e31b60d503dc6d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp71sefu-07.
- `d0fd8d6b00d6b77d.png` ← https://lh3.googleusercontent.com/rj2mxQ2OOOkXBNSqH0v_EygOCSFiJ3gWHUimBMQ0rq0X1A-0ME7ENXaZ4oc_PBMpLU-doQF19kE3

## foundations/layout/layout-overview/adaptive-design

Layout – Material Design 3
 What’s adaptive design? Designing adaptive experiences Adaptive layouts What’s adaptive design? Adaptive design is a set of techniques to change an interface to fit different contexts. While responsive design scales a single layout to fit any screen, adaptive design customizes a product to optimize the experience on each device. Designing adaptive experiences goes beyond customizable properties like color, typography, and shape. The structure, individual components, and entire layouts can adapt based on: People: Individual preferences and settings Devices: Watch, phone, foldable, tablet, desktop, or XR device Usage: Screens dynamically change as a person resizes windows, changes orientation, or switches device Designing adaptive experiences Layouts must be versatile, designed to adapt fluidly across three primary experience types: mobile , desktop , and spatial . Start with mobile and make sure your product's layout and components can scale and adapt seamlessly all the way up to spatial environments. While each experience has different primary input methods, designs should be built with all inputs in mind—touch, pointer, and physical keyboard—since users may use your product in a desktop environment regardless of their device type. Mobile Mobile experiences include phones, foldables, and tablets. On mobile, an app can be shown in several window modes: Full-screen: The app takes up the entire screen, the default for mobile Split-screen: Two or more apps share the screen simultaneously, common on tablets and foldables Bubbles: Floating windows that let people multitask without leaving their current context Mobile layouts default to a full-screen window Desktop Desktop experiences use free-form windows that adapt across
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 . People can use split screens, floating windows, and free-form windows for multi-tasking. A tablet can convert to a desktop experience when a physical keyboard and mouse are connected. Similarly, Android mobile devices can transition into a desktop-like environment when connected to an external monitor. A desktop layout can adjust from three to two columns to fit a medium breakpoint Spatial Extended reality (XR) experiences use multiple free-form windows within virtually limitless screens. Immersive modes, such as Android XR’s full space , allow components to be positioned freely in 3D space. More on XR design In an XR full space layout, a navigation rail can become an orbiter, and float to the side of the main pane Adaptive layouts The Material 3 adaptive system uses
 panes
 Panes are layout containers that house other components and elements within a single app. A pane can be: fixed, flexible, floating, or semi permanent.
 More on panes
 and
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 to organize content into adaptive layouts. Panes are the building blocks of layout; a pane is a single destination in the product. For example, in a messaging app, the list of messages is one pane, and and a specific conversation thread is another. Panes are the primary segments of a layout, and can change based on context As the pane or window resizes—or as someone navigates a product—panes may change size, enter and exit the screen, and reorganize themselves to make the experience more usable or easier to navigate. These patterns are called adaptive strategies. Material has three adaptive strategies that create a cohesive experience across breakpoints: show and hide , levitate , and reflow . Co-planar: Panes are displayed side by side Floating: A pane is displayed above other panes or content, like a dialog Docked: A pane is displayed above other panes and one of its edges extends beyond one side of the screen, like a bottom sheet In Compose, the Navigation 3 library allows multiple destinations to be shown on screen at the same time, and enables layouts to adapt seamlessly across window sizes and screens. pause Navigation destinations remain consistent regardless of screen sizes with Navigation 3 Adapting components Components can adapt in appearance, placement, and behavior based on factors like: Where components are placed in relation to their containers, content, and pane boundaries How components use space How components enable usage across different device and input types Most Material components respond using three main strategies: resizing, showing and hiding, and presentation changes. Resizing Components should resize in response to their content and their placement in a layout. For example,
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 may scale along with their parent container, or hug their contents and maintain a left or right alignment. Buttons can hug their contents or span their containers based on context Showing & hiding Components should show and hide information, or collapse and expand to selectively reveal content that best suits the space. For example,
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 items may reveal descriptions or other additional information as their parent container scales. List items can reveal more text on a tablet Presentation changes Presentation changes include the orientation of elements and changes to specific properties, like color, type, and shape. Components can also change configurations. For example, when a window size increases, a
 FAB
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 can change to an extended FAB, and
 navigation rails
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 can be automatically expanded. The extended FAB can change to a standard FAB when the window is smaller

- `5e359d7834037bcf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3w1k0w-01.
- `73f045429f4f91dd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3w5izv-02.
- `710c813f56f5d38e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3wl9n4-03.
- `941422b3b19b0e35.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3wz2eh-04.
- `0dabd672141cafbb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3xf0z5-05.
- `621ca7e40a09ca24.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3xgph2-06.
- `309f70fe29074087.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3xiwiu-07.
- `ec3cceb1e1af72b0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3xrm51-Pla
- `2e249b1977fa6760.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3xtdfv-Pla
- `30e1c6f60e9e14b5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3xtdfv-Pla
- `b293d98534f54f8b.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3xuwp5-Pla
- `07702e4670caa215.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3xuwp5-Pla
- `59c73fc986c25409.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmsz6rtgu-Layout%20-%20Adapt
- `9d15a6e68fbbf0ba.png` ← https://lh3.googleusercontent.com/PYxK3aBSxukkpG_3ks0pjQ-krbSyGsPIlfn9OAy58ynkAhUEOSYvnfVujPO9qxFChGLI2-XXnxCb

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmsz6rtgu-Layout%20-%20Adaptive%20Design%20-%20I`

## foundations/layout/layout-overview/overview

Layout – Material Design 3
 Availability & resources What's new Layout terms Use layout to organize all elements in a screen, signal hierarchy, and draw attention to key actions Adapt layouts to compact, medium, expanded, large, and extra-large
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 (previously window size classes) Build from an established canonical layout example Design for bidirectionality to support both left-to-right (LTR) and right-to-left (RTL) languages Apply consistent arrangement, sizing, and spacing to create a functional layout structure Material layout guidance is implemented on Android and applies to web Column Fold Margin Bar Drag handle Pane Rail Availability & resources Type Resource Status Design M3 Design Kit (Figma) Available Spacing system & tokens Available Implementation Jetpack Compose: Canonical layouts Available Jetpack Compose: Rulers Available Android Views (MDC-Android): Canonical layouts Available Jetpack Compose: Navigation3 Available What's new When creating new layouts, use the layout
 scaffold
 A scaffold is a fundamental UI design structure that provides a standard platform for assembling key screen components.
 More on scaffold
 , start from a
 canonical layout example
 Designs for common screen layouts across breakpoints
 More on canonical examples
 , and ensure layouts scale across
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 . May 2026   Layout structure and design: Introduced layout scaffold, to create adaptive layouts efficiently New adaptive guidelines for mobile, desktop, and spatial devices Updated canonical layout examples Spacing system Naming: Window size classes renamed to breakpoints Responsive layout renamed to adaptive design The Material layout scaffold enables layouts to adapt across different screen sizes Layout terms Adaptive design : Techniques that allow an interface to dynamically respond to contexts like user preferences, device type, state, and breakpoints Bars : Can frame the page to help people navigate through a product, and typically house the app bar and bottom navigation bar Bidirectionality : A writing system that displays text and content from right-to-left (RTL) Breakpoints : Opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes) Column : One or more vertical blocks of content within a pane Drag handle : The component that resizes panes Fold : A flexible area of the screen or a hinge that separates two displays on foldable devices Gap : The space between components or elements within a container Margin : The space between the edge of the screen and any elements inside of it Multi-window mode : Enables multiple apps to share the same screen simultaneously Pane : A layout container that houses other components and elements within a single app. A pane can be fixed, flexible, floating, or semi-permanent. Rails : The perimeter space surrounding panes that holds key elements such as navigation rails, toolbars, and pane control Right-to-left (RTL) language : Languages written and read right-to-left, such as Arabic, Hebrew, and Farsi, used by over 2 billion people Rulers : An opinionated set of global alignment lines that help organize building blocks in a layout Safety region : Zones reserved for system UI elements outside the application space, such as status bar or gesture bar Scaffold : A fundamental UI design structure that provides a standard platform for assembling key screen components Spacer : The space between two panes on a foldable device

- `84f89cf617f49916.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3ukjvm-01.
- `a68b59479b98bc23.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3uxdvt-02.
- `9d15a6e68fbbf0ba.png` ← https://lh3.googleusercontent.com/PYxK3aBSxukkpG_3ks0pjQ-krbSyGsPIlfn9OAy58ynkAhUEOSYvnfVujPO9qxFChGLI2-XXnxCb

## foundations/layout/layout-overview/parts-of-layout

Layout – Material Design 3
 Parts of layout Layout scaffold Parts of layout Windows A window frames and contains an app or product. Many systems support multi-window views, which display multiple apps at once. Multi-window support guide for Android Two windows can be shown at once with a taskbar underneath On desktop, windows can be resized and moved around freely. They should adapt to various screen sizes. More on adaptive design Windows can be moved around, resized, and adapt to different screen sizes Grids The layout grid is the foundation for every layout. It provides a structural framework for organizing components, content, and actions. Use the grid to: Group related information in columns Apply spacing consistently Create focal points for primary actions Align building blocks like bars, rails, and panes More on grids Column count, width, and spacing dynamically adjust to different breakpoints Layout scaffold Bars Bars help people navigate through a product. Use bars to: Frame the main content Contain an
 app bar
 App bars contain page navigation and information at the top of a screen.
 More on app bars
 or
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 Span one or multiple panes   More on bars 1. App bars are placed at the top of the screen to help people navigate by providing a description of the screen and 1–2 essential actions, like search or back navigation Rails Rails are the next level in layout after bars, filling the perimeter space surrounding panes, or floating above them. They contain key elements such as
 navigation rails
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 ,
 toolbars
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 , chat inputs,
 FABs
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 , and other primary controls. More on rails On mobile, the rail region can contain a toolbar On desktop, the rail region can contain the navigation rail Panes Just like panes of glass that make up a window in the real world, panes in Material make up most of the layout in a window. All content must be in a pane. A layout can contain 1–3 panes of various widths, which adapt dynamically to the
 breakpoint
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 (formerly window size class) and the person’s language setting. For right-to-left (RTL) languages, navigation components will be on the right. People can navigate to or between panes. Presenting multiple panes at once can make a product more efficient and easier to use. More on panes First pane Second pane Containment On most devices, panes can blend in with the background. This is called implicit grouping, and helps show relationships between panes. Explicit grouping uses distinct colors or outlines to visually delineate content. More on spacing to group content In multiple-pane layouts, use color to show emphasis and close spacing to group related content In spatial environments, panes use a container color to separate them from the passthrough or virtual environment. Use contrast between panes and the background to create a spatial effect in XR Drag handles Drag handles can be used to resize panes in a layout. They can: Adjust the width of flexible panes Fully collapse and expand fixed panes to quickly switch between a single and two-pane layout pause Drag handles can adjust pane size in a list-detail layout Rulers Rulers are a set of global alignment lines. They help to align elements across all layers of the layout. How to implement rulers in Compose Rulers ensure global alignment across a product, keeping margins and placement consistent

- `ee26a1362d07233e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3yuwss-01.
- `d9359ef0988af162.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3z1fl4-02.
- `9c17d3f4236671cf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3z8y9f-03.
- `b5c25b86bf9324f8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp45sv4u-04.
- `79f2db00a02ff294.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp45u0ar-05.
- `fc443848c6cabbd1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp46vx4x-07.
- `13422580a6500005.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp46z833-08.
- `0182464b5c2e342c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp472v90-08.
- `64b744ded1738739.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp4771l5-GM3
- `246a7323160bc43a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp47dohx-10.
- `9d15a6e68fbbf0ba.png` ← https://lh3.googleusercontent.com/PYxK3aBSxukkpG_3ks0pjQ-krbSyGsPIlfn9OAy58ynkAhUEOSYvnfVujPO9qxFChGLI2-XXnxCb

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp4771l5-GM3_Applaying%20Layout_`

## foundations/layout/scaffold/bars

Scaffold – Material Design 3
 Bars Bars Bars frame the screen to help people navigate through a product. They typically contain an
 app bar
 App bars contain page navigation and information at the top of a screen.
 More on app bars
 or bottom
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 . Bars can span a single pane or across the full width of a window. A navigation bar occupies the bottom bar region on mobile An app bar occupies the top bar region on the web App bars are placed at the top of the screen to help people navigate, providing a title and 1–2 essential actions like search or back. The app bar sits at the top of the screen, outside of the safety region Navigation bars let people switch between 3–5 primary UI views at
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 or
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 breakpoints. The navigation bar sits at the bottom of the screen, above the safety region Safety region Bars are placed adjacent to the safety regions, which contain system UI elements. The safety region shouldn’t contain primary content. The safety region—at the top and bottom edges of the screen on compact devices—protect system UI elements

- `eb8252be8bd227d9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3nck82-01.
- `f952e4113b1f1620.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3nejq3-02.
- `73420d0cc6095a1b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3ng1v5-03.
- `c9f9db05d4ad14af.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3nk11i-04.
- `15aad3a370790c78.png` ← https://lh3.googleusercontent.com/ugQj9qFYRzreLSIZwq9VDe0hhGqgxJaA03G4lbranHplMNpkcItKhC7LoxXW_k3sJMibuVdMLCl8

## foundations/layout/scaffold/overview

Scaffold – Material Design 3
 Availability & resources The layout scaffold structures every piece of an adaptive layout into bars, rails, and
 panes
 Panes are layout containers that house other components and elements within a single app. A pane can be: fixed, flexible, floating, or semi permanent.
 More on panes
 Bars can frame the page to help people navigate through a product Rails create the perimeter space surrounding panes, creating space for elements like navigation and toolbars Panes hold a product’s primary content, adapting to
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 (previously window size classes) and other conditions Availability & resources Type Resource Status Design M3 Design Kit (Figma) Available Spacing system & tokens Available Implementation Jetpack Compose: Rulers Available Safety region Bar Pane Rail

- `596f1a1c7e5ae907.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3n7x8n-01.
- `15aad3a370790c78.png` ← https://lh3.googleusercontent.com/ugQj9qFYRzreLSIZwq9VDe0hhGqgxJaA03G4lbranHplMNpkcItKhC7LoxXW_k3sJMibuVdMLCl8

## foundations/layout/scaffold/panes

Scaffold – Material Design 3
 Panes Pane expansion & resizing Displaying multiple panes How panes adapt Spatial panels Accessibility considerations Panes All layouts are made up of 1–3 panes. The type of layout and amount of panes you choose should depend on the
 breakpoint
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 (previously window size classes) and the type of product being built. Layouts often include multiple panes that work together All layouts are made up of 1–3 visible panes. The type of layout and amount of panes you choose should depend on the
 breakpoint
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 and the type of product you're building. Breakpoint Recommended pane total Other pane totals Compact 1 -- Medium 1 2 Expanded 2 1 Large 2 1 Extra-large 2 1, 3 Panes can be: Fixed: Width doesn’t change based on available space Flexible: Width changes based on available space, and can grow and shrink All layouts need at least one flexible pane. Fixed pane Flexible pane Panes can be permanent or temporary. Temporary panes can appear and be dismissed when necessary, affecting the layout and size of other panes. Panes can be displayed permanently side by side pause Temporary panes can be dismissed Single-pane layouts Single-pane layouts use one flexible pane that extends to fit the available space in a layout’s width. They can be used at any
 breakpoint
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 , but are recommended for
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 and
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 . A single flexible pane adapts to fit any breakpoint Two-pane layouts Split-pane layout A split-pane layout keeps the spacer visually centered. It’s best for foldable devices and dynamic layouts. When a
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 or
 drawer
 Navigation drawers let people switch between UI views on larger devices. In the expressive update, use an expanded navigation rail.
 More on navigation drawers
 is present, it only reduces the size of one pane. The other pane remains at 50% of the window width. The navigation and first pane should be 50% of the window width to keep the spacer centered With a
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 , or no navigation, both panes span 50% of the window width by default. With no navigation rail visible, split-pane layouts set each pane to 50% width by default Fixed-and-flexible layout This layout is common for
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
 breakpoints. The fixed-and-flexible panes can appear in whichever order is best for the content. The fixed pane is often temporary, and used for side sheets or lists with light information density. Fixed pane Flexible pane Three-pane layouts While less common, the extra-large breakpoint supports using a standard
 side sheet
 Side sheets show secondary content anchored to the side of the screen.
 More on side sheets
 as a third pane. When the side sheet is present, the expanded navigation rail can remain visible, change into a collapsed navigation rail, or hide completely. Don't use more than three panes. Note: Fixed panes at this breakpoint are recommended to be 412dp, but side sheets have a default maximum width of 400dp. A standard side sheet can be used as a third pane Pane expansion & resizing Panes can be resized, expanded, and collapsed using
 drag handles
 A drag handle adjusts the layout when there are 2 or more panes.
 More on drag handles
 . In a split-pane layout, both flexible panes can be freely adjusted, or can snap to certain widths. In a fixed-and-flexible layout, the drag handle can fully collapse and expand the fixed pane. This makes it easy to switch between a single-pane and two-pane layout. The drag handle should also toggle between layout sizes when selected. This can be a tap, double tap, or long press. pause Drag handles can adjust pane size in a list-detail layout At expanded, large, and extra-large breakpoints, two-pane layouts can be customized to snap to set widths when resized. The recommended custom widths are: 360dp 412dp Split-pane with spacer centered visually pause Panes can snap to custom widths when releasing the drag handle Persistent pane resizing The persistent resizing behavior remembers a person's pane width preference. Use this for most resizable layouts. pause Pane widths persist even after a person closes the app The width persists even after a
 breakpoint
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 change. This means that if a two-pane layout is collapsed to one pane at any size, it’ll remain collapsed even when changing breakpoints. pause When a two-pane layout is resized to a single full-width pane, that pane should remain at full-width after switching breakpoints Temporary pane resizing The temporary resizing behavior doesn't remember a person’s preferences for pane width. This is primarily used in supporting pane layouts where resizing is uncommon. pause Supporting pane layouts can have a pane drag handle to temporarily resize the secondary content With temporary resizing, panes should always return to the default layout after the pane or product is closed and reopened. This ensures content is a suitable size for most interactions. pause The pane width can be temporarily adjusted using the drag handle, but will return to the default layout Displaying multiple panes Multiple panes can be displayed in three ways: co-planar, floating, or docked. The layout depends on breakpoint, what the pane does, and how people interact with it: Co-planar: Two side-by-side panes. To stay accessible, persistent utilities like tool panels should be co-planar with primary content. Floating: A small pane displays above larger panes. Temporary tasks should remain floating regardless of breakpoint, such as a dialog. Docked: A small pane pinned to the edge of a window. For example, a
 bottom sheet
 Bottom sheets show secondary content anchored to the bottom of the screen.
 More on bottom sheets
 can be docked to show additional actions. Co-planar: Panes are displayed side by side Floating: A pane is displayed above other panes or content, like a dialog Docked: A pane is displayed above other panes and one of its edges extends beyond one side of the screen, like a bottom sheet How panes adapt Pane layouts can adapt using three strategies: show and hide, levitate, or reflow . When a window is resized or changes orientation, these strategies allow panes to reorganize themselves to preserve context and meaning. Show and hide As the
 breakpoint
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 size or orientation changes, panes can enter and exit the screen or appear next to one another. pause A pane can be shown or hidden depending on the available space and orientation Levitate Panes can be elevated above other content as floating or docked panes. This strategy helps panes appear relative to their triggers. Floating panes: Appear in front of the body content Can be customized to be dragged or resized When adding controls that resize or move a floating pane, provide accessible controls. pause A co-planar pane can float when switching breakpoint or orientation On large screens: Floating panes are the default The scrim behind a floating pane is optional Floating pane with a scrim Floating pane without a scrim Docked panes are usually at the bottom of the window, like a
 bottom sheet
 Bottom sheets show secondary content anchored to the bottom of the screen.
 More on bottom sheets
 . At
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , docked panes can adapt into floating panes. pause A docked pane can adapt into a floating pane at medium and expanded breakpoints Alternatively, at medium and expanded breakpoints, a docked pane can adapt into a co-planar pane. pause A docked pane can also adapt into a co-planar pane at medium and expanded breakpoints On large screens, consider changing docked panes into co-planar panes. A compact screen can have a docked pane On a large screen, it should change to a co-planar pane Reflow Panes can be reorganized on screen as the breakpoint or orientation changes, also known as reflow. For example, in a vertical orientation, the supporting pane can move underneath the primary pane. pause In a vertical orientation, the supporting pane can move below the primary pane Reflow also applies to breakpoints. When there’s not enough horizontal space for panes, they can stack vertically instead. pause Panes can change size, location, and orientation when switching screen sizes Spatial panels On XR devices, pane layouts can be presented in disconnected
 spatial panels
 In Android XR, a spatial panel is a container for UI elements, interactive components, and immersive content.
 More on spatial panels
 . These panels must have clear containment to make them easy to see on any background. The content in a spatial panel can use
 implicit grouping
 Implicit grouping uses close proximity and open space to group related items.
 More on implicit grouping
 when the pane has an explicit container to distinguish it from the environment. When a pane uses explicit containment, content can use implicit grouping Accessibility considerations Coplanar panes The focus order should match the visual arrangement of the panes on screen Floating panes Modal floating pane: When active, the elements behind it can’t be interacted with Focus moves automatically to the first element in the pane, and when the pane is closed, focus moves back to the element that triggered it, like a dialog If triggered automatically, focus should still move to it, but when it’s closed, focus should go to the next most logical element on screen It disappears when a person interacts with something behind it. Non-modal floating pane: When open, other parts of a product can be interacted with Focus should be able to move to and from the pane The pane should be available in a logical reading order of the screen Docked panes Have the same focus requirements as modal and non-modal panes The focus order should match the visual arrangement of the panes on screen

- `f73fdc3537a2a9f3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3nyytv-13-
- `18606ff6bc3f057d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3o5axo-01.
- `43d0961fc67c7683.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3o6q96-02.
- `2e79b8a8f0cbb8b8.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3o8609-GM3
- `372ed8b1a101174e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3oanue-04.
- `9b55354c8340f140.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3ocqkb-05.
- `d994a9308ddd88b2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3oeb3e-06.
- `6492bab6f658d7ca.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3ogbeu-07.
- `cc768cb824deb928.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3ojkaq-08.
- `88ad3d855ef0768a.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3omlsl-GM3
- `08c5230a4122b1d4.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3ooyrc-GM3
- `739b2a59ff97f4e7.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3org16-GM3
- `b96cbb61b1046516.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3otau7-GM3
- `4c92adbde9c5b95d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3ow4kk-15.
- `661cfe51fc5b1ce4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3oxadg-16.
- `799b9db08afdca85.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3oxtwa-17.
- `b92989cf1f258396.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3p0wwo-GM3
- `06b7ebddaebd58cd.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3p3knn-GM3
- `bb2fcd4ec9b4e195.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3p9uz9-20.
- `fa7b8389cf47c25b.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3rcrfk-GM3
- `0155ec3cc1a4fa14.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3rfkvn-GM3
- `2e4f078da1b149fe.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3riptw-23.
- `8b1b1b688d34f9d3.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3skf28-GM3
- `dee689470dca9590.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3smk3l-GM3
- `a7ba5729b736c2c9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3sp9gc-07-

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3o8609-GM3_Applying%20Layouts_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3omlsl-GM3_Applaying%20Layout_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3ooyrc-GM3_Applaying%20Layout_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3org16-GM3_Applaying%20Layout_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3otau7-GM3_Applaying%20Layout_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3p0wwo-GM3_Applying%20Layouts_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3p3knn-GM3_Applying%20Layouts_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3rcrfk-GM3_Applying%20Layouts_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3rfkvn-GM3_Applying%20Layouts_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3skf28-GM3_Applying%20Layouts_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3smk3l-GM3_Applying%20Layouts_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5bgps3-GM3_Applaying%20Layout_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp5bk7hu-lxx28ijn-GM3-Styles-Fou`

## foundations/layout/scaffold/rails

Scaffold – Material Design 3
 Rails Rails Rails are the next level in layout after bars, filling the perimeter space surrounding panes or floating above them. Rails occupy the spaces immediately adjacent to bars: A toolbar sits above the navigation bar A navigation rail and companion rail occupy the leading and trailing sides of a large window On compact screens, the top and bottom rail regions can be used for components like:
 Toolbars
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 Chat inputs
 FABs
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 Other primary controls related to an individual screen On mobile, a toolbar can float in the rail region On larger screens, there are rails on the sides of the screen (as well as top and bottom). The leading side rail region commonly holds the
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 . At larger breakpoints, the leading rail region can be occupied by an expanded navigation rail The rail region on the trailing side of a large screen can hold supporting controls or actions that modify or relate to the content in a pane. The rail region can also be occupied by a vertical toolbar or other controls In XR , rail components can become orbiters , which float outside the visible content area.  In full space, an XR navigation rail can float outside the main content as an orbiter

- `e5431ac25fa3da07.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3nmktk-01.
- `fed5a1b7c25aae52.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3nowjr-02.
- `8e418721168198d9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3nu4r2-04.
- `deeb551d6b742d9d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3nvyg3-05.
- `de63f6a3220540b6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmp3thuiz-03.
- `15aad3a370790c78.png` ← https://lh3.googleusercontent.com/ugQj9qFYRzreLSIZwq9VDe0hhGqgxJaA03G4lbranHplMNpkcItKhC7LoxXW_k3sJMibuVdMLCl8
