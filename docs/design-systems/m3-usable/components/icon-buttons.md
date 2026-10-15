# M3 component: icon-buttons

_Archive: `m3-archive/spec/components/icon-buttons/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/icon-buttons/…_

## Overview (full text)

Icon buttons – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 Icon buttons must use a system icon with a clear meaning Two variants: default and toggle Many configurations: Color, size, width, and shape On web, display a tooltip describing the action while hovering In toggle buttons, use the outlined style of an icon for the unselected state, and the filled style for the selected state Standard, filled unselected, filled selected, filled tonal, and outlined icon buttons Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Available language Web Available language Web: Expressive Unavailable Close M3 Expressive update May 2025 Icon buttons now have a wider variety of shapes and sizes, changing shape when selected. When placed in
 button groups
 Button groups organize buttons and add interactions between them.
 More on button groups
 , icon buttons interact with each other when pressed. More on M3 Expressive Variants and naming: Default and toggle (selection) Color styles are now configurations. (filled, tonal, outlined, standard) Shapes: Round and square options Shape morphs when pressed Shape morphs when selected Sizes: Extra small Small (default) Medium Large Extra large Widths: Narrow Default Wide Five sizes Two shapes Three widths Differences from M2 Color: New color mappings and compatibility with dynamic color Variants and naming: Icon buttons were called toggle buttons. There are now two variants of icon buttons: default and toggle. Default icon buttons Toggle icon buttons

## Key measurements (dp, extracted)

- tra small and small icon buttons must have a target size of 48x48dp or larger to be accessible. A. Extra sm
- L A. Round button Full Full Full Full Full B. Square button 12dp 12dp 16dp 28dp 28dp C. Pressed state 8d
- p 8dp 12dp 16dp 16dp Baseline tokens Use the
- uttons are available in five different sizes: Extra small - 32dp Small - 40dp (default) Medium - 56dp La
- rge - 96dp Extra large - 136dp And three widths: D
- one. The target size of each icon button should be at least 48dp, even when nested. Icon buttons can be

## Accessibility (full text)

Icon buttons – Material Design 3
 Use cases Interaction & style Keyboard navigation Labeling elements Layout & density Hover Use cases People should be able to do the following using assistive technology: Understand meaning of the icon Navigate to and activate an icon button When applicable, a tooltip should be available to help describe the icon button's purpose Interaction & style Ensure the icon has contrast of at least 3:1 with the surface or background. check Do Icon buttons should have a 3:1 contrast ratio with the surface or background close Don’t Avoid using colors with contrast below 3:1 Keyboard navigation Keys Actions Tab Focus lands on (non-disabled) icon button Space or Enter Activates the (non-disabled) icon button Labeling elements The accessibility label for icon buttons describes the action the button is executing, such as Add to favorites , Bookmark , or Send message . The icon button label describes the action, such as Add to favorites for the heart icon Layout & density Groups of similar components can be nested together inside a component, or they can stand alone. The target size of each icon button should be at least 48dp, even when nested. Icon buttons can be used within other components, such as an app bar Avoid applying density by default Don't apply density to icon buttons by default. This lowers their targets below the required 48x48 CSS pixels minimum size. Provide density options that allow people to choose a higher density, such as selecting a denser layout or changing the theme. Controls for adjusting density must maintain a target size of at least 48x48 CSS pixels. Hover On web, icon buttons should display a tooltip with an accessibility label. The tooltip label text should be clear and concise

## Specs (full text)

Icon buttons – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color States Shape morph Measurements Baseline tokens Variants Default icon button Toggle icon button Variant M3 M3 Expressive Default Available Available Toggle (selection) Available Available Configurations Five sizes Two shapes Four color styles Three widths Category Options M3 M3 Expressive Size Small (default) Available Available XS, M, L, XL -- Available Shape Round (default) Available Available Square -- Available Color Filled (default), tonal, outlined, standard Available Available Width Default Available Available Narrow, wide -- Available Tokens & specs Icon button token sets are organized by common tokens, color, and size. Select the token set from the table’s menu. Learn about design tokens Icon button - Color - Filled arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed keyboard_arrow_down Close Anatomy Icon Container Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. There are four built-in color styles: filled, tonal, outlined, and standard. Default and toggle buttons use different color roles per style. star Note: These color roles were chosen to create design coherence and familiarity. Other color roles can be used as long as the container and text have a 3:1 contrast ratio. For example, tertiary and on tertiary. A: Filled, B: Tonal, C: Outlined, D: Standard Default Toggle, unselected Toggle, selected 1. Default 2. Toggle, unselected 3. Toggle, selected Filled container Filled icon Primary  On primary Surface container On surface variant Primary On primary Tonal container Tonal icon Secondary container On secondary container Secondary container On secondary container Secondary On secondary Outlined container Outlined icon Outline variant (outline) On surface variant Outline variant (outline) On surface variant Inverse surface Inverse on surface Standard icon On surface variant On surface variant Primary States 
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. State layers slightly change button color. Disabled states have different base colors. View tokens for details Filled button states Default Enabled Disabled (10% state layer) Hovered (8% state layer) Focused (10% state layer) Pressed (10% state layer) Toggle A: Unselected. B: Selected Enabled Disabled (10% state layer) Hovered (8% state layer) Focused (10% state layer) Pressed (10% state layer) Tonal button states Default Enabled Disabled (10% state layer) Hovered (8% state layer) Focused (10% state layer) Pressed (10% state layer) Toggle A: Unselected. B: Selected Enabled Disabled (10% state layer) Hovered (8% state layer) Focused (10% state layer) Pressed (10% state layer) Outlined button states Default Enabled Disabled (10% state layer) Hovered (8% state layer) Focused (10% state layer) Pressed (10% state layer) Toggle A: Unselected. B: Selected Enabled Disabled (10% state layer) Hovered (8% state layer) Focused (10% state layer) Pressed (10% state layer) Standard icon button states The standard icon button’s container is invisible at rest, but visible when the state layer is applied. Default Enabled Disabled (10% state layer) Hovered (8% state layer) Focused (10% state layer) Pressed (10% state layer) Toggle A: Unselected. B: Selected Enabled Disabled (10% state layer) Hovered (8% state layer) Focused (10% state layer) Pressed (10% state layer) Shape morph Pressed state While pressed, icon buttons can morph to become more square. Both round and square icon buttons should have the same pressed shape radius. The corner radius value differs for each button size. See full icon button corner measurements A. Round, B. Square Enabled Hovered Pressed When selected In addition to changing shape when pressed, toggle icon buttons also change the resting shape from round (unselected) to square (selected) by default. If the resting shape is square, the selected shape should be round. A. Round, B. Square Enabled Hovered Pressed Selected Measurements A. Extra small B. Small C. Medium D. Large E. Extra large Icon size Default width size Narrow width size Wide width size Target sizes Extra small and small icon buttons must have a target size of 48x48dp or larger to be accessible. A. Extra small icon button size B. Small icon button size Narrow width Default width Wide width Button corner radius XS S M L XL A. Round button Full Full Full Full Full B. Square button 12dp 12dp 16dp 28dp 28dp C. Pressed state 8dp 8dp 12dp 16dp 16dp Baseline tokens Use the table's menu to select a token set. Filled, tonal, and outlined icon button tokens are now deprecated in favor of the new token sets. All other tokens are still available in the module at the top of the page. [Deprecated] Icon button - Filled arrow_drop_down search expand_all Default, Light arrow_drop_down folder [Deprecated] Enabled keyboard_arrow_down folder [Deprecated] Disabled keyboard_arrow_down folder [Deprecated] Hovered keyboard_arrow_down folder [Deprecated] Focused keyboard_arrow_down folder [Deprecated] Pressed (ripple) keyboard_arrow_down Close

## Guidelines (full text)

Icon buttons – Material Design 3
 Usage Anatomy Placement Behavior pause Icon buttons can be a wide variety of sizes, shapes, and colors. When placed in a button group, adjacent icon buttons respond to one another when pressed. Usage Use icon buttons to display common actions. There are two variants: default and toggle . Default icon buttons can open other elements, such as a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 or
 Search lets people enter a keyword or phrase to get relevant information.
 More on search
 . Toggle icon buttons can represent binary actions that can be toggled on and off, such as favorite or bookmark . Icon buttons can be placed directly on the background or in most container components, such as
 cards
 Cards display content and actions about a single subject.
 More on cards
 ,
 app bars
 App bars contain page navigation and information at the top of a screen
 More on app bars
 , and
 toolbars
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 . Multiple icon buttons can be placed in a
 standard button group
 Standard button groups add interactions between adjacent buttons when they're pressed.
 to add interaction and motion between the buttons when pressed. More about standard button groups Icon buttons can be used within other components, such as in a toolbar or card Color There are four icon button color styles, in order of emphasis: Filled Tonal Outlined Standard For the highest emphasis, use the filled style. For the lowest emphasis, use standard. The default (left) and toggle (right) icon buttons are available in all four color styles Use a filled, tonal, or outlined icon button when the button needs more visual separation from the background. Choose the right style and emphasis for the situation. check Do Use icons with a background to make them easy to see on any surface check Do When mixing button variants, use color styles to make the primary action clear Use the filled style for visual impact and key actions that require high emphasis. Avoid overusing the filled style on a screen. Use them sparingly. pause Use filled icon buttons for high emphasis actions, such as downloading or deleting Use the tonal style as a middle ground between filled and outlined icon buttons. It’s useful for secondary actions paired with a high emphasis action. For example, use the tonal style for actions like Raise hand in a video meeting. When selected, its visual emphasis is greater than the outlined menu button, but less than the filled End call button. Leverage the different color styles to establish emphasis and direct people to important actions Use the outlined style for medium-emphasis buttons. It’s useful when the button isn’t the main focus of the interaction, such as browsing through sets of cards. Use the standard style for low-emphasis buttons, or when placing buttons on a colorful surface. Outlined buttons indicate that more content is available without grabbing attention Size & width Icon buttons are available in five different sizes: Extra small - 32dp Small - 40dp (default) Medium - 56dp Large - 96dp Extra large - 136dp And three widths: Default Narrow Wide Use size and width to provide emphasis and visual hierarchy in a page with multiple buttons. The main action should be the most visually prominent, whether through color or size, like starting and stopping a timer or playing and pausing a song. Use different button colors and sizes to provide visual hierarchy and emphasize primary actions Not all icon buttons will need to emphasize a primary and secondary action. When buttons have a similar importance, they should be the same size. When everything should have the same emphasis, use icon buttons that are the same size Anatomy Icon Container Icon Icons visually communicate the button’s action. Their meaning should be clear and unambiguous. Browse popular icons Default icon buttons should use filled icons. Toggle buttons should use an outlined icon when unselected, and a filled version of the icon when selected. Ensure the meaning of the icon is clear, such as a heart indicating Favorite Icon accessibility requirements For selected toggle buttons, if a filled version of an icon doesn’t exist, increase the icon weight to semibold. If semibold doesn’t provide enough visual change, use bold. This is to ensure that selection is communicated through at least two properties, rather than just color. This requirement doesn't apply to default non-toggle buttons. Icons without a fill should be semibolded when selected Container The container provides increased contrast and hierarchy in places that need more visual separation from the background or other elements. The container provides visual separation from the background image Placement Icon buttons are commonly used in other components, such as
 app bars
 App bars contain page navigation and information at the top of a screen
 More on app bars
 and
 cards
 Cards display content and actions about a single subject.
 More on cards
 . These buttons should be used for common, easily understandable actions. Only use a few icon buttons at once. App bars often contain icon buttons In dense layouts, group popular actions by placing many icon buttons next to each other in components like a
 toolbar
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 or
 button group
 Button groups organize buttons and add interactions between them.
 More on button groups
 . These components draw attention or add interaction between buttons. A toolbar is a collection of icon buttons and other components Behavior Hover On hover, the icon button displays a tooltip describing its action, rather than the name of the icon itself. pause The tooltip label text should be clear and concise Selection Toggle icon buttons allow a single choice to be selected or deselected, such as adding or removing something from favorites. When placed in a
 button group
 Button groups organize buttons and add interactions between them
 More on button groups
 , icon buttons change shape to help the selected button stand out. More on button groups pause check Do Use toggle icon buttons when the icon can be selected pause close Don’t Don’t use toggle icon buttons for actions that don’t have a selected state, such as an icon button for an overflow menu The icon should become filled to represent selection. If a filled version of the icon doesn't exist, use semibold weight instead. pause When making a selection, such as bookmarking or saving a video, the icon transitions from outlined (unselected) to filled (selected)

## [overview] illustrations

- `5ec774f5912c0954.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0by1ftf-1.p
- `a3ff53acf76f151e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0by3xdg-2.p
- `be68dd507fede74e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0by5hfz-3.p
- `989e27ba5ac413b6.png` ← https://lh3.googleusercontent.com/wWaldqQ0mhWU14C293h0J8vXBsR7QwHviA_kZ4KpeDNPnwWk9h7FXRybSRl1MzABHtFGfbU8hPKb

