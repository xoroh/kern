# M3 component: side-sheets

_Archive: `m3-archive/spec/components/side-sheets/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/side-sheets/…_

## Overview (full text)

Side sheets – Material Design 3
 Availability & resources Differences from M2 Use side sheets to provide optional content and actions without interrupting the main content Two variants:
 standard
 Standard side sheets display content without blocking access to the screen’s primary content, such as an audio player at the side of a music app. They're often used in medium and expanded window sizes like tablet or desktop.
 and
 modal
 Modal side sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken. They're often used in compact breakpoints, like mobile, due to limited screen size.
 People can navigate to another region within the sheet Side sheets can contain a back icon for navigation Standard side sheet
 Modal side sheet Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Unavailable android Jetpack Compose Unavailable android Android Views (MDC-Android) Available language Web Unavailable Close Differences from M2 Right-to-left (RTL) language support with left side sheet Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Shape:
 Modal side sheets
 Modal side sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken. They're often used in compact breakpoints, like mobile, due to limited screen size.
 have a 16dp corner radius Side sheets have new color mappings to support dynamic color

## Key measurements (dp, extracted)

- have a 16dp corner radius Side sheets have new colo
- ing and size measurements Attribute Value Start/end padding 24dp Padding between top elements 12dp Botto
- m actions height 72dp Bottom actions top padding 16dp Bottom
- actions bottom padding 24dp Bottom actions alignment (horizontal) L
- eft Max-width 400dp Margins (when detached) 16dp Modal side
- ing and size measurements Attribute Value Start/end padding 24dp Start padding with icon 16dp Padding be
- tween top elements 12dp Bottom actions height 72dp Bottom actio
- ns top padding 16dp Bottom actions bottom padding 24dp Bott
- om actions alignment (horizontal) Left Max-width 400dp Margins (when detached) 16dp
- Window widths from 600dp to 839dp, such as a tablet or foldable
- Window widths 840dp to 1199dp, such as a tablet or foldable
- Window widths smaller than 600dp, such as a phone in portrait orientatio
- components on the left edge. They can be slightly inset by 16dp. close Don’t Don’t inset a side sheet f

## Accessibility (full text)

Side sheets – Material Design 3
 Use cases Interaction & style Initial focus Keyboard navigation Labeling Use cases People should be able to dismiss the side sheet using assistive technology. Interaction & style Material requires that a close affordance, such as a close
 icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 , is always present within a side sheet. check Do A close icon button makes the side sheet easy to dismiss close Don’t Without a close icon button, people can’t predict the opening and closing flow of side sheets, or know if the sheet is transient or permanent Initial focus Actions within a side sheet can be
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 by tab order using a keyboard or switch control. Visible focus shown on the available actions within a side sheet: Headline Close Cancel Save Keyboard navigation Keys Actions Tab Focus lands on (non-disabled) icon button Space or Enter Activates the (non-disabled) icon button Labeling The accessibility role for a side sheet is Dialog . The role for side sheets is Dialog

## Specs (full text)

Side sheets – Material Design 3
 Tokens & specs Standard side sheet Modal side sheet Tokens & specs Browse the component elements, attributes, tokens, and their values. Learn more about design tokens Sheets - Side arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Standard side sheet Divider (optional) Headline Container Close icon button Standard side sheet color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Side sheet color roles used for light and dark themes: Outline variant On surface variant Surface On surface variant Standard side sheet measurements Side sheet padding and size measurements Attribute Value Start/end padding 24dp Padding between top elements 12dp Bottom actions height 72dp Bottom actions top padding 16dp Bottom actions bottom padding 24dp Bottom actions alignment (horizontal) Left Max-width 400dp Margins (when detached) 16dp Modal side sheet Back icon button (optional) Headline Container Close icon button Divider (optional) Action buttons (optional) Scrim Modal side sheet color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens . Side sheet color roles used for light and dark themes: On surface variant On surface variant Surface container low On surface variant Modal side sheet measurements Modal side sheet padding and size measurements Attribute Value Start/end padding 24dp Start padding with icon 16dp Padding between top elements 12dp Bottom actions height 72dp Bottom actions top padding 16dp Bottom actions bottom padding 24dp Bottom actions alignment (horizontal) Left Max-width 400dp Margins (when detached) 16dp

## Guidelines (full text)

Side sheets – Material Design 3
 Usage Anatomy Adaptive design Behavior Standard side sheet
 Modal side sheet Usage 
 Standard side sheets
 Standard side sheets display content without blocking access to the screen’s primary content, such as an audio player at the side of a music app. They're often used in medium and expanded breakpoints like tablet or desktop.
 are supplementary surfaces used mostly in
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 to
 expanded breakpoints,
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 like tablet and desktop. They provide a consistent and predictable surface for contextual actions and information. Standard side sheets display content that complements the screen’s primary content. They remain visible while people interact with primary content. Common uses include: Displaying a list of actions that affect the screen’s primary content, such as filters Displaying supplemental content and features Information about a photo in a standard side sheet 
 Modal side sheets
 Modal side sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken. They're often used in compact breakpoints, like mobile, due to limited screen size.
 are preferred in
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , like mobile, due to limited screen size. They can display the same kinds of content as standard side sheets, but must be dismissed in order to interact with the underlying content. Modal side sheet with filter controls Side sheets have a fixed width and typically span the height of the screen. Their dimensions depend on how the app’s
 layout
 Layout is the visual arrangement of elements on the screen.
 More on layout
 is subdivided into UI regions. check Do Place side sheets along the edge of the screen, usually on the right side to avoid interference with any navigational components on the left edge. They can be slightly inset by 16dp. close Don’t Don’t inset a side sheet from the screen edges far beyond the recommended margin. This makes the sheet’s position and scroll behavior unclear, while obscuring primary content. Anatomy Divider (optional) Headline Container Close icon button Back icon button (optional) Headline Container Close icon button Divider (optional) Action buttons (optional) Scrim Container Side sheet containers hold all side sheet elements. Their size is determined by the space those elements occupy. The container is the only required element of a side sheet. Container Back icon button (optional)
 Icon buttons
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 can provide ways to exit a side sheet or move to a different experience. Because the primary content behind or beside a side sheet is always visible, it’s important to provide affordances for leaving a side sheet and returning to the primary content. Back icon button Close icon button (optional) A close affordance provides a consistent method for dismissing a side sheet. A close icon button is highly recommended, increases
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 , and makes
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 side sheets easier to close. Close icon button Action buttons (optional)
 Buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 represent actions available from a side sheet. Examples: Save , Edit , Download Use
 elevation
 Elevation is the distance between two surfaces on the z-axis
 More on elevation
 , fill, and
 tone
 Tone is how light or dark a color appears. Tone is sometimes also referred to as luminance.
 More on hue, chroma, and tone
 to call attention to specific actions. Action buttons Divider (optional)
 Dividers
 Dividers are thin lines that group content in lists or other containers.
 More on dividers
 can separate different kinds of content and create distinct regions in a side sheet. Use a divider to separate: Action buttons from content User-generated content from system-generated content Divider Content (optional) Side sheets can display a wide variety of content and
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 , ranging from a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 of actions to supplemental content in a tabular layout. Form controls shown in a side sheet for app settings pause Modal side sheets on smaller screens can transition to standard side sheets at larger screen sizes Adaptive design Side sheets have a default width, but can be resized depending on the needs of the
 layout
 Layout is the visual arrangement of elements on the screen.
 More on layout
 . When a
 standard side sheet
 Standard side sheets display content without blocking access to the screen’s primary content, such as an audio player at the side of a music app. They're often used in medium and expanded breakpoints like tablet or desktop.
 opens, the body area shrinks to accommodate the sheet’s width while maintaining a
 margin
 Margins are the spaces between the edge of a nested element and its parent element, such as the space between a button's label text and the edge of its container.
 More on margins
 on the body’s trailing edge. pause Entrance of standard side sheets will cause the body area to adjust and accommodate the new content RTL language support In right-to-left (RTL) languages, side sheets should appear on the left edge of the window with all elements reversed. Side sheet elements are reversed in RTL languages Behavior Side sheets can vertically scroll independent of the rest of the UI. This allows their scroll position and content to persist while the page is scrolled, and vice versa. Side sheets cannot scroll horizontally. pause check Do Side sheets can vertically scroll internally when their content exceeds the screen height close Don’t Don’t allow horizontal scrolling or lay out the side sheet in a way that suggests horizontal scrolling. A side sheet’s narrow width leaves limited space to fully view items. Predictive back On Android, a
 gesture
 Gestures are all the ways people interact with UI elements using touch.
 More on gestures
 called predictive back allows a person to swipe left or right on the side sheet. When predictive back is used: The side sheet detaches from the top and bottom edges of the screen to signal it will close The previous screen is revealed in a preview The side sheet and its content always scales in the direction of the gesture Find a list of compatible components pause Preview of the result of the gestures: release to commit, fling to commit, and cancel

## [overview] illustrations

- `7036e2301af4442d.png` ← https://lh3.googleusercontent.com/5DQn6-h3w6BIR9DoXAncCck22WNg-86e7uh4meG22SsqcvVMb966220Fp-Ooiwui3eekiqk8p_Uq
- `1c837cb2abaedb54.png` ← https://lh3.googleusercontent.com/NcjJRXvRM56DuF0hrulvw3eixw8QXtodshjuhM6OgLXuC54E06Ov7JGxPSynfQiwGnaQspHgMps2
- `c29180d694ea9347.png` ← https://lh3.googleusercontent.com/n8fIOtVTaebce3t16v7jMRN1-sL2Xj13DBTxPiQA3tLczCD_Za-MdXw5wAoGOpoczWBOCeCndDrJ

## [specs] illustrations

- `6eafc5de7b13972d.png` ← https://lh3.googleusercontent.com/2LAblBbcF_ZBcupC3Q2aXZlYse3imp3Y1ePIVfC3DY5iefsYPzFRDPu20wDJmkgcAxlpprO9NpnB
- `574169fce6a5045c.png` ← https://lh3.googleusercontent.com/LqFhUoIZJCxI-xrg-swaOn2vwlyswPNvs2JQfS2oNHhVms4yvkJE1tCBaFLUxKH_B-NWUoZ9Wo5Q
- `a4321bfa9fcfd1d5.png` ← https://lh3.googleusercontent.com/MCbwK4pOf-VBkCt3qXBvBVReNnD3TzDuwLJdajh_CvxUT_TN3_5Ho5v3QyV0SHhv5IHbZP0V5UbC
- `061b7710b3bcef2e.png` ← https://lh3.googleusercontent.com/ggmDZsvw6x0ei4ktaEtZbG_D-SvR-dKw59udjcKCr7KdED37SNpjgIxFdBL6ySJrdglC7AeXbcho
- `79f7a810c2897bd1.png` ← https://lh3.googleusercontent.com/lg2svhv9DuP5FMVqxsmnsLS5m2S1aSqU4fcUuQacBh9lHSy2DiPpaUpGpphS0iiVcuOJvSHp95mF
- `ffb07721e0e840ec.png` ← https://lh3.googleusercontent.com/mCkCbKeP2EQNehrmAoIhTh8csAxLh6TS5YKqEtZWs-p6OhXjXK3OQ-8GxAiPRoDu7tQQ_qh6pdkk
- `c29180d694ea9347.png` ← https://lh3.googleusercontent.com/n8fIOtVTaebce3t16v7jMRN1-sL2Xj13DBTxPiQA3tLczCD_Za-MdXw5wAoGOpoczWBOCeCndDrJ

## [guidelines] illustrations

- `20fc9f364a16a8e0.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8ytzch-GM3
- `a8ebb32a073feb88.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8yw08l-GM3
- `7b8310af00f29ede.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8yz6fq-GM3
- `773fda234af98add.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8z3x56-19_
- `b1cb2fe6464429a8.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8z7v0k-GM3
- `762f50124d34d14e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqqqohk-01.
- `2b83d41dc0ca6a52.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqr6mnd-02.
- `e63974dd9726cc39.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqrab5f-03.
- `39c1e1f5f2976889.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqrlvws-04-
- `ce690980e52613d2.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqrngv8-05-
- `15645e2dec491ec1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqrqfpt-06.
- `58303c3598a869aa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqrrjh7-07.
- `70950453dfd11a1e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqsampe-08.
- `790a32c03f434761.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqsgqgs-09.
- `5c5769ca745c81d1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqsns8t-10.
- `b2ef7f9c65d27bc1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqsw3fe-11.
- `46544719d51866c7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqsz2ma-12.
- `07982f35843a6b0c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqt0pai-13.
- `42857d03df57d7dd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmeqwb27c-16.
- `c29180d694ea9347.png` ← https://lh3.googleusercontent.com/n8fIOtVTaebce3t16v7jMRN1-sL2Xj13DBTxPiQA3tLczCD_Za-MdXw5wAoGOpoczWBOCeCndDrJ

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8ytzch-GM3-Components-SideShee`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8yw08l-GM3-Components-SideShee`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8yz6fq-GM3-Components-SideShee`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8z7v0k-GM3-Components-SideShee`

