# M3 component: segmented-buttons

_Archive: `m3-archive/spec/components/segmented-buttons/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/segmented-buttons/…_

## Overview (full text)

Segmented button – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 star Note: Segmented buttons are no longer recommended in the Material 3 expressive update. For those who have updated, use the connected button group instead, which has mostly the same functionality but with an updated visual design. Segmented buttons can contain icons, label text, or both Two variants: single-select and multi-select Use for simple choices between two to five items (for more items or complex choices, use
 chips
 Chips help people enter information, make selections, filter content, or trigger actions.
 More on chips
 ) Single-select segmented button Multi-select segmented button Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Unavailable Close M3 Expressive update May 2025 The segmented button is no longer recommended. Use the connected button group instead. More on M3 Expressive Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Icons: Optional check icon to indicate selected
 state
 States show the interaction status of a component or UI element.
 More on states
 Layout: Taller container height of 40dp Name and variants: Segmented buttons were previously known as toggle buttons. They now have two official variants: single-select and multi-select. Shape: Fully rounded corners Typography: Labels use sentence case instead of all caps Segmented buttons now have a container height of 40dp M2: Segmented buttons had a small corner radius and label text in all caps M3: Segmented buttons have fully rounded corners, sentence-case text, different height, and new color mappings

## Key measurements (dp, extracted)

- Layout: Taller container height of 40dp Name and variants: Segmented buttons we
- f all caps Segmented buttons now have a container height of 40dp M2: Segmented buttons had a small corne
- idth Container width / total segments (Example: 1/3) Height 40dp Outline width 1dp Label alignment Cente
- r Left/right padding Min 12dp Padding between elements 8dp Target siz
- e 48dp Density Density can be used in denser U
- ly applied to the height. Each step down in density removes 4dp from the height

## Accessibility (full text)

Segmented button – Material Design 3
 Use cases star Note: Segmented buttons are no longer recommended in the Material 3 expressive update. For those who have updated, use the connected button group instead, which has mostly the same functionality but with an updated visual design. Use cases Users should be able to: Navigate to and activate segmented buttons with assistive tech Understand what each segment selection will do Interaction & style For keyboard navigation, Tab navigates to the button, and arrow keys navigate between the individual segments. For single-select segments, Space or Enter will select or unselect the
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 segment. For multi-select segments, Space or Enter will: Select an unselected segment Select all of the segments Unselect a selected segment Use Tab to navigate through segments, and Space or Enter to select and unselect Color contrast Segmented buttons are clusters of similar components, so the outline should have at least a 3:1 contrast ratio with the background or surface. This helps distinguish each button. Both a checkmark icon and a color change are used to distinguish selection. Make sure color isn’t the only way to show selection. check Do Use an outline with a surface contrast of at least 3:1 close Don’t The segmented button shouldn't have a contrast outline less than 3:1 Initial focus Focus will start in the first segment. Depending on the direction of the language, it is either the most left or the most right segment. For single select and multi-select, the first segment will be focused regardless of selection state. Focus begins on the left for left-to-right languages and on the right for right-to-left languages Keyboard navigation Keys Actions Tab Navigate between buttons Arrow keys Navigate inside the component Space or Enter Activate a focused button Labeling elements The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 label for a segmented button comes from the visible label text on such as Relevance and Distance . If the segmented button displays icons without label text, the accessibility label describes the action that the button is expressing, such as Inexpensive for one currency symbol. The label for segmented button matches the text label Single-select segmented buttons behave like
 radio buttons
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 : only one option can be selected at a time. The label is Radiogroup . Multi-select buttons behave like
 checkboxes
 Checkboxes let users select one or more items from a list, or turn an item on or off.
 More on checkboxes
 : more than one option can be selected. The label is Checkbox . The role for the multi-select segmented button is Checkbox

## Specs (full text)

Segmented button – Material Design 3
 Tokens and specs Color States Measurements star Note: Segmented buttons are no longer recommended in the Material 3 expressive update. For those who have updated, use the connected button group instead, which has mostly the same functionality but with an updated visual design. Container Icon (optional for unselected state) Label text Tokens and specs Browse the component elements, attributes, tokens, and their values. Learn more about design tokens Segmented button - Outlined arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Segmented button color roles used for light and dark schemes: On surface Outline Secondary container On secondary container States
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Unselected Unselected button states: Enabled Disabled Hovered Focused Pressed Selected Selected button states: Selected Hovered on selected Focused on selected Pressed on selected Measurements Padding and container size Target size Attribute Value Container width Dynamic based on labels Segment width Container width / total segments (Example: 1/3) Height 40dp Outline width 1dp Label alignment Center Left/right padding Min 12dp Padding between elements 8dp Target size 48dp Density Density can be used in denser UIs where space is limited. Density is only applied to the height. Each step down in density removes 4dp from the height

## Guidelines (full text)

Segmented button – Material Design 3
 Usage Anatomy Single-select Multi-select Placement Behavior star Note: Segmented buttons are no longer recommended in the Material 3 expressive update. For those who have updated, use the connected button group instead, which has mostly the same functionality but with an updated visual design. Single-select Multi-select Usage Segmented buttons help people select options, switch views, or sort elements. A segmented button can help switch between viewing restaurant and bar options There are 2 variants of segmented buttons: Single-select Multi-select Single-select segmented button can only have 1 segment selected Multi-select segmented button can have multiple segments selected Anatomy Segment Container Icon (optional) Label text (optional) Selected icon Segments Segmented buttons can have 2-5 segments. Each segment is clearly divided and contains label text, an icon, or both. There can be anywhere from 2 to 5 segments in single-select and multi-select segmented buttons check Do Segmented buttons are best used for selecting between 2 and 5 choices close Don’t Don’t use more than five segments in a single segmented button. Choices should be scoped. If you have more than five choices, consider using another component, such as chips. Container Like
 common buttons
 Buttons let people take action and make choices with one tap.
 , segmented buttons have fully rounded corners by default. Segmented buttons have fully rounded corners Icons Icons may be used as labels by themselves or alongside text. If an icon is used without label text, it must clearly communicate the option it represents. Segmented buttons can include icons Label text Labels should be short and succinct. If a label is too long to fit within its segment, consider using an icon alone. Use labels that are as clear and short as possible check Do Keep labels short and consistent in length close Don’t Don’t allow segments to wrap onto a new line check Do Use consistent label types exclamation Caution Icons can be used in place of labels, but they must clearly communicate their meaning close Don’t Avoid mixing icon-only labels with text labels. Choose one label type and use that type for all segments. Single-select Use a single-select segmented button to select one option from a set, switch between views, or sort elements from up to five options. For example, use a single-select segmented button to choose one of a set of sizes, such as this beverage size selector. A single select segmented button for choosing beverage size Multi-select Use a multi-select segmented button to select or sort from two to five options. Unlike single-select, selection is not required and a user may concurrently select anywhere from all to none of the options. For example, multi-select segmented buttons can be used to filter by price range when searching for a restaurant. A multi-select segmented button for filtering restaurant search options Placement Segmented buttons should have adequate
 margins
 Margins are the spaces between the edge of a nested element and its parent element, such as the space between a button's label text and the edge of its container.
 More on margins
 from the edge of the viewport or frame. On larger screens, set a maximum padding for all button segments so the set doesn't fill the screen. check Do Allow adequate space for margins. The button container shouldn’t reach the edge of the viewport. check Do Set a maximum padding within the segments to ensure usability on larger screens close Don’t Don’t allow segmented buttons to span the full width of larger screens or panes. This can leave too much padding on either side of the segment label, making the button less usable. Segmented buttons can be placed on other components, such as
 bottom sheets
 Bottom sheets show secondary content anchored to the bottom of the screen.
 More on bottom sheets
 or
 full-screen dialogs
 Full-screen dialogs fill the entire screen, displaying actions that require a series of tasks to complete. They're often used for creating a calendar entry.
 . A segmented button can be placed on a bottom sheet Behavior When using both icons and label text in segmented buttons, the icon label is replaced by the checkmark icon when the segment is selected. pause Icons become checkmarks when selected in buttons that also use label text

## [overview] illustrations

- `75415f8f4d4250ad.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fl20oj7ju-exa
- `f4f295c5b0e2e9f5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7qvais-1.p
- `3cfcf10452507df0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7ruslm-4.p
- `30ca18cf3b8f437a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhr0fyz-2.p
- `cb15ddfba6001956.png` ← https://lh3.googleusercontent.com/D-8dyCWQ3sxdEzNoL4MW-4aX_TSHE0F_wrF40y4bTsKTbVY6mN86qdTP_lmiTwpu0HhzzajqYj1V

## [specs] illustrations

- `3fdbf738f36b5a59.png` ← https://lh3.googleusercontent.com/-uNJiGxEkqwavKi0rqCcQ6_NTV7HdAQ9_eZ9b40fw_6Ij00V60BU3iLu88EgzvFUO0prwPdmKRKo
- `92a85ceba398faed.png` ← https://lh3.googleusercontent.com/0shX8UYtu_19Pa79pXEjmEc2GW6UOTINXPAw9K9HoaRUWiUqDJsLbSBiPTvL3Nd315qjZapICkjO
- `18a5e978d144a1bb.png` ← https://lh3.googleusercontent.com/C6AHlXtNzhGMs8gghgCKSba6mwIpYO0fiDnecohrFF3YJraSvBsQL-eXZnCvQJIU9AqRNgtrrvet
- `cb15ddfba6001956.png` ← https://lh3.googleusercontent.com/D-8dyCWQ3sxdEzNoL4MW-4aX_TSHE0F_wrF40y4bTsKTbVY6mN86qdTP_lmiTwpu0HhzzajqYj1V
- `72f8a2a76ab18776.png` ← https://lh3.googleusercontent.com/PMYMRAaXu4kiEdyI_9iuWFzh9CDRnmy7VqZ7H34w8Y2jeJy0KUUZekkTUR35ISHPJxnChOXSeLwk
- `31664824fa4524a5.png` ← https://lh3.googleusercontent.com/YDundjWkMlYTm9ZC1RERNdV1PS0i86yel8Qe8OjWM7OEoMRC2frzBJzmqAywQu1BSW2eAP2ITtJk
- `fe54ef95defde3f1.png` ← https://lh3.googleusercontent.com/gaOReQpJgFqk-nmLLFHu7hpIFV9BQ6hqnVt8oSC0ZsgpMaeDzc9y-FIcDnkTciniAxMCpPfWD4RM

## [guidelines] illustrations

- `9e8f50d341da448a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7mlxdq-1.p
- `a30db62b6961f15e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7mnnk2-2.p
- `80ce929ab96ba2f6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7mz9ev-3.p
- `3e69711ba92521b3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7n59nt-4.p
- `ffe5de3c3a13cf71.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7nap4m-5.p
- `a7e9ca4c4a08ed0c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7ngd39-6_d
- `bb0d1b556430f1e1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7o4u2i-7_d
- `170f52053fa949e1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7o7un8-8.p
- `793b208213af9810.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7okkk9-9.p
- `4ccad9a8ac6d5cb9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7omu8a-10.
- `bfa7c9d3b796df50.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7pqz1e-11_
- `ff6f5503859ed13d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7prory-12_
- `e04b2376c6fba67b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7psieh-13_
- `a3d01d44c2d4f004.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7pt9gl-14_
- `f446ea533463a6c3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7ptzzf-15_
- `5683d8be679cac00.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7puwq3-16.
- `5344f2aa58f496d6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7pvpf7-17.
- `7bd2872b9c2fb9b0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7pwh9i-18.
- `2d0e49d46067a07e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7pxu9q-18-
- `93741d440fe6b866.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7pyzy1-18-
- `b4ed59e8ce98315f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7q0vrm-19.
- `80c44ec8e85d14f2.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmq6a9huq-GM3%20-%20Buttons%
- `cb15ddfba6001956.png` ← https://lh3.googleusercontent.com/D-8dyCWQ3sxdEzNoL4MW-4aX_TSHE0F_wrF40y4bTsKTbVY6mN86qdTP_lmiTwpu0HhzzajqYj1V

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmq6a9huq-GM3%20-%20Buttons%20-%20Segmented%20Bu`

## [accessibility] illustrations

- `dd71f93077f185d0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7q4935-1.p
- `33806c5703d8bb2b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7q6k39-2_d
- `5ff63345b236bafd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7q87p2-3_d
- `66088480c79f2ca9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7q9t4x-4.p
- `78a0457adf518398.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7qcq3h-5.p
- `c1e5a80af2407b6f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7qpwe0-6.p
- `cb15ddfba6001956.png` ← https://lh3.googleusercontent.com/D-8dyCWQ3sxdEzNoL4MW-4aX_TSHE0F_wrF40y4bTsKTbVY6mN86qdTP_lmiTwpu0HhzzajqYj1V
