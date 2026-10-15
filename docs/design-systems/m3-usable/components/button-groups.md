# M3 component: button-groups

_Archive: `m3-archive/spec/components/button-groups/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/button-groups/…_

## Overview (full text)

Button groups
 Availability & resources M3 Expressive update Two variants: standard and connected Applies shape morph when pressed and selected Connected button groups replace the
 segmented button
 Segmented buttons help people select options, switch views, or sort elements. Note: They're deprecated in the expressive update. Use a nav rail instead.
 More on segmented buttons
 Works with all button sizes: XS, S, M, L, and XL Support for single-select, multi-select, and selection-required Button groups can contain buttons and icon buttons Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation android Jetpack Compose: Expressive Available android Android Views (MDC-Android): Expressive Available language Web: Expressive Unavailable Close M3 Expressive update Button groups apply shape, motion, and width changes to
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 and
 icon buttons
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 to make them more interactive. More on M3 Expressive May 2025 New component added to catalog. Variants and naming: Added standard button group Added connected button group Use instead of
 segmented button
 Segmented buttons help people select options, switch views, or sort elements. Note: They're deprecated in the expressive update. Use a nav rail instead.
 More on segmented buttons
 , which is no longer recommended Configurations: Works with all button sizes: XS, S, M, L, and XL Applies default shape to all buttons: round or square Button groups are containers that hold buttons of many shapes and sizes

## Key measurements (dp, extracted)

- n button size to ensure a minimum accessible target size of 48dp. More details on padding: Button specs
- icon button specs Standard button group inner padding: XS: 18dp S: 12dp M: 8dp L: 8dp XL: 8dp Connected
- button group For all connected button groups, use 2dp padding. This provides visual consisten
- cy at scale. Round connected button group inner padding is 2dp at every size. The outer shape is fully
- r shape remains square with the following corner sizes: XS: 4dp S: 8dp M: 8dp L: 16dp XL: 20dp Square c
- onnected button group inner padding is 2dp at every size. The outer shape has the
- following corner sizes: XS: 4dp S: 8dp M: 8dp L: 16dp XL: 20dp Minimum
- widths Extra small and small connected button groups have 48dp target areas and a minimum width of 48d
- Window widths smaller than 600dp, such as a phone in portrait orientatio
- Window widths 1200dp to 1599dp, such as desktop.
- Window widths 1600dp and larger, such as ultra-wide monitors
- action & style Each button in a group should have a minimum 48x48dp target. Extra small and small button gr

## Accessibility (full text)

Button groups
 Use cases Interaction & style Keyboard navigation Labeling elements Use cases People should be able to do the following with assistive technology: Navigate to and interact with each button in the group Identify when buttons are selected Interaction & style Each button in a group should have a minimum 48x48dp target. Extra small and small button groups have larger inner padding to ensure accessible targets. Avoid reducing the padding in these sizes. Extra small button group Small button group Initial focus The button group container is not a focusable element. Initial focus should land on the first button in the group and then move to each button. Initial focus should land on the first button, not on the container Use Tab to navigate to a button group, the arrow keys to navigate between each item in the group, and Space or Enter to select a focused button. Tab : Initial focus lands on the first button Arrow keys: Navigate between items Space or Enter : Selects a focused item Keyboard navigation Keys Actions Tab Navigate between buttons Arrow keys Navigate inside the component Space or Enter Activate a focused button Labeling elements The button group container doesn't need to be labeled. Label each button according to the
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 and
 icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 accessibility guidance. Label each button within the button group

## Specs (full text)

Button groups
 Variants Configurations Tokens & specs Anatomy Selection & activation States Measurements Density Variants Standard button group Connected button group Variant M3 M3 Expressive Standard button group -- Available Connected button group Available as
 segmented button
 Segmented buttons help people select options, switch views, or sort elements. Note: They're deprecated in the expressive update. Use a nav rail instead.
 More on segmented buttons
 Available Configurations Configurations for both variants of button groups: Extra small Small Medium Large Extra large Single-select and multi-select Round and square Category Configuration M3 M3 Expressive Size XS, S, M, L, XL -- Available Default shape Round, square -- Available Selection Single-select, multi-select, selection-required Available as
 segmented button
 Segmented buttons help people select options, switch views, or sort elements. Note: They're deprecated in the expressive update. Use a nav rail instead.
 More on segmented buttons
 Available Tokens & specs Standard and connected button group tokens are organized by size. Select the variant and size from the token set menu. Go to the button and icon button pages to view their tokens. Learn about design tokens Close Anatomy Button groups are invisible containers that add padding between buttons and modify button shape. They don’t contain any buttons by default. Container Common layouts Mix and match buttons and icon buttons for different scenarios. Label buttons Label buttons and icon buttons Extra small icon buttons Large icon buttons Color Button groups have no color properties. They can use the default button or toggle button color styles, like filled, tonal, and outlined. Avoid using standard icon buttons or text buttons, as they have no container treatment. Filled Tonal Outlined Elevated Selection & activation Standard button groups add interaction between adjacent buttons when a button is selected or activated. This interaction changes the width, shape, and padding of the selected or activated button, which adjusts the width of buttons directly next to it. pause A selected button changes shape, and briefly changes the width of itself and adjacent buttons Connected button groups don’t add any interaction between buttons when selected or activated. They only affect the shape of the button being selected or activated. pause A selected button changes shape without affecting adjacent buttons States Standard button group When a button is pressed, standard button groups modify the width and shape of that button and adjacent buttons. Enabled Disabled Hovered Focused Pressed When a toggle button is selected in a standard button group , its shape should change between square and round. The color should change according to the button specs . Enabled Disabled Hovered Focused Pressed Connected button group Connected button groups have different shape changes than standard button groups. Selecting a button does not affect adjacent buttons. Connected button group unselected states: Enabled Disabled Hovered Focused Pressed Connected button group selected states: Enabled Hovered Focused Pressed Measurements Standard button group Standard groups apply padding between all buttons. The amount of padding changes based on button size to ensure a minimum accessible target size of 48dp. More details on padding: Button specs , icon button specs Standard button group inner padding: XS: 18dp S: 12dp M: 8dp L: 8dp XL: 8dp Connected button group For all connected button groups, use 2dp padding. This provides visual consistency at scale. Round connected button group inner padding is 2dp at every size. The outer shape is fully round, and the inner shape remains square with the following corner sizes: XS: 4dp S: 8dp M: 8dp L: 16dp XL: 20dp Square connected button group inner padding is 2dp at every size. The outer shape has the following corner sizes: XS: 4dp S: 8dp M: 8dp L: 16dp XL: 20dp Minimum widths Extra small and small connected button groups have 48dp target areas and a minimum width of 48dp. Extra small Small Density Button groups adapt to density of the buttons inside. More on density Button groups adapt to the height of the buttons inside, including when density is applied

## Guidelines (full text)

Button groups
 Usage Anatomy Adaptive design Behavior pause Standard button groups add interaction between adjacent buttons Usage There are two variants of button groups: standard and connected . Standard button groups add interaction between adjacent buttons so they respond to each other. When a button in a standard group is selected: The selected button changes shape and width A selected toggle button also changes color Adjacent buttons move and temporarily change width Button groups add more expression to a product Mix and match the different button variants, widths, and colors to emphasize what’s important, and to visually group related buttons. By default, all buttons in a standard group should be the same size (XS to XL) and shape (round or square). Only use multiple sizes in a group for hero moments Avoid mixing sizes frequently Only use a different shape in a group when a button is selected, or to add meaning or contrast check Do Use the same shapes for buttons in a group, but change other properties like width and color exclamation Caution Reserve shape differences in button groups for key interactions Connected button groups help people select options, switch views, or sort elements in a page. They behave similarly to standard groups, except they don’t affect adjacent buttons. Connected groups should replace the
 baseline segmented button
 Segmented buttons help people select options, switch views, or sort elements. Note: They're deprecated in the expressive update. Use a nav rail instead.
 More on segmented buttons
 , which is no longer recommended. pause Connected button groups can be used to toggle between similar actions Use connected button groups when the button content is related, and buttons can be selected. Closely related actions work well in a connected button group Connected button groups should be used for single or multi-select patterns that use toggle buttons. Avoid using a connected group when none of the buttons can be toggled. Use the connected button group with single or multi-select patterns Color Avoid mixing color styles in connected button groups; it can make selection and emphasis unclear. close Don’t Don’t mix color styles in connected button groups Anatomy Container Container The standard button group container has padding between buttons so they can animate width and shape without disrupting the product layout. The standard button group hugs the width of the buttons inside. Button groups can animate without affecting their surroundings The connected button group should span the width of the page or surface it’s placed on, increasing the button widths inside. In larger windows, consider adding a maximum width to the connected group to avoid it growing too wide. Connected button groups increase the widths of each button inside and expand to their container width Adaptive design Adaptive design allows an interface to respond or change based on context, such as the user, device, and usage. More on adaptive design Resizing Button groups should move through layouts together in a single line. They shouldn’t wrap to a second line. Multiple button groups can be stacked to keep items close together. However, button groups don’t interact vertically. Button groups and individual buttons can be set to fixed or flexible resizing: Fixed : Manually define the button width (narrow to wide), size (XS to XL), or padding at each breakpoint. Flexible : Automatically increase or decrease the width of buttons and the button group. Button groups grow until all flexible buttons are at their largest width. If adjusting button width manually, avoid stretching icon buttons beyond the wide setting. Buttons can have width, size, and padding manually adjusted to fit different breakpoints In
 compact windows
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , consider using smaller, narrower buttons so all buttons in the button group can fit. In
 large
 Window widths 1200dp to 1599dp, such as desktop.
 More on large breakpoints
 and
 extra large
 Window widths 1600dp and larger, such as ultra-wide monitors.
 More on extra-large breakpoints
 windows, consider using larger, wider buttons to better fill in the available space. Flexible buttons or button groups will automatically adjust width. pause Set the size, shape, and padding to manually adjust the button group at different breakpoints When scaling to larger breakpoints, make sure that the visual hierarchy of each button is preserved using qualities like color and size. For example, the primary action should remain the largest, widest, or most visually prominent button at all breakpoints. pause Maintain hierarchy across layouts and devices Presentation Buttons at the trailing edge of the button group can be customized to collapse into an overflow menu at smaller breakpoints, and become visible again at larger sizes. Place the overflow menu at the trailing end of the group. Buttons outside the group aren’t affected by button group behavior. pause Buttons should become hidden in an overflow menu or visible again, depending on screen size. Buttons outside the button group, like the end call button, will not be affected. Behavior Pressed When a button is pressed, it changes width and shape. In a standard button group, pressing a button also affects the width of adjacent buttons. In a connected button group, only the shape of the pressed button changes. pause Pressing buttons in a standard group changes the width of adjacent buttons Selected A selected button should change shape from round to square, or square to round. pause Selected buttons should change shape

## [overview] illustrations

- `1d835e7c57ef1b34.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0ca0qix-1.p
- `c4a09f8bea899eb1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4sskpfx-1_a
- `45c8fa93fca4140d.png` ← https://lh3.googleusercontent.com/yHacNSBWhhtbC944LRmPg_s-4gSjPOgJFj2qf5EzdaYV3Ol5rTNoGgAUn14a2GDIm31hDHdKc9mx

## [specs] illustrations

- `9dab1b4bea4a1434.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmack7ok2-GM3_Expressive_But
- `deba5e20330b7551.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmack8xlo-GM3_Button-group_S
- `bed058e1d414db65.png` ← https://lh3.googleusercontent.com/3YpaF7-0WXRLTv6vxHgKCSJBsLTOFIaTw5JZ5795oi7393Y_y8hlC-gNbJh57zwFbM8SJ6VsaQMH
- `864481ecb72c6bf2.png` ← https://lh3.googleusercontent.com/81FApYiTXho8D7eyhKVzVF5qhIRk02bF6rEp6QoLXRtnuW94g2EoBt1EQLLK7h2vRiKsRbNHUyYa
- `66fafafbe4e9daa1.png` ← https://lh3.googleusercontent.com/909fUN1vEim33Fg-tzKVqEEl_EQRq_GsNWP9dPCSA181-jk63D2BmlLmh8pisBn2zBlyE581QGQU
- `65d2dd0bee9d0f5e.png` ← https://lh3.googleusercontent.com/9hbmv_ziBEblvbLNhjPIK994tZijzcHgGhHBn_z-e52FBeulOHrdGeVlk4y0G8YWkUVABgf5Evmf
- `f4c3976684158a2a.png` ← https://lh3.googleusercontent.com/DiysV2VqS8bJV3jH34XtaPeeGGi2Svo6ZIFJhmjAeYH0zOw7-6P-5qgZeRy2A6CoXA2mgQ0WMXan
- `4242776dd9633642.png` ← https://lh3.googleusercontent.com/N09iT9pfuy2j_ZfeAqJIUzPo31zdiKwWd0P-BH5eVSj3QR3JWxULGnjVnTbavy0VNZX5lhBc9Dyw
- `9f53288f1def2c00.png` ← https://lh3.googleusercontent.com/RGY_WzbLD07B3K6DGITtC-0NcW5LQI1HS1L-g0O4Lt0wttv2BWMZQWR2LqpG39dzWUHBNqCx12no
- `9ab033551f20893a.png` ← https://lh3.googleusercontent.com/Zlys4Fta71zY-GAiCcT-oqug62NMk2muBeMcrPxVq_ZyoZhWxZrY5QlyYMHMI8wb6GSstakH8Bms
- `7c5a6f212537bcc1.png` ← https://lh3.googleusercontent.com/gQSD-N83stSwtNWu4Vgei7se_1vFmSqc8L7QyZ_u66ja9ZsX_71o7I8800O7qg8TBICKzr6L2vBt
- `59d55ecbd293bc3c.png` ← https://lh3.googleusercontent.com/mB9JxUhRXlbUJhjAnZciD7yqHtJQpwyqJME-B-dTSOz6AQVQbdOHskFsAM7E60jDTOOPx9qjA7Yi
- `fdf61f480c9534c6.png` ← https://lh3.googleusercontent.com/tXvGi5QNHXaEdYS0QIwTTJHGUdhlUv1s8dzEvt3yvdhs0CCvXGe3Y3bBOTJvHKv2VA3DPdHEWmLb
- `37882e211f54adf3.png` ← https://lh3.googleusercontent.com/tyj4mLRYzA86JWOUFPOV0mFMQxD7ckw1kX2zjPh0iOs4KV_jy6SCEtBmeQASzBTE9ULLNl0NY_jT
- `45c8fa93fca4140d.png` ← https://lh3.googleusercontent.com/yHacNSBWhhtbC944LRmPg_s-4gSjPOgJFj2qf5EzdaYV3Ol5rTNoGgAUn14a2GDIm31hDHdKc9mx
- `edb8208c7d43d628.png` ← https://lh3.googleusercontent.com/yW6GJfPC6vob2O0uaXXiMDGwKXMv7majvHsxv9MEQGBjXCtZg0YERe27DGduNwB1ofpRLw4evKy_
- `83350160f32ad648.png` ← https://lh3.googleusercontent.com/zh7Dh6_ChlGUt5mWmhDpY_dTPHFXlFOmdfy2AJEpn013_utxmX5it3VZuG3iyveqk3N3Pj07dV4a

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmack7ok2-GM3_Expressive_Button%20Group_Selectio`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmack8xlo-GM3_Button-group_Specs_Selection-%26-a`

## [guidelines] illustrations

- `6b4b52032c38a0a1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0di4v84-1.p
- `74a867ac8f035837.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0diaau3-sam
- `cfac964f440de488.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dibcom-dif
- `2200f5e3df9289e2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dijxcq-16.
- `a92cdd8d6c3992b7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0diog82-18.
- `cbd00eddb8656dda.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0diztnf-6.p
- `0bac60af249e667c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dj3wcm-18-
- `4b87ef0a95a4a303.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0djrht4-1.p
- `f7ec473714a0ee64.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fljnt9-But
- `d163aa010f9df6cc.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34llls1-But
- `df55191c5988d332.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34lm16p-But
- `4ec526993cd15c27.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34lmgn1-But
- `a23f1aa6ffe4a173.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm4sznpeh-5.p
- `41d64fd2b2690af3.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fma2ph39h-GM3
- `022634f104728292.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fma2pii3g-Gm3
- `9bcaa3889470262e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fma2pjcic-GM3
- `9d0a8229e34078ec.png` ← https://lh3.googleusercontent.com/eUF5jkygvsUgcQm3ey4C4f3n04x79AaJvSz9AmeLk9FBserFzb7VbHkTo316YyrAMQAv62NxJdQy
- `45c8fa93fca4140d.png` ← https://lh3.googleusercontent.com/yHacNSBWhhtbC944LRmPg_s-4gSjPOgJFj2qf5EzdaYV3Ol5rTNoGgAUn14a2GDIm31hDHdKc9mx

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fljnt9-Button-Group-D.mp4?alt=`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34llls1-Button-Group-B-2.mp4?al`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34lm16p-Button-Group-Hero-alt-2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34lmgn1-Button-Group-Hero-alt-2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fma2ph39h-GM3_Expressive_Button-G`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fma2pii3g-Gm3_Expressive_Button-g`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fma2pjcic-GM3_Expressive_Button-G`

## [accessibility] illustrations

- `1f6ecf96a62216bf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dgm57d-tap
- `79c564fc826dbd7c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dgsbc6-foc
- `5e0454612c801878.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dh20ef-lab
- `5fa53fb9d49c4d4e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmu4dvwu6-03.
- `45c8fa93fca4140d.png` ← https://lh3.googleusercontent.com/yHacNSBWhhtbC944LRmPg_s-4gSjPOgJFj2qf5EzdaYV3Ol5rTNoGgAUn14a2GDIm31hDHdKc9mx
