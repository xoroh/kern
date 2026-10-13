# M3 component: text-fields

_Archive: `m3-archive/spec/components/text-fields/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/text-fields/…_

## Overview (full text)

Text fields – Material Design 3
 Availability & resources Differences from M2 Make sure text fields look interactive Two variants:
 filled
 Filled text fields have more visual emphasis than outlined text fields. They're often used in dialogs and short forms where their style draws more attention.
 and
 outlined
 Outlined text fields have less visual emphasis than filled text fields. They're often used in long forms where their reduced emphasis helps simplify the layout.
 The text field’s
 state
 States show the interaction status of a component or UI element.
 More on states
 (blank, with input, error, etc) should be visible at a glance Keep labels and error messages brief and easy to act on Text fields commonly appear in forms and
 dialogs
 Dialogs provide important prompts in a user flow.
 More on dialogs
 Filled text field Outlined text field Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Available Close Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Text fields have new color mappings

## Key measurements (dp, extracted)

- nd character count Attribute Value Default container height 56dp Label alignment (unpopulated) Verticall
- y centered Top/bottom padding 8dp Left/right padding without icons 16dp L
- eft/right padding with icons 12dp Icon alignment Vertically centered Padd
- ing between icons and text 16dp Supporting text and character counter t
- op padding 4dp Padding between supporting text and cha
- racter counter 16dp Target size 56dp Filled text field conf
- g text and character count Attribute Value Container height 56dp Left/right padding without icons 16dp L
- eft/right padding with icons 12dp Padding between icons and text 16dp Ico
- centered Supporting text and character counter top padding 4dp Padding between supporting text and cha
- racter counter 16dp Label alignment Vertically centered Lef
- t/right padding populated label text 4dp Target size 56dp Outlined text field co
- heir position based on LTR or RTL contexts. Images that are 24dp in height can be placed inside of text

## Accessibility (full text)

Text fields – Material Design 3
 Use cases Interaction & style Keyboard navigation Labeling elements Use cases User should be able to: Navigate to and activate a text field with assistive technology Input information into the text field Receive and understand supporting text and error messages Navigate to and select interactive icons Interaction & style The containers for both
 filled
 Filled text fields have more visual emphasis than outlined text fields. They're often used in dialogs and short forms where their style draws more attention.
 and
 outlined text fields
 Outlined text fields have less visual emphasis than filled text fields. They're often used in long forms where their reduced emphasis helps simplify the layout.
 provide the same functionality. Changes to color and thickness of stroke help provide clear visual cues for interaction. Filled text fields Outlined text fields Containers improve the discoverability of text fields by creating contrast between the text field and surrounding content. In some contexts, outlined text fields can improve the perception of the fields with a 3:1 or greater contrast ratio between the container outline and the background. check Do Make sure the container outline has a minimum contrast of 3:1 to the background close Don’t Don't choose colors that won't pass Material's minimum contrast of 3:1 Keyboard navigation Keys Actions Tab Focus lands on (non-disabled) text field Labeling elements If the UI text is correctly linked, assistive tech (such as a screenreader) will read the UI text followed by the component’s role. The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 label for a text field is the same as the text field label. A text field’s label should include its UI text For text fields with interactive trailing icons, the accessibility label clarifies its function. For example, when a password is hidden, the label for the view icon is "Show password," and when the password is visible, the label is "Hide password." When an icon has no actionable role, like an error icon, the label is "Error." When a trailing icon in the field acts as a button, the label should clarify function, while the role explains the component type The prefix and suffix of a text field provides symbols and abbreviations to help users enter the correct values. The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 label for prefix and suffix needs to have a unique id attribute, for example, the currency name for a currency symbol prefix. A form containing fields with both a prefix for currency, and a suffix for email address When there is an error, "alert" is applied to the role and the error message to the text label. If a text field displays both supporting text and error text, the label should include the supporting text first, followed by the error text. Text field error messages should be given an “alert” role in accessibility labels The accessibility label for the character counter clarifies the number of characters that can be entered into the text field. The remaining character counter should be called “character count” within the label The text displayed in the supporting text is also used for its accessibility label. Text field supporting text should have its own accessibility label If a text field requires input, indicate so with an asterisk at the end of the text field label. The accessibility label must include the asterisk. A required text field’s accessibility label should include any supporting text

## Specs (full text)

Text fields – Material Design 3
 Tokens & specs Filled text field Outlined text field Tokens & specs Browse the component elements, attributes, tokens, and their values. Learn about design tokens Text field - Filled arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Error keyboard_arrow_down Close Filled text field Container Leading icon (optional) Label text in empty field Label text in populated field Trailing icon (optional) Focused active Indicator Caret Input text Supporting text (optional) Enabled active indicator Filled text field color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Filled text field color roles used for light and dark schemes: Surface container highest On surface variant On surface variant Primary On surface variant Primary Primary On surface On surface variant On surface Filled text field states States are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Enabled (empty) Focused (empty) Hovered (empty) Disabled (empty) Enabled (populated) Focused (populated) Hovered (populated) Disabled (populated) Filled text field error states Error
 states
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. An error message can display instructions on how to fix it. Error messages are displayed below the text field as supporting text until fixed. Enabled (empty) Focused (empty) Hovered (empty) Enabled (populated) Focused (populated) Hovered (populated) Filled text field measurements Padding and size measurements without icons Padding and size measurements with icons Padding and size measurements with supporting text and character count Attribute Value Default container height 56dp Label alignment (unpopulated) Vertically centered Top/bottom padding 8dp Left/right padding without icons 16dp Left/right padding with icons 12dp Icon alignment Vertically centered Padding between icons and text 16dp Supporting text and character counter top padding 4dp Padding between supporting text and character counter 16dp Target size 56dp Filled text field configurations Empty and populated filled text fields with: Supporting text Trailing icon Leading icon Leading and trailing icons Prefix Suffix Multi-line text field Outlined text field Enabled container outline Leading icon (optional) Label text in empty field Label text in populated field Trailing icon (optional) Focused container outline Caret Input text Supporting text (optional) Outlined text field color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Outlined text field color roles used for light and dark schemes: Outline On surface variant On surface variant Primary On surface variant Primary Primary On surface On surface variant Outlined text field states States are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Enabled (empty) Focused (empty) Hovered (empty) Disabled (empty) Enabled (populated) Focused (populated) Hovered (populated) Disabled (populated) Outlined text field error states Error
 states
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. An error message can display instructions on how to fix it. Error messages are displayed below the text field as supporting text until fixed. Enabled (empty) Focused (empty) Hovered (empty) Enabled (populated) Focused (populated) Hovered (populated) Outlined text field measurements Padding and size measurements without icons Padding and size measurements with icons Padding and size measurements with supporting text and character count Attribute Value Container height 56dp Left/right padding without icons 16dp Left/right padding with icons 12dp Padding between icons and text 16dp Icon alignment Vertically centered Supporting text and character counter top padding 4dp Padding between supporting text and character counter 16dp Label alignment Vertically centered Left/right padding populated label text 4dp Target size 56dp Outlined text field configurations Empty and populated outlined text fields with: Supporting text Trailing icon Leading icon Leading and trailing icons Prefix Suffix Multi-line text field

## Guidelines (full text)

Text fields – Material Design 3
 Usage Choosing text fields Anatomy Adaptive design Filled and outlined text fields Usage Use a text field when someone needs to enter text into a UI, such as filling in contact or payment information. Contact form using outlined text fields There are two variants of text fields: Filled text fields Outlined text fields Both variants of text fields use a container to provide a visual cue for interaction and provide the same functionality. Filled text field Outlined text field Outlined text fields Outlined text fields have less visual emphasis than
 filled text fields
 Filled text fields have more visual emphasis than outlined text fields. They're often used in dialogs and short forms where their style draws more attention.
 . When they appear in places like forms (where many text fields are placed together), their reduced emphasis helps simplify the
 layout
 Layout is the visual arrangement of elements on the screen.
 More on layout
 . Login screen with outlined text fields Choosing text fields Choosing text fields Both variants of text field provide the same functionality. The variant of text field used can depend on style alone. Choose the variant that: Works best with an app’s visual style Best accommodates the UI's goals Is most distinct from other components (like
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 ) and surrounding content Mobile form using filled text fields The same mobile form using outlined text fields Using both text field variants on the same screen If both variants of text field are used in a UI, they should be used consistently within different sections, and not intermixed within the same region. For example, use
 outlined text fields
 Outlined text fields have less visual emphasis than filled text fields. They're often used in long forms where their reduced emphasis helps simplify the layout.
 in one section and
 filled text fields
 Filled text fields have more visual emphasis than outlined text fields. They're often used in dialogs and short forms where their style draws more attention.
 in another. check Do When using both variants of text fields in a UI, separate them by region close Don’t When using both variants of text fields, don't use both next to each other or within the same form Anatomy Filled text field Container Leading icon (optional) Label text in empty field Label text in populated field Trailing icon (optional) Focused active Indicator Caret Input text Supporting text (optional) Enabled active Indicator Outlined text field Enabled container outline Label text in empty field Leading icon (optional) Label text in populated field Trailing icon (optional) Focused container outline Caret Input text Supporting text (optional) Containers Containers improve the discoverability of text fields by creating contrast between the text field and surrounding content. Fill and stroke A text field container has a fill and a stroke either around the entire container, or just the bottom edge. The color and thickness of a stroke can change to indicate when the text field is active. Rounded corners The container of an outlined text field has rounded corners, while the container of a filled text field has rounded top corners and square bottom corners. Text field containers Label text Label text tells people what information is requested. Every text field should have a label. Label text should be aligned with the input text, and always visible. It can be placed in the middle of a text field, or rest near the top of the container. Label text shouldn't be truncated or take up multiple lines. Keep it short, clear, and fully visible. pause Label text should always be visible. When the field is selected, the label text moves from the middle of the text field to the top. close Don’t Don’t truncate label text. Keep it short, clear, and fully visible. close Don’t Label text shouldn’t take up multiple lines Adjacent label A text field doesn't require a label if the field's purpose is indicated by a separate, adjacent label. Adjacent labels should be aligned to the leading edge of the text field container. Text fields with adjacent labels Required text indicator To show a field is required, display an asterisk (*) next to the label text, and explain that asterisks indicate required fields in one of two ways: Supporting text A single note at the beginning of the form Additional best practices include: Indicate all required fields If required text has a particular color, use the same color for the asterisk Asterisk with required supporting text Input text Input text is text a person has entered into a text field. Text fields can display input text in the following ways: Single line text fields display only one line of text Multi-line text fields grow to accommodate multiple lines of text Text areas are fixed-height fields Input text in a filled text field pause In single-line fields, as the cursor reaches the right field edge, text longer than the input line automatically scrolls left. Single-line fields are not suitable for collecting long responses; use a multi-line text field or text area instead. pause In multi-line fields, overflow text causes the text field to expand, shifting screen elements downward and text wraps onto a new line. These fields initially appear as single-line fields, which is useful for compact layouts that need to accommodate large amounts of text. pause Text areas are taller than text fields and wrap overflow text onto a new line. They are a fixed height and scroll vertically when the cursor reaches the bottom of the field. The large initial size indicates that longer responses are possible and encouraged. These should be used instead of multi-line fields on the web. Ensure the height of a text area fits within mobile screen sizes. Prefix text Text fields can contain prefix text such as currency symbol. A text field with a currency symbol text prefix Suffix text Text fields can contain suffix text such as unit of measurement or email domain. A text field with a grading scale as suffix A text field with an email domain suffix Supporting text & character counter Supporting text conveys additional information about the input field, such as how it will be used. It should ideally be one line, though may wrap to multiple lines if required. It can be either persistently visible or visible only on focus. If there is a character or word limit, include a character or word counter. They display the ratio of characters used and the total character limit. Supporting text Character counter Error text For text fields that validate their content such as passwords, replace supporting text with error text. Swapping supporting text with error text prevents new lines of text from bumping content and changing the layout. If only one error is possible, error text should describe how to avoid the error If multiple errors are possible, error text should describe how to avoid the most likely error pause check Do Swap supporting text with error text pause close Don’t Don't add error text in addition to supporting text, as their appearance will shift content exclamation Caution Long errors can wrap to multiple lines if there isn't enough space to clearly describe the error. In this case, ensure padding between text fields is sufficient to prevent multi-lined errors from bumping layout content. Error icon It’s strongly recommended to show an error icon when the text field is in the error state. This highlights the error for people with visual impairments, and provides an additional sensory indicator. The error icon is an important second visual indicator that a text field has an error Icons & images Icons in text fields are optional. Text field icons can: Describe valid
 input
 Inputs are devices that provide interactive control of an app. Common inputs are a mouse, keyboard, and touchpad.
 methods such as a microphone icon Provide affordances to access additional functionality such as clearing the content of a field Express an error Leading and trailing icons change their position based on LTR or RTL contexts. Images that are 24dp in height can be placed inside of text fields. This image height allows for optimal top and bottom padding within the field and is consistent with icon size recommendations. Icon signifier Icon signifiers can describe the type of input a text field requires, and be touch targets for nested components. For example, a calendar icon may be tapped to reveal a
 date picker
 Date pickers let people select a date, or a range of dates.
 More on date pickers
 . Valid or error icon Iconography can indicate both valid and invalid inputs, making error states clear for colorblind users. Clear icon Clear icons let a person clear an entire input field. They appear only when input text is present. Voice input icon A microphone icon signifies that people can input characters using voice. Dropdown icon A dropdown arrow indicates that a text field has a nested
 selection
 Selection lets users choose specific items to act on.
 More on selection
 component. Image An image can help contextualize the required input text such as a credit card number. Icon signifier Valid or error icon Clear icon Voice input icon Dropdown icon Image Read-only fields Read-only text fields display pre-filled text that people cannot edit. A read-only text field is styled the same as a regular text field and is clearly labeled as read-only. A filled read-only text field An outlined read-only text field Adaptive design As layouts adapt to larger screens and different
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 , apply flexible container dimensions to text fields. Set minimum and maximum values for
 margins
 Margins are the spaces between the edge of a nested element and its parent element, such as the space between a button's label text and the edge of its container.
 More on margins
 , padding, and container dimensions as layouts scale so that typography adjusts for better reading experiences. For compact breakpoints, text fields can span the full width of the display. For medium and expanded breakpoints, text fields should be bound by flexible margins or other containers. As text fields expand in fluid layouts, avoid maintaining fixed margins and typography properties. This can lead to extra long text fields. For example, text fields should not span the full width of a large screen. close Don’t Don’t use fixed text field margins on large devices. Text fields shouldn’t span the full width of a large screen. Density Dense text fields enable people to scan and take action on large amounts of information. A form with dense text fields Avoid applying density by default Don't apply density to text fields by default. This lowers their targets below the recommended 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme. To ensure this density setting can be easily reverted when it's active, keep all the targets to change it at a minimum of 48x48 CSS pixels each.

## [overview] illustrations

- `ab37c2dc69c14194.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2u2h3p-1.p
- `3fef548e97c0daa2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2u3e4d-2.p
- `45c31882761d6998.png` ← https://lh3.googleusercontent.com/WjHF4riC7maVlT9eNjGwcXpHUd9kVTpO91GpCEE252hvkP0kjcqSV-R_iD5Y4UlJUfcPPYA1MGXi

## [specs] illustrations

- `b8fcb7196c832ec9.png` ← https://lh3.googleusercontent.com/-FpsbRTgumDQyTLpD4LAvrmPPGOU5CXnJFFxPPHNWfN6Fml9KUbuwsV-Uzz7EWlfTKXjfUnGqwv0
- `cd3ae3454e8c2790.png` ← https://lh3.googleusercontent.com/2AoiwzxCOioxZi9xQyWBalI9wO_Q2Xvt-udVeaI-UDY00zFWxtWZHUvOZa5PFbRwRJrOOQDlMra6
- `a19e116b97c71c5a.png` ← https://lh3.googleusercontent.com/3QvK6g9HSsTheSVwbJnhS3xny_okcH05M7S-VzIzT8Y20T1azDNw3ab6oTjCFDJDqfz8rgA9If_R
- `3306b20b98f5f27e.png` ← https://lh3.googleusercontent.com/7ChV4X-ZSeY8_BCyeu3u3qdlGOmI9fGOOM00iO7V4hK0Ci3rwp_hy9EoMRpsX5t-SnO-nesLg-wB
- `588ba38a9dd0a5b3.png` ← https://lh3.googleusercontent.com/IPC3bKvB5geLDysQJQQsC4IYzNggiZUaqGguykwiwZvUKkNbtAH4_QXRM2MRS3kK04txiDciUgwD
- `e9cee415aedb29a0.png` ← https://lh3.googleusercontent.com/JzpL2KJVz10gQRdqaY43CbT_rimzZySTQc-l3ZSUVIdVIYgAXeOvtbuBqIpR3MUIV7uGKVPnHPzT
- `e719d8e5970d22f0.png` ← https://lh3.googleusercontent.com/KpOprJPDbuBUSURPtov109LS7MrNCFY0Ek20qjx5tGAzycWbhUb1YSwjT7Bc7KEu3_7woFXY5msS
- `4490c74fc8a2c7e3.png` ← https://lh3.googleusercontent.com/QRrrzuYpe5zpPsCu6AbhllIu1DaJBehUTcv2cIVtd6O7bLdl-ZuUnukzJePt9Y4_-szZKPRj8u0v
- `140f762fc3ca34fd.png` ← https://lh3.googleusercontent.com/QbiBv3lVHm9nL8hoQllo5jKgQ6AA37Ngmcd3R0DuB37MAANtap_k0woqbUvLxZJqDgPznP0tIBzy
- `45c31882761d6998.png` ← https://lh3.googleusercontent.com/WjHF4riC7maVlT9eNjGwcXpHUd9kVTpO91GpCEE252hvkP0kjcqSV-R_iD5Y4UlJUfcPPYA1MGXi
- `95634818d779f372.png` ← https://lh3.googleusercontent.com/X9POJ7yw_vGiALE8gBKfttJ_56zdy0ncjv5fYNyJVl1Y8SzdDbDA2VCVqWZDA0BYUfjgn3o1jfQ_
- `42788e89c75f89bf.png` ← https://lh3.googleusercontent.com/_JjJwZsUzwXoqZBtCVcypOsMMq3BPaHVC11s604XWSrXVgPsm5_Jd2mFcMk0lbxVFr2XZSOrtwQe
- `732d3a10797ff88e.png` ← https://lh3.googleusercontent.com/fbPahcRVZOrZP4b6Iro8dbT09lSK22S5Fy_Pi_z0Kjiqd_11BD-7MOoRsO3qcXo5x--D8HprVru2
- `bec702f8a154868f.png` ← https://lh3.googleusercontent.com/hG_Z6Lx5Jfmhqu7Rnds8d_Ia4DGHtlVW1oCZbwwqD29FtoXf2_g24bzr81cvy3i7nQxSxDzTXYqK
- `324fa5dd3ce57764.png` ← https://lh3.googleusercontent.com/juT_ZbiIpoR4u-rL6ab7C0pqjMMp9nEOCEx43GdSNJ0jPkt4RAwIeOy3k047QwD4VLaHhkG4Xc7Z
- `26339b4361f58149.png` ← https://lh3.googleusercontent.com/nuNzqyBbqzPQww1YvytMccqt-cGwmw0Brm79oYB6w-Z1am626wYtqGd6pN2nx393wXxEIJRPia-F
- `86f3687a81ebf123.png` ← https://lh3.googleusercontent.com/oKmfNMCJ_ViUQMDGqTLkxCQj9pqlu69kIuzt96fo0YC7mb_vceZF4LQUwYQViUk_oDf38-KSOFZV

## [guidelines] illustrations

- `152b0a4912fd5b23.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31ssyn-1.p
- `4a37f4719a627556.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31t4yp-2.p
- `e0896fe3849045e4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31tc9a-3.p
- `90f76b9c357af9fa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31u7r0-4.p
- `a974dc8eaa1492bd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31v0nn-5.p
- `f534ff6694376827.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31vds5-6.p
- `4b72059c45d7adbc.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31vnye-7_d
- `98b4042204e8c1e2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31vw2z-8_d
- `3e861f8d5b905623.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31y44j-11.
- `0a5aaafcdfb8daf0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx31ykco-13_
- `c5618806c7bbc2ec.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx320mke-14_
- `1d4180a5369f05c4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32132w-15.
- `d60eb8a0423f5e9f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx322ilp-16.
- `f535db9cb3bc2216.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx322ww5-17.
- `f04b698f6a191e82.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx323bkz-21.
- `7445fe6ec65917eb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx323jpq-22.
- `322a54c18ff42335.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx3246iw-23.
- `c38d24334378e858.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx324ofo-24.
- `fce6e92f3e7aee4f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx325xha-27_
- `0bdde4f31c4f41fd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx3270td-28.
- `9670a15896f455cb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32b33u-29.
- `c32d0f41fa7cabec.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32b91b-30.
- `cbb20a6a22ea660e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32c2h0-Ful
- `4d62ba733d181f2f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32d5ny-res
- `3b3efcd683fb6ad9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32dfqc-31.

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32tcjs-GM3-Components-TextFiel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32tu4z-GM3-Components-TextFiel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32uir5-GM3-Components-TextFiel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32usx4-GM3-Components-TextFiel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32v93h-GM3-Components-TextFiel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32vmu8-GM3-Components-TextFiel`

## [accessibility] illustrations

- `aec0a2d6a3d77047.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32k7wf-3.p
- `d3224dd83970f671.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32kef6-4.p
- `019ccd1cae88b3c1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32ks8b-5.p
- `26ed808449f9ca2d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32l5y8-6.p
- `94674e4bc1764a59.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32leg0-7.p
- `fffd847ebf5798aa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32lojq-8.p
- `5a7d26d279287efe.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32m4pa-9.p
- `b5d08cc610c4a711.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32meu7-10.
- `d42a23f062cf68d8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx32mlzg-11.
- `77547e8c40f631d7.png` ← https://lh3.googleusercontent.com/0s1xBLUmS9DAStbieTHQwGKQq42pyoUiZdSTjlczK97CYRbrKPV58n7m02pcCtSY4XlgiRyv3WRH
- `45c31882761d6998.png` ← https://lh3.googleusercontent.com/WjHF4riC7maVlT9eNjGwcXpHUd9kVTpO91GpCEE252hvkP0kjcqSV-R_iD5Y4UlJUfcPPYA1MGXi
- `0cfbce0440a20745.png` ← https://lh3.googleusercontent.com/ueFOTTaBZqSJw0sLrnS0-JLzMtDWg-4J7Ot0sn6SkEiXvbCZ7l3OFYNhv1NlzBfKYVD7RzDXuo_y
