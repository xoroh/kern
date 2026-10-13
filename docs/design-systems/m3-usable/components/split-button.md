# M3 component: split-button

_Archive: `m3-archive/spec/components/split-button/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/split-button/…_

## Overview (full text)

Split buttons
 Availability & resources M3 Expressive update Use to show an action with a menu of related actions Same size range as buttons and icon buttons: XS, S, M, L, XL pause Split buttons are made of a common button and a menu icon button Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation android Jetpack Compose: Expressive Available android Android Views (MDC-Android): Expressive Available language Web: Expressive Unavailable Close M3 Expressive update May 2025 The split button has a separate menu button that spins and changes shape when activated. It can be used alongside other buttons of the same size. More on M3 Expressive New component added to catalog. Sizes: Extra small Small Medium Large Extra large Color styles: Elevated Filled Tonal Outlined Split buttons have the same five recommended sizes as label and icon buttons

## Key measurements (dp, extracted)

- tokens Split button - Size - Xsmall arrow_drop_down search 32dp Split button xsmall container height 2d
- p Split button xsmall between space Fully rounded 4dp Split button xsmall inner corner size 5
- 0% Split button xsmall outer corner size 12dp Split button xsmall leading button lead
- ing space 10dp Split button xsmall leading button trai
- ling space 22dp Split button xsmall trailing button ico
- n size 13dp Split button xsmall trailing button lea
- ding space 13dp Split button xsmall trailing button tra
- iling space 8dp Split button xsmall inner corner hovere
- d size 8dp Split button xsmall inner corner presse
- ly when symmetrical. Menu icon offset when unselected: XS: -1dp from center S: -1dp from center M: -2dp
- from center L: -3dp from center XL: -6dp from center The in
- nges depending on button sizing. The space should always be 2dp. Extra small 4dp Small 4dp Medium 4dp L
- arge 8dp Extra large 12dp
- it with one of the edges of the button. The menu should be 4dp from the split button. Top aligned to t
- h button in the split button needs a minimum target area of 48x48dp. Extra small and small split buttons ar
- e shorter than 48dp, so the target areas around them need t
- o be at least 48dp tall. Target areas should be at least 4

## Accessibility (full text)

Split buttons
 Use cases Interaction & style Initial focus Keyboard navigation Labeling elements Use cases People should be able to do the following using assistive technology: Navigate to each button and interact with them Navigate to any element opened by the trailing button Understand the current selection state of the button Interaction & style Each button in the split button needs a minimum target area of 48x48dp. Extra small and small split buttons are shorter than 48dp, so the target areas around them need to be at least 48dp tall. Target areas should be at least 48x48dp Extra small Small Initial focus Focus should land on the leading button then move to the trailing button. This can depend on the operating system’s settings. Left to right Right to left Keyboard navigation Keys Actions Tab Navigate between buttons Space or enter Activate focused button Labeling elements The accessibility label for the leading button is the same as buttons. Leading buttons should have the same labels as common buttons The trailing icon button should have an extra state or similar label indicating that the menu is expanded or collapsed. Label the button to clearly indicate that there are more options. The label of the secondary button should indicate that it provides additional choices related to the action of the main button. For instance, if the main button says "Watch later," the secondary button should be something like "More watch options." Label the opened menu according to the menu accessibility guidance . Trailing buttons should communicate the state of the menu and that more options are available

## Specs (full text)

Split buttons
 Variants Configurations Tokens & specs Anatomy Color States Measurements Variants Variant M3 M3 Expressive Split button -- Available Configurations Color configurations: Elevated, filled, tonal, outlined Size configurations: XS, S, M, L, XL Category Configuration M3 M3 Expressive Size XS, S, M, L, XL -- Available Color Elevated, filled, tonal, outlined -- Available Tokens & specs Use the table's menu to select a token set. Split button token sets are organized by size. Learn about design tokens Split button - Size - Xsmall arrow_drop_down search 32dp Split button xsmall container height 2dp Split button xsmall between space Fully rounded 4dp Split button xsmall inner corner size 50% Split button xsmall outer corner size 12dp Split button xsmall leading button leading space 10dp Split button xsmall leading button trailing space 22dp Split button xsmall trailing button icon size 13dp Split button xsmall trailing button leading space 13dp Split button xsmall trailing button trailing space 8dp Split button xsmall inner corner hovered size 8dp Split button xsmall inner corner pressed size 50% Split button xsmall trailing button inner corner selected size Close Anatomy Leading button Icon Label text Trailing button The leading button in split buttons can have an icon, label text, or both. The trailing button should always have a menu icon. Label + icon Label Icon Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. Split buttons use the same color schemes as standard
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 . However, unlike toggle buttons, the split button color doesn’t change when selected—only a state layer is applied. Split buttons use the same colors and state layers as buttons, shown in the following token module. Go to buttons for more details. A: Unselected, B: Selected trailing icon Elevated Filled Tonal Outlined Button - Color - Elevated arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed keyboard_arrow_down Close States
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or an interactive element. Split button states use the same colors and state layers as
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 and
 icon buttons
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 . Go to those specs for details. Leading button shape The inner corners change shape for hovered, focused, and pressed states. Enabled Disabled Hovered Focused Pressed, pressed with focus Trailing button shape The inner corners change shape for hovered, focused, and pressed states, and the icon becomes centered when selected. Enabled Disabled Hovered Focused Pressed, pressed with focus Selected, selected with focus Measurements Text and icons are optically centered when the buttons are asymmetrical. They’re centered normally when symmetrical. Menu icon offset when unselected: XS: -1dp from center S: -1dp from center M: -2dp from center L: -3dp from center XL: -6dp from center The inner corner radius changes depending on button sizing. The space should always be 2dp. Extra small 4dp Small 4dp Medium 4dp Large 8dp Extra large 12dp

## Guidelines (full text)

Split buttons
 Usage Anatomy Behavior Split buttons come in many sizes and colors Usage Split buttons are used to add a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 of actions alongside a main action. This reduces visual complexity by hiding extra options. Split buttons work well alone or alongside
 common buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 and
 icon buttons
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 . Split buttons on their own can grab attention Split buttons have five recommended sizes. These sizes match the sizes offered on buttons and icon buttons: Extra small Small (default) Medium Large Extra large Scale up the split button in large breakpoints, or to create more emphasis in smaller windows. Using large split buttons on small screens can add extra emphasis for hero moments Split buttons can be used alongside other buttons and button groups. Split buttons work harmoniously with regular buttons Split buttons can be of different sizes from other buttons on the page, especially since they take up more space. The most prominent controls can be larger while secondary controls in a split button can be smaller The split button typically opens a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 , but can be customized to open other components like
 cards
 Cards display content and actions about a single subject.
 More on cards
 . check Do Open a menu from a split button close Don’t Avoid modifying the menu in unusual ways Anatomy Leading button Icon Label text Trailing button The leading button should be brief, just one or two words, with an icon that best matches the action. The trailing button should always have the expand and collapse icon since it rotates when selected. Avoid modifying the icon. close Don’t Avoid using very long labels or changing the trailing icon In right-to-left languages, the component layout is mirrored. Split buttons mirror the order of elements in right-to-left languages Behavior The split button uses the
 standard motion scheme
 The motion physics system has two schemes: standard for utilitarian movement, and expressive for more bouncy movement.
 (not the expressive motion scheme) when rotating the menu button. The menu button rotates inwards 180° when opened and closed. pause Selecting the menu button rotates the icon inwards and applies shape morph Menu placement When using the split button with a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 , align the menu with the trailing button when possible. Align the menu with the trailing button If there’s not enough room, align the menu to one of the sides of the button. If not possible, align the menu to the side of the leading or trailing button Depending on breakpoint, scroll position, and other factors, the menu may need to appear elsewhere around the button. Always try to align it with one of the edges of the button. The menu should be 4dp from the split button. Top aligned to trailing button Bottom aligned to trailing button T op right-aligned Top left-aligned Bottom right-aligned Bottom left-aligned

## [overview] illustrations

- `df7243a35ffb9eed.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dmjd8r-2.p
- `eaf3e639b96ee57f.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4ilqvqh-Spl
- `7fc9bbfc5b0b88b4.png` ← https://lh3.googleusercontent.com/M8XsqmeTn2jgy7srjlfRDU_uqy6XEh754ELjK3dY2FFn4JmVWRU_vs3opnrZBI1c1n4vErm_mtJ4

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4ilqvqh-Split-Button-B.mp4?alt=`

