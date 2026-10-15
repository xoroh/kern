# M3 component: extended-fab

_Archive: `m3-archive/spec/components/extended-fab/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/extended-fab/…_

## Overview (full text)

Extended FAB – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 Use for the most common or important action on a screen Three variants: small, medium, and large Use instead of FAB when label text is needed to understand action Small extended FAB Medium extended FAB Large extended FAB Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Available language Web Available language Web: Expressive Unavailable Close M3 Expressive update May 2025 The extended FAB now has three sizes: small, medium, and large, each with updated type styles. These align with the
 FAB
 Floating action buttons (FABs) help people take primary actions.
 More on FABs
 sizes for an easier transition between FABs. The baseline extended FAB is no longer recommended and should be replaced with the small extended FAB. Surface and FABs are also no longer recommended. More on M3 Expressive Variants and naming: Added new sizes Small: 56dp Medium: 80dp Large: 96dp No longer recommended Baseline extended FAB (56dp) Surface extended FAB Updates: Adjusted typography to be larger The baseline extended FAB is replaced with a set of small, medium, and large extended FABs with new typography Differences from M2 Color: New color mappings and compatibility with dynamic color Layout: Extended FAB is the same height as the FAB Shape: Boxier style with smaller corner radius M2: Extended FABs are pill-shaped and have a different height and elevation M3: Extended FABs share the same height, boxier shape, and simpler elevation model as FABs

## Key measurements (dp, extracted)

- n M3 Expressive Variants and naming: Added new sizes Small: 56dp Medium: 80dp Large: 96dp No longer reco
- mmended Baseline extended FAB (56dp) Surface extended FAB Updates: Adjusted
- d color. Extended FAB - Size - Small arrow_drop_down search 56dp Extended FAB small container height Aa
- Title Medium 24dp Extended FAB small icon size Large roun
- ding 16dp Extended FAB small leading space 8dp Ex
- tended FAB small icon label space 16dp Extended FAB small trailing space Close
- nd large extended FABs Extended FABs should have margins of 16dp Baseline extended FAB Container Label t
- essed Baseline measurements Extended FABs have a padding of 16dp Extended FAB height, width, and icon si
- ze Attribute Value Container height 56dp Container width Dynamic, 80dp min Conta
- iner shape 16dp corner radius Icon size 24dp Padding 16
- Window widths smaller than 600dp, such as a phone in portrait orientatio
- Window widths from 600dp to 839dp, such as a tablet or foldable
- Window widths 840dp to 1199dp, such as a tablet or foldable

## Accessibility (full text)

Extended FAB – Material Design 3
 Use cases Interaction & style Initial focus Keyboard navigation Labeling elements Use cases People should be able to do the following using assistive technology: Navigate to and activate the extended FAB Interaction & style To make it easier for users of screen readers to reach a primary action such as an extended FAB, consider placing the action in the upper left region of large web screens, like in an
 expanded navigation rail
 Expanded navigation rails show text labels and an extended FAB, and can be default or modal.
 More on navigation rails
 . In smaller windows, the best place for the extended FAB is the lower right corner of a screen. Extended FABs can be placed in the expanded navigation rail check Do Place extended FABs in an easy-to-reach place that doesn’t obstruct other actions close Don’t Don’t place extended FABs over another actionable element Initial focus Ensure the extended FAB is prioritized in the overall focus order to create an efficient experience for people who navigate UIs with assistive tech. On mobile, the focus order may start with the
 app bar
 App bars contain page navigation and information at the top of a screen
 More on app bars
 , move to the
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 , and then skip past any other content on the page to land on the extended FAB. When using an extended FAB, both the visible label and icon should be treated as one focusable element. The extended FAB doesn’t need a tooltip because it already has a visible label. check Do Ensure extended FABs get focus when navigating with assistive technology close Don’t Tooltips aren’t required since the extended FAB has label text Keyboard navigation Keys Actions Tab Moves focus to the extended FAB Space or Enter Activates the extended FAB Labeling elements To ensure the action is clear, use consistent icons and text labels, such as a Compos e icon with a Compose text label. The icon and text label combination should have one distinct purpose. The accessibility label must include the same first word as the visible label. For example, if the visible button is Create , then the accessibility label might say Create a new invite . The accessibility label reads Compose to match the extended FAB's displayed label

## Specs (full text)

Extended FAB – Material Design 3
 Variants Tokens & specs Anatomy Color States Measurements Baseline extended FAB Variants Small extended FAB Medium extended FAB Large extended FAB Baseline variants The baseline extended FAB is no longer recommended in the M3 expressive update. Use a small extended FAB; the type style was updated from label large to title medium , and the inner padding was reduced. View baseline extended FAB specs Extended FAB Variant M3 M3 Expressive Small extended FAB -- Available Medium extended FAB -- Available Large extended FAB -- Available Extended FAB (baseline) Available Not recommended. Use small extended FAB. Tokens & specs Use the table's menu to select a token set. Extended FAB tokens are organized by size and color. Extended FAB - Size - Small arrow_drop_down search 56dp Extended FAB small container height Aa Title Medium 24dp Extended FAB small icon size Large rounding 16dp Extended FAB small leading space 8dp Extended FAB small icon label space 16dp Extended FAB small trailing space Close Anatomy Container Label text Icon Color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Color styles Extended FABs can use several combinations of color and on color styles, such as primary and on primary . The following color mappings provide the same level of contrast and functionality, so choose a color mapping based on visual preference. Extended FAB color roles used for light and dark schemes: Primary container & on primary container (default) Secondary container & on secondary container Tertiary container & on tertiary container Primary & on primary Secondary & on secondary Tertiary & on tertiary Baseline color styles Extended FABs should no longer use surface color styles. They’re still available, but not recommended. Surface container FAB States States are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states When using a non-default color mapping for extended FABs, make sure the state layer color is the same as the icon color. For example, the state layer color for primary mapping should be md.sys.color.primary. Enabled Hovered - elevation 4 Focused Pressed Measurements Size and padding measurements of the small, medium, and large extended FABs Extended FABs should have margins of 16dp Baseline extended FAB Container Label text Icon Baseline configurations With icon Without icon Baseline tokens Use the table's menu to select a token set. The baseline extended FAB token sets are organized by common tokens, then by surface and branded color styles. Other color styles like primary, secondary, and tertiary are still used by the latest extended FABs. Extended FAB - Color - Tonal primary arrow_drop_down search expand_all folder Enabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed keyboard_arrow_down Close Baseline colors Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Extended FAB color roles used for light and dark schemes: Primary container + shadow On primary container On primary container Additional color mappings Extended FABs can use other combinations of container and icon colors. The color mappings below provide the same legibility and functionality as the default, so the color mapping you use depends on style alone. Extended FABs can use different combinations of container and icon colors Baseline states States are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Enabled Hovered Focused Pressed Baseline measurements Extended FABs have a padding of 16dp Extended FAB height, width, and icon size Attribute Value Container height 56dp Container width Dynamic, 80dp min Container shape 16dp corner radius Icon size 24dp Padding 16dp

## Guidelines (full text)

Extended FAB – Material Design 3
 Usage Anatomy Placement Responsive layout Behavior Extended FABs are more prominent than regular FABs Usage Use an extended FAB on screens with long, scrolling views that require persistent access to an action, such as a checkout screen. Use it when label text helps understand the main action, or to add further emphasis to the button. Extended FABs ensure the main action is visible at all times Use an extended FAB to provide constant access to a primary action above long-scrolling surface content Use an extended FAB to emphasize a page’s primary action Additional emphasis The extended FAB can provide more emphasis and clarity to a product’s primary action. Since it has room for both a text label and icon, the extended FAB can be effective where an icon alone is ambiguous. However, the relationship between an extended FAB's icon and label should be clear. An extended FAB can be effective where an icon alone is too vague Like the regular FAB, only one extended FAB should be used per screen. Multiple FABs compete for attention. If additional high-level actions are required, consider adding more buttons elsewhere on the page. check Do Only show one prominent action at a time with the extended FAB close Don’t Don’t use multiple extended FABs in one screen as it disrupts visual hierarchy The extended FAB shouldn't be used as an option in a set of actions. Instead, use filled buttons for a similar level of emphasis. check Do Use a button with appropriate styling to emphasize it in a group of buttons close Don’t Don’t use the extended FAB to convey an option in a set of actions Choosing a size There are three variants of extended FABs: small, medium, and large. Choose an appropriately-sized extended FAB to add the right amount of emphasis for an action. In compact windows with one prominent action, the large extended FAB can be appropriate. In larger breakpoints, use a medium or large extended FAB. There are three sizes of extended FABs Anatomy Container Label text Icon (optional) Container The extended FAB container is a rounded rectangle that hugs its contents. The extended FAB grows and shrinks with text length. The extended FAB container hugs the icon and text Icon (optional) An extended FAB's icon should intuitively represent its action. check Do Unlike standard FABs, extended FABs don't require an icon close Don’t An extended FAB can't have an icon without a text label Label text The extended FAB’s label should clearly describe its action. Use 1–2 words at most. Keep in mind that localization may increase the amount of characters and width of the extended FAB. check Do Shorten the text as much as needed. Include an icon for additional context. close Don’t Avoid wrapping or truncating text Placement check Do Place the extended FAB above the rest of the UI, off of elements like app bars close Don’t Don’t place the extended FAB on top of toolbars. It disrupts the consistency of the elevation and surface layers. close Don’t Don’t place the extended FAB in the upper half of a mobile screen, as it disrupts the reading of the UI close Don’t Don’t place extended FABs on cards or inside other containers Avoid putting other floating components, like the
 floating toolbar
 Floating toolbars float on top of page content and can provide contextual, dynamic actions.
 More on toolbars
 , on screen with the extended FAB. close Don’t Floating toolbars can be paired with FABs, but not extended FABs Responsive layout The FAB and extended FAB can transform into each other depending on available space and layout. In a
 collapsed navigation rail
 Collpased navigation rails take up minimal space and are best for medium windows and wider.
 More on navigation rails
 , a FAB would be used. When the rail is expanded, the FAB can transform into an extended FAB. When space is limited, an extended FAB can transform into a FAB Right-to-left languages Extended FABs should mirror their elements in right-to-left (RTL) languages. Icons should be placed to the left of labels for left-to-right (LTR) languages Icons should be placed to the right of labels for RTL languages Breakpoints In
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 and
 medium breakpoints
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 , the extended FAB should be placed at the bottom of the screen, either center-aligned or aligned to the trailing edge of the window. The extended FAB can be center-aligned The extended FAB can be aligned to the trailing edge of the window In
 expanded
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 and larger breakpoints, the extended FAB should appear either: At the bottom right edge of the window, in both LTR and RTL languages Within the navigation rail The extended FAB can be right-aligned in both LTR and RTL languages The extended FAB can be at the top of the expanded navigation rail Behavior Appearing The extended FAB surface expands when appearing on screen using an enter and exit transition pattern. pause An extended FAB expands when appearing on screen Expanding The extended FAB can expand and adapt to any shape using a container transform transition pattern. This includes a surface that is part of the app structure, or a surface that spans the entire screen. pause An extended FAB can expand and adapt to any shape Transforming The extended FAB can transform into a FAB on scroll to temporarily take up less space on screen. pause An extended FAB can transform into a FAB Scrolling The extended FAB can transform into a FAB when scrolling down, and back to an extended FAB when scrolling up. pause An extended FAB collapses and expands when scrolling When the FAB switches to an extended FAB, the following transitions occur: The FAB shape changes FAB icon moves to the left FAB text label fades in pause FAB switches to an extended FAB

## [overview] illustrations

- `e2fa3bc90cc13a9c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0df17xu-01.
- `2f8758c29e47d45b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dff6p3-05.
- `54ce09fbc1d5b7fe.png` ← https://lh3.googleusercontent.com/CLwhLFrMkpEgnOAWORcnTMHBqt8gZ67coHMiSw1taCuxR0nRqasV1w7XWJ50w6ZT6gD6aZql87Kr
- `57db80df6d051769.png` ← https://lh3.googleusercontent.com/W709DD7h3NdXzkYi80bp3EdAW-lKHkEnv_Pef4ATcNYo-HnszNIIZQLnVXt-7OXQrrgOSNsXEfz_
- `261748aa24356eac.png` ← https://lh3.googleusercontent.com/o8RP_K8msVBonOVgmcnANIcH_obxNxoaP2OKhzTpcLR6f6W8f2TJH0x2t0k703n-EIp_WM4_fMyA

## [specs] illustrations

- `2577443eea4f5337.png` ← https://lh3.googleusercontent.com/1n9kpQw8OhgILXZOD3kA6RzO20NmwQzt184w4PvBbS4qJxqseyJ81kr9yk5cbyr824e7gKDu01_Z
- `9568a3e467481707.png` ← https://lh3.googleusercontent.com/60hw0Nm5mZX8sW8xBY_eU64kA2Ju_GszCM_g9H5tr_aDrtbv_7lq2939sVn0QF8aZfjIrSoz9dUB
- `309dad53cc6beafe.png` ← https://lh3.googleusercontent.com/6_OCmL-IgDTNGgDG2E6_5sUGlzaM1D_glmAKdNWtLl2P-8vOR1ur1HBHKt1pfb1gp8TmMRFu3_uk
- `f2e2d12cc5e34c62.png` ← https://lh3.googleusercontent.com/9IwzFk5XDN4m9vzImfQxg0mR1AtQJ86eAkPH3xC5h2GPFNLw5Wqd0VWHGgMOUOSFF32Iv3M3ypda
- `fe82fa2ad002f8a6.png` ← https://lh3.googleusercontent.com/9NboEFx6AmMw3XNkz0ES2hdV0_-I3cQ50CSV64-QsxrOzwZO38CynMks9fxg3wvvq6GSZAQnWv1R
- `3f0d64a1785a8c11.png` ← https://lh3.googleusercontent.com/BHRB4fj8KQKyqwOGul6DN_sqlayRB3Gs5AMUQ5xbnA0jWl5JIDr7a6oM3eKNUM927e8s92y-w1T_
- `612e288e8347fc07.png` ← https://lh3.googleusercontent.com/BU02XKNQEFAuGts8-NpS5UG9q4WN58-z0DM-KPlHoM4MBqV_R39vdorWW1ONyIKGphkVugmYfKEv
- `b4a72eb88a16bf39.png` ← https://lh3.googleusercontent.com/BfVkr1OjcKMdwpCyy_0JfIAuGNx2Z_AlwSDie5SKQmAIXXlRW1yGqf7UTrO1Vfn95sgY935-quSQ
- `e09012591e082411.png` ← https://lh3.googleusercontent.com/I81VtVjjXN2Snx8X1zpMv5Jp-q12chYm4QYjLJqDyHlxc6WVWKEa7y9y6NC761EXd6tsmGOBMY6x
- `2768acc15b5cd2bb.png` ← https://lh3.googleusercontent.com/SSZr-dBlNa4O7kbOQi9byJEQSVaZzUOBXZnNoDoxhb5G8Fbd3pQdTfo14YWIS6QTQTIcd70uYAYZ
- `57db80df6d051769.png` ← https://lh3.googleusercontent.com/W709DD7h3NdXzkYi80bp3EdAW-lKHkEnv_Pef4ATcNYo-HnszNIIZQLnVXt-7OXQrrgOSNsXEfz_
- `51dddab3fca8cd80.png` ← https://lh3.googleusercontent.com/Z_RWOWfuQ9kdznoWiL_ox5ol2kDw2Th205LV2FDuX-rbxH3Rb1FZnDcgdSThvYwkuetWn9d2z62K
- `112f2b19b879b5e1.png` ← https://lh3.googleusercontent.com/mirVSM4EDUYdZY4eF-l65mg6of6d1WI8u5nP3qZcTjDUZK8BdZl7QTjSzFtzkr-XBjVBzDFZpQ2C
- `21bf43ac4b19b96a.png` ← https://lh3.googleusercontent.com/oOjTBewuhKfDILRyn0mW8Y_Qv5I9nnTgLUnNJEwEARSu_ocixeZ9V2CTUmz5fjkT8G04_iXPUQWd
- `6de6b307e09f85f3.png` ← https://lh3.googleusercontent.com/pcW-KzjKYIkI08HsYSKw2bRaDPQgikxhsVRQWVzMTObgMoJCv-Mx_IIXFzbhIDUXMXq-MaTXPrPW
- `e95ac56fe424494d.png` ← https://lh3.googleusercontent.com/vHxV15QsYc98EQyLenfT7dOu3npLcTkKTLpe5YY2K0m6eNsWU8yXQs_d6XBpaPJ44MJODwpB8iCI
- `50e478563c51f061.png` ← https://lh3.googleusercontent.com/xbMM1zoCiBMpqJ8DQ-gHGAoRRZ79UMQ5YGIaQyTy66Y5xKkq336JfbSeJzydBNoWJ_ojOQ4O2LfN

## [guidelines] illustrations

- `4cd14ebce7496843.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dfvsl8-01.
- `fa66e73f82635653.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dfxjts-02.
- `7f934f8b1f90ba3c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dfymif-03.
- `c13987409f087080.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dfzjai-04.
- `15de5a1706d9f531.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dg2hbe-05.
- `56c56ba5b299318e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dg63ur-06.
- `01a28feb574343d3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dg6za4-07.
- `d3c1822c57de826f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dg9f6o-08.
- `eacc5df064ef7118.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dgacb3-09.
- `597f57cd0febb2e8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dgr1oq-13.
- `826ce105956a7750.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dhk1cf-10.
- `e4f73869e8be0b9a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dhlqdv-11.
- `4f978c41685a864e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dhmym8-12.
- `bf9c5b417ac3fe2f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dhs8b9-15.
- `2d54b0e8d22611a5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dhtaim-16.
- `4ef7ea2b1a7e38cc.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0di65x4-17.
- `e7d2f093118465e4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0di94u1-18.
- `f3e2f911ab0fa555.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dia4hb-19.
- `d5d19fdb335a9a6d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dib69h-20.
- `b3fb88406cb92fea.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dif190-21.
- `0ee65fbe75fb1a14.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0djhpqm-23.
- `925fbb804340d3d0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0djk489-24.
- `a3a266a7a8cf6ff1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0djl493-25.
- `966f050130dd4bb2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0djn9nf-26.
- `5b45dadfb3184819.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0djo3i8-27.

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0e6w6vv-EFAB-B_1.mp4?alt=media&`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0e6wsqu-EFAB-C.mp4?alt=media&to`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0e6x271-EFAB-D.mp4?alt=media&to`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm23g68f9-EFAB-A_1.mp4?alt=media&`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm23g6lbk-EFAB-E_1.mp4?alt=media&`

## [accessibility] illustrations

- `bacead3cf06f0464.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dmgu83-02.
- `f96aa9a88aa391cc.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dmhng1-03.
- `be6c8f36b6eaf9dc.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dmis8z-04.
- `176648bc5d9a4527.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dmjod6-05.
- `4eb7e742281439a9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0dmmjzu-06.
- `89587f76b2662117.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0e5baky-01.
- `57db80df6d051769.png` ← https://lh3.googleusercontent.com/W709DD7h3NdXzkYi80bp3EdAW-lKHkEnv_Pef4ATcNYo-HnszNIIZQLnVXt-7OXQrrgOSNsXEfz_
