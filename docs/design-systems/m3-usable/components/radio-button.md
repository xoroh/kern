# M3 component: radio-button

_Archive: `m3-archive/spec/components/radio-button/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/radio-button/…_

## Overview (full text)

Radio button – Material Design 3
 Resources & availability What’s new Use radio buttons (not
 switches
 Switches toggle the state of an item on or off.
 More on switches
 ) when only one item can be selected from a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 Label should be scannable Selected items are more prominent than unselected items Radio buttons can be selected Resources & availability Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Available Close What’s new Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Radio buttons feature new color mappings

## Key measurements (dp, extracted)

- ts Radio button size measurements Attribute Value Icon size 20dp State layer size 40dp Target size 48dp

## Accessibility (full text)

Radio button – Material Design 3
 Use cases Interaction & style Initial focus Keyboard navigation Labeling elements Use cases People should be able to do the following with assistive technology: Navigate to a radio button Select a radio button Get appropriate feedback based on
 input
 Inputs are devices that provide interactive control of an app. Common inputs are a mouse, keyboard, and touchpad.
 type Interaction & style A radio button can be either selected or unselected. Selecting one radio button deselects any others. A radio group can start with one radio button selected, or none selected. Once a radio button is selected, the group can’t be deselected. To let people opt out of their selection, either provide a Not applicable or No option radio button, or provide a separate way to deselect all radio buttons, like Clear selection . People should be able to select either the text label or the radio button to select an option. pause Only one radio button is selected at a time Avoid applying density by default Don't apply density to radio buttons by default. This lowers their targets below Material's recommendation of 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme. To ensure this density setting can be easily reverted when it's active, keep all targets to change it at a minimum of 48x48 CSS pixels each. Initial focus When outside the radio group, Tab moves focus directly to the selected radio button, or the first one if none are selected. Shift+Tab instead focuses on the last radio if none are selected. Use the arrows to navigate between options. Tab brings the focus to the initially selected item or the initial radio option Arrows move to next element in a list Keyboard navigation Keys Actions Tab Moves focus into the group to the selected radio button, or the first if none are selected Shift + Tab Moves focus into the group to the selected radio button, or the last if none are selected Arrows Moves focus and selects the previous or next radio button. Wraps focus and selection between the first and last radio buttons. Space Selects a focused radio button. If already selected, does nothing. Labeling elements If the UI text is correctly linked to the radio button, assistive tech such as a screenreader will read the UI text, followed by the component’s role. The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 label for a group of radio buttons is typically the same as its title. The role is Radio group . Label the radio group based on the category title The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 label for an individual radio button is typically the same as its adjacent text label. Label the radio button based on its label text

## Specs (full text)

Radio button – Material Design 3
 Tokens & specs Color States Measurements Radio button icon Tokens & specs Learn more about design tokens Radio Button arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Radio button color roles used for light and dark themes: Primary On surface variant Adjacent text label color Use the
 color role
 Color roles are assigned to UI elements based on emphasis, container type, and relationship with other elements. This ensures proper contrast and usage in any color scheme.
 on surface for adjacent text labels. This remains the same even if interacting with the label or component. The text color remains the same regardless if the button is selected or not States
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Enabled Hover Focus Pressed Disabled State specs are in the token module above Measurements Radio button size measurements Attribute Value Icon size 20dp State layer size 40dp Target size 48dp

## Guidelines (full text)

Radio button – Material Design 3
 Usage Anatomy Placement Behavior Radio buttons Usage Radio buttons are the recommended way to allow users to make a single
 selection
 Selection lets users choose specific items to act on.
 More on selection
 from a list of options. Only one radio button can be selected at a time. pause Radio buttons should always be accompanied by clear inline labels Use radio buttons to: Select a single option from a set Expose all available options Radio buttons are single-select, unlike checkboxes which are multi-select check Do Use radio buttons when only one option can be selected from a list check Do Use checkboxes when multiple options can be selected from a list Avoid nesting radio buttons or using radio buttons to select multiple options. close Don’t Don’t nest radio buttons close Don’t Don’t allow radio buttons to select multiple options Alternate selection controls Radio buttons are one of several
 selection
 Selection lets users choose specific items to act on.
 More on selection
 controls, which allow people to make choices such as selecting options or switching settings on or off.
 Switches
 Switches toggle the state of an item on or off.
 More on switches
 and
 checkboxes
 Checkboxes let users select one or more items from a list, or turn an item on or off.
 More on checkboxes
 are alternative selection controls that can be used to change settings or preferences. Switches Checkboxes Use radio buttons when there are five or fewer options. Consider using a drop-down
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 instead of radio buttons when it’s important to save space on a screen. However, drop-down menus require additional steps for a person, both in the number of clicks and cognitive effort. check Do Use radio buttons when there are five or fewer options check Do Consider using a drop-down menu instead of radio buttons when space is constrained Anatomy Selected icon Adjacent label text Unselected icon Adjacent label text Always pair radio buttons with an adjacent label describing what the radio button selects. Because only one radio button can be selected at a time, each choice must have its own label. pause Radio button always need label text Placement Radio buttons are often arranged in stacked
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 . Radio buttons should be vertically listed and have one option always selected. check Do Radio buttons should always have one option pre-selected exclamation Caution Avoid using horizontal radio button lists Behavior A radio button is successfully selected when a person clicks or taps either the radio button icon or the label. pause Radio buttons should take effect immediately, unless they're in a dialog or page that needs to be saved

## [overview] illustrations

- `ede0954945d15202.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc92gkg1-01.
- `630f97311f63ff76.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0z3b8a-02.
- `6a6ecb5f9bbcdb5c.png` ← https://lh3.googleusercontent.com/RKWgcABIrCHrrGhFi6_duV8zcWSY1nscgia4GD9DNgEPPjQ4-FtpeneiI0NLKi8SPqIivalSBu_0

## [specs] illustrations

- `e35672c2322976de.png` ← https://lh3.googleusercontent.com/AiZMdjDtHEF9acx935WgjONj_Kvnb5Zl00C7Q1pxV56QjHx29o9tmyo4ACyJzafBGMDlrnOQBqSc
- `20bf1ced494a8368.png` ← https://lh3.googleusercontent.com/Mix21eJwewQUVsSEPZiI8V9QtuoPH_Fw_CYVBaXX1vwpGyYgkN0dC8tdrO6WXjS-ADSW8GMMsDP5
- `6a6ecb5f9bbcdb5c.png` ← https://lh3.googleusercontent.com/RKWgcABIrCHrrGhFi6_duV8zcWSY1nscgia4GD9DNgEPPjQ4-FtpeneiI0NLKi8SPqIivalSBu_0
- `27d8b014087485a7.png` ← https://lh3.googleusercontent.com/aFf7EK2cXKvdJegnbGx-u44UtDR9NZkQxw81UNCX4Q_D6_dvx_psq5rttJYfH9qytzYEkAxpFiNc
- `a4ad00f99e7e72cd.png` ← https://lh3.googleusercontent.com/batG4K9NgonMPOe8NtbqKBf_5HbQhLrGbpIrPzKU2lPdbMfVm8nbualfdj3tFA5cfGE9OLgj4lxy
- `8b13497749fdf5f9.png` ← https://lh3.googleusercontent.com/dhK9o6CpKl0rU0nNthzBHEz_WjPB264BCIZiXJisj5qoYSGwynygzLH2JUgl2RyYjyArXkZNMdlp

## [guidelines] illustrations

- `e55888b6953cda7f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwg86p38-16_
- `4b1c8efcac0bb65b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc92xj30-01.
- `18c7ff9fb3a4d68f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc93t2tz-03.
- `1ee0c59c3b75365d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc93whon-04-
- `b88f71c3a009d43f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc93wr1q-05-
- `01985ecdba1aa81a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc93ykkg-06_
- `02267e93562c4043.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc93z4ss-07_
- `35fbb16d16f8ec64.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc942but-09.
- `b4165a0fcc5e5ba3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc942yik-08.
- `4fa6a1a10f2d9ffd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc944w0k-10-
- `a9669a3742b52ed6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc945hgt-11-
- `629618da36e865f7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc949gf8-14.
- `ec191286ea785f55.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc94bpsi-16_
- `2126ffe12a1a7e8e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcelfjb2-GM3
- `b96b11d018e69bda.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcelh3zd-GM3
- `7841f03379b0e566.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcelja73-GM3
- `40871c6b61376d58.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0z4md9-12.
- `6a6ecb5f9bbcdb5c.png` ← https://lh3.googleusercontent.com/RKWgcABIrCHrrGhFi6_duV8zcWSY1nscgia4GD9DNgEPPjQ4-FtpeneiI0NLKi8SPqIivalSBu_0

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcelfjb2-GM3_Radio-button_Guidel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcelh3zd-GM3_Radio-button_Guidel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcelja73-GM3_Radio-button_Guidel`

## [accessibility] illustrations

- `bcb291a78946d6c2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmc94qafr-02.
- `b2f2ff3093916f61.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcelaxg0-GM3
- `bf34892377db8c0d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd3jpo7w-04.
- `4e853a20fd0dfad3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0z51u6-03.
- `e5b1d65f2fa3306f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0z56zm-05.
- `6a6ecb5f9bbcdb5c.png` ← https://lh3.googleusercontent.com/RKWgcABIrCHrrGhFi6_duV8zcWSY1nscgia4GD9DNgEPPjQ4-FtpeneiI0NLKi8SPqIivalSBu_0

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcelaxg0-GM3_Radio-button_Access`