## [specs] illustrations

- `f842709d2b7254b9.png` ← https://lh3.googleusercontent.com/136pHVBxZ_A3wzi6-X1sKmbfnuqeUu_FIMeP4lGM3iVNjPqQH-SA62_w0wEZPalIigsfGp_6G4V0
- `ac1a84081f292b61.png` ← https://lh3.googleusercontent.com/1yQajxz3WCQRMH3AdX8Tg7OPVxOT2Lcj8f3T7pDYmRcVZhFzkHR55JK8u7zD0did-AL95AJrs_xn
- `dcc60da21edb146d.png` ← https://lh3.googleusercontent.com/F2kUnhi2ZrsjiRH1K8Vru69-_x8fiFll-_4x9F4Nn-Y2X-KktX3SGtz5KBK4EkCQx5So3aXSeDex
- `bf997667bc9ec51f.png` ← https://lh3.googleusercontent.com/HXNWWohWOFX1IuFh8xMMnWtDczymOUA8I7CDja4WgwY3y_9LL-Ns0MjX2KsGanjBtco9oWxaL-tY
- `70b0391ed2fa7f27.png` ← https://lh3.googleusercontent.com/JOPyvu0AZccMCkuvHxbfK-M5B8_rVrEfV4GQ0Zgy0heMSDFJWtwU20dCLmW2HU4SM4JiEu-AfEg7
- `7fc9bbfc5b0b88b4.png` ← https://lh3.googleusercontent.com/M8XsqmeTn2jgy7srjlfRDU_uqy6XEh754ELjK3dY2FFn4JmVWRU_vs3opnrZBI1c1n4vErm_mtJ4
- `f56833df77ca7c85.png` ← https://lh3.googleusercontent.com/e6qwxAXA90nObGQBZ7-_IkTOn31Iw8LdEp8ua6AHcsG-8wRtfxpgADUbK2qbkwUwJkNad-EAPoVx
- `d9cf1cda43600433.png` ← https://lh3.googleusercontent.com/h_N1go5ViA5xTyg6nI2IBVOYKAqFx_-KIIRe4x3G3zHumq0gfQTZ3RUz1nUquSZJgSjeTLW5cRqD
- `372fff0f346860c3.png` ← https://lh3.googleusercontent.com/ocKi_dfwn4Uv_N5ArrzqUKti6uAj79S5f8KVg0BvXDI_BLYgT1-VC55NzHO8NHePXEQ6ygQevbqA
- `aced8e888824a60a.png` ← https://lh3.googleusercontent.com/y1PQA-NhEihuhB7tNeqbtGZu6b_yL6_kxPmh2Hghbj4dahZfyaxnimD4KhbRfGdnXlsy0NKEyxaM

