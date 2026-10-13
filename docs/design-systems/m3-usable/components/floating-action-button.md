# M3 component: floating-action-button

_Archive: `m3-archive/spec/components/floating-action-button/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/floating-action-button/…_

## Overview (full text)

FAB – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 Use a FAB for the most common or important action on a screen Make sure the icon in a FAB is clear and understandable FABs persist on the screen when content is scrolling Three variants: FAB, medium FAB, large FAB FAB Medium FAB Large FAB Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Available language Web Available language Web: Expressive Unavailable Close M3 Expressive update May 2025 The FAB has new sizes to match the extended FAB and more color options. The small FAB is no longer recommended. More on M3 Expressive Variants and naming: Added medium FAB size Small FAB size is no longer recommended FAB and large FAB sizes are unchanged FAB variants are based on size, not color Color: Added tone color styles: Primary Secondary Tertiary Renamed existing tonal color styles to match their token names: Primary to Primary container Secondary to Secondary container Tertiary to Tertiary container The values haven't changed Surface color FABs are no longer recommended FABs have updated colors and sizes Differences from M2 M2: FABs are circles and always have a drop shadow M3: FABs have a boxier shape, can use dynamic color, and include a new large FAB variation

## Key measurements (dp, extracted)

- t design tokens FAB - Size - Regular arrow_drop_down search 56dp FAB container height 56dp FAB container
- width 24dp FAB icon size Large rounding Close Anat
- Window widths smaller than 600dp, such as a phone in portrait orientatio
- Window widths from 600dp to 839dp, such as a tablet or foldable
- Window widths 840dp to 1199dp, such as a tablet or foldable

## Accessibility (full text)

FAB – Material Design 3
 Use cases Interaction & style Focus Layout & position Keyboard navigation Labeling elements Use cases People should be able to do the following using assistive technology: Navigate to and activate the FAB Perform an action with the FAB Expand and minimize an
 extended FAB
 Extended floating action buttons (extended FABs) help people take primary actions.
 More on extended FABs
 Interaction & style Don't disable the FAB. If the action represented in the FAB is unavailable, the FAB shouldn't appear. Ensure the icon has a minimum 3:1 contrast ratio with the container. check Do FAB icons are above the 3:1 contrast ratio close Don’t Avoid using colors with a contrast below 3:1 Focus Ensure the FAB is prioritized in the overall focus order to create an efficient experience for people who navigate UIs with assistive tech. On mobile, the focus order may start with the
 app bar
 App bars contain page navigation and information at the top of a screen
 More on app bars
 , move to the
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 , and then skip past any other content on the page to land on the FAB. Consider displaying a tooltip when the FAB is focused. This is supported on web. Tooltips surface the FAB’s label when focused Layout & position To make it easier for users of screen readers to reach a primary action such as a FAB on
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , consider placing the FAB in the upper left region. However, it’s critical to test placement options with users to see if the upper left region is the best position in all browser windows. For
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 and
 medium breakpoints
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 , the best place for the FAB is the lower right corner of a screen. In compact windows, place the FAB in the bottom trailing edge In expanded windows, place the FAB in the navigation rail To ensure accessibility for keyboard users on the web, avoid positioning the FAB in a way that completely obscures the focus indicator of an actionable element. It’s okay to partially cover the desired element, as long as the focus indicators are still visible. check Do The FAB can partially cover an actionable element, as long as the focus indicator is still clearly visible close Don’t Don’t completely obscure an actionable element and its focus indicator Keyboard navigation Keys Actions Tab Focus lands on the FAB Space or Enter Perform the default action on an item Labeling elements The accessibility label should describe the action that the button is performing, such as Compose a new message . The accessibility label of the FAB with a pencil icon describes the action of composing a new message

## Specs (full text)

FAB – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color States Measurements Baseline tokens & specs Variants FAB Medium FAB Large FAB Baseline variants The small FAB is still available, but no longer recommended. Jump to baseline specs 1. Small FAB Variant M3 M3 Expressive FAB Available Available Medium FAB -- Available Large FAB Available Available Small FAB Available Not recommended. Use a larger size. Configurations In the expressive update, the primary , secondary , and tertiary set colors were renamed to primary container , secondary container , and tertiary container to match the actual color roles used. New primary, secondary, and tertiary color styles were created to match the corresponding color roles. View details in the color styles section Category Configuration M3 M3 Expressive Color Primary container, secondary container, tertiary container Available as primary, secondary, tertiary Available Primary. secondary, tertiary -- Available Tokens & specs Use the table's menu to select a token set. FAB tokens are organized by size and color. Learn more about design tokens FAB - Size - Regular arrow_drop_down search 56dp FAB container height 56dp FAB container width 24dp FAB icon size Large rounding Close Anatomy 1. Container 2. Icon Color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. Learn more about design tokens Color styles FABs can use several combinations of color and on-color styles, such as primary and on-primary . The following color mappings provide the same legibility and functionality, so the color mapping you use depends on style alone. Primary container & On primary container (default) Secondary container & On secondary container Tertiary container & On tertiary container Primary & On primary Secondary & On secondary Tertiary & On tertiary Baseline color styles Surface FAB color styles are still available, but no longer recommended. Surface FABs States States are visual representations used to communicate the status of a component or interactive element. When using a non-default color mapping for FABs, make sure the state layer color is the same as the icon color. For example, the state layer color for the primary color style should be md.sys.color.primary . Enabled Hovered (8% state layer) - elevation 4 Focused (10% state layer) Pressed (10% state layer) Measurements FAB FAB size measurements FAB padding measurements Medium FAB Medium FAB size measurements Medium FAB padding measurements Large FAB Large FAB size measurements Large FAB padding measurements Baseline tokens & specs Use the table's menu to select a token set. This only includes tokens for small and surface FABs, which are both no longer recommended. It doesn't include other colors, or large or regular FABs, since those are still currently used. FAB - Color - Surface arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close

## Guidelines (full text)

FAB – Material Design 3
 Usage Actions Anatomy Adaptive design Behaviors FABs have multiple sizes that scale with the breakpoint Usage Use a FAB for the most important action on a screen; it appears in front of all other content. The FAB can be aligned left, center, or right. It can be positioned above the navigation bar, or nested within it. FABs can use dynamic color There are three FAB sizes: FAB Medium FAB (most recommended) Large FAB Choose the FAB size based on the visual hierarchy of your layout. Note: The small FAB is no longer recommended. FAB Medium FAB Large FAB The FAB is the smallest size, and is best used in
 compact windows
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 where other actions may be present on screen. The medium FAB is recommended for most situations, and works best in compact and
 medium windows
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 . Use it for important actions without taking up too much space. A large FAB is useful in any window size when the layout calls for a clear and prominent primary action, but is best suited for
 expanded
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 and larger breakpoints, where its size helps draw attention. Use a medium FAB in most breakpoints Use a large FAB when the primary action needs to be prominent check Do FABs are not needed on every screen, such as when images represent primary actions close Don’t Don't display multiple FABs on a single screen A FAB can transform into an
 extended FAB
 Extended floating action buttons (extended FABs) help people take primary actions.
 More on extended FABs
 on larger screens, or it can transition into a FAB menu when selected. Use a FAB menu when there are many kinds of actions relevant to the FAB. More on FAB menus Use the extended FAB when label text is necessary Use the FAB menu when there are many kinds of actions relevant to the FAB Actions A FAB can trigger an action on the current screen, or it can perform an action that creates a new screen. A FAB promotes an important, constructive action such as: Create Favorite Share Start a process check Do Use FABs for primary, positive actions Avoid using a FAB for minor or destructive actions, such as: Archive or trash Alerts or errors Limited tasks like cutting text Controls better suited to a toolbar, like to adjust volume or font color close Don’t Don’t use FABs for minor, overflow, unclear, or destructive actions Anatomy Container Icon Container The FAB is typically displayed in a square container. The container shouldn’t be covered by other elements, such as badges. The container must have sufficient color contrast with the surface it’s placed on. A FAB container color needs to stand out from its background Icon An icon in a FAB should be clear and understandable. When hovering over a FAB on web products, FABs should display a tooltip with an accompanying icon text label. Use a filled icon instead of an outlined icon. A FAB shouldn't contain notifications or actions found elsewhere on a screen. check Do Use clear and simple icons such as add, message, or edit close Don’t Don’t use confusing or open-ended icons to symbolize less common actions Adaptive design In
 compact
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 and
 medium breakpoints
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 , the best place for the FAB is typically the lower right corner of a screen, since it’s easy to reach and is less likely to cover important content. In
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , consider placing the FAB in the upper left corner, like in the
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 . This positions it as one of the first interactive elements people see when they land on the page. Adjust the size of the FAB based on the context. Use a medium FAB for mobile layouts, and large FAB for tablets and large screens. For large screens, place the FAB in the upper left corner check Do A FAB can be used within a navigation component, such as a navigation rail close Don’t Individual components, such as cards, shouldn’t have their own FAB Behaviors Appearing When a FAB animates on screen, it expands outward from a central point. The icon within it can be animated as well. While FABs should be relevant to screen content, they aren't attached to the surface on which content appears. FABs move separately from other UI elements because of their relative importance. Screen transitions FABs can morph to launch related actions. When a screen changes its layout, the FAB should disappear and reappear during the transition. Reappearance The FAB should only reappear if it's relevant to the new screen. It should reappear in the same position, if possible. pause FAB animating on screen Expanding The FAB can expand and adapt to any shape using a container transform transition pattern. This includes a surface that's part of the app structure, or a surface that spans the entire screen. The FAB can also transition into a FAB menu. More on FAB menus pause FABs can expand and adapt to any shape Scrolling FABs remain in place on scroll. Extended FABs can collapse into a FAB on scroll and expand on reaching the bottom of the view. pause FABs stay in place above a scrolling background Moving across tabs When tabs are present, the FAB should briefly disappear, then reappear when the new content moves into place. This shows that the FAB is not connected to any particular tab. pause check Do The FAB should disappear and reappear when switching pages Don't animate the FAB with body content. pause close Don’t Don’t keep the FAB on screen when switching pages

## [overview] illustrations

- `05f7bd51a94cdc22.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkap9gay-01.
- `0bde57690d2fb062.png` ← https://lh3.googleusercontent.com/Hw0sslK5sGrGpnxb9hsvdsGJ0mIEzpIwbx1SyM7s-XAiu136AGItSHA5FbtiqtlsNrhCa7rgqSyk
- `76ca205136b01f25.png` ← https://lh3.googleusercontent.com/Kyq0kFrZiQkyIGco9EHQ5yzaPCDzbUydpq5bcHqcin1vLOhBpnqAeAW6D86dFvHrexhyJvo5jK0B
- `aab986a3f813523f.png` ← https://lh3.googleusercontent.com/biMTAbEZ8apVSF9QNSr9S8V1F1DCCRCRckdBmlU0g9XLCrNJMwkw_cbBk_gvb6b0JbaulKKD9lAe
- `92557ce54828cf11.png` ← https://lh3.googleusercontent.com/eSZyi5bl8kk_aCpEVo6DV_KiYuZ3i_rEVB9y7rWbFd5SSILeUBlvQ3n2ztYzvPSTe1fyMK0LKDD_

