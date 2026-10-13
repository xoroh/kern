# M3 component: sliders

_Archive: `m3-archive/spec/components/sliders/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/sliders/…_

## Overview (full text)

Sliders – Material Design 3
 Availability & resources M3 Expressive update Previous updates Differences from M2 Three variants: Standard, centered, range Has five sizes, vertical and horizontal orientation, and an optional inset icon Sliders should present the full range of available values The slider value should take effect immediately pause Sliders change values along a range Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Available language Web Available language Web: Expressive Unavailable Close M3 Expressive update May 2025 The slider includes expressive configurations for orientation, shape sizes, and an inset icon. More on M3 Expressive Updated on Android Views (MDC-Android) and Jetpack Compose. Variants and naming: Changed continuous slider to standard slider The discrete slider is now the stops configuration New configurations: Orientation: Horizontal, vertical Optional inset icon (standard slider only) Sizes: XS (existing default), S, M, L, XL Standard slider Centered slider Range slider Previous updates Visual refresh to improve non-text contrast Dec 2023: Updated on Android Views (MDC-Android) and Jetpack Compose. Configuration: Added centered configuration and range selection Shape: New shape for slider tracks and handles. Slider elements change shape when selected. Motion: Slider handle adjusts width upon selection. Slider tracks adjust in shape when sliding to the edge. Color: Refreshed color mappings M3 visual refresh: Sliders have a stop indicator, larger label text, and a vertical handle that narrows when pressed. Centered sliders start from the middle instead of the leading edge. Differences from M2 Color : New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 M2: Sliders have a circular handle and a small label when pressed M3: Sliders have new color mappings and support dynamic color

## Key measurements (dp, extracted)

- S, M, L, and XL sliders Attribute XS S M L XL Track height 16dp 24dp 40dp 56dp 96dp Label container hei
- ght 44dp Label container width 48dp Handle heigh
- t 44dp 44dp 52dp 68dp 108dp Handle width 4dp T
- rack shape 8dp 8dp 12dp 16dp 28dp Inset icon size -- -
- - 24dp 24dp 32dp
- n inset icon with sliders that have track thicknesses under 40dp Don’t use inset icons on centered or ra
- ive and inactive tracks should always be the same size. XS: 16dp S: 24dp M: 40dp L: 56dp XL: 96dp XL sli

## Accessibility (full text)

Sliders – Material Design 3
 Use cases Interaction & style Color contrast Keyboard navigation Labeling elements Use cases People should be able to do the following using assistive technology : Navigate to a slider Select a range by controlling a handle along a track Get appropriate feedback based on input type Interaction & style The slider handle shrinks in width and the value appears to provide a visual cue to the user that the handle is being pressed. Touch When tapped or dragged, the handle width shrinks to provide interaction feedback, and the value appears. Cursor When hovered, the cursor changes. When clicked and dragged, the handle width shrinks, and the value appears. pause The slider handle changes width during interaction Focus and navigation Initial focus lands directly on the handle, since it’s the primary interactive element of the slider. The slider value can then be adjusted using the arrow keys or other keyboard navigation options. pause Use arrow keys to change the slider value Color contrast Use visual anchors so the end of the slider’s inactive track has at least 3:1 contrast with the background. The stop indicator makes the end easily visible on most backgrounds. A stop indicator on the inactive track makes it easier to identify the end of the slider on a low-contrast background Alternatively, icons or other elements that have a 3:1 contrast with the background can be used to indicate the ends of the slider’s inactive track. Icons make it easier to identify the ends of the slider on a low-contrast background Keyboard navigation Keys Actions Tab Moves focus to the slider handle Arrows Increase and decrease the value by one value or one stop indicator Space & Arrows Increase and decrease the value by one interval or one stop indicator Home or End Set the slider to the first and last values on the slider Labeling elements The accessibility label for a slider is typically the same as the slider's adjacent text label. It should have the slider role. A slider’s accessibility label should match the adjacent UI text If the UI text is correctly linked to the slider, assistive tech (such as a screenreader) will read the UI text followed by the component’s role. Icon buttons placed outside the slider should have the button role

## Specs (full text)

Sliders – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color States Measurements Variants Standard Centered Range Variant M3 M3 Expressive Standard Available as “continuous” slider Available Centered Available (web only) Available Range Available Available Discrete Available Available as “stops” configuration Configurations Orientation: Horizontal, vertical Size: XS, S, M, L, XL Inset icon Stops Value indicator Category Configuration M3 M3 Expressive Inset icon No (default) Available Available Yes -- Available Orientation Horizontal (default) Available Available Vertical -- Available Size XS (default) Available Available S, M, L, XL -- Available on Android Views (MDC-Android). Available as tokens on other platforms.* Stop indicators No (default), Yes Available as “discrete” slider Available Value Indicator No (default), Yes Available Available *Configurations only available using tokens don’t have implemented presets in code. To change the size, swap the default size tokens md.comp.slider. xsmall .[...] with those of the desired size. Tokens & specs Slider tokens are organized into a common token set, and token sets for each size. Switch token sets from the table’s menu. Learn more about design tokens Slider arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Anatomy Value indicator (optional) Stop indicators (optional) Active track Handle Inactive track Inset icon (optional) Color Slider color roles used for light and dark schemes: Inverse surface Inverse on surface Primary On primary Primary Secondary container On secondary container On secondary container On primary States Enabled Disabled Hovered Focused Pressed Measurements Padding and size measurements for common sliders Padding and size measurements for XS, S, M, L, and XL sliders Attribute XS S M L XL Track height 16dp 24dp 40dp 56dp 96dp Label container height 44dp Label container width 48dp Handle height 44dp 44dp 52dp 68dp 108dp Handle width 4dp Track shape 8dp 8dp 12dp 16dp 28dp Inset icon size -- -- 24dp 24dp 32dp

## Guidelines (full text)

Sliders – Material Design 3
 Usage Anatomy Configurations Behaviors pause Sliders can adjust values in real time, such as image attributes Usage Sliders are used to select values along a track. They’re ideal for adjusting settings such as volume and brightness, or changing the intensity of image filters. Sliders can use icons or labels to represent a numeric or relative scale. Use sliders to pick a value from a range, like volume loudness Changes made with sliders must take effect immediately, so people can understand the effects of their selection as they're moving the slider. pause Selection changes are immediate There are three different variants of sliders: standard , centered , and range: Standard sliders select one value from a range of values. Use this when the slider should start from zero or the beginning of a sequence. Horizontal standard slider Vertical standard slider Centered sliders select a value from a positive and negative value range. Use this when zero, or the default value, is in the middle of the range. Horizontal centered slider Vertical centered slider Range sliders select two values on one slider to create a range. Use this when defining a minimum and maximum value. Avoid using range sliders vertically, as this can add too much cognitive load. People are used to most sliders being horizontal. check Do Horizontal range slider close Don’t Because of the additional cognitive load of a range slider, avoid using it in vertical orientation. Anatomy Value indicator (optional) Stop indicators (optional) Active track Handle Inactive track Inset icon (optional) Track The track shows the full range of values that can be selected on the slider. It has two sections: active and inactive. The active section of the track is from the minimum value to the handle. For range sliders, the active track is between the two handles. The inactive section of the track is from the handle to the maximum value, or outside the two handles of a range slider. For left-to-right (LTR) languages, the values increase from left to right. For right-to-left (RTL) languages, this is reversed. The track on a slider shows the available range Handle The handle can be moved along the track to choose a value. When sliders have two handles, the handles choose the minimum and maximum values in a range. The handle changes shape to indicate when it’s pressed. A handle changes shape when it's being pressed or dragged Two handles are used for sliders with range selection Configurations Value The value displays the specific value that corresponds with the handle’s placement. A value appears when interacting with the corresponding handle. For range sliders, only one value should be shown at a time. If the value is shown elsewhere, the indicator is not required. A value can appear while the handle is being pressed or dragged For range sliders, the value only appears on one handle at a time Instead of showing the built-in value label, a separate text input field can be added outside of the slider. If this is added, the slider and value in this text field should automatically update to match each other. Make sure people can tab to the text field directly after the slider. pause Use Tab to navigate to values that are shown outside the slider, like a text input field Stop indicators Stop indicators show which predetermined values can be chosen on the slider. The slider handle snaps to the closest stop. Avoid having too many stop indicators on a slider, because it can become visually crowded and difficult to adjust the value. All sliders have stops at the end of the inactive track to ensure at least a 3:1 contrast with the background. If the inactive track has this level of contrast already, the end stops can be removed. Stop indicators show each available value on a slider Icons or text can be added outside the slider to indicate the range of values and make the slider more accessible. This can be used instead of a stop indicator. Plus and minus icons, or text, can be added to the left and right of the slider Orientation Sliders can be oriented either horizontally or vertically, depending on what is best for your use case. Standard slider in horizontal orientation Standard slider in vertical orientation Inset icon Standard sliders that are M, L, or XL can include an icon within the track. This icon should illustrate what the slider controls. Avoid adding inset icons to XS or S sliders. When there’s not enough space for the icon on the active track, like at a low value, the icon moves to the inactive track. Consider swapping which icon is displayed at zero, like a volume icon becoming a mute icon. check Do Inset icons change placement based on the handle close Don’t Don’t use an inset icon with sliders that have track thicknesses under 40dp Don’t use inset icons on centered or range sliders. It makes it unclear where the start of the slider is. close Don’t Don’t use an inset icon on a centered slider close Don’t Don’t use an inset icon on a range slider Size Sliders come in different sizes: XS, S, M, L, and XL. Use larger sizes to increase the targets and provide a larger visual emphasis. The active and inactive tracks should always be the same size. XS: 16dp S: 24dp M: 40dp L: 56dp XL: 96dp XL sliders should be reserved for hero moments, where the slider itself is the most important element on the page. XL sliders should be the focus of the page Behaviors Select & drag Select a value by dragging the handle. pause Standard slider : The handle drags smoothly pause Slider with stop indicators: The handle snaps to the closest stop indicator while dragged Select jump Select a value by selecting part of the track. pause Standard slider : The handle moves to the selected location pause Slider with stop indicators: The handle moves to the closest stop indicator Select & arrow Select a value using the keyboard. Tab: Focus lands on handle Arrows: Selected value increases or decreases by one value or stop indicator Space & arrows: Selected value increases or decreases by a larger interval or stop indicator pause Standard slider : The handle moves one value pause Slider with stop indicators: The handle moves to the next stop indicator

## [overview] illustrations

- `681ae22b45904a86.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lii3kv-02.
- `08cc3df958fe49d3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lirx37-03.
- `e27d7dbe98c5e165.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7livqfr-04.
- `ca33c062c6da4b63.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7liwct9-05.
- `a74358a7b363d8d3.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7ll9aj1-GM3
- `6f41b84603b39030.png` ← https://lh3.googleusercontent.com/OWwb77SjGqjZQLsDqlw0d2LHmx7E1Edw9pc7X8Xk2lA7AUQ1nRcjpOR76wXmHgqC77ZCpt_5cjRs

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7ll9aj1-GM3_Expressive_Slider_O`

## [specs] illustrations

- `0c6e9433d2f1b4f3.png` ← https://lh3.googleusercontent.com/-UgZpnEJ6uET5STSdzpCWEydsoa9cfqtNAbzpuKX9-4jQ3d8IdU0EjRtpfgizjIX8I7XM-ETfXPE
- `945341d2ab6ca9e9.png` ← https://lh3.googleusercontent.com/CV3PfOlQdK3A_3O8RLyu_r-GjqW7NK-qgzQmKuo5M5tWBmI6eDGdNfq7p8bTvQbP1jYCpk8WaRkt
- `768ebd4259d156a3.png` ← https://lh3.googleusercontent.com/FH3TsHZ1NpVLh--XKKb2ygB9rd0bgZ6ig1vGxWhQu5HOFVbk_8CXIxMAVdJnPxKj3fojh8jFh6qD
- `6f41b84603b39030.png` ← https://lh3.googleusercontent.com/OWwb77SjGqjZQLsDqlw0d2LHmx7E1Edw9pc7X8Xk2lA7AUQ1nRcjpOR76wXmHgqC77ZCpt_5cjRs
- `0e4184729c1f9d2f.png` ← https://lh3.googleusercontent.com/PUKZpvA88_wvpKTUHRmGx0XIOjDEUAFWbO14A9AMUDyX-mu0w9qTo7ywQTKCcm8ERhdQHoohHwHt
- `2e293c79b429c121.png` ← https://lh3.googleusercontent.com/PgYCQrkBSJUOlzQMXu0BmIe16Fho4X9NdvdYYSOtE1tIl0aucZejoImkNIfdTpbPity3lWJxxg2W
- `d120e76e45d69a3e.png` ← https://lh3.googleusercontent.com/QFc1hXc78XHCuqhH4no1fQLDRvSzLaW1K8El5jIW1v3K3sNXjMquxEGcaq22u48Mq5kCqGRoPSCD
- `e491ef6c4dc82f7a.png` ← https://lh3.googleusercontent.com/Tj-xqiQbRv2zhsiRQmk6ZkdhFwQgK6qEZx40m4TMy8W7B8ulEiPsHemm1KcY6ejMeYjYFnJF2GHG
- `357f56dfa54de218.png` ← https://lh3.googleusercontent.com/WLMws1Xen6XFUKvbCJS2NM4jwTMVmQxFlh8QhTslZGI-TR2eoFPXUp-ck8i0FhO_U2cy0cW5qnNP

## [guidelines] illustrations

- `8a1527b0e8d9671f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx1s1ozg-10.
- `59146db2e0fa32aa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx1s2vu5-13.
- `4a949455e1788c2d.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tddmn-GM3
- `cd282024dace4d62.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tdv5o-GM3
- `8c9a1269d60ae6e6.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tec5h-GM3
- `132eb8cbb8d2debd.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tep43-GM3
- `2096d38cec5f0e60.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tf2t6-GM3
- `55923b0298a5dbe4.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tffc3-GM3
- `80f0f95dc81a692a.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tgm3i-GM3
- `3a07a7e3296d138a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lk01w5-04.
- `4077e5808dd6c9ec.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lk1j0t-05.
- `b0e77085c622dd40.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lk3lyv-06.
- `f17504953198f911.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lk4tsn-07.
- `77861598ebe78c4e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lk6981-08.
- `f6c295626a0d048a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lk9dsb-11.
- `f98ef1a2c7d5557d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lkaurk-12.
- `ce87f08088eb45a3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lkbdhm-13.
- `49a6e421ef69ee39.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lkclo7-14.
- `9b8751509075644f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lkfou6-17.
- `c5cd542442d6a1b8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lkhuu1-18.
- `36a116951462cc47.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lkj1b8-19.
- `616d294c6745ebae.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lkmte8-20.
- `c91c8e532d847825.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lkolpk-24.
- `0140558ac02c32b5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7lkr4j4-25.
- `4bbb9a97c4d94db1.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7llbz94-GM3

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tddmn-GM3-Components-Sliders-`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tdv5o-GM3-Components-Sliders-`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tec5h-GM3-Components-Sliders-`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tep43-GM3-Components-Sliders-`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tf2t6-GM3-Components-Sliders-`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tffc3-GM3-Components-Sliders-`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tgm3i-GM3-Components-Sliders-`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7llbz94-GM3_Expressive_Slider_g`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm7m4gc9t-slider%20motion.mp4?alt`

## [accessibility] illustrations

- `5d5d6bdd29742cc6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx1s6sg3-3.p
- `ffa02023de354533.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx1s73wl-4.p
- `478208cb58353095.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tjccg-GM3
- `d66e09b5d1383c80.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tk5qd-GM3
- `c21d04cef59e1888.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0o6wp1l-5.p
- `23f9f172429b9ab4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm3601h6w-6.p
- `6f41b84603b39030.png` ← https://lh3.googleusercontent.com/OWwb77SjGqjZQLsDqlw0d2LHmx7E1Edw9pc7X8Xk2lA7AUQ1nRcjpOR76wXmHgqC77ZCpt_5cjRs

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tjccg-GM3-Components-accessib`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flx2tk5qd-GM3-Components-accessib`
