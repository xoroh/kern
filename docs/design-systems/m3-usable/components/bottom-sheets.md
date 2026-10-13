# M3 component: bottom-sheets

_Archive: `m3-archive/spec/components/bottom-sheets/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/bottom-sheets/…_

## Overview (full text)

Bottom sheets – Material Design 3
 Availability & resources Differences from M2 Use bottom sheets in
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 and
 medium breakpoints
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 Two variants:
 standard
 Standard bottom sheets display supplementary content without blocking access to the screen’s primary content, such as an audio player at the bottom of a music app.
 and
 modal
 Modal bottom sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken.
 Content should be additional or secondary (not the app’s main content) Bottom sheets can be dismissed in order to interact with the main content Standard bottom sheet Modal bottom sheet Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Android Views (MDC-Android) Available android Jetpack Compose Available language Web Unavailable Close Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Shape: Bottom sheets have a 28dp top corner radius Layout: New max-width of 640dp and an optional drag handle with an accessible 48dp hit target

## Key measurements (dp, extracted)

- Window widths smaller than 600dp, such as a phone in portrait orientatio
- Window widths from 600dp to 839dp, such as a tablet or foldable
- Shape: Bottom sheets have a 28dp top corner radius Layout: New max-width
- of 640dp and an optional drag handle with an acc
- essible 48dp hit target
- measurements Bottom sheets span the full window width up to 640dp. When the window width exceeds 640dp, b
- ottom sheets adjust to have a top margin of 56dp and side margins of 56dp. Attribute Val
- lignment (horizontal) Center Drag handle padding top/bottom 22dp Top margin 72dp Top margin (window widt
- h > 640dp) 56dp Start/end margin (window width >
- 640dp) 56dp Width Full width, up to max-width
- 640dp Height Variable
- Window widths 840dp to 1199dp, such as a tablet or foldable
- ouch gestures Interaction & style Touch target area The top 48dp portion of the bottom sheet is interact

## Accessibility (full text)

Bottom sheets – Material Design 3
 Use cases Interaction & style Keyboard navigation Labeling Use cases Users should be able to: Resize bottom sheets without having to rely on touch gestures Interaction & style Touch target area The top 48dp portion of the bottom sheet is interactive when user-initiated resizing is available and the drag handle is present. To ensure touch target accessibility, the top portion of a bottom sheet can be reserved for resize interactions Initial focus The optional drag handle can be
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 in the tab order and interacted with using non-touch
 inputs
 Inputs are devices that provide interactive control of an app. Common inputs are a mouse, keyboard, and touchpad.
 , such as keyboard or
 switch
 Switches toggle the state of an item on or off.
 More on switches
 controls. Visible focus shown on the drag handle affordance Dragging Include a single-pointer alternative for any action that can be completed by dragging. Drag handles should cycle the bottom sheet through available heights when selected. If a drag handle can’t be used, add a button to do this action. Interacting with the drag handle can quickly move a bottom sheet through preset heights A bottom sheet can automatically resize to another height after interacting with the drag handle Keyboard navigation Keys Actions Tab Focus lands on drag handle Space / Enter Toggles between available heights Labeling Label only the drag handle. The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 role for the drag handle is “button.” Label the drag handle

## Specs (full text)

Bottom sheets – Material Design 3
 Tokens and specs Color Measurements 
 Modal bottom sheets
 Modal bottom sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken.
 are above a scrim while
 standard bottom sheets
 Standard bottom sheets display supplementary content without blocking access to the screen’s primary content, such as an audio player at the bottom of a music app.
 don't have a scrim. Besides this, both variants of bottom sheets have the same specs. Container Drag handle (optional) Scrim Tokens and specs Browse the component elements, attributes, tokens, and their values. Learn more about design tokens Sheets - Bottom arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down Close Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Bottom sheet color roles used for both light and dark schemes: Scrim* On surface variant Surface container low *On Android platforms, the scrim color and opacity is automatically handled by the system UI. Measurements Bottom sheet padding and size measurements Bottom sheets span the full window width up to 640dp. When the window width exceeds 640dp, bottom sheets adjust to have a top margin of 56dp and side margins of 56dp. Attribute Value Drag handle alignment (horizontal) Center Drag handle padding top/bottom 22dp Top margin 72dp Top margin (window width > 640dp) 56dp Start/end margin (window width > 640dp) 56dp Width Full width, up to max-width 640dp Height Variable

## Guidelines (full text)

Bottom sheets – Material Design 3
 Usage Anatomy Standard bottom sheets Modal bottom sheets Responsive layout Behavior Standard bottom sheets Modal bottom sheets Usage Bottom sheets display supplementary content and actions on a mobile screen. Bottom sheet containing contacts and applications Bottom sheets are a versatile component that can contain a wide variety of information and
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 , including
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 items (in
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 or grid layouts), actions, and supplemental content. Bottom sheet with menu items in a list Anatomy A container is the only required element of a bottom sheet. Bottom sheet
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 can vary widely to support the kinds of content they contain. Container Drag handle (optional) Scrim (modal only) Container Bottom sheet containers hold all bottom sheet elements. Their size is determined by the space those elements occupy. The container is the only required element of a bottom sheet. All other elements are optional. Bottom sheets are flexible containers that adapt to their content and available space List items (optional) 
 Lists
 Lists are continuous, vertical indexes of text and images.
 More on lists
 are a continuous group of text or images. List items can include label text, icons, and text
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 , among other elements. Bottom sheet containing a list with icons Dividers (optional) 
 Dividers
 Dividers are thin lines that group content in lists or other containers.
 More on dividers
 can be used to separate related content in bottom sheets. Bottom sheet with a divider separating kinds of actions Media (optional) Thumbnail Bottom sheets can include thumbnails for an avatar or logo. Image Bottom sheets can include photos, illustrations, and other graphics, such as weather icons. Video Bottom sheets can include video. Bottom sheets can contain thumbnails, images, and video Standard bottom sheets Standard bottom sheets co-exist with the screen’s main UI region and allow for simultaneously viewing and interacting with both regions, especially when the main UI region is frequently scrolled or panned. Use a standard bottom sheet to display content that complements the screen’s primary content, such as an audio player in a music app. The music player in this standard bottom sheet allows people to control their music while browsing albums At full-screen height, standard bottom sheets contain a collapse icon in an app bar to return to their initial position. Standard bottom sheets can contain supplementary content that continues below the screen, such as location information over a map. pause A bottom sheet can have preset positions from full-screen height to preview Modal bottom sheets Like
 dialogs
 Dialogs provide important prompts in a user flow.
 More on dialogs
 , modal bottom sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken. A modal bottom sheet must be interacted with or dismissed. Its blocking behavior makes it suitable for a menu, such as in this files app, to help people focus on their available choices. Use a modal bottom sheet as an alternative to inline
 menus
 Menus display a list of choices on a temporary surface.
 More on menus
 or simple
 dialogs
 Dialogs provide important prompts in a user flow.
 More on dialogs
 on mobile, especially when offering a long
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 of action items, or when items require longer descriptions and icons. Modal bottom sheets are used in mobile apps only. Modal bottom sheets can be used instead of menus to present additional actions Visibility To provide access to its top actions, the initial vertical position of
 modal bottom sheets
 Modal bottom sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken.
 is capped at 50% of the screen height. Modal bottom sheets whose contents exceed 50% of the screen height can then be pulled across the full screen and scrolled internally to access their remaining items. The initial vertical position of modal bottom sheets can't exceed 50% of the screen height 
 Modal bottom sheets
 Modal bottom sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken.
 appear when triggered by a user action, such as tapping a
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 or an overflow icon. They can be dismissed by: Tapping a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 item or action within the bottom sheet Tapping the scrim Swiping the sheet down Using a close affordance within the bottom sheet’s
 app bar
 App bars display information and actions at the top of a screen.
 More on app bars
 , if available Display a close affordance in a full-screen modal bottom sheet. Tapping the scrim dismisses a modal bottom sheet A modal bottom sheet can be dismissed by swiping the sheet down Responsive layout Compact breakpoint In
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , like mobile devices, bottom sheets extend across the width of a screen and are elevated above the primary content. Bottom sheets should extend to the width of the screen on mobile Medium and expanded breakpoints For larger screens with
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , bottom sheets have a default max-width to prevent undesired
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 and awkward spacing. However, this can be overridden if needed. For more complex tasks and flows, consider using a non-transient surface such as a
 floating sheet
 Floating sheets show secondary content on a surface that can be anchored to the screen or moved.
 . Bottom sheets on larger screens like tablet have a max width that can be overridden On larger
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , like desktop, a bottom sheet can be swapped for a
 side sheet
 Side sheets show secondary content anchored to the side of the screen.
 More on side sheets
 that shows similar content. Side sheets can contain the same content as bottom sheets and may be more suitable for desktop Behavior Bottom sheets can offer an expansion option where the sheet is fully raised and toggled between a collapsed and expanded
 state
 States show the interaction status of a component or UI element.
 More on states
 . This provides a more predictable footprint of the sheet, and can be set by the system or toggled by the user. A bottom sheet for sharing can appear fully raised if needed Alternately, a bottom sheet for sharing can appear collapsed for a more focused set of actions Custom positioning The drag handle can be dragged or selected to change the bottom sheet height. Sheets should be able to cycle through preset heights and close completely without dragging. Selecting the drag handle should toggle through preset heights or close the sheet, while selecting the scrim should always close the bottom sheet. If the bottom sheet has multiple preset heights but can’t use a drag handle, Material requires the inclusion of a single-pointer alternative to change height. Interacting with the drag handle can quickly move a bottom sheet through preset heights A bottom sheet can automatically resize to another height after interacting with the drag handle Scrolling Bottom sheets can be horizontally scrolled, independent of the rest of the screen’s content. Bottom sheets should be scrollable when their content exceeds the initial viewable height Back On Android, a
 gesture
 Gestures are all the ways people interact with UI elements using touch.
 More on gestures
 called predictive back allows a user to swipe left or right on the bottom sheet. Bottom sheet detaches from the left and right edges of the screen to signal it will close Previous screen is revealed in a preview A list of compatible components is available in the gestures article . pause Preview of the result of the gesture, release to commit, fling to commit, and cancel

## [overview] illustrations

- `75cecc94744b2885.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp3m82k-1.p
- `5c058f32d543c04d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp3mrmz-2.p
- `14e9f1b379153e0a.png` ← https://lh3.googleusercontent.com/anRizsTTKb3ZFDxvaOQnGhnaepLiJtk__kY2eOG1-X9tBEOZ_Efjd8vHU14mujMBUuRZXdKZjW6k

## [specs] illustrations

- `c8137d0aa2e903b7.png` ← https://lh3.googleusercontent.com/DRToa14TKB2-AlRHwUn1aPr1fykKEPGlGiKLDxHYv9B9e5CeupNBR-mM7uQOfp_OK-ZHdqjgboBe
- `14e9f1b379153e0a.png` ← https://lh3.googleusercontent.com/anRizsTTKb3ZFDxvaOQnGhnaepLiJtk__kY2eOG1-X9tBEOZ_Efjd8vHU14mujMBUuRZXdKZjW6k
- `97a39ddfab900c32.png` ← https://lh3.googleusercontent.com/gVNIjqiBu0DjSUv-lwnH3xIvACuZ6S4LWuUrUHe_KA0V_GlU3w-iwKPM-ka_6KfmjFuQJ1k6qrmm
- `5a25275fdfb7acf1.png` ← https://lh3.googleusercontent.com/zukI3AJrMtdfLMWQT4wlAlMvIUfkIHpc5QmTQNqYJpxh-cV8QEJcVsy9Yc198HJsK1Od4d-cEiCf

## [guidelines] illustrations

- `988616da44de0a48.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7eqa7-1.p
- `edcbd64ee24ce21e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7jb72-2.p
- `205e653c0ac6635f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7jy07-3.p
- `1176063bb9024f33.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7l25p-4.p
- `930db1a1e9f02db0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7llpd-5.p
- `f4c110a3bb13cc8d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7m0a5-6.p
- `2d13c392b2a6c05e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7t324-7.p
- `45a2eef6e3af419d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7tqb3-8.p
- `065d867ade8fc43d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7ubva-9.p
- `2837b649f2b888b4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp7yz9g-11.
- `769a1f6a627a4625.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp80k55-14.
- `feb95b5ff7fc24f5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp81a31-Bot
- `46fc121076469a49.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp86bt1-15.
- `c8957ae2466f9322.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp86pgb-16.
- `643ae5cd98520ff4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp877lp-17.
- `692554f7f68dcd1e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp87qvd-18.
- `0187f14841c785e4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp8870t-19.
- `86a53e12da11e951.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp8argg-20.
- `4df744de1948e0c3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp8b6u5-21.
- `2c022ea9e3a6eb46.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp8bo42-22.
- `0e1242f4111816a4.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvpbsatl-GM3
- `597c1f82f110a938.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvpbtr1r-GM3
- `50f2e691a5ec7b74.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvqcnuc5-12.
- `db4b7851860965b2.png` ← https://lh3.googleusercontent.com/0hAPkL3uzyvqMvvRWFno-49bG4xDEWveRgFgP06QiwL9TTPtIatzwZnFBVZI70GmAn_NyU9lVQQ-
- `14e9f1b379153e0a.png` ← https://lh3.googleusercontent.com/anRizsTTKb3ZFDxvaOQnGhnaepLiJtk__kY2eOG1-X9tBEOZ_Efjd8vHU14mujMBUuRZXdKZjW6k

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvpbsatl-GM3-Components-BottomSh`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvpbtr1r-GM3-Components-BottomSh`

## [accessibility] illustrations

- `e66a895b9b7479c3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp8g5p9-1.p
- `a8a5769407541dc0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp8gmd5-bot
- `6fbc98a57562f904.png` ← https://lh3.googleusercontent.com/Qbh70YFT_L81Y-982OVil6qLEB90imUJs9wbRQLdxVkcYIPlYik995maTieLEuP8Oc-T1-2WrcTu
- `14e9f1b379153e0a.png` ← https://lh3.googleusercontent.com/anRizsTTKb3ZFDxvaOQnGhnaepLiJtk__kY2eOG1-X9tBEOZ_Efjd8vHU14mujMBUuRZXdKZjW6k
- `3471d3a87ad4258b.png` ← https://lh3.googleusercontent.com/oTYgjX2EiyzXtztzy6pKLtl4orLwt83InSn2nHXrJuSKwwBhO-R1pllkNzYnilWk-qI5_eNNob5z
- `c794d30fc9d1efcd.png` ← https://lh3.googleusercontent.com/rQnID5aS5_ORuWh7Yp2LhBOLLPZQrEvPmowQpgTLFeBfTwyBEMJjvvOYIo991CA4BiA9o4uEZBAL
