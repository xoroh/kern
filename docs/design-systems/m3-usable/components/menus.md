# M3 component: menus

_Archive: `m3-archive/spec/components/menus/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/menus/…_

## Overview (full text)

Menus – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 Use a menu to show a temporary set of actions. To show actions on screen at all times, use a
 toolbar
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 instead Menus can open from many components, including
 icon buttons
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 ,
 split buttons
 The split button opens a menu to give people more options related to an action.
 More on split buttons
 , and
 text fields
 Text fields let users enter text into a UI.
 More on text fields
 Context menus provide actions for a specific element, like an image or highlighted text, and usually open with a secondary click Vertical menus can include vibrant colors, gaps, dividers, and submenus to organize a list of choices Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Unavailable language Web Available language Web: Expressive Unavailable Close M3 Expressive update November 2025 Vertical menus were introduced with new shapes, color styles, selection states, and refined submenu motion. Gaps can be used for a more flexible layout on Android. More on M3 Expressive Variants: Added vertical menus , recommended for new designs
 Baseline
 Baseline variants are the M3 component designs. They may not have the latest features introduced in M3 Expressive, like updated motion, shapes, type, and styles.
 More on M3 Expressive
 menu is still available   Color styles: Standard Vibrant Vibrant colors help selected menu items stand out Differences from M2 Color : New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Variants : Dropdown menu and exposed dropdown menu are now both referred to as menu, since they differ only in the element which opens the menu surface M2: Former menu colors don’t contrast with the background M3: Menus feature new color mappings and dynamic color

## Key measurements (dp, extracted)

- dding and size measurements Attribute Value Container width 112dp min, 280dp max Corner radius 4dp Vertic
- ontal label text alignment Start-aligned Left/right padding 12dp Left/right padding with-icon 12dp List
- item height 48dp Padding between elements within a list
- item 12dp Divider top/bottom padding 8dp Divider
- height 1dp Divider width Dynamic Leading/trailing
- icon size 24dp Configurations A baseline menu appears
- component Keep the same menu item padding Targets should be 48x48dp or larger Don't add buttons, switches,
- Window widths from 600dp to 839dp, such as a tablet or foldable
- Window widths 840dp to 1199dp, such as a tablet or foldable

## Accessibility (full text)

Menus – Material Design 3
 Use cases Interaction & style Flexibility & slots Focus Keyboard navigation Interactability Labeling elements Use cases People should be able to do the following using assistive technology: Navigate to, open, and close a menu Navigate between and select menu items Interaction & style Menu items need certain cues to clearly show when they're selected: By default, menu items change shape and color when selected The default color contrast is 3:1 between selected and unselected menu items It's recommended to include another visual cue, like a checkmark Use multiple visual cues like color, shape, and icons to show that an item is selected Flexibility & slots Use caution when adding slots to menus: Make sure the menu remains accessible Elements must follow the rules and interaction patterns of the menu component Keep the same menu item padding Targets should be 48x48dp or larger Don't add buttons, switches, or other direct actions into the menu item. Nested elements should only perform one action. Adding multiple actions can break keyboard navigation and screen reader functionality. More on slots in menus exclamation Caution Reserve the use of slots for use cases that maintain the menu’s accessibility and functionality Focus Initial focus When a menu opens, focus should be placed on the first menu item. This allows people using a keyboard or other assistive technologies to begin navigating the menu immediately. Exiting a menu People expect to exit a menu by: Selecting an option Tapping Escape or outside of the menu Using the system back
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 Where focus is placed after closing the menu depends on the app. Keyboard navigation on Android and web: Tab to select a menu item Space or Enter to open a menu Space or Enter to select a menu item Escape to close a menu Keyboard navigation Keys Actions Tab Focus lands on menu Space or Enter For closed menus: Opens menu or submenu For open menus: Selects a menu item Up and Down arrows For closed menus: Opens menu For open menus: Moves focus to the next item Left and Right arrows Opens or closes a submenu Letters Focus moves to the next menu item starting with letter Escape Closes menu Interactability 
 Disabled
 A disabled state communicates a non-interactive component or element.
 More on disabled state
 menu items can receive focus but aren't selectable. Dividers and gaps can't receive focus. check Do Disabled menu items can receive focus close Don’t A divider or gap can’t receive focus Labeling elements 
 Accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 labels are used with assistive technology devices like screen readers. The accessibility label should be the same as the menu item text. The role is dependent on platform . The menu item’s accessibility label aligns with the UI text Element A11y label Role (Web) Role (Android Views) Role (Jetpack Compose) Menu item text Preview Menu item Generic actionable element Generic actionable element For menu items with text and an icon, the icon’s accessibility label should be marked as decorative to avoid redundant verbalizations. For menu items with text and an icon, the icon’s accessibility label is decorative

## Specs (full text)

Menus – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color States Measurements Menu (baseline) Variants Vertical menus Use vertical menus for a more expressive look and feel, including rounded corners, standard and vibrant color styles, more selection states, and submenu motion. Vertical menu with gap Vertical menu with divider Baseline variant In M3 Expressive,
 baseline
 Baseline variants are the original M3 component designs. They may not have the latest features introduced in M3 Expressive, like updated motion, shapes, type, and styles.
 More on M3 Expressive
 menu is still available to use, but doesn’t have the latest shapes, color styles, selection states, and motion. See baseline menu specs A baseline menu has square corners, as compared to a vertical menu’s round corners and expressive styling Variant M3 M3 Expressive Vertical menus -- Available Menu (
 baseline
 Baseline variants are the original M3 component designs. They may not have the latest features introduced in M3 Expressive, like updated motion, shapes, type, and styles.
 More on M3 Expressive
 ) Available Available Configurations Vertical menus layout Standard Grouped Category Configuration M3 M3 Expressiv e Color Standard Available Available Vibrant -- Available Layout Standard Available Available Grouped -- Available Tokens & specs Browse the component elements, attributes, tokens, and their values. Learn about design tokens Menus - Common arrow_drop_down search expand_all Default, Light arrow_drop_down folder Typography keyboard_arrow_down folder Shape keyboard_arrow_down folder Layout keyboard_arrow_down folder Focus ring keyboard_arrow_down Close Anatomy Vertical menus Menu item Leading icon (optional) Menu item text Trailing icon (optional) Badge (optional) Trailing text (optional) Container Supporting text (optional) Label text (optional) Gap (optional) Divider (optional) Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. Learn more about design tokens Menus have two color mappings: Standard: Surface-based Vibrant: Tertiary-based These mappings provide options for lower or higher visual emphasis. Vibrant menus are more prominent so should be used sparingly. Standard color scheme Vibrant color scheme Standard colors Vertical menus color roles used for light and dark themes: On surface variant On surface On surface (state layer) Surface container low On surface variant On surface variant Tertiary container (selected) On tertiary container (selected) On surface variant On surface variant On tertiary container (selected) Vibrant colors Vertical menus color roles used for light and dark themes: On tertiary container On tertiary container On tertiary container (state layer) Tertiary container On tertiary container On tertiary container Tertiary (selected) On tertiary (selected) On tertiary container On tertiary container On tertiary (selected) States
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or an interactive element. More on interaction states Shape morphing in vertical menus creates an expressive active state. As focus moves between submenus, the corner shape changes to highlight the active menu. More on menu focus Enabled Disabled Hovered Focused Pressed Active (main menu reveals submenu) Measurements Vertical menu padding and size measurements Menu (baseline) The
 baseline
 Baseline variants are the original M3 component designs. They may not have the latest features introduced in M3 Expressive, like updated motion, shapes, type, and styles.
 More on M3 Expressive
 menu variant is available and continues to work in existing products. However, M3 expressive vertical menus are recommended for new designs. Baseline tokens & specs Browse the component elements, attributes, tokens, and their values. Learn about design tokens Menu (baseline) arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hover keyboard_arrow_down folder Focus keyboard_arrow_down folder Pressed keyboard_arrow_down folder Focus indicator keyboard_arrow_down Close Anatomy List item List item leading icon List item trailing icon Container List item trailing text Divider Color Baseline menu color roles used for light and dark themes: On surface variant On surface On surface - opacity: 0.08 Surface container On surface variant On surface variant On surface variant Surface container highest Outline variant States Default menu items Enabled Disabled Hovered Focused Pressed Selected menu items Enabled Disabled Hovered Focused Pressed State specs are in the token module above Measurements Baseline menu padding and size measurements Attribute Value Container width 112dp min, 280dp max Corner radius 4dp Vertical label text alignment Center-aligned Horizontal label text alignment Start-aligned Left/right padding 12dp Left/right padding with-icon 12dp List item height 48dp Padding between elements within a list item 12dp Divider top/bottom padding 8dp Divider height 1dp Divider width Dynamic Leading/trailing icon size 24dp Configurations A baseline menu appears when a person interacts with a button, action, or other control. A few examples:
 Button
 Buttons let people take action and make choices with one tap.
 More on buttons
 Text field
 Text fields let users enter text into a UI.
 More on text fields
 Icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 Selected text

## Guidelines (full text)

Menus – Material Design 3
 Usage Anatomy Flexibility & slots Placement Adaptive design Behavior Focus Density pause A menu in the vibrant color style is more expressive, and one with standard colors is more utilitarian Usage Use a menu to show a temporary set of actions. To show actions on screen at all times, use a
 toolbar
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 instead.  A menu takes up less space than a set of
 radio buttons
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 or
 chips
 Chips help people enter information, make selections, filter content, or trigger actions.
 More on chips
 . Color options Menus have two color mappings: Standard: Surface-based, lower visual emphasis Vibrant: Tertiary-based, higher visual emphasis Vibrant menus are more prominent, and should be used sparingly. On web, menus can open submenus Opening menus Menus temporarily appear in front of all other permanent UI elements. A menu should open when a person: Selects an element, such as an icon,
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 , or text field Performs a specific action to trigger the menu, like right-click or press-and-hold Use menus in situations that need extra actions, like: Overflow menus Text field dropdown menus Select menus Context menus Menus appear in front of all other UI elements Menu groups Vertical menu items can be grouped by adding a divider or small gap. Use groups to bundle similar actions together.   Gaps and dividers guidelines Menu items can be grouped to be more scannable: Standard vertical menu Grouped vertical menu Context menus Context menus provide a list of additional actions a person can take on an item. A secondary click, like a right-click on a mouse or a two-finger tap on a trackpad, opens a context menu. A context menu appears when right clicking with a mouse or trackpad. It can reveal key actions related to the associated content. Anatomy Menu item Leading icon (optional) Menu item text Trailing icon (optional) Badge (optional) Trailing text (optional) Container Supporting text (optional) Label text (optional) Gap (optional) Divider (optional) Menu items Menu items can include label text, leading icons, trailing icons, and keyboard commands. When a menu item can only be used under specific conditions, it should appear
 disabled
 A disabled state communicates a non-interactive component or element.
 More on disabled state
 rather than be removed. The Redo action is disabled when that action isn’t available Gaps & dividers (optional) Gaps and dividers can be used to separate and group menu items. Gaps Use a gap to visually divide menu items into distinct groups. Gaps are more expressive than dividers and make the relationship between items clear. Avoid changing the size of the gap Limit the number of gaps in a menu to one or two Don’t use gaps in scrollable menus Gaps separate menu items using expressive shapes star Note: Gaps are not currently available on web Dividers Dividers create a more subtle separation between items. Use a divider for: Scrollable menus Text fields with a dropdown menu, where a grouped treatment isn’t appropriate On web, use a divider to separate menu items. Dividers separate menu items in baseline menus and on web Flexibility & slots Menus have custom slots that support more flexible item layouts. When creating a complicated menu, think of the menu item as a container with a swappable slot. Slots work best with simple content such as: Images Progress indicators Color swatches Slots can appear anywhere in a menu Slot accessibility Use caution when adding slots to menus: Make sure the menu remains accessible Elements must follow the rules and interaction patterns of the menu component Keep the same menu item padding Targets should be 48x48dp or larger Don't add buttons, switches, or other direct actions into the menu item. Nested elements should only perform one action. Adding multiple actions can break keyboard navigation and screen reader functionality. More on required accessibility guidelines exclamation Caution Reserve the use of slots for use cases that maintain the menu’s accessibility and functionality Placement A menu is positioned relative to the window edge. It typically appears below, next to, or in front of the element that generates it. If a menu is in a position to be cut off, it should automatically reposition to appear to the left, right, or above the element that generates it. Menus can appear around or in front of the element that opened them Submenus Submenus should open next to the parent menu item without overlapping it. Submenus are best used on large screens where there's space. See adaptive guidance for alternatives on mobile.   Position submenus to the side of the parent item star Note: Submenus are not currently available on Jetpack Compose Adaptive design Compact breakpoints Consider adapting menus into
 bottom sheets
 Bottom sheets show secondary content anchored to the bottom of the screen.
 More on bottom sheets
 on small screens. They have more space to display additional items and longer labels. A bottom sheet can replace a menu on smaller screens Other breakpoints On
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 expanded
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 windows, menus are most effective as they appear in context with the content. On larger screens, menus can also display more items, and can use submenus to organize complex sets of options. On large screens, a menu is often more appropriate than a bottom sheet Behavior Appearing A menu can appear when a person interacts with an element on the page, like a button, text field, filter chip, or highlighted text. A menu’s position on screen affects where and how it appears. If opened at the top of the screen, it expands downwards to avoid being cropped. pause Menus at different positions on a screen open in different directions, adapting to the available space pause A menu can open from a split button pause A menu can appear in context, like next to highlighted text or a selected image pause A menu can open from a text field pause A menu can open from a filter chip Motion Menus use an enter and exit transition. This animation creates a relationship between the menu and the element that generates it. When a menu expands, the trigger element becomes pressed. When an item is selected, a ripple appears on touch. pause A menu expands when opened, and has a ripple when an item is selected In dense products, such as on desktop, menus can open instantly to reduce motion. pause Desktop menus can open instantly Filtering A menu can include a text field to filter options. This pattern is also known as autocomplete. As someone types, the list of menu options filters to show relevant results. This helps people quickly find the right option from a long list. Menu items ease into their new position as the menu is filtered. pause As a person types in the text field, the menu options filter to match the input Scrolling Menus can scroll when all menu items can’t display at once. In this state, menus show a persistent scrollbar. Don’t use gaps if a menu scrolls; this is currently unsupported. pause When content is scrollable, menus display scrollbars Selecting When a menu is opened, the corresponding
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 or
 icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 should remain the same visually, with the addition of a pressed state. This should happen even when opening from a keyboard shortcut. Tapping the icon triggers a menu. Choosing a menu option doesn’t change the icon generating the menu. Single- and multi-select menus Menus can allow either single-select or multi-select actions: Single-select menus can have one item selected at a time. When a new item is selected, the previously selected item is automatically unselected. Multi-select menus can have many selected items. They stay open until the person dismisses the menu. More on selection accessibility requirements Menus can be single- or multi-select Focus When a menu has multiple submenus, focus follows the current hovered or focused submenu. Shape morphing As a person moves from one submenu to the next, the corners of the focused submenu become more rounded, while the unfocused submenu becomes less rounded. This adds a dynamic quality to menu interactions. pause On a custom menu, the corner shape changes to indicate focus as the cursor moves across submenus Density On web only, density levels control the spacing between elements. Increasing density decreases the top and bottom padding. More on layout density Density of menus from 0 to -3

## [overview] illustrations

- `289602c3cbf76c77.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhk9jsmw-02.
- `0330b21040910a20.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhkajj6i-01.
- `919245dfb9e53506.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlt7xid-04.
- `1d794c493892cca4.png` ← https://lh3.googleusercontent.com/eL0VqKowoWoyad9XeiEkCH_Z07uvihWBuQdxkFAW_Nqgs56RqYsknQb3955D1ivkyjqQpqC_Urfj
- `b5c1ecbb56587bed.png` ← https://lh3.googleusercontent.com/lRkDtzZzv1cQwgvOMTY_hxx5v6LvsZjXrAo_zSvv-cqgB6vH92PvSw1XJMN925XPqGDdMB1OgVKZ