## [specs] illustrations

- `ad0b373ba257c051.png` ← https://lh3.googleusercontent.com/3K-szMHugOwyybK3LjFoitWWxa6kcW8TKvzoBTvLDYFKK2hePutHe3uPnaZlY9-87q4g-CJ_cNUX
- `7dc8d0c29385956d.png` ← https://lh3.googleusercontent.com/8uQEXQa18WJuSmuK5CLloUJ69m6TGCdj5C9FBDFAETglM5PWdtNDxW62KriOfOjurHZ9ThRY_yfM
- `88611b3b4560d67a.png` ← https://lh3.googleusercontent.com/BcxmjH6ecztV2npud8AveNazSZr__0H66nlq-j3xggQLcQvKLxLCXDbyXs13fVtB-A3l_zU1wq8a
- `a6b2421347b39288.png` ← https://lh3.googleusercontent.com/BnUdAgpdenC-evMYsprXRd489dyTMpWrSuPeQgbXSYXyJipJESFG-v4OLvX9K0aWOHkWjS7-k7qX
- `21d1e14c605b65d2.png` ← https://lh3.googleusercontent.com/R4g7sI29Fu5i_IbuatO_g8K3lOfiXc5bWqBhR3s_5fhlg_yRXIbj6n26wEoi5SKZBszsh2CYiN6i
- `83bd01c1b213d608.png` ← https://lh3.googleusercontent.com/Saes8VH33LRUx0xEd2BgfqFb39GzpjdT-z4HRzdjv3hST24J--BeF4JV_r0do5wk4jbPBb-AsSLM
- `2460370f2a0e0364.png` ← https://lh3.googleusercontent.com/Sv4DWzeNFz0bHgKddC2o6jcm4_Mg65zw0e9QF5y_PHOChQFHOkMGw_c05fE1srSoY50_RoTis4N2
- `b8c2cce547e6c6a3.png` ← https://lh3.googleusercontent.com/_CWKvmXvNaFk4LwtZcFhYyOOgq-OJEnRgXVifhpYTwewAHQXGsA8SAcHgpi4_BO2o6CIT-ERoIMp
- `39a467d110dcb7cd.png` ← https://lh3.googleusercontent.com/_jjXoUxycgTulKAlvK7SJG4QJ6ok6z-OJVsuMM4Q79_6fBauVYYA_TBTzTFzKa3-HvqYbWV9SR13
- `c4151bc8b6b56c59.png` ← https://lh3.googleusercontent.com/awRYSAQ6XdaVBsLtLmUSRj56cqySERCiE8qj36eLHxsk8YXYMMkaU_tkx606qnJKv41RtQKLV9uS
- `230406cd41f2f17b.png` ← https://lh3.googleusercontent.com/dwZOlhE1Y0s7U-eyHTYVA9aLYhUf9oSQBoay9bRBmlE-yPvG59Cu80jkcB3VNU6876dcNy34dIYj
- `d30a97b564cbe52f.png` ← https://lh3.googleusercontent.com/eJRJf0S1ywGr8CdhzgukcRgQpKxbZOCEZ12g2HeJrldunvEVBgg_65CzvyHntvAMJWJYApy-Bpom
- `01fd75c507bf3156.png` ← https://lh3.googleusercontent.com/elGowRNNI3axprldZYy7RbpofXNr_DB-TAdJep-DZ_sRF0WCCACN-pxCEBBeF6_5FJADjm_fVuRg
- `d672a77ed18131e8.png` ← https://lh3.googleusercontent.com/f_CiuCyosU5CvebQEKN5zF51JfbHKIee5oqSFrP2od51IfqDJ3SLx35_e9J-heZw83g2JpUqslKh
- `6d57bef77fa57d9b.png` ← https://lh3.googleusercontent.com/qbTMBYNLCAPi3CIr8hTDFwdc0GclxQmGaA67KohT7UMz509-iBAlMzevRQwXVvthTGyaA_7lA4DR
- `853210f7c0a969e8.png` ← https://lh3.googleusercontent.com/tgEuyiPL-Ux4Egj4kNTjvchlPIoplTaK_XukYj-4rC8T0MY8-7lsHzNq6wVpithFm43UqjQC-Ymy
- `989e27ba5ac413b6.png` ← https://lh3.googleusercontent.com/wWaldqQ0mhWU14C293h0J8vXBsR7QwHviA_kZ4KpeDNPnwWk9h7FXRybSRl1MzABHtFGfbU8hPKb
- `00046e67e65bed00.png` ← https://lh3.googleusercontent.com/yinTmVHDt3kOx1KIpfsX9V_-EkqnaUvj7hBjMWu90VQ3MgbEsjFJFPlV_-i4k9ACyP1Vt4uJMABC