## [specs] illustrations

- `56638099489f27bd.png` ← https://lh3.googleusercontent.com/ANFTHcXuJZA9FSSl3I315pOU3UzwgUh_BZgfudPuvatQY4tLh2hREtb6ESAQZulQZBDe8iHcqQ54
- `e67ae5ac9ce125ff.png` ← https://lh3.googleusercontent.com/CdTXXgPJ5XavoUEXtTKTczb0ENYt1VwreirVIJMyIYnwI6gFCYn1S4LCQyptGlF6EzKq9xL2hzPO
- `0bde57690d2fb062.png` ← https://lh3.googleusercontent.com/Hw0sslK5sGrGpnxb9hsvdsGJ0mIEzpIwbx1SyM7s-XAiu136AGItSHA5FbtiqtlsNrhCa7rgqSyk
- `952955d864164bf3.png` ← https://lh3.googleusercontent.com/LVMfvx2rKsoVM1_1Pq9CQ8o0dDyfSQtfCxYgle_57GhDKX0oDkNepZr0yvyqmoI6mL-0QfWWfFkm
- `193dff9377fb4b17.png` ← https://lh3.googleusercontent.com/PsH6GvakYnsKOw9X05rxaShBXItlCIc3qS-LGjmdITmzFgAnhxdiyhzUEM34i8B0MGtZoBoDdXE7
- `1abfa9cd508d6660.png` ← https://lh3.googleusercontent.com/Yt-382N_6b_TEqwyVAFZY_PG3zCmejVTFm6-tfbkUGpTqwgeECy2CNFH8n0bV1Spc6qU-ruc9l-Q
- `d189376b3565b543.png` ← https://lh3.googleusercontent.com/ZwUAoGfKU_nKPy45dUL885gk5_UbUfDoN2lY0oreRhS7vnkY12iBhnT3a1Fm1LydwMZVkqFYkQhY
- `fd86423bf5e68065.png` ← https://lh3.googleusercontent.com/_1q2AqUdfZfCbC9aKRbQaXHO48GA5OSdH6ywXyyosvlIznXjrr0Wx-WM9xomavwT1qj6RA42qG01
- `e244e8a8a572f21e.png` ← https://lh3.googleusercontent.com/bY4SJyZCamFkqUakHco1-HsHBRJ55wn7zAWPhJCBlE9W4aA7wFnRywl8NSl_e7oToqU6JODtUnje
- `3710816a6961295b.png` ← https://lh3.googleusercontent.com/beevX-JBo5BT5oaSR6WnfIvvspxwDFUOsGg0TBWuDEAgjCYevFNjOhNnz6om1Pbxkal9dwoBR5Hw
- `a12909bf6dc873c9.png` ← https://lh3.googleusercontent.com/l-yip97Leh5bLumalSFuxS1DEMG6p3xJlXkUCTioixjvr0uXlzTaKK85zQzLnZPpgD9E72Zajd1y
- `88b70fa3304b5b5d.png` ← https://lh3.googleusercontent.com/qQZXXxZh9x9LRJyZI_2tblBDG7aMd-Rx3HQVX-ssihAGa-xSIGuOA2FZNPKeHgfbI-q19SD0IIUC
- `1a06521639036a73.png` ← https://lh3.googleusercontent.com/zCVGIf6lxv-ExBpOFiRo9G2yv-hIzjqPkEG0HKniNMzlBuWcEI8tXSvAndc3RL7Q0OOG56i6xP36

