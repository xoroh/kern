# M3 component: checkbox

_Archive: `m3-archive/spec/components/checkbox/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/checkbox/…_

## Overview (full text)

Checkbox – Material Design 3
 Availability & resources Differences from M2 Use checkboxes (instead of
 switches
 Switches toggle the state of an item on or off.
 More on switches
 or
 radio buttons
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 ) if multiple options can be selected from a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 Label should be scannable Selected items are more prominent than unselected items Unselected, selected (hover), and indeterminate checkboxes Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Available Close Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 States
 States show the interaction status of a component or UI element.
 More on states
 : New indeterminate states as well as error states for unselected, selected, and indeterminate M2 M3

## Key measurements (dp, extracted)

- Focused Pressed Measurements Attribute Value Container size 18dp Container corner shape 2dp Icon size 18
- dp Icon alignment Center-aligned Target size 48dp State-layer size 40dp
- Window widths 840dp to 1199dp, such as a tablet or foldable

## Accessibility (full text)

Checkbox – Material Design 3
 Use cases Interaction & style Avoid applying density by default Keyboard navigation Labeling elements Use cases People should be able to use assistive technology to: Navigate to a checkbox Toggle the checkbox on and off Get appropriate feedback based on input type documented under Interaction & style Interaction & style Users should be able to select either the text label or the checkbox to select an option. A checkbox selected via the text label The parent checkbox has three states: selected, unselected, and indeterminate. Checkboxes can be selected or unselected regardless of the state of the other checkboxes in a group. If some, but not all, child checkboxes are checked, the parent checkbox becomes indeterminate. Selecting an indeterminate parent checkbox will check all of its child checkboxes. An indeterminate selection indicating that at least one checkbox is selected within a group Avoid applying density by default Don't apply density to checkboxes by default — this lowers their targets below our best practice of 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme. To ensure that this density setting can be easily reverted when it's active, keep all the targets to change it at minimum 48x48 CSS pixels each. Keyboard navigation Keys Actions Tab Moves focus to
 enabled
 An enabled state communicates an interactive component or element.
 More on enabled state
 chip or chip group Space or Enter Activates, selects, or deselects the focused chip Backspace or Delete Removes currently
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 input chip Arrows Moves focus between chips Labeling elements If the UI text is correctly linked to the checkbox, assistive tech (such as a screen reader) will read the UI text followed by the component’s role. The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 label for an individual checkbox is typically the same as its adjacent text label. The accessibility label clearly states the text label of the checkbox

## Specs (full text)

Checkbox – Material Design 3
 Tokens & specs Checkbox Color States Measurements Tokens & specs Browse the component elements, attributes, tokens, and their values. Checkbox arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Checkbox Container Icon Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Checkbox State-layer Icon Adjacent text label color Use the
 color role
 Color roles are assigned to UI elements based on emphasis, container type, and relationship with other elements. This ensures proper contrast and usage in any color scheme.
 on surface for adjacent text labels. This remains the same even if interacting with the label or component. The text color remains the same regardless if the checkbox is selected or not States States are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Enabled Disabled Hovered Focused Pressed Measurements Attribute Value Container size 18dp Container corner shape 2dp Icon size 18dp Icon alignment Center-aligned Target size 48dp State-layer size 40dp

## Guidelines (full text)

Checkbox – Material Design 3
 Usage Anatomy Responsive layout Behavior Checkboxes in a list of items Usage Use checkboxes to:  Select one or more options from a list Present a list containing sub-selections Turn an item on or off in a desktop environment Visually group similar options together Checkboxes select multiple, related options Checkboxes should be used instead of
 switches
 Switches toggle the state of an item on or off.
 More on switches
 if multiple, related options can be selected from a list. Checkboxes visually group similar items effectively and take up less space than switches. check Do Checkboxes let users select one or more options from a list. A parent checkbox allows for easy selection or deselection of all items. close Don’t If a list consists of multiple options, don't use switches. Instead, use checkboxes. Checkboxes imply the items are related, and take up less visual space. Alternate selection controls Checkboxes,
 radio buttons
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 , and
 switches
 Switches toggle the state of an item on or off.
 More on switches
 are the three main selection controls. They all help people make choices, like selecting options or switching settings on or off. Use checkboxes to select multiple related options in a list. Use radio buttons to select a single option in a list. Use switches to select standalone or more verbose options in a list, like settings. Radio buttons Switches Anatomy 1. Container 2. Icon Responsive layout In
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , placing checkboxes within a contained region such as a
 side sheet
 Side sheets show secondary content anchored to the side of the screen.
 More on side sheets
 can help group related controls and available actions. A side sheet can group related controls on larger screens Behavior Multiple checkboxes in a list can be selected. pause Selecting multiple items in a list using checkboxes Checkboxes can have a parent-child relationship with other checkboxes. When the parent checkbox is checked, all child checkboxes are checked If a parent checkbox is unchecked, all child checkboxes are unchecked If some, but not all, child checkboxes are checked, the parent checkbox becomes an indeterminate checkbox. Checking an indeterminate checkbox checks all child items. pause Use a parent checkbox to make it more efficient to select many items When selected, a checkbox clearly and instantly communicates its selected state. If used to turn something on or off, the action should be immediately executed. pause Turning an item on or off using a checkbox

## [overview] illustrations

- `3488269e81490ea3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmab66psf-2.p
- `c10b3743514a5cd3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmab66tlq-3.p
- `c0aa153f3a65363e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcyjgb31-01.
- `ae4ba2f9b4654070.png` ← https://lh3.googleusercontent.com/aU_5afl5gGlvkbfrZbNt8vLxHxTXGm9EnzkEUsov69ZMUQ_Rjtm96HsJdAfX5RlSrsvrS9inZbRE