## [guidelines] illustrations

- `177ad1b3ed48ed80.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c0dz7i-2.p
- `62bc157f3c1c8e6d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c0hfou-4.p
- `f3eb08150a7fbc7b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c0ir4x-5.p
- `f74d1f790dfe924a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c0lz0p-7.p
- `088dfcb413d73009.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c0tpl2-12.
- `fa03420ae092763c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c0wdzg-13.
- `39357c9572014954.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c0xugp-14.
- `5a16617aaad73460.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c0z5xa-15.
- `7522e5784408065c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dw9g2n-11.
- `6dd95b588bbfd60f.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dz2qbs-ico
- `1c7a1ef5fd0ab516.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34mdbc5-ico
- `3b9aa4ff3c2f8fca.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34mf3vo-ico
- `c5b487a924273e74.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34mfwtu-ico
- `cfc49ca2b9b8bed0.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34mg1cq-ico
- `f6702f94a6b9625e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm5xjqza2-8.p
- `169073519d034601.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm5xk0kj1-10.
- `0f32c776f99df4b4.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8q92iv1-Gm3
- `0210abb165004b7c.png` ← https://lh3.googleusercontent.com/WlJwCfuBY1Q541JoSnQlMRnQK77D7bjNnaLrojXxV7WJxGkYJOIwZdwMo0FnRu_qw0HMjfx5hso_
- `989e27ba5ac413b6.png` ← https://lh3.googleusercontent.com/wWaldqQ0mhWU14C293h0J8vXBsR7QwHviA_kZ4KpeDNPnwWk9h7FXRybSRl1MzABHtFGfbU8hPKb
- `e84d76146c88464c.png` ← https://lh3.googleusercontent.com/xCB1ezQGhZ8n6LcIlfpkJhTP-cziJEyQRycEmz_Eu8GlnA9CBQiY4Zuf5BZHpCf50WOMBNVbzi8n
- `9df65f05989b5c37.png` ← https://lh3.googleusercontent.com/zX0RmAg_m2LHij-KQp9s644fx6zWH5Vq47EOpwR4OcSeSxQE4MnZPtq4RtAJj0pKfTLaOsRCrEEA

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dz2qbs-icon-button-F.mp4?alt=m`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34mdbc5-icon-buttons-A_2.mp4?al`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34mf3vo-icon-buttons-B_1.mp4?al`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34mfwtu-icon-buttons-D-2.mp4?al`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm34mg1cq-icon-buttons-E-2.mp4?al`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm8q92iv1-Gm3_Expressive_Icon_but`

## [accessibility] illustrations

- `2da627fa5367d1cd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c1h7ba-4.p
- `3dcd6e4adea954b6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c1j2b9-5.p
- `a05e848bd0abca3a.png` ← https://lh3.googleusercontent.com/FqCMh3l6_zJ396vQUK3U2--BcmNuXzVzQHPsd2a9kOXz6CjN4pE_mugSVMkSsZep6dHnnmhA-1_J
- `5c6ca419c7418eea.png` ← https://lh3.googleusercontent.com/Veran4xIuwOjaUK-TME0CkyE4D03sjgbC1O1fGyyeie01_pz6s0p7PoibSPSPzTNT7bmFKJy4kG4
- `f6332be17181d6a5.png` ← https://lh3.googleusercontent.com/sxEm_qQA7j39jtqbpiH6Lnec5G_ZIJs-b8cWfSYYldZIAEjGTT52yeEfaF8M1HLTZCe0_0zqKfBB
- `989e27ba5ac413b6.png` ← https://lh3.googleusercontent.com/wWaldqQ0mhWU14C293h0J8vXBsR7QwHviA_kZ4KpeDNPnwWk9h7FXRybSRl1MzABHtFGfbU8hPKb