## [guidelines] illustrations

- `bc917d2d480d29b3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dosrjf-3.p
- `fd3ea5c0416c7c82.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dp22eb-8.p
- `1846f0524513ae5d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dxuxjz-9.p
- `cd9f0d8d2ef41d46.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm36akp9w-1.p
- `3419e32f8456f4d3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4il1tni-6-a
- `4ec429808a75dfaf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4il1xwy-7-a
- `882a2a5390005d27.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4il8isz-12.
- `830a51e8a1998fb2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4ilatqh-13.
- `12bf756bf796ad6e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4ilqjvz-Spl
- `fe96eaa2efa0eebc.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4iz4b9v-14.
- `ebf71128716ac348.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmaehs3k3-4_A
- `d7839c77011afeb1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmaehumyk-5-a
- `a4104e6b318ce34a.png` ← https://lh3.googleusercontent.com/43s7j0gcA5ez0PmFtHcj6TNeZLo7IqSGHqlOTKi2whopiRe66fXmJylV_V3M7SUNoFR4NtxZoeAq
- `368d383a105732ac.png` ← https://lh3.googleusercontent.com/9UfkZE4_cZigzNlvBgN4B7ahe-tzvOBPxn_pzLUChLFUIKQitLU2y7pNJTXoW-K4aM2tVthNrk3B
- `7fc9bbfc5b0b88b4.png` ← https://lh3.googleusercontent.com/M8XsqmeTn2jgy7srjlfRDU_uqy6XEh754ELjK3dY2FFn4JmVWRU_vs3opnrZBI1c1n4vErm_mtJ4

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4ilqjvz-Split-Button-B.mp4?alt=`

## [accessibility] illustrations

- `edb2f47d93602509.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dpv69h-1.p
- `fee7b8fb2117a3d4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dq2sfs-3.p
- `c9250eca10ae23c3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dq40tg-4.p
- `1616935c049693d6.png` ← https://lh3.googleusercontent.com/Hxb_s-kioHaVoJt_tb0g2lLobKLWCPoTiVio9TRl21G3_8Ss0_qrmvpKS-bFeozlGusX8XxyQlG8
- `7fc9bbfc5b0b88b4.png` ← https://lh3.googleusercontent.com/M8XsqmeTn2jgy7srjlfRDU_uqy6XEh754ELjK3dY2FFn4JmVWRU_vs3opnrZBI1c1n4vErm_mtJ4
