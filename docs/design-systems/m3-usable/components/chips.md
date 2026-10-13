# M3 component: chips

_Archive: `m3-archive/spec/components/chips/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/chips/…_

## Overview (full text)

Chips – Material Design 3
 Availability & resources Updates Differences from M2 Use chips to show options for a specific context Four variants:
 assist
 Assist chips represent smart or automated actions that can span multiple apps, such as opening a calendar event from the home screen.
 ,
 filter
 Filter chips use tags or descriptive words to filter content. They can be a good alternative to toggle buttons or checkboxes.
 ,
 input
 Input chips represent discrete pieces of information entered by a user, such as Gmail contacts or filter options within a search field.
 , and
 suggestion
 Suggestion chips help narrow a user’s intent by presenting dynamically generated suggestions, such as suggested responses or search filters.
 Chip
 elevation
 Elevation is the distance between two surfaces on the z-axis.
 More on elevation
 defaults to 0 but can be elevated if they need more visual separation Assist chip Filter chip Input chip Suggestion chip Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Available Close Updates Aug 2024 Updated stroke color from outline to outline variant . The stroke color was softened to improve visual hierarchy between chips and buttons Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Shape: Rounded rectangle Variants: Action chips have been separated into
 assist chips
 Assist chips represent smart or automated actions that can span multiple apps, such as opening a calendar event from the home screen.
 and
 suggestion chips
 Suggestion chips help narrow a user’s intent by presenting dynamically generated suggestions, such as suggested responses or search filters.
 . Choice chips are now a subset of
 filter chips
 Filter chips use tags or descriptive words to filter content. They can be a good alternative to toggle buttons or checkboxes.
 M2: Variants of chips are input, choice, filter, and action chips M3: Variants of chips updated to assist, filter, input, and suggestion chips

## Key measurements (dp, extracted)

- t chip padding and size measurements Attribute Value Height 32dp Shape 8dp corner radius Icon size 18dp
- ontal label text alignment Start-aligned Left/right padding 16dp Left/right padding with icon 8dp Paddin
- g between elements 8dp Filter chip Container Label text Leadin
- ding and size measurements Attribute Value Container height 32dp Container shape 8dp corner radius Icon
- size 18dp Vertical label text alignment Center-al
- g between elements 8dp Input chip Container Label text Trailin
- size 18dp Avatar shape 12dp corner radius Avatar
- size 24dp Vertical label text alignment Center-al
- label text alignment Start-aligned Left padding for avatar 4dp Right padding for avatar 8dp Left/right
- padding for icon 8dp Padding between elements 8dp Target siz
- e for close icon Min 48dp Suggestion chip Container Label text Su
- ext alignment Start-aligned Left/right padding without icon 16dp Left/right padding with icon 8dp Paddin
- g between elements 8dp
- ter chips) Container All chips are slightly rounded with an 8dp corner. Chips have rounded corners Shad
- ns (such as a trailing icon button for Remove ) must have a 48x48dp interaction target that doesn’t interfe
- s Edit or Drag ). To achieve this, apply a minimum width of 88dp to the chip, or 42dp to the label text.
- s can be achieved by setting the minimum container width to 88dp. Assist chips Assist chips represent sm
- Window widths from 600dp to 839dp, such as a tablet or foldable
- Window widths 840dp to 1199dp, such as a tablet or foldable
- Window widths smaller than 600dp, such as a phone in portrait orientatio
- ow high, chip sets can scroll horizontally instead. Keep an 8dp minimum space between chips. Chips must
- also have a minimum 48dp target size, regardless of placement or

## Accessibility (full text)

Chips – Material Design 3
 Use cases Interaction & style Keyboard navigation Labeling elements Use cases People should be able to do the following with assistive technology: Use a chip to perform an action Navigate to a chip Activate a chip Interaction & style The chip label needs at least 3:1 contrast with the background. A chip that performs an action should present the same semantics as a
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 to a platform's accessibility API. High contrast helps differentiate chips clustered together Horizontal overflow When there are too many chips to fit on one row, provide a way to display them all at once and avoid scrolling. Reflow method: Use a filter chip as a leading element to reflow the horizontal list. This should shift down the content below and make room for all chips to show. pause The Show all filter chip is used to reflow the list, displaying all chips at once and pushing down the content below Menu method: Create a leading button to display all chip options in a menu. Use this option to avoid shifting the position of the content below. Don’t use the menu method on chips with a second action, like a remove icon. pause The Show all leading button shows a menu of chip options, keeping the place of content below Avoid applying density by default Don't apply density to chips by default — this lowers their targets below our best practice of 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme. To ensure that this density setting can be easily reverted when it's active, keep all the targets to change it at minimum 48x48 CSS pixels each. Keyboard navigation Keys Actions Tab Moves focus to
 enabled
 An enabled state communicates an interactive component or element.
 More on enabled state
 chip or chip group Space or Enter Activates, selects, or deselects the focused chip Backspace or Delete Removes currently
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 input chip Arrows Moves focus between chips Labeling elements Element A11y label Role (Web) Role (Android Views (MDC-Android)) Role (Jetpack Compose) Image / Icon within chip Hide image - - - Basic chip (one action) “{chip content}” gridcell button button Selectable chip “{chip content}” gridcell radio button checkbox Remove icon (no other action) “Remove {chip content}” - - - Two actions (e.g., select + remove) “{chip content}.” Then “Remove {chip content}”. button or checkbox button or checkbox button or checkbox The accessibility label for a chip is the chip's label text. Additional actions, like remove, are labeled separately. Accessibility tags should include both the label and role Multi-select For multi-select chip sets, Space or Enter will select the focused chip and allow you to select all of the chips. Space or Enter will also deselect a focused selected chip. While multiple chips can be selected, only one can be in focus Drop-down list The accessibility label should align with each list item’s text label. For list items with text and an icon, the accessibility label should be marked as decorative to avoid redundant verbalizations. The accessibility label should be the text label Input chip remove action Display the remove icon whenever a chip can be removed. On mobile, if remove is the only chip action, the remove icon isn't necessary. Instead the chip can be removed by selecting it and pressing the Delete key on the keyboard. Each chip is a focusable element. If a chip only has a remove icon, the entire chip and icon are one focusable element. If a chip has a second action, like select, then the chip content and remove icon are two separate focusable elements. The remove action is focused when the chip can also be selected Showing chip interactivity Material requires that chips use a secondary indicator to show that they are interactive in context, allowing users with low vision and cognitive disabilities to see them. Use one of the following methods:  Add a label before the chip group suggesting interaction, such as Select type Labels introducing a chip group can indicate that they are selectable Provide interactive page context, such as Filter results , indicating chips can be selected to narrow results Page context can indicate how search results will be narrowed by selecting chips Use the outline color role, instead of outline variant , to ensure a minimum 3:1 contrast Include an interactive chip label, such as Turn on lights , or leading icon Chips can show they are interactive with a darker outline color stroke Chips can also use a leading icon or label to show interactivity

## Specs (full text)

Chips – Material Design 3
 Tokens & specs Assist chip Filter chip Input chip Suggestion chip Tokens & specs Select a component variant below to see its elements, attributes, tokens, and values. Chip - Assist arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down folder Dragged keyboard_arrow_down Close Assist chip Container Label text Leading icon Assist chip color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Assist chip color roles used for light and dark themes: Surface container low (optional) On surface Outline Primary Assist chip states
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Selected and unselected assist chip states: Enabled Disabled Hovered Focused Pressed Dragged Assist chip measurements Assist chip padding and size measurements Attribute Value Height 32dp Shape 8dp corner radius Icon size 18dp Vertical label text alignment Center-aligned Horizontal label text alignment Start-aligned Left/right padding 16dp Left/right padding with icon 8dp Padding between elements 8dp Filter chip Container Label text Leading icon Trailing icon Filter chip color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Filter chip color roles used for light and dark themes: On surface variant On secondary container Secondary container Outline variant Surface container low (optional) Filter chip states
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Selected and unselected filter chip states: Enabled Disabled Hovered Focused Pressed Dragged Filter chip measurements Filter chip padding and size measurements Attribute Value Container height 32dp Container shape 8dp corner radius Icon size 18dp Vertical label text alignment Center-aligned Horizontal label text alignment Start-aligned Left/right padding 16dp Left/right padding with icon 8dp Padding between elements 8dp Input chip Container Label text Trailing icon Leading icon Input chip color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Input chip color roles used for light and dark themes: On surface variant Surface container low (optional) On surface variant On surface variant Outline variant Primary Secondary container On secondary container On secondary container Input chip states
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Selected and unselected input chip states: Enabled Disabled Hovered Focused Pressed Dragged Input chip measurements Input chip padding and size measurements Attribute Value Container height 32dp Container shape 8dp corner radius Icon size 18dp Avatar shape 12dp corner radius Avatar size 24dp Vertical label text alignment Center-aligned Horizontal label text alignment Start-aligned Left padding for avatar 4dp Right padding for avatar 8dp Left/right padding for icon 8dp Padding between elements 8dp Target size for close icon Min 48dp Suggestion chip Container Label text Suggestion chip color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Suggestion chip color roles used for light and dark themes: Outline Surface container low (optional) On surface variant Suggestion chip states
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Selected and unselected suggestion chip states: Enabled Disabled Hovered Focused Pressed Dragged Suggestion chip measurements Suggestion chip padding and size measurements Attribute Value Container height 32dp Container shape 8dp corner radius Icon size 18dp Vertical label text alignment Center-aligned Horizontal label text alignment Start-aligned Left/right padding without icon 16dp Left/right padding with icon 8dp Padding between elements 8dp

## Guidelines (full text)

Chips – Material Design 3
 Usage Anatomy Assist chips Filter chips Input chips Suggestion chips There are four variants of chips: Assist, filter, input, and suggestion Usage Chips help people enter information, make selections, filter content, or trigger actions. They're best used to help people accomplish their current task faster and easier. Chips appear as a group of interactive elements Chips aren’t buttons Chips and
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 are similar. They both provide visual cues to prompt people to take actions and make selections. While buttons appear consistently and with familiar calls to action, chips are dynamic to the situation, and appear as a group of interactive elements. Use chips to enhance a person's current journey and encourage action. Use buttons to progress them through the product and for significant actions. check Do Use chips to present contextual, supplemental options close Don’t Avoid replacing major actions with chips. Actions that progress people to the next or previous step should always be displayed as buttons. Chips should dynamically offer various actions depending on the current task, whereas a button should be a persistent fixture of a layout. Chips represent forking paths for a current task, while buttons represent linear steps. check Do Use buttons for the final step in a task close Don’t Avoid using chips to finish or progress a task Multiple chips should appear together in a set, whereas there should be no more than 3 buttons in a single arrangement. Chip sets can be scrolled horizontally. check Do Chips can be scrolled horizontally close Don’t Don’t display a single chip by itself. Chips should appear in a set. Variants Choose the chip variant based on its purpose and author. Does the chip represent an action (assist chip) or filter results (filter chip)? Is its content generated by the product (suggestion chip), or by the person using the product (input chip)? There are four chip variants: Assist Filter Input Suggestion Purpose Chip variant Rationale Example Action Assist chip Assist chips represent smart or automated actions that can span multiple apps Add to calendar action Filter Filter chip Filter chips represent filters for a collection Platform selector on material.io/components Information, user-authored Input chip Input chips represent discrete pieces of information entered by a person Gmail contact in the To field Information, product-authored Suggestion chip Suggestion chips help narrow a person’s intent by presenting dynamically-generated suggestions Suggested chat response Anatomy Container Label text Leading icon or image (optional) Trailing icon (required for input chips, optional for filter chips) Container All chips are slightly rounded with an 8dp corner. Chips have rounded corners Shadows & elevation Chip containers can be elevated if placed on top of an image or dynamic background. When on complicated backgrounds, chip containers can be elevated check Do Use an outline to define the edge of the chip's container on regular backgrounds check Do Chips may use elevation when placed on an image close Don’t Chips shouldn't be elevated when placed directly on the page close Don’t Avoid using elevation to indicate a chip's pressed state. Instead, use the visual ripple effect. Label text Chip label text should be 20 characters or fewer, and have the same typography style as
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 . Chip labels should remain brief for the limited space available. Skip conventional grammar rules, such as articles (take "a" walk), to save space. check Do Keep chip labels short close Don’t Avoid chip labels longer than 20 characters Leading icon or image (optional) Chips can contain a leading icon, logo, or circular image. Use a system icon to help identify a chip's category. Chips can contain a logo, icon, or circular image The leading icon color for unselected chips can be customized through theming. While the default
 color role
 Color roles are assigned to UI elements based on emphasis, container type, and relationship with other elements. This ensures proper contrast and usage in any color scheme.
 More on color roles
 is primary , the on surface variant color role is a good alternative when the icon style requires less emphasis. Primary color (left) and on surface variant color (right) Leading circular images are sized larger than leading icons to provide more space for detail. Icons are designed to be legible at small sizes. See the Specs tab for precise measurement values. Leading images, such as avatars, are sized larger than leading icons or logos Trailing icon (optional, input and filter chips only) The trailing icon is present for input and
 filter chips
 Filter chips use tags or descriptive words to filter content. They can be a good alternative to toggle buttons or checkboxes.
 . On input chips, it's required and must be used to remove the chip. On filter chips, it's optional, and can be used to open a menu or remove the chip. Secondary actions (such as a trailing icon button for Remove ) must have a 48x48dp interaction target that doesn’t interfere with the chip's primary action (such as Edit or Drag ). To achieve this, apply a minimum width of 88dp to the chip, or 42dp to the label text. Interaction targets for actions like Edit or Close have a size of 48x48. This can be achieved by setting the minimum container width to 88dp. Assist chips Assist chips represent smart or automated actions that can span multiple apps, such as opening a calendar event from the home screen. Assist chips function as though the person asked an assistant to complete the action. They should appear dynamically and contextually in a UI. An alternative to assist chips are
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 , which should appear persistently and consistently. The text in most assist chips begins with a short verb, like Get or Add An assist chip can surface supplemental information like a calendar event, as well as provide contextual actions During an interaction, assist chips can transform into modals, transition into full-screen views of new content, or readjust to display more results inline Assist chips can trigger an action or show progress and confirmation. Write assist chips like buttons: start with a verb. Adjust text dynamically if the state changes, like Save to Saved . pause Tapping an assist chip triggers a contextual action pause Assist chips can show progress and confirmation feedback Assist chips are displayed after primary content, such as below a
 card
 Cards display content and actions about a single subject.
 More on cards
 or persistently at the bottom of a screen. Assist chips should be shown underneath primary content Filter chips Filter chips use tags or descriptive words to filter content. They can be a good alternative to
 segmented buttons
 Segmented buttons help people select options, switch views, or sort elements.
 More on segmented buttons
 or
 checkboxes
 Checkboxes let users select one or more items from a list, or turn an item on or off.
 More on checkboxes
 when viewing a list or search results. Tapping on a filter chip activates it and appends a leading checkmark icon to the starting edge of the chip label. Write filter chips with nouns that describe the category to include in the results. Avoid negative phrases like Exclude images . Filter chips rely on tags or descriptive words to filter content Filter chips in a shopping app Filter chips in a real estate app Tap a chip to select it. Multiple chips can be selected or unselected. An icon can be added to indicate when a filter chip is selected Filter chip suggestions can dynamically change as a person starts to select filters Alternatively, a single chip can be selected. This offers an alternative to
 segmented buttons
 Segmented buttons help people select options, switch views, or sort elements.
 More on segmented buttons
 ,
 radio buttons
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 , or single select
 menus
 Menus display a list of choices on a temporary surface.
 More on menus
 . However, avoid mixing chip set behaviors. All chip sets on a page should be either single-select or multi-select. pause Filter chips can be set so that selecting a single chip automatically deselects all other chips in the set In
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , filter chips may contain a trailing icon to directly remove the chip or open a menu of options. In
 compact windows
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , the trailing icon's target area is too small to be accessible on its own. However, if the whole chip can be selected to accomplish the action, the chip is likely still accessible. The remove icon helps users remove the filter Filter chips can open a menu for more filtering options When combined with a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 , the filter chip opens a list of selectable options. pause exclamation Caution In compact windows, make sure the whole chip opens the menu. Otherwise, the target area is likely too small to be accessible. Filter chips can be used with other components, such as
 Search lets people enter a keyword or phrase to get relevant information.
 More on search
 fields and
 sheets
 Side sheets show secondary content anchored to the side of the screen.
 More on side sheets
 . Filter chips can be shown underneath a search field Use a side sheet to organize many filter chips Filter chips can wrap to a new row. If there are more than two rows, consider using horizontal scrolling to access them all. Filter chips can scroll horizontally to show many options close Don’t Filter chips should not present only a single option Input chips Input chips represent discrete pieces of information entered by a person, such as Gmail contacts or filter options within a
 Search lets people enter a keyword or phrase to get relevant information.
 More on search
 field. They enable user input and verify that input by converting text into chips. Input chips transform text based on a person's input Input chips can support editing to change their contents, such as correcting an email address. In edit mode, the chip reverts back to a text string. Editing can be triggered by interacting with the chip, either by selecting it or by a second interaction after selection. pause Input chips converted from email addresses are editable pause Using the backspace key with the cursor before a chip selects the entire chip. The chip can then be deleted when the user taps the backspace key again. A single field can contain multiple
 input chips
 Input chips represent discrete pieces of information entered by a user, such as Gmail contacts or filter options within a search field.
 . These chips can be reordered or moved into other fields. Multiple input chips in one field Input chips being moved from one field to another Input chips can expand to show more information or options. A container transform transition pattern is used to reveal additional content. pause Input chips can expand Placement Input chips can be integrated with other components. They can appear: Inline with the cursor in a text field In a stacked list In a list that can be horizontally scrolled Input chips can wrap to a new row if all chips need to be visible pause Input chips can scroll horizontally Icons & images The leading icon of input chips can be an icon, logo, or circular image. Input chips can contain an icon, logo, or circular image The trailing icon is always aligned to the end side of the container. It’s placed: On the right for left-to-right (LTR) languages, such as English On the left for right-to-left (RTL) languages, such as Farsi Input chips can be a more flexible way to filter search results, compared to filter chips Input chips make it easier to add and remove contacts pause Overflowed chips in a text field should follow the same behavior as regular text. An unfocused text field with overflowed content should display the beginning of the input. Tapping the field snaps the user to the end of the input with the cursor and keyboard active. Suggestion chips Suggestion chips help narrow a user’s intent by presenting dynamically generated suggestions, such as possible responses or search filters. Write suggestion chips as nouns or short phrases, depending on context. Avoid exceeding 20 characters when possible. The text labels within suggestion chips are most often nouns or short phrases Suggestion chips can offer quick-reply options in a chat or email app A suggestion chip can help the user start a search Placement When displaying multiple chips together, place them inline as a row of options, not listed vertically. Overflowing chips should break to the next line. If the field is only one row high, chip sets can scroll horizontally instead. Keep an 8dp minimum space between chips. Chips must also have a minimum 48dp target size, regardless of placement or density. If required, the target can extend beyond the visible container of the chip. Text labels for chips should be concise. Chip labels will truncate when in a wrapped layout, and when they are wider than the full width of the window. Margins between chips Margin between each line

## [overview] illustrations

- `ee3a06cb08777461.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flzthj7vk-1.p
- `4ca2755f3bf7f904.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8sdpshu-02.
- `28d91bc9721608d3.png` ← https://lh3.googleusercontent.com/2QvL9BG6dybkEq8-MxokwRvnU_5-Yxey0SZtSxa9o6KlczyP2t5hAtUxTyZRJbGF9i7m6oOrZCWK
- `e6d915c1ceeda9ab.png` ← https://lh3.googleusercontent.com/3W0HJhJSBgfi_3TWYvZlXCPDg42elT_0VwxJmTTK5l61ZFdC9l9mPQPqPcUOBXNIce2r3aDWGNEC
- `4a610999324f3351.png` ← https://lh3.googleusercontent.com/4cBoCPcD2kxFOPpph3XKIzBklwsMYwgbCZYK8H68fL0glQcFcClOttreYSnDpq7XEOsu5ozH0LJZ

## [specs] illustrations

- `1b3b01a1226235ad.png` ← https://lh3.googleusercontent.com/22fmoqWkQTxchSh4qTgO2nrZ76sooCtX3ywKPLhqba5suVk8PW60_IA03iQ1yUdTipCKCFx0mRHh
- `4412fb4a197b4e96.png` ← https://lh3.googleusercontent.com/2raflfeNVlaC3gjYDipGLH5aIA6hJB4NL7ruSwZGbqk7Ec8W1AHpbd2Eyhxbeo0g0rVWSvHwdbjU
- `dc228d7ee94f18f0.png` ← https://lh3.googleusercontent.com/4Ni_EPMelCZDcAAcbhbIDdGj4ER5JGlUjPOtgO4Qx1IIooRh25eJo_y7LgMr7yD0tX-PcXu3vY6O
- `4a610999324f3351.png` ← https://lh3.googleusercontent.com/4cBoCPcD2kxFOPpph3XKIzBklwsMYwgbCZYK8H68fL0glQcFcClOttreYSnDpq7XEOsu5ozH0LJZ
- `7b703229e4dbefef.png` ← https://lh3.googleusercontent.com/CgU4dUqBVfaebvIlmiYeW8i9Geq2Z3kASKWrVMHXl1kgDAx2tDJ40MrFVDf7tqkPEKuX4au-iLvz
- `df55c0a06c7b0d4b.png` ← https://lh3.googleusercontent.com/KftllQmRE7STKHvBYUhxG13rWSMWMWOj_Y3mqpHMyKpj4Exvl-J7B4cBwB1_Cexx8oaCnXYw7hdP
- `8bbf5ec6c5500e89.png` ← https://lh3.googleusercontent.com/LwwDa1dknxPJeGchp4qkldM7ofBH7mypUCmVb5VQRgeY0cICTc5_H0fHVUTbuY0TQ7VNaBlqfYrl
- `306e7ae3954eb392.png` ← https://lh3.googleusercontent.com/MFMFJhZqnlfNlT6wWDldzAYdPhLBn9OvPgeAyUmocIf1YooTBamJN4doylmVzztWcDYbjHmV2OSQ
- `c776e7cd28361115.png` ← https://lh3.googleusercontent.com/ToyBZvY6HgToxkWV0wPdYIHq3FzSkIz4HUsgSzJD-Q30jS8TQTzRzN81nagH7Q1XDitG-Lgzav9w
- `64d9390aaf73cc34.png` ← https://lh3.googleusercontent.com/UipTazZY6lB09YYRrq_uydfwLG0Xj5EIIlJVA252BfyovfvZXXXPGP66wGx4ZT0jOXqI6eQ7OLB6
- `a0907433535c0c71.png` ← https://lh3.googleusercontent.com/WczxPrTlNqVqk9HILdgclP7OR_TQ6sLWYPB9qIHvZ6QLGDS9Uo1Sjm30UFiVAJmo8DVAWcZPacF_
- `79fab168e3f64d33.png` ← https://lh3.googleusercontent.com/YYoIuUfDsUQqPR--eP-zfow9SJVnjSlY060t1WUqtVUdBkynNCTTe1IK16I4rpfBRRpHrZqDKEYf
- `39dd4c81e2f7ddc3.png` ← https://lh3.googleusercontent.com/YmMzczrJL0g0MAMFwW2zs8up57xJzcAxNJraHceXpaVZVPAEN2ukdjQwHpuYnVjEKQrnC-KGaC09
- `27de09300f817c47.png` ← https://lh3.googleusercontent.com/ganq0HIgyGsa-HH5bnqU95oJCYypADT4v0LOgsmwQ9ek5B45GtD6EgJCpd589BbA4-tDKOpNCksy
- `ab32fedda684827b.png` ← https://lh3.googleusercontent.com/s6LyjzP2TrQRGesL7fSbWcwEr94zeAaCTl8Zj7vDx6EsJ9Hn-9fNov0mtodXBs61mOtW6OnsmyPn
- `c1be994502286d4c.png` ← https://lh3.googleusercontent.com/tDL76BxJhx73568XEIJ3nbFUBxkn1ac2zO3Vqrf0CmFLPBi3yuLhjPYhZHmEFv6_cfjXMg-16mB2
- `2fb96b64817fdef4.png` ← https://lh3.googleusercontent.com/ytfZyslYlVSL6feuGZznpeG6Wi6YP9sPrNyN7IDDr8cClF4pFIS2gdMGmX6GAG6oYN2ZAHE4hito

## [guidelines] illustrations

- `abd140be1f312c2a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztjonhj-3-d
- `8a5595b3947098e8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztjp9f8-4-d
- `68c5e4cb09b32476.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztjqmoj-5-d
- `31d43c314d4264ab.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztjqyzl-6-d
- `3e8867af43dbde76.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztjtuyd-10.
- `33dfea87b49ad52f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztjz5d8-17-
- `0ee61a2f92b61165.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztjzmjd-18-
- `891ac3c76b4a24f4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztk48sd-20.
- `a660a5b45bda2bc2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztl3mne-41.
- `7a76fd18291e7e04.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztl40h2-42.
- `80e244f9b1236f4f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztl535g-43-
- `ee80216a001e843f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztl8hee-55.
- `2cb74f3c73a104f7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztlb0cw-60.
- `ec3cc0d83910a7b7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztlbx06-61.
- `ab3e98615071e0d0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flztlcsh2-62.
- `f848f4b7efd41927.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm6af1abe-GM3
- `d919aefd9690bbac.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8smcq59-01.
- `2c684908713a279f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8smdd4g-02.
- `c8a3caf3c02ce8a6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8smf6wp-07_
- `fc22a304ea70515a.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8smfmgg-08_
- `d93e2695b1f3b2e5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8smgjsw-09.
- `3b7c1b902825fb7d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8smkogw-14_
- `f894d8ff6ed18efd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8sml3zk-15_
- `e1eed0fda312506e.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8smnajs-16_
- `67ccd2ceae1113ec.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8smwopa-25.

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm6af1abe-GM3-Components-Chips-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8so4v60-GM3_Chips_Guideline_64_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8spbow8-GM3_Chips_Guideline_49_`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm6baqa1g-GM3-Components-Chips-Guidelines-6-3P-v`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm6baqmrn-GM3-Components-Chips-Guidelines-4-3P-v`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm6bar2g2-GM3-Components-Chips-Guidelines-1.1-3P`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm8zkgr9j-GM3_Chips_Guideline_36_IA_v01.mp4?alt=`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm8zkn8ku-GM3_Chips_Guideline_39_IA_v01.mp4?alt=`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm8zkwi4x-GM3_Chips_Guideline_58%20-%203P%20-_IA`

## [accessibility] illustrations

- `aca995081664b0d8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm99z66s4-01.
- `0fbcdbef1894c41d.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm9a4c1yw-GM3
- `2d8d71bdc782ce2e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm9a4cs1u-GM3
- `9a55cc5122977ca6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd78nzr3-04.
- `d4272cd9c7f9561c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmderoau5-25.
- `5d69e1e4eb59f8fc.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmderzcwe-02.
- `ef38ae9cf68e9080.png` ← https://lh3.googleusercontent.com/-PJSF2Rl5Xam0GLsqoqkWXhm3VNqDgZh7B3Ck1pLkVFTuPzwhSR9H-DXgfQOVggcz-CaZrqh4kh8
- `bc5ee8e4ce176c5d.png` ← https://lh3.googleusercontent.com/3mkdqveEbxIinncg25_qmQvewzApIKUm8jK3Nml2ratbJLBLBhBUCNYcrGFsb-7nevBxFssZdACg
- `4a610999324f3351.png` ← https://lh3.googleusercontent.com/4cBoCPcD2kxFOPpph3XKIzBklwsMYwgbCZYK8H68fL0glQcFcClOttreYSnDpq7XEOsu5ozH0LJZ
- `f5efdf6f534f2ab3.png` ← https://lh3.googleusercontent.com/6ogPU6jU6ecd-bIOHVBsztMIVbrMh9QFdEYLITFw2dbd9atxkbPCtGrNHZfykUnYCCmQUR4-XY9K
- `e0018e20a668417b.png` ← https://lh3.googleusercontent.com/gkYkp2thJm8NuXg0WkQDTthTjMCckk44U7U8HKxA322oYbQbIfE60aLw8mRpl4zG3yP9iM7xRKvI
- `f37ddf8b53a48d57.png` ← https://lh3.googleusercontent.com/jEO4v0siZwhGUJRWwN3qHEggxZU7YO42T-yV1X2_7zuBm9bW_mHSE1cJ1U2YAh6fDxdvjv10zK9J

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm9a4c1yw-GM3_Chips_Guidelines_07`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm9a4cs1u-GM3_Chips_Guidelines_08`
