# M3 component: progress-indicators

_Archive: `m3-archive/spec/components/progress-indicators/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/progress-indicators/…_

## Overview (full text)

Progress indicators – Material Design 3
 Availability & resources M3 Expressive update Previous updates Differences from M2 Two variants: linear and circular Use the same configuration for all instances of a process (like loading) They capture attention through motion Option to apply a wave to the active track for use cases that would benefit from increased expressiveness Linear and circular progress indicators have visual configurations for shape and thickness Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Available language Web Available language Web: Expressive Unavailable Close M3 Expressive update Aug 2024 The progress indicators have configurations for height and wavy shape. Choose the visual style that best fits your product. More on M3 Expressive Track height: Configurable Shape: Wavy pause Progress indicators have a new rounded, colorful style, and more configurations to choose from, including a wavy shape and variable track height Previous updates Dec 2023: Non-text contrast (NTC) Anatomy: Added an end stop indicator to improve accessibility Contrast: Higher contrast between track and active indicator to enhance the perception of progress Motion: New motion behavior Shape: Rounded corners Progress indicators have a new rounded, colorful style Differences from M2 July 2022: Added to Material 3 Color: New color mappings and compatibility with dynamic color M2: Progress indicators have a boxier, neutral style M3: Progress indicators are compatible with dynamic color

## Key measurements (dp, extracted)

- Behavior: Determinate and indeterminate Thickness: Default (4dp) and variable Shape: Flat and wavy Cate
- ), Indeterminate Available Available Track thickness Fixed (4dp) Available Available Configurable -- Av
- progress indicator is inset from the edge of the screen by 4dp Baseline tokens The circular and linear
- he overall container Stop indicator The stop indicator is a 4dp circle that marks the end of a linear d
- rogress indicators have flexible sizes. They can range from 24dp to 240dp, depending on the placement an
- a card. They shouldn’t be used in any elements smaller than 40dp. The padding on each end should be 4dp

## Accessibility (full text)

Progress indicators – Material Design 3
 Use cases Interaction & style Labeling elements Use cases People should be able to do the following using the assistive technology: Navigate to the progress indicator Understand what progress the indicator is communicating Interaction & style The active indicator, which displays progress, provides visual contrast of at least 3:1 against most background colors. The progress indicator and stop indicator provide visual contrast of at least 3:1 against most background colors When integrated into another component, such as a button, make sure that the active indicator provides visual contrast of at least 3:1 against the other component. For the active indicator, use the same color as the label text or icon. The track should be removed. check Do Ensure the indicator’s color provides at least 3:1 contrast against the surface it's on close Don’t Avoid using a color below 3:1 contrast For linear progress indicators, the stop indicator is required if the track has a contrast below 3:1 with its container or the surface behind the container. Essentially, the end of the track must be easy to identify. check Do Only remove the stop indicator when the linear progress indicator has at least a 3:1 color contrast with surrounding containers and surfaces close Don’t Avoid removing the stop indicator if any adjacent containers or surfaces are below the 3:1 color contrast Labeling elements Since the progress indicator is a visual cue, it needs an accessibility label to describe the kind and amount of progress made. Use the progress bar accessibility role, and write an accessibility label that describes the purpose of the progress indicator. The label should include the process, such as "loading,” and the affected content, such as a page, article, or episode. For example: "Loading news article" or "Refreshing page." Progress indicator labels should explain which items are loading A label on an intedeterminate progress indicator on a screen which is loading a set of podcast episodes

## Specs (full text)

Progress indicators – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color Measurements Baseline tokens Variants Linear progress indicator Circular progress indicator Variant M3 M3 Expressive Linear progress indicator Available Available Circular progress indicator Available Available Configurations Behavior: Determinate and indeterminate Thickness: Default (4dp) and variable Shape: Flat and wavy Category Configuration M3 M3 Expressive Behavior Determinate (default), Indeterminate Available Available Track thickness Fixed (4dp) Available Available Configurable -- Available Shape Flat (default) Available Available Wavy -- Available Tokens & specs Browse the component elements, attributes, tokens, and their values. View baseline tokens Progress Indicator - Common arrow_drop_down search expand_all Default, Light arrow_drop_down folder Color keyboard_arrow_down folder Shape keyboard_arrow_down folder [Deprecated] Enabled keyboard_arrow_down Close Anatomy Active indicator Track Stop indicator Color Progress indicator color roles used for light and dark schemes: Primary Secondary container Measurements Wavy indicators use amplitude and wavelength to determine the shape of the wave. The height is the overall container height. Amplitude measures from the center of the resting position to the center of the peak Wavelength measures the distance between two adjacent peaks Size measurements for linear progress indicators. The thicker variants are provided as sample measurement for makers to adjust the default version based on their use cases. Size measurements for circular progress indicators. The thicker variants are provided as sample measurement for makers to adjust the default version based on their use cases. The linear progress indicator is inset from the edge of the screen by 4dp Baseline tokens The circular and linear progress indicator had separate token sets. These are no longer recommended. [Deprecated] Progress indicator - Circular arrow_drop_down search expand_all Default, Light arrow_drop_down folder [Deprecated] Enabled keyboard_arrow_down Close

## Guidelines (full text)

Progress indicators – Material Design 3
 Usage Anatomy Placement Responsive layout pause Progress indicators communicate the status of an ongoing process Usage Use progress indicators to show the status of ongoing processes, such as loading an app, submitting a form, or saving updates. When multiple items are loading, use a single progress indicator to show progress for the group. Don’t add progress indicators to every activity. pause check Do Indicate overall progress of a group of items pause close Don’t Don’t show the progress of each activity in a group Choose a
 loading
 Loading indicators show the progress of a process with a short wait time.
 More on loading indicators
 or
 progress indicator
 Progress indicators show the status of a process in real time.
 More on progress indicators
 that corresponds to the expected wait time and kind of process. If the wait is very long, consider allowing people to navigate away from the page while the process finishes up. Expected wait time Recommendation Instant (under 200ms) No indicator Short (between 200ms and 5s) Loading indicator Long (Over 5s) Progress indicator pause Instant (under 200ms): Display the content immediately pause Short (between 200ms and 5s): Use a loading indicator pause Long (over 5s): Use a progress indicator There are two variants of progress indicators: Linear Circular Linear indicators are best when placed on the edge of a container. Circular indicators are best when centered in an element. A process should be represented by the same variant of progress indicator throughout the product. For example, if refreshing uses a circular indicator in one place, it should use circular indicators everywhere. Linear indicator Circular indicator Progress indicators behave differently based on the time of progress being tracked: Determinate : Known progress and wait time Indeterminate : Unknown progress and wait time When using a determinate indicator, the indicator must accurately represent the progress of what it's measuring. Use indeterminate indicators to show that a process is happening, but the wait time is unknown. pause Determinate progress indicators fill from 0% to 100% Indeterminate progress indicators move along a fixed track, growing and shrinking in size As more information about a process becomes available, a progress indicator should change from indeterminate to determinate . pause A linear progress indicator changes from indeterminate to determinate while loading a screen Anatomy pause Active indicator Track Stop indicator Active indicator The active indicator shows the progress that has been made so far. In indeterminate processes, it grows and shrinks along the track repeatedly. pause Linear indicators animate from the leading to the trailing edge along the track. Circular indicators animate from the top of the track, clockwise by default. The active indicator appears as soon as progress begins. At low percentages where space is limited, this should appear as a dot to help people understand that there’s progress underway. When progress first begins, the active indicator appears as a dot The active indicator has two shape options: flat and wavy . Use the shape that best fits the product’s tone. The wavy shape can make longer processes feel less static and is best used when a more expressive style is appropriate. When using the wavy shape, the overall height of the component changes. At very small sizes, the wavy shape may not be as visible. pause Wavy linear indicators increase the height of the overall container Stop indicator The stop indicator is a 4dp circle that marks the end of a linear determinate progress indicator to meet Material's accessibility standards. It's not used for indeterminate or circular progress indicators. The stop indicator is required if the track has a contrast below 3:1 with its container or the surface behind the container. check Do Use a stop indicator when placing the progress indicator inside a container with low contrast exclamation Caution Only remove the end stop indicator if there's a visual contrast of at least 3:1 with surrounding surfaces Placement Place a linear progress indicator along the edge of a container that’s loading. If the container changes shape, place it on the edge that animates. It can also be placed in the middle of a container. Use a single progress indicator at the top of a page to show progress of the whole group. Don’t add one for every element unless they’re activated independently. pause When at the top of a screen, a progress indicator shows that all of the page content is loading pause When attached to a card, a progress indicator shows that just the card content is loading pause A progress indicator on the expanding edge of a card shows that the edge may expand to show the loaded content Circular progress indicators should be centered directly on the container or page that's loading, such as a button or card. When loading more items on a page, place the circular progress indicator in the empty space where the new content will appear, not overlapping existing content. However, if the content does not take long to load, consider using a loading indicator instead. pause A circular progress indicator can show that the page is loading pause A circular progress indicator can show where new items will appear on a page. A loading indicator also works well in this space. Progress indicators in buttons A circular indicator can be placed in a button to show that the button’s action is currently in progress. In very small buttons, use the flat shape since the wavy shape is not as visible at that size. To ensure a minimum 3:1 contrast ratio, change the active indicator color to be the same color as the button’s icon or label text, and remove the track. pause check Do Use circular indicators for short, indeterminate activities under 5 seconds pause close Don’t Avoid applying progress indicators to every button in a list Responsive layout Right-to-left languages Linear progress indicators should be mirrored horizontally for products using right-to-left (RTL) languages. Circular progress indicators don’t need to be mirrored. Linear progress indicators can flow from right to left in right-to-left (RTL) languages Large screens Circular progress indicators have flexible sizes. They can range from 24dp to 240dp, depending on the placement and the breakpoint. Avoid exceeding the minimum and maximum sizes. Reserve very large progress indicators for large and extra-large windows, such as desktop. The waveform should scale with the size so the proportions look the same across sizes Linear progress indicators dynamically adjust to fit the width of the window or element they’re placed within, such as a card. They shouldn’t be used in any elements smaller than 40dp. The padding on each end should be 4dp minimum, but can be modified. The linear progress indicator should always span the width of the UI element it’s placed within

## [overview] illustrations

- `f788af89b827f7f8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c2if7i-04.
- `57309ddc53284252.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0c2jf26-05.
- `b66af36ff0046dfa.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qvxgu6-Pro
- `2a438ff88012ce4c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmleotj2q-01.
- `1ef33358ccd153fb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmleov4bo-03.
- `fc856867b6936cd6.png` ← https://lh3.googleusercontent.com/v1cUW72XHWnx_Bo8u7jeLlR96xuUPPqAM22BIk3XouqTuxAWAIoRIvFqYqKSM3NrFQSkKWX-HqNv

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qvxgu6-Progress-Indicator-Over`

## [specs] illustrations

- `5238679b2c339caa.png` ← https://lh3.googleusercontent.com/6_sdBcuvKe2j9XDUC70bzaxi8QsZW1507V6pQ9ZQstst3B_Y8w26_5Yuz504uIxL_GcrMfNhJFvN
- `647b146a427dc75c.png` ← https://lh3.googleusercontent.com/8oX70XRFeRqxFH1vBkx8z4hy6nKrvShQvQsQuR8emIWoXRKU8OWnK5pdFx-Q8ZwF0d4w8qDLi5Nq
- `10dfe178e373f238.png` ← https://lh3.googleusercontent.com/Aii3LLGqfr5jLHSdMLKx4rMUceBixyyXu77IqvYcUoMGwV8MxqqZgcB0XU6nx7GpVeU7_sqdq6Sc
- `ebe2b6e18142d0dd.png` ← https://lh3.googleusercontent.com/Cf6AdPUEQffL-k5D1on9M3H1oyAGh20uJyfa7sbOwip6oRPvmqv7u2MSLKrH70PpyL0bCJdy2fGR
- `b3a5cbb0d3986cee.png` ← https://lh3.googleusercontent.com/CrzKce-9x2GrD2SOdyYCmDhdK37XcZoiMv9mT6N0NjUybL1GwXLN52_LbXb1AKfzmLUna1jMew5x
- `633ad516cb326e07.png` ← https://lh3.googleusercontent.com/M-64WwKIqgmV6lWqTh7Ar7vJuUsvjqLTnOJcMLrFPbW4nxRmYITD4GbXXEGCjwK2eJLUBGlfD1rt
- `121a2793a239e0b0.png` ← https://lh3.googleusercontent.com/d1mWcS4gytQf_XcgwvUqsNTf47P5BT9PUo-Ivi-7Ld1_Vc_HAtLGPARxwbqUcN7gdc-JH4iXM0nR
- `2001d93df4e05570.png` ← https://lh3.googleusercontent.com/fLmSSW0vCAz72TSdfqeo9FQY5YlgLT7ktKAZkxs-FEetsANoory1UPDxRd3-jESQSkUeq6xuwEtp
- `d871459ae2e1358f.png` ← https://lh3.googleusercontent.com/hYbEOpy3GfIuFxLUfMLU_r3VijC9KNldOlFhXM3oEYputn_p6YvzArLiC3dZWgzuuzVOfrsX2LUh
- `fc856867b6936cd6.png` ← https://lh3.googleusercontent.com/v1cUW72XHWnx_Bo8u7jeLlR96xuUPPqAM22BIk3XouqTuxAWAIoRIvFqYqKSM3NrFQSkKWX-HqNv

## [guidelines] illustrations

- `e8bc02ce64a62e7e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0h3mssg-Pro
- `c33355e213c44499.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0h3n5x5-Pro
- `410753847ab99425.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0h3nu79-Pro
- `1fea662735d06780.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0h3o5um-Pro
- `661356026ea5391f.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw0hzu-Pro
- `673e134bc2eec2d1.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw2h3o-Pro
- `e9e25b61b0d04f27.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw333o-Pro
- `b14da54cbbbe3597.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw3uto-Pro
- `7c0841cf876d1b29.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw4l6g-Pro
- `42e0459ae1c552fa.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw57zf-Pro
- `9e72d780944d3d76.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw6vq0-Pro
- `c2716a79cbbbcba5.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw7zgb-Pro
- `d9b25a8f1de63fdd.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw8fla-Pro
- `3c34c71142c3246f.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qwbhkm-Pro
- `bd00b734b0301591.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qwbvqt-Pro
- `03ed86bef40b2a7d.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm37rcxcs-Loa
- `d870ea5d05bedcd7.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm37ri5xn-Pro
- `6a0e6e25b06a67bc.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm37rivp2-Pro
- `4f1d6a70e5aab508.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlep5ivu-07.
- `e805f5f7a19673b5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlep6b3j-12.
- `b4ab0e63b0c5dc8c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlep7pxt-16.
- `dd7d4712a3a449ae.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlep87pn-17.
- `563cde30e8e28d7f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlep96rs-25.
- `09a97ce5999ee9ac.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlep9qg1-26.
- `012e58fb78939c8b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlepa8w9-27.

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0h3mssg-Progress-Indicator-B.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0h3n5x5-Progress-Indicator-C.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0h3nu79-Progress_Indicator-C.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0h3o5um-Progress_Indicator-D.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw0hzu-Progress-Indicator-G.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw2h3o-Progress-Indicator-K.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw333o-Progress-Indicator-H.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw3uto-Progress-Indicator-I.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw4l6g-Progress-Indicator-J.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw57zf-Progress-Indicator-L.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw6vq0-Progress-Indicator-M.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw7zgb-Progress-Indicator-O.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qw8fla-Progress-Indicator-P.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qwbhkm-Progress-Indicator-Q.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0qwbvqt-Progress-Indicator-R.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm37rcxcs-Loading-Indicator-E_2.m`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm37ri5xn-Progress-Indicator-A_1.`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm37rivp2-Progress-Indicator-N_1.`

## [accessibility] illustrations

- `38e3bc34f3fc0d61.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlepc1r2-01.
- `92368a56350b04bb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlepcmau-02.
- `b96501a48e4db1f7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlepd6dk-03.
- `b9fc06b7b474c98e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlepdozy-04.
- `f04bce6d78058816.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlepe18t-05.
- `6edeb65dbaa30439.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlepereg-06.
- `0eb70e5ba79e5c7e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlepf1vr-07.
- `fc856867b6936cd6.png` ← https://lh3.googleusercontent.com/v1cUW72XHWnx_Bo8u7jeLlR96xuUPPqAM22BIk3XouqTuxAWAIoRIvFqYqKSM3NrFQSkKWX-HqNv