## [guidelines] illustrations

- `133d851990df6d9d.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0e6834q-FAB
- `fa7be90997ee79ff.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm1l6g0wn-FAB
- `4b0ce4cb1b2648bd.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm1l6g857-FAB
- `1fd1a6b3db4b434b.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd8w19ca-GM3
- `850cfe8301ef3ce7.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd8w1k06-GM3
- `2cbefab52f082c1b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkapod2e-01.
- `87886e954511e783.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkapp0w4-02.
- `a2de8a47abcf4bcf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkappjdx-03.
- `325b2b7bbb147198.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkapq84r-04.
- `15532605cb00a240.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkapqn1b-05.
- `d93f6f1ea55426e3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkapr8x3-06-
- `63dc8c656ca88c70.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaps2z9-07-
- `96e7cc0f304f30e0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaptzjv-10.
- `2b7dca6853e386c7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkapug9u-11.
- `de577f465a3daad3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkapv2og-12.
- `736918a83b173106.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaq0msf-13.
- `a5d9ed6559c96ac5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaq1779-14.
- `eb3037fdc922015c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaq1wxv-15.
- `4213a95481090d97.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaq2b6m-16.
- `58b9fde4f8983111.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaq2qmb-17.
- `75746da36892863e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaq35yc-18.
- `668fc4a579b2abcc.png` ← https://lh3.googleusercontent.com/6gVz4SSpnVYq28cYhUlwX36JiaNZLx-0A1NhL4z0IUA-RwlUz5tsApAkIXx0RAVE780uol-6VkeZ
- `0bde57690d2fb062.png` ← https://lh3.googleusercontent.com/Hw0sslK5sGrGpnxb9hsvdsGJ0mIEzpIwbx1SyM7s-XAiu136AGItSHA5FbtiqtlsNrhCa7rgqSyk
- `386e58e7b34a3ab1.png` ← https://lh3.googleusercontent.com/YtrgWibQJDIheCADkeWKz14g7auX0_zMKtGJ8o45F48iJl9BvPomdwRJGi8bjtOnAH7gtd-8V5ki

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0e6834q-FAB-A.mp4?alt=media&tok`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm1l6g0wn-FAB-B-1.mp4?alt=media&t`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm1l6g857-FAB-C_1.mp4?alt=media&t`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd8w19ca-GM3_Expressive_FAB_Guid`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd8w1k06-GM3_Expressive_FAB_Guid`

## [accessibility] illustrations

- `07bdea72155e0d04.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalo050e-1.p
- `ca7295e707be3351.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmalo08ew-2.p
- `6444a6a74102f32a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaqbeez-03.
- `7c27431e0eaa663d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaqbxv8-04.
- `cc18fc6dddfa541c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaqcdup-05.
- `c286b937acd48d8e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaqcwm1-06.
- `c440e169a76a601f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkaqdy3m-08.
- `0c9c0611a5c2167c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmkbecw5o-07.
- `0bde57690d2fb062.png` ← https://lh3.googleusercontent.com/Hw0sslK5sGrGpnxb9hsvdsGJ0mIEzpIwbx1SyM7s-XAiu136AGItSHA5FbtiqtlsNrhCa7rgqSyk