## [specs] illustrations

- `42f41c4de8dbfef3.png` ← https://lh3.googleusercontent.com/1vrmeDpf2FtiP2c9fRq9p_aeqONtRV3zqmzYfkoIOaJesocpZ19K_ZUuMj99rTWJxwAW_r9WSMEH
- `fab0bb566ae6b4da.png` ← https://lh3.googleusercontent.com/6B9lmZdfYRC5nkKI-x6hS9U37bZC1o0jRWDkYe90mc-TV-OjPicvEckz5sYKYsoyP2hRO_hR3An7
- `fd628d69d5665cad.png` ← https://lh3.googleusercontent.com/9WZ8E98mBPsfeJqGE1w6ExWLXo1jACCCgppiykccySkhqcZCqFfrTs87Gp_XAlUNSqxRdv04cO62
- `76e8c04665ccdbe7.png` ← https://lh3.googleusercontent.com/9y63FlzafeIP9Tth6PTh9NKO6wwrYUZqCs6PTUKqIQPfYd7apIWRsvYx91maUHu43E0GoIkm7nDV
- `48ac82f6006f3b8b.png` ← https://lh3.googleusercontent.com/AfTrO7v-T_4xnHi8Fa-xmOOn21wmjYQWZ9CqSCVGaG910Nd8K4lS3FqfcNgYQ0iF4FSY12e_AEjX
- `e124f45e52f9d38b.png` ← https://lh3.googleusercontent.com/Eg2mSAl6lckNeGZn60i3N6b7ltjvGCbssGUhr-LWmLpa2HDbKhgxvA72PVKqTsT0ho7uQZWaK_bu
- `f850524f01a27248.png` ← https://lh3.googleusercontent.com/I8AoQRDKlS29lSyVHYVs4-2PKXVQUXC_wlPJx5IT1hWiga7bEC7DZUlNH_OEoICZN5hCf8ii45dp
- `c8c816481570102b.png` ← https://lh3.googleusercontent.com/MRcY8zpznxkaZVmDq-MvnNSUQnLDJ3uftXolOX1MZ7ZczEmBCp4nro5uy3WDlxm8De9S3E9m7yoH
- `61bad5b798dec23a.png` ← https://lh3.googleusercontent.com/SyybBdmLyz7BXoGoAF1kjCwXx7BiZvB0e_I7bpFAIDO-W4YGSJ21CKgtu5PdH7J49aZfYEJbVPyj
- `103e68c10f7a6bae.png` ← https://lh3.googleusercontent.com/UQTohIy6KP6b1-pM2Mvhf_SyQW6J3ibpKvf3Z5T8dI48XoYQ6DqhwG5ILCidkiXxCje50h4Tdx6V
- `1d794c493892cca4.png` ← https://lh3.googleusercontent.com/eL0VqKowoWoyad9XeiEkCH_Z07uvihWBuQdxkFAW_Nqgs56RqYsknQb3955D1ivkyjqQpqC_Urfj
- `e5b4cc00ab710e38.png` ← https://lh3.googleusercontent.com/fJlPTJ2NqSiweyHvIr8M0iPk67mplnSmEnq_2SEOW1OvhT31iv4txdTlYrXWpNvmmBVVfJJzaE_l
- `dcf7f7378ebdd0be.png` ← https://lh3.googleusercontent.com/j5d1I8gfzjOWuHT_-hl99nkZRsYTe7HewZawtXqtHSrfZhzBSF92oFrF4O2icV5C3AUdsRZTxRIg
- `c84cdee8be9477ce.png` ← https://lh3.googleusercontent.com/nA4wviKihXfkWje8PlNIZNpYajfpoudcjVm30OYpC8UdMEdquwj9QeSziFOs7KjJ3IR-fioXjTLM
- `ae66b614b4a2cc09.png` ← https://lh3.googleusercontent.com/qaQR6Vom4qUYAtiLZOaGC34kpj4PCzx3--sowDis88NJ1VOQiwhipAIlwryE8_cYmOrso8ZXJ8O5
- `24912ba15204c0b9.png` ← https://lh3.googleusercontent.com/ryW1crRfja9xt_7sPlT_XlF64XPHQjHmk6HkJ91EP23gfGW2Z1TNt8V1RsaAEt4bzOOow6wEtTrB