## [specs] illustrations

- `d7b9e6b453559c2b.png` ← https://lh3.googleusercontent.com/712ygEoSMR9tGvygN9LKJ8DZ7BhOWkzxv1y86AilaXmqdTa30fz5WP68koUEZThkz30akxDDI3CU
- `a21996c0954d8618.png` ← https://lh3.googleusercontent.com/CcUqIZiHlrkBXYmqL54pCjCjsNpVnHsMf6QdUXITGzV89PkHrNbV84_w9I5ZgcNPlMFcCVbTxYhZ
- `e2a39fbfcec4a019.png` ← https://lh3.googleusercontent.com/Yor59BqmDg2qk4vgXtDVI9FzkAcqUFQZ4EjWrwLc_rYafcVTgirLkf-bt1t7JbvpRyPYQYvrP8ZM
- `ae4ba2f9b4654070.png` ← https://lh3.googleusercontent.com/aU_5afl5gGlvkbfrZbNt8vLxHxTXGm9EnzkEUsov69ZMUQ_Rjtm96HsJdAfX5RlSrsvrS9inZbRE
- `6c0d638acbf8f12d.png` ← https://lh3.googleusercontent.com/o7Jd5nbugG-76fMDJwv-WD-ardrEfZF5Nxfq_8Pikz0V6pnzJXvDA6C4NPzOpZ3z39Rjb6tb1yxx
- `3e5349e3c6f37e32.png` ← https://lh3.googleusercontent.com/tRScc_0bS1gM7jai2Ojj3qDzyhE696wedzZNPry2Pson8ONvZ_S_IoRUO6RwZBC5-YQUmgqLKG0x

## [guidelines] illustrations

- `e53ba469adfdcc6f.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwj3f7ot-GM3
- `c0eb73a2b2717a39.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwj3h4ri-GM3
- `e7f8addd8588dbd7.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwj3iba1-GM3
- `2cfb2438dadbd3b7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcypcjyf-5.p
- `df5159643082200d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcypfx6t-7.p
- `f5f8f69e19634cf8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0vnl39-2.p
- `bae10e91f6166448.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0vok05-3_d
- `c798386f8134d932.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0vp83b-8.p
- `eba6f0af55b4b584.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0vwf9n-4_d
- `a60f234f76cf902a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0vwj88-6.p
- `4df487771b9dd0f3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0yt1n6-1.p
- `ae4ba2f9b4654070.png` ← https://lh3.googleusercontent.com/aU_5afl5gGlvkbfrZbNt8vLxHxTXGm9EnzkEUsov69ZMUQ_Rjtm96HsJdAfX5RlSrsvrS9inZbRE

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwj3f7ot-GM3-Components-Checkbox`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwj3h4ri-GM3-Components-Checkbox`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwj3iba1-GM3-Components-Checkbox`

## [accessibility] illustrations

- `2f5d3a90c70c8134.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcyq4z51-2.p
- `d148d092e96a9cee.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0vkh7s-1.p
- `c7f0c3c69ceaf8bb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0vlqi0-3.p
- `ae4ba2f9b4654070.png` ← https://lh3.googleusercontent.com/aU_5afl5gGlvkbfrZbNt8vLxHxTXGm9EnzkEUsov69ZMUQ_Rjtm96HsJdAfX5RlSrsvrS9inZbRE
