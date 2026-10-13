# M3 component: lists

_Archive: `m3-archive/spec/components/lists/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/lists/…_

## Overview (full text)

Lists – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 to M3 baseline Use lists to help people find a specific item and act on it Order list items in logical ways, like alphabetical or numerical Keep items short and easy to scan Show icons, text, and actions in a consistent format Choose between standard and segmented styles A list item's label text, supporting text, image, and trailing icon can be customized to create a variety of lists Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Available language Web Available language Web: Expressive Unavailable Close M3 Expressive update Lists have a new segmented visual style, improved selection treatment, and support for slots. More on M3 Expressive December 2025   Variants: Added expressive list Recommended for new designs List (
 baseline
 Baseline variants are the original M3 component designs. They may not have the latest features introduced in M3 Expressive, like updated motion, shapes, type, and styles.
 More on M3 Expressive
 ) is still available New visual styles: Standard or segmented Highlighted selection states Flexible slots Supported platforms: Android Views (MDC-Android) Jetpack Compose Expressive lists feature improved selection states Differences from M2 to M3 baseline Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Layout: Padding and spacing rules are updated to be more consistent Height: The tallest element within a list item determines the list item’s height - either 56dp, 72dp, or 88dp Alignment: In most cases, elements in a list item are middle-aligned If a list is 88dp or larger, or contains three or more lines of text, elements are top-aligned M2: Non-standard heights and alignments M3 (baseline): Standardized heights and alignments

## Key measurements (dp, extracted)

- thin a list item determines the list item’s height - either 56dp, 72dp, or 88dp Alignment: In most cases
- , elements in a list item are middle-aligned If a list is 88dp or larger, or contains three or more li
- Use standard list item padding Target size must be at least 48x48dp Don't add interactive elements that mak
- ges to highlight the active item: Unselected corner radius: 4dp inner, 16dp outer Selected corner radiu
- s: 16dp Unselected list items have a 4dp inner
- corner radius, and 16dp outer corner radius Selected list items
- have a 16dp corner radius all around List (baseline
- Value Label alignment Center Label alignment when height is 88dp or taller Top Label left padding 16dp L
- Center Leading element alignment (vertical) when height is 88dp or taller Top Leading element left padd
- ing 16dp Leading icon alignment (vertical) Top L
- eading icon top padding 8dp Leading icon top padding when height is
- 88dp or taller 12dp Trailing element alignme
- Center Trailing element alignment (vertical) when height is 88dp or taller Top Trailing element left pad
- ding 16dp Trailing element right padding 24dp Pad
- ding above/below divider 0dp Targets 48dp Divider full-width 100% Di
- vider inset left padding 16dp Divider inset right padding 24dp Config
- Window widths smaller than 600dp, such as a phone in portrait orientatio
- Window widths 840dp to 1199dp, such as a tablet or foldable
- Window widths from 600dp to 839dp, such as a tablet or foldable

## Accessibility (full text)

Lists – Material Design 3
 Use cases Indicate selection with more than color Interaction & style Focus Keyboard navigation Labeling elements Use cases People should be able to do the following with assistive technology: Navigate to a list item Select a list item Indicate selection with more than color To make selected items clear for everyone, don't rely on color as the only visual cue.    Use an additional indicator that an item is selected such as:
 Radio buttons
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 or
 checkboxes
 Checkboxes let users select one or more items from a list, or turn an item on or off.
 More on checkboxes
 Leading or trailing icons A visual style not related to color, like underlined text Use two visual cues to show a list item is selected, like a leading checkmark and filled color Interaction & style Touch When a person taps on a list item, a touch ripple appears, indicating interaction feedback. pause A ripple appears when a person taps on a list item to select it Cursor When hovered, the
 hover
 A hover state communicates when a user has placed a cursor above an interactive element.
 More on hover state
 state provides a visual cue that a list item is interactive. Cursor: Hover Cursor: Selected Keyboard & switch When a person tabs to a single-action list, a focus indicator appears, providing a visual cue that the first list item is now
 focused
A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 and action can be taken. When a person interacts with the focused list item via Space or Enter , the action is performed. pause Tab key navigates to the list. Space or Enter keys activate items. Swipe List items that can be swiped should include alternative ways to access hidden actions, such as a more icon.    Swipe alternatives can be: Single tap Double tap Long press Other single-point interactions  List items can reveal more actions from swiping or using an accessible secondary action such as a double tap Focus Single-action lists The first element in a list should always receive focus, unless the list has a selected element. In that case, focus should go to the selected list item instead. After an element is
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 , a person should be able to navigate within the list using arrow keys. Tab key focuses on the first item or the selected item Arrow keys navigate up and down through list items All list items must be able to be activated using the Space or Enter key.   More on single-action lists Space or Enter keys activate an element in a list Multi-action lists Multi-action list items contain a primary action and at least one supplementary action.   The list item as a whole isn't selectable; only the individual actions are.  A person should be able to use a keyboard to: Tab to the list item, which focuses the first element Move between between all focusable elements in the list using the Up , Down , Left , and Right arrow keys Activate a focused element using Space or Enter    More on multi-action lists Tab brings the focus to the first action Down and Right arrow keys move focus to the next action of the list item, or to the first action in the next item Up and Left arrow keys move focus to the previous action of the list item If the focus is on a list item’s first action, the Up and Left arrows move focus back to the last action of the previous item The Space or Enter key activates a selected action in a list Keyboard navigation Keys Actions Tab To move focus to the first list item, last list item, or outside of the list component Down and right arrow keys Moves to the next element in the list; if the focused element is the last in the list, it wraps back to the top of the list Up and left arrow keys Moves to the previous element in the list; if the focused element is the first in the list, it wraps back to the bottom of the list Space or Enter To select a list item not yet selected Labeling elements 
 Accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 labels are used with assistive devices like screen readers. The accessibility label for a list item is typically the same as the label text and supporting text . Some labels, roles, and states are dependent on platform . A list item’s label text and supporting text is used for its accessibility label Platform-specific labels Single-select lists Trait Web Android Views (MDC-Android) Jetpack Compose Aria label Container label: Should describe selection type List item: Should match the visible label text List item: Should match the visible label text List item: Should match the visible label text Role Container: List box  List item: Option List item: Radio button List item: Radio button State Selected or Not-selected Checked or Not-checked Checked or Not-checked Multi-select lists Trait Web Android Views (MDC-Android) Jetpack Compose Aria label Container label: Should describe selection type List item: Should match the visible label text List item: Should match the visible label text List item: Should match the visible label text Role Container: List box  List item: Option List item: Checkbox List item: Checkbox State Selected or Not-selected Checked or Not-checked Checked or Not-checked On web, a list container’s accessibility label describes the type of selection that can be made, and the role is List box . On web, a list container’s role is List box On Jetpack Compose, the role applies to the list item as a whole. If a list isn't selectable, the label text is read out without a role. When selectable, the role Checkbox applies to the entire list item on Jetpack Compose On Android Views (MDC-Android), components contained within the list should be labeled according to that component’s specific guidelines: Checkbox Radio button On Android Views (MDC-Android), the accessibility label and role are applied to the interactive component by default

## Specs (full text)

Lists – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color States Measurements List (baseline) Variants Expressive lists Use the expressive list variant for more flexible styling, highlighted selection states, and customizable slots. An expressive list has a segmented style and round corners Baseline lists
 Baseline
 Baseline variants are the original M3 component designs. They may not have the latest features introduced in M3 Expressive, like updated motion, shapes, type, and styles.
 More on M3 Expressive
 lists are still available to use, but don’t have the latest visual style, selection treatment, and slot functionality. On web, expressive lists are built on top of baseline lists. See baseline list specs Baseline list items have square corners and standard colors Variants M3 M3 Expressive Lists (expressive) -- Available Lists (baseline) Available Not recommended.   Use expressive lists instead. Configurations Styles The standard and segmented styles are a visual choice, and don’t affect a list’s behavior. Standard Segmented List selection A list can have only one selection mode at a time. For example, a single-action list can change to a multi-select list, but can’t be both at once. In a single-action list , each item is a single tappable area Multi-action list items include a primary action, and one or more secondary actions A single-select list A multi-select list List interactions Lists can: Expand and collapse Swipe to reveal * More on list interaction accessibility pause A list can expand to include multiple items A list item can be swiped to reveal more actions Category Configuration M3 M3 Expressive Styles Standard Available Available Segmented -- Available Selection modes Single-action, multi-action, single-select, multi-select Available Available Interactions Expand, swipe* Available Available * Swipe-to-reveal interactions are only available on Android Views Tokens & specs Use the table's menu to select a token set. The common set combines baseline tokens with new expressive shapes and sizes. The expand set has tokens for the expand interaction. Learn about design tokens List - Common arrow_drop_down search expand_all Default, Light arrow_drop_down folder Color keyboard_arrow_down folder Spacing keyboard_arrow_down folder Shape keyboard_arrow_down folder Size and typography keyboard_arrow_down Close Anatomy Container and label text are required. All other elements are optional: Container Overline Label text Trailing text Supporting text Trailing icon Divider Leading avatar Leading icon Leading media - image or video Flexibility & slots The M3 Design Kit includes lists with custom slots for designing flexible item layouts. Think of a custom list as a container with three different slots: leading, content, and trailing. Each slot can hold a different element. Slot accessibility Slots are not accessible by default. Consider the following: Elements must follow the rules, structure, and interaction patterns for lists Use standard list item padding Target size must be at least 48x48dp Don't add interactive elements that make the list item difficult to navigate, especially for people using screen readers More on required accessibility guidelines exclamation Caution Reserve the use of slots for use cases that maintain the list’s accessibility and functionality Leading slot Content slot Trailing slot warning Caution: Slots require custom code implementation that you must create and maintain The leading and trailing slot positions must be a smaller width than the content section. 1. Leading slots can contain: Visual elements: Avatar, icon, image, or video thumbnail
 Selection
 Selection lets users choose specific items to act on.
 More on selection
 controls: Checkbox, radio button, or switch Customizations: Badge or larger image 2. Content slots must be the largest-width slot and can contain: Default content: Label text, supporting text Optional add-ons: Badge, icon, in-line label, or more text elements Avoid long lines of text to preserve readability 3. Trailing slots can contain: Action elements or text: Icon, icon button, or trailing text Selection controls: Checkbox, radio button, or switch The content slot must be the largest section, placed in the middle of the list item Selection lists For selection lists, use only one selection interaction per list item. check Do Use only one selection interaction per list item close Don’t Don't use multiple selection interactions in one item Color Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. Learn more about design tokens List color roles used for light and dark themes: Surface On surface variant On surface On surface variant On surface variant On surface variant Outline variant Primary container On primary container On surface variant States States are visual representations used to communicate the status of a component or an interactive element. Learn more about interaction states More on list focus Default list items Enabled Disabled Hovered Focused Pressed Dragged Selected list items Enabled Disabled Hovered Focused Pressed Dragged Measurements List item alignment, padding, and size measurements. The icon button height is dynamic, and automatically adjusts to fill the list item height. Shape morphing When a list item is selected, the corner shape changes to highlight the active item: Unselected corner radius: 4dp inner, 16dp outer Selected corner radius: 16dp Unselected list items have a 4dp inner corner radius, and 16dp outer corner radius Selected list items have a 16dp corner radius all around List (baseline) The
 baseline
 Baseline variants are the original M3 component designs. They may not have the latest features introduced in M3 Expressive, like updated motion, shapes, type, and styles.
 More on M3 Expressive
 list variant is available and continues to work in existing products. However, the expressive list variant is recommended for new designs. Tokens & specs Baseline list
 tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 are in the common token set. Note: This set also includes several expressive tokens. List - Common arrow_drop_down search expand_all Default, Light arrow_drop_down folder Color keyboard_arrow_down folder Spacing keyboard_arrow_down folder Shape keyboard_arrow_down folder Size and typography keyboard_arrow_down Close Color Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. Learn more about design tokens List color roles used for light and dark themes: Surface On surface On surface variant On surface variant On surface variant Outline variant Primary container On primary container On surface variant States States are visual representations used to communicate the status of a component or interactive element. 1. Enabled 2. Disabled 3. Hovered 4. Focused 5. Pressed 6. Dragged Layout One-line lists Baseline one-line list alignment, padding, and size measurements Baseline list item measurements and padding Two-line lists Baseline two-line list alignment, padding, and size measurements Baseline list item measurements and padding Three-line lists Baseline three-line list alignment, padding, and size measurements Baseline list item measurements and padding Attribute Value Label alignment Center Label alignment when height is 88dp or taller Top Label left padding 16dp Leading element alignment (vertical) Center Leading element alignment (vertical) when height is 88dp or taller Top Leading element left padding 16dp Leading icon alignment (vertical) Top Leading icon top padding 8dp Leading icon top padding when height is 88dp or taller 12dp Trailing element alignment (vertical) Center Trailing element alignment (vertical) when height is 88dp or taller Top Trailing element left padding 16dp Trailing element right padding 24dp Padding above/below divider 0dp Targets 48dp Divider full-width 100% Divider inset left padding 16dp Divider inset right padding 24dp Configurations Leading avatar With leading avatar With leading avatar and trailing checkbox Leading image or thumbnail With leading image With leading image and trailing checkbox Leading video With leading video With leading video and trailing checkbox Leading icon With leading icon With leading icon and trailing checkbox Text-only With text only With text and trailing checkbox Leading checkbox With leading checkbox With leading checkbox and trailing text Leading radio button With leading radio button With leading radio button and trailing text Trailing switch With trailing switch With leading icon and trailing switch

## Guidelines (full text)

Lists – Material Design 3
 Usage Anatomy Adaptive design Behavior Lists can include a range of layout combinations: Leading images, videos, icons, or avatars Trailing text, icons, or icon buttons Usage Lists are vertical groups of text, icons, images, and other elements, optimized for reading comprehension. List items can contain multiple actions at once, like selection, icon buttons, overflow menus, and more. A clear visual hierarchy makes lists easy to scan and read Use lists for communicating or selecting discrete items, such as choosing from a set of colors. Lists are an organized way to add imagery and supporting elements to selection. In this color selection example, the list contains color swatches, color names, and a checkbox action. A list should be easy to scan. Any element can be used to anchor and align list item content. Place supporting visuals and primary text in the same position in each list item. Don’t vary the position of elements within a list. Sample list Content placement in a row Supporting visuals are aligned for easy scanning Primary text is aligned for easy scanning List items can adapt to different lengths of text: Label text only A list item can contain a single line of label text. If the text doesn’t fit on one line, it can wrap or be truncated. Label text with supporting text A list item can include supporting text below the label text. Both the label and supporting text can wrap or be truncated. Three examples of list item sizes: Label text only Label text with supporting text on one line Label text with supporting text that wraps to two lines Anatomy Container and label text are required. All other elements are optional: Container Label text Supporting text Trailing text Trailing icon Trailing selection control - checkbox, radio button, switch Leading avatar container Leading avatar text Leading icon Leading media - image or video Container List containers hold all list items and their elements. List item size is determined by the tallest element within the list item. See layout measurements    When a list item features an image, consider customizing the container color to use a content-based color scheme. This should be applied to either the enabled state or for an interaction. pause A list item can include a leading image and a vibrant color Label & supporting text Keep label text brief.    To ensure list items are scannable: Limit supporting text to one to three lines Truncate supporting text, depending on screen size See adaptive guidance Limit supporting text to one to three lines Icons Leading icon A leading icon should provide a quick visual cue that relates to the item's label text, helping people scan the list. Trailing icon A trailing icon is often used to communicate status or indicate an action, like Show more . Leading icons should relate to the label text Trailing icons can communicate an action Leading media List items can contain a leading avatar, image, or video. Anchor visuals to the leading edge of the list to improve scannability. Leading video thumbnails can open a video player or even play within the list. check Do Place supporting visuals, like thumbnails, at the leading edge of a row to improve scannability exclamation Caution Avoid placing visuals in the center of a row because it makes the list difficult to scan Avatars List items can include images in circular or expressive shapes to represent a person or entity. Use square or rectangular images for other content, such as products or videos. Use an expressive, circular avatar to represent a person or entity Primary & secondary actions Use spacing to draw attention to the most important aspect of the list item, usually the primary action area or key content. The primary action takes up more space: 1. Primary action area 2. Secondary action area Align content by importance: 1. More distinguishing content 2. Less distinguishing content Trailing text Trailing text can provide additional meta-information about a list item, such as a price, count, or other details. Use trailing text for supplemental details, like a price, count, or date Selection controls
 Selection
 Selection lets users choose specific items to act on.
 More on selection
 controls display list item actions. Position controls at the leading or trailing end of a list item: Use
 checkboxes
 Checkboxes let users select one or more items from a list, or turn an item on or off.
 More on checkboxes
 to select multiple items Use
 switches
 Switches toggle the state of an item on or off.
 More on switches
 to toggle settings on or off Use
 radio buttons
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 to select a single item List items with: Checkboxes Switches Radio buttons Gaps & dividers Gaps or dividers can separate lists into items and groups: Use gaps for contained lists. Gaps leverage expressive shape and containment tactics. Limit dividers to uncontained or complex lists, only when a stronger visual separation is necessary. check Do Use segmented gaps and filled list items to define a list group exclamation Caution Limit the use of dividers to uncontained lists Adaptive design Line length In fluid
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 , avoid excessively long lines of text when expanding containers and text-heavy components. This often means changing
 margins
 Margins are the spaces between the edge of a nested element and its parent element, such as the space between a button's label text and the edge of its container.
 More on margins
 and typography properties as the container scales. check Do Adjust margins to create a more comfortable line length for reading Adapt the width of the list container based on a line’s length, or by switching to a multi-column layout. check Do A multi-column layout can help break up content when needed The ideal line length for text is typically between 40 to 60 characters, but large-screen devices can accommodate up to 120 characters per line. If a line of text is close to 120 characters in length, consider increasing the line height to improve readability . close Don’t Don’t scale components without adjusting other affected areas of the screen, such as text length. This can result in line lengths that make reading difficult. A list with a
 compact breakpoint
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 can become part of a two-column layout at an
 expanded breakpoint
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , adjusting the amount of information shown in each list item. pause Reduce the amount of information shown at compact breakpoints Adapt list elements & layout Lists can change their layout to adapt to different
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 . This affects the size and placement of content. For example, a list at a compact breakpoint can adjust margins, spacing, or density to better fit an expanded window. pause On larger screens, lists can show more content, like supporting text and larger imagery Swap components Lists are just a compact composition of images, text, and actions. Other components, like cards and carousels, use the same elements but take up more space.    At larger breakpoints, consider swapping a list to a component with a similar purpose to take advantage of available space. pause Information displayed in list items on mobile can change to cards on tablet and desktop Compact breakpoints Lists should extend edge-to-edge in compact windows. Selecting a list item should open a page with the details. pause On small screens, people can navigate between lists and full-screen detailed views Medium & expanded breakpoints
 Medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , such as tablet and desktop screens, can display primary and secondary content in the same view. For example, a list and the detailed information can appear side-by-side. On larger screens, a list-detail view can be more appropriate At a larger breakpoint, a list may transform into a carousel. pause Lists can transform into carousels in expanded windows Lists can also show more or less content as they scale up and down in size. For example, a list item can reveal more content when the component expands. pause List items reveal supporting text at expanded breakpoints Behavior List selection modes The selected state applies to the entire list item. For example, when an item with a checkbox is selected, both the list item and the checkbox show a selected state. Single-select Lists can feature a single-selection component such as a
 radio button
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 . Single-select list items: Don’t support multi-actions Can’t have secondary nested actions Shouldn’t use checkboxes Use radio buttons to allow a single selection in a list Multi-select Multi-select lists allow for multiple list items to be toggled on. Multi-select list items: Pair well with checkboxes and switches Can’t have secondary nested actions Shouldn’t use radio buttons Use checkboxes or switches for multi-select lists Single-action In a single-action list, the entire list item performs one action, such as navigating to a new page. Single-action list items: Can’t have secondary nested actions Can’t be toggled into a persistent selected state Use a single-action list for a primary action, like navigation Multi-action Multi-action lists can support multiple nested actions within a list item. The primary action should take up the majority of the space in the leading and content positions. Place supplementary actions, like a bookmark or menu, in the trailing position.   More on multi-action accessibility Place supplementary actions in the trailing position of a list item Non-interactive Non-interactive lists can organize information in a scannable way. They don’t perform any actions and can’t be selected. Use non-interactive lists to make information easy to scan List interactions Expand & collapse List items containing other list items can expand and collapse in a folder-like manner, to reveal or hide content. Tapping a list item expands it vertically across the entire screen using a container transform transition pattern. pause To expand a list item, display a parent-child transition Swipe On Android, list items can reveal buttons on swipe. Use a mix of button styles for visual interest and hierarchy.   The primary action must be the final end-aligned option. A full swipe triggers this action, clearing the list item and all other actions off-screen.  Swipeable list items should include alternative ways to access hidden actions, such as a more icon. More on swipe accessibility When a list item is swiped, it can be archived or reveal more actions

## [overview] illustrations

- `56135027f7fd5457.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8nxjh0-01.
- `1b994d7d97758514.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8pwbjv-02.
- `207c973938e8fd5d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8q1tdh-03.
- `cf51802e4794619d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8q2xsp-04.
- `9e4bb61a60d6b2be.png` ← https://lh3.googleusercontent.com/D9kmD7TGeuB3-racv1SUAJPNK6hFXZzfnfcOhHyzg-4FcKKoy-aIL4il04fdYgJi8na-_bLRZF3q

## [specs] illustrations

- `49c437679568d5b2.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmshrflwe-GM3%20-%20Expressi
- `b2711e0356111149.png` ← https://lh3.googleusercontent.com/-Eph6i5PJ8k8D5ABIpITkh-WLe2a-gMsM-sq2qCDM1cFBVfQN3FGAYAwiryrXRkrF8-8Q3Exypco
- `e2b76e1d20f88f4c.png` ← https://lh3.googleusercontent.com/0D-xONvUbyoPV0EMlMrBItgWHQXbW1IV2dBVpIslSFeHc0mUoHbJsP3y9on5ym7Ch1ICbFcFH702
- `16a8639a528bf4db.png` ← https://lh3.googleusercontent.com/3pOgKx-2m1N3ewCJ-joHRZ0IFwf-GHaxzimTyF_4-SYx_80TL6UnaBywa7ogFoCCil_KQgEFXoNm
- `6efe3b02206974df.png` ← https://lh3.googleusercontent.com/5lf9R5VeSpT9MZ52tQ1Gr9G6LJSo3T61BAkwRTHYYL4e0_ymdXq3TFfAieV8fBpokbyEkAP1dql3
- `2f3922a01fc7a09e.png` ← https://lh3.googleusercontent.com/6qcPlbTkPuUN2vByfw3QiZU3_haTWYgitgstbbYGI9ugO1r8LknZ2RPovveQ18B9EOKQNu5robyV
- `0e8629526dbe6e9c.png` ← https://lh3.googleusercontent.com/7CIUKy6Fim2680D81iGn6XanxNoVlnFioAJfyYiwtTyF2xh2_RvyyLsLSFZoUj6LRfn6MVEyvaHy
- `dcea9a2defd5f7e4.png` ← https://lh3.googleusercontent.com/7K4R5eQvQLtvBGZ8iDlPrwl6-HftUdcPx0S6MRj8QLMuQMLlHQXj0EYkvlawvcIQOlaTsf1CAq8G
- `ca452c762731157b.png` ← https://lh3.googleusercontent.com/7ikqKMFSD3KqUsrjy_D0FguVESN7UimX34YCtDgR8Cqm5sbof9nysVBBnBgjQukuuXjAQooDRC5m
- `7bc2709f205fe8e2.png` ← https://lh3.googleusercontent.com/811g1L2vKGQ0BTtqAoZPO-jApLgGPEDiV-7oi308iwDk-GrwrWTuQmCkNSok5-5XqCp7iNaldpc6
- `2fba9b392c042027.png` ← https://lh3.googleusercontent.com/ANybLHYX4h2Z9SkeL_p_Pp1K3Wg9plho_Lbg3-Z5d7NwszrsXTlRm434BJIm0mbM1Km5s9XFun2j
- `d8a0b40cdf3ed4d7.png` ← https://lh3.googleusercontent.com/ARd2jFHJp7QY8tjQqnTd9qITF5sD6WqWXpapVsC25_-ej0okbpB1kkGYkJ8V7jSl-iFv0cW18ZGs
- `7d2d68787db89df2.png` ← https://lh3.googleusercontent.com/AjWZ3hS3wVVBYsai8chTl-DhNYum8MkyLgX24Q1dLLV43O6P2gRIbTqcrvQMXwyFG9Jai3R-zExV
- `9e4bb61a60d6b2be.png` ← https://lh3.googleusercontent.com/D9kmD7TGeuB3-racv1SUAJPNK6hFXZzfnfcOhHyzg-4FcKKoy-aIL4il04fdYgJi8na-_bLRZF3q
- `d7b98abdd9f8e220.png` ← https://lh3.googleusercontent.com/F_D2HGWtWYSMxDVgfkIRpfgvy8O26m5Gq1uzE8tvEuo9m9sMLfRhcnuVfZSE6hyxoICYNuSzjIfA
- `cc8756b22a553043.png` ← https://lh3.googleusercontent.com/LxLM2jQt0STwJFF6mM7jaAxeP09Gu8KXxM8a2gg_tCprAziEoUSMbqhONXIWU-yKoahTjXATtmhp
- `4485cbc1ad093ed9.png` ← https://lh3.googleusercontent.com/N1XQO63f9X32oDtv-OfmhY2QXVt4JpIIbZVk7BmB_2FcLR7QDWORgKJOQkA81-R5pujkxNiZHTMR
- `71e58bd1bbd66045.png` ← https://lh3.googleusercontent.com/N4Dqm-y0qh8NW2KuKAqcRAmf_oyfUyeY2HgR3cHvoCwL-cM6j7fuAg97gGrX73Rs25WTv-POEG1Z
- `a06a520e726224c5.png` ← https://lh3.googleusercontent.com/Sa8xghsBnkEPnF8eS5BsRjuohsdTmqbkr_f1sENLSXj6Vvj60a-fAE32n9nUI8ErJeIbxkQPPl7w
- `d28bc3e80a29bfcc.png` ← https://lh3.googleusercontent.com/UIM_5cKOrqy1Jgy2wF6ND6qMT0cXmrXlqkqpSr1hUtJoShVECpFJt1jn39e7aoczco9L3ABwR7O4
- `5b1e83584bd0f58a.png` ← https://lh3.googleusercontent.com/UeCgyEiHh76y34mk1S7ebdWal471s5Yjj34uWFbNb0sEgl-iICDps6JeHuje-47Lb8h1F1ii1GsW
- `b522e257b9db877e.png` ← https://lh3.googleusercontent.com/WfsQdzz9ydTMtaG8lRdHEb8GmuDilZ3RVX7fNys6QemgIc3Euv0bnB2eKnFMZNxvApj-l2ZNNVTt
- `929b6ce8b3c73241.png` ← https://lh3.googleusercontent.com/YZNJPefhDxEZHejO2AZtRcJlJmExP5SKLT5whDkHInauUNxfIgYBOXhlhXukAnjNfZRDhVUlk5fR
- `a56e9df3a3840a33.png` ← https://lh3.googleusercontent.com/YtV6g40j9-XQCPCAVu67QZhyyBxdzXse8Aq4zgVnIWxg5eL0YP-62b5XRWhoQFLGZ77XDbPLnnLn
- `62a7f942f18f23e0.png` ← https://lh3.googleusercontent.com/ZP5JjdhEst35JLSuCdpnHvXs58yyjQdBREYdsNON0wtg-iHRjNtjvaPF6ekO3e3ceRrJWfJrP0Zf

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmshrflwe-GM3%20-%20Expressive%20-%20Specs%2008%`

## [guidelines] illustrations

- `3c502f7cecfebf33.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmielqxgm-29.
- `edc109f33513669b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmielw5u4-30.
- `f7aa5953c0702e0f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmielzpxu-31.
- `f18dd40e0df01e85.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiem2107-32.
- `acf62193ade3bd09.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiem457u-33.
- `0c0dc594b6b6d9ec.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiem9cox-GM3
- `77677b5281461921.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiewcuoc-02.
- `d09a3a19ed1ff152.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiewi9tz-03.
- `c5d21caa5a1f155a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiewlynz-01.
- `9ae587c7f53eb80d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiewmxat-04.
- `0426b72d6381b4d4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiewpdzm-05.
- `5d26e323e3a2a5de.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiewsyte-06.
- `a0d4d0afc837b918.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiewwh4p-GM3
- `cd331d62e15c03e2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiex0v5m-08.
- `b6f3a1796d1758f4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiexc5t2-9.p
- `d9c23b7c7c990221.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiexhs7r-10.
- `b3200682b2e4bf5e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiexip9k-11.
- `e868a29c0b5a263b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiexkoay-12.
- `65feb5558ba44823.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiexnuvs-13.
- `ee7c6465ca155ae9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiexoaw7-14.
- `ad73a93aaf8a024e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiextt91-15.
- `bfe69d7d1a80e628.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiexzfsy-16.
- `7ade0b6dbdbc4090.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiezuscb-17_
- `3fbe9fa31b918912.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiezvi6d-18c
- `ea178cacaf7c5d41.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiezxs4c-19_

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiem9cox-GM3%20-%20Expressive%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmiewwh4p-GM3%20-%20Expressive%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif043uk-GM3%20-%20Expressive%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif0dffm-GM3%20-%20Expressive%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif0fb1t-GM3%20-%20Expressive%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif0hg20-GM3%20-%20Expressive%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif0mtl7-GM3%20-%20Expressive%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif0onle-GM3%20-%20Expressive%20`

## [accessibility] illustrations

- `05a89351c46d3b1d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8um9bl-11-
- `9bd0544efbd13772.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8uomf0-12-
- `e0004f86caf0b77e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8uwmgu-13-
- `a766954a91e4a506.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8v0dqs-14-
- `416418dc38338728.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8v14y1-15-
- `6f464cb6b0eb40a3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8wfvkj-17.
- `907ee8c720f51c91.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmi8wgxsf-18.
- `9e4b9a40b5689f2f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif14iza-01.
- `b0f60b5a3ad50d80.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif1hthv-GM3
- `23f470edb19f4e6c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif1lpwx-03.
- `3076d1f8ee75b262.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif1n85t-04.
- `6d1b26aaf7b970fc.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif1rzoz-GM3
- `e8e6cbe652480aae.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif1yik5-08.
- `35f3e458a2708977.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif1z0du-09.
- `62f6b5efdc63e6c2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif21ldt-10.
- `20eefe5ee3357e2d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif3ecf9-16.
- `7ef44c4b5b43695a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif3mprn-19.
- `e2eac0dbe9cd35e5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmshqfb4p-07-
- `9e4bb61a60d6b2be.png` ← https://lh3.googleusercontent.com/D9kmD7TGeuB3-racv1SUAJPNK6hFXZzfnfcOhHyzg-4FcKKoy-aIL4il04fdYgJi8na-_bLRZF3q

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif1hthv-GM3%20-%20Expressive%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmif1rzoz-GM3%20-%20Expressive%20`