## [guidelines] illustrations

- `0824559f14e062b8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhkpbo8d-30.
- `b931a6e35862bf13.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlk1jwz-GM3
- `5ef243b30435a3aa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlkhju5-04.
- `e94ab1767ba85543.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlkwxab-06.
- `fae8198f4d2106b0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhll6qil-08.
- `2b50d4eaf67da62a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhllndkg-11.
- `47e147feb88491c7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhllqs3p-12-
- `2247211a2d128164.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhllv77j-13.
- `ba1ba6c872c085ee.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlm1f1q-15.
- `2ca149ded53e4a59.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlm7yx1-16.
- `7b38ac80d318493a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlmbxni-17.
- `51d6d740ada966a1.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhln3y77-GM3
- `bf201124ba30de11.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhln8qym-GM3
- `526ee57a717afdec.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlna20p-GM3
- `4986414c37ec83c7.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlnd4tn-GM3
- `ed9dbff24bb826c9.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlnelhq-GM3
- `abcd4ba1282c15da.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlnmpgd-GM3
- `643712ac5228db9b.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlnu8z2-GM3
- `8e04ac52e47bcc3c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhloarxl-GM3
- `d5392839135abe6a.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhloe6n0-GM3
- `66b45649b47ea8de.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlohkz8-28.
- `69b9f60855e5db0e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhloky2g-GM3
- `849d750d309342a1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhloonkj-32.
- `3c2d3dd655c0bfbe.png` ← https://lh3.googleusercontent.com/23G6to4Ij-HsQF2iAQsFg737t4f1InY3ANqqt-NYDrCj4ajmDFHSL7o3BTM7CHvUGdR8bTgcGg-O
- `744b38f0ccd8e84d.png` ← https://lh3.googleusercontent.com/6e3Jr7pvYamV89OCHR395lTYFRLLVJsUseXpeuESUaJGC8qKEa1geMsIaYbWGi2O0l2OjBKn5rzn

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlk1jwz-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhln3y77-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhln8qym-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlna20p-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlnd4tn-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlnelhq-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlnmpgd-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlnu8z2-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhloarxl-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhloe6n0-GM3_Menus_Guidelines%20`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhloky2g-GM3_Menus_Guidelines%20`

## [accessibility] illustrations

- `2225049d3e69cd54.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhkewf5t-03.
- `1410ea39c94ca86c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhkkp9r3-05-
- `882160029beccc7e.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhkkqmt3-05-
- `17ad81d307463222.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhkkynea-08.
- `3df2b97373183358.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhkl2sea-07.
- `40572be8eccce713.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhkskcq8-02-
- `1d794c493892cca4.png` ← https://lh3.googleusercontent.com/eL0VqKowoWoyad9XeiEkCH_Z07uvihWBuQdxkFAW_Nqgs56RqYsknQb3955D1ivkyjqQpqC_Urfj
- `48686a6e093e0ef4.png` ← https://lh3.googleusercontent.com/sQHnduUnTdZmXVul2Np64bpBWRigAhD_49ObKd4Ks5y6nO0DHiY9tADgizMA9vOTkfNS_w-InRys