## [accessibility] illustrations

- `e3e84ec0e2d5a3a5.png` ← https://lh3.googleusercontent.com/0LSf0hnC19HAyDDf88fqzUUo62971bFb2XWjHguURc3jJbZpy8ejGuIyFR-2MSFM27gLA3LjupVj
- `1f64e3456f820944.png` ← https://lh3.googleusercontent.com/MuS9aCeC3P_ukbbopUpL7M9rV8VhBbirg3UofV-_SA7g-v4ABLSE8zgMWQOlHo7WP5XEd7s-KyR1
- `28bdcf5cbe05fffd.png` ← https://lh3.googleusercontent.com/bGugN52A6j4bvI4smHp21cQzZbZv4qaF9YBYdKZDD51XL6yAkHSY_KVtpUF7HkL6G04T2w61MQeJ
- `c29180d694ea9347.png` ← https://lh3.googleusercontent.com/n8fIOtVTaebce3t16v7jMRN1-sL2Xj13DBTxPiQA3tLczCD_Za-MdXw5wAoGOpoczWBOCeCndDrJ
- `e333b286e9c734b6.png` ← https://lh3.googleusercontent.com/ogti7RlWzhZNIER0PGHxR2hM--wMncqBhexq_aLUiY6OPM1C5NeuaWV29SOOqi5gjdr7dGbCFrlP
