# M3 component: loading-indicator

_Archive: `m3-archive/spec/components/loading-indicator/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/loading-indicator/…_

## Overview (full text)

Loading indicator - Material Design 3
 Availability & resources M3 Expressive update Recommended as a replacement for indeterminate
 circular progress indicators
 Circular progress indicators display progress by animating along an invisible circular track in a clockwise direction.
 More on circular progress indicators
 Always reflect an ongoing process and are never simply decorative Used for pull-to-refresh interactions Not used for processes that transition from indeterminate to determinate Capture attention through motion pause Loading indicator Contained loading indicator Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation android Jetpack Compose: Expressive Available android Android Views (MDC-Android): Expressive Available language Web: Expressive Unavailable Close M3 Expressive update May 2025 The loading indicator i s designed to show progress that loads in under five seconds. It should replace most uses of the indeterminate circular progress indicator. More on M3 Expressive New component added to catalog. Loading indicators: Are used in pull-to-refresh functionality Can be contained or uncontained Use shape and motion to capture attention Can scale in size pause Loading indicators are used in the pull-to-refresh behavior

## Key measurements (dp, extracted)

- iner Measurements To ensure sufficient margins, the size is 48dp while the shape container is 38dp
- much space Responsive layout Loading indicators default to 48dp, but the size is flexible. It should be
- between 24dp to 240dp, depending on the placement an
- like desktop. Loading indicators can range in size from 24–240dp Larger windows As the pane or window si
- pty space around it. The loading indicator shouldn’t exceed 240dp. pause The loading indicator’s default

## Accessibility (full text)

Loading indicator - Material Design 3
 Use cases Interaction & style Labeling elements Use cases People should be able to do the following with assistive technology: Navigate to the loading indicator Understand what progress the indicator is communicating Initiate a content refresh without relying on a gesture Interaction & style The active indicator, which displays progress, provides visual contrast of at least 3:1 against most container and surface colors. The indicator itself must have 3:1 contrast with the background, but the container does not. The loading indicator provides visual contrast of at least 3:1 against most background colors When integrated into another component, such as a button, make sure that the active indicator provides a visual contrast of at least 3:1 against the other component. check Do Ensure at least 3:1 contrast between the indicator and the surface it's on close Don’t Avoid using when the contrast is under 3:1 Pull-to-refresh interactions can’t be accessible by just swiping. Provide an alternate way to refresh the content with a single pointer, such as placing a refresh button in a menu or directly alongside the content. pause The refresh action can be in an app bar Labeling elements Since the loading indicator is a visual cue, it needs an accessibility label to assist people who can't rely on visuals. It should use the progress bar accessibility role. Write a label describing the purpose of the loading indicator, such as loading news article or refreshing page . Loading indicator labels should explain which items are loading

## Specs (full text)

Loading indicator - Material Design 3
 Variants Configurations Tokens & specs Anatomy Color Measurements Variants Loading indicator Variant M3 M3 Expressive Loading indicator -- Available Configurations Default Contained Category Configuration M3 M3 Expressive Containment Default -- Available Contained -- Available Tokens & specs Loading indicators have a single token set. Loading indicator arrow_drop_down search expand_all Default, Light arrow_drop_down folder Color keyboard_arrow_down folder Size keyboard_arrow_down folder Shape keyboard_arrow_down Close Anatomy Active indicator Container Color Default Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. Loading indicator color roles used for light and dark schemes: Primary Contained Contained loading indicator color roles used for light and dark schemes: On primary container Primary container Measurements To ensure sufficient margins, the size is 48dp while the shape container is 38dp

## Guidelines (full text)

Loading indicator - Material Design 3
 Usage Anatomy Placement Responsive layout Behavior pause Loading indicators are best for indicating a short, indeterminate wait time Usage Loading indicators use animation to grab attention, mitigate perceived latency, and indicate that an activity is in progress. They should be used when progress isn’t detectable, or when it’s not necessary to indicate how long an activity will take. While similar in function to circular progress indicators, loading indicators are a better alternative for short processes between 200ms and 5s. pause Use a loading indicator when a background process is running Choose a loading or
 progress indicator
 Progress indicators show the status of a process in real time.
 More on progress indicators
 that corresponds to the expected wait time and type of process. If the wait is very long, consider allowing users to navigate away from the page while the process finishes up. Expected wait time Recommendation Instant (under 200ms) No indicator Short (between 200ms and 5s) Loading indicator Long (Over 5s) Progress indicator pause Instant (under 200ms): Display the content immediately pause Short (between 200ms and 5s): Use a loading indicator pause Long (over 5s): Use a progress indicator When a process can transition from indeterminate (unknown progress) to determinate (known remaining progress), transition between the corresponding progress indicators. Don’t transition a loading indicator into a progress indicator. pause check Do Transition from an indeterminate progress indicator to a determinate progress indicator pause close Don’t Avoid transitioning from a loading indicator to a determinate progress indicator Anatomy Active indicator Container (optional) Active indicator The active indicator is a looping shape morph sequence composed of seven unique Material 3 shapes. More about the Material shape library The active indicator morphs shape to capture attention Container (optional) When the container is visible, the active indicator should change color from primary to on-primary-container . The container should be visible when the loading indicator is placed over other content. This helps it stand out better by giving it a stronger contrast. It’s not needed when the loading indicator is placed directly on a surface. The container should be used with pull-to-refresh behavior. The container is a circle that provides extra contrast from body content Placement While loading a page or container, the loading indicator should be centered on the element. pause Center the loading indicator in the middle of the page or container When loading more items on a page with existing content, place the loading indicator in the empty space where the new content will appear. Avoid overlapping existing content. pause Center the loading indicator in the empty space where content will appear Loading indicators can be placed within other components, such as
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 , to indicate that the action is ongoing, such as validating a form or checking for updates. pause Loading indicators can be placed in buttons that take a few seconds to take effect pause Use loading indicators to show progress without taking up much space Responsive layout Loading indicators default to 48dp, but the size is flexible. It should be between 24dp to 240dp, depending on the placement and the breakpoint. Avoid exceeding the minimum and maximum sizes. The ratio between the container and the active indicator stays the same when resizing the loading indicator. Reserve very large progress indicators for large and extra-large windows, like desktop. Loading indicators can range in size from 24–240dp Larger windows As the pane or window size grows, consider scaling the loading indicator as well, so it remains proportional in size to the empty space around it. The loading indicator shouldn’t exceed 240dp. pause The loading indicator’s default size is ideal for mobile and other compact windows. The loading indicator should scale up in larger windows. Behavior Pull-to-refresh The loading indicator is used in pull-to-refresh on Jetpack Compose only. Pull-to-refresh is an Android system feature that manually refreshes screen content with an action or gesture. It’s used at the beginning of lists, grid lists, and card collections where the most recent content appears. It’s best to use pull-to-refresh with dynamic content that can have frequent updates, where people have a high chance of seeing new content after refreshing. pause The loading indicator for pull-to-refresh can appear on top of the content or adjacent to it Threshold requirements To ensure intentional usage of the pull-to-refresh gesture, the loading indicator must pass a threshold before the app will refresh. pause After passing the threshold, completing the gesture initiates a refresh pause Reversing the gesture past the threshold will cancel the refresh action The loading indicator remains visible until the refresh activity completes and any new content is visible, or someone navigates away from the refreshing content. pause check Do Keep the loading indicator in view until the activity is completed to provide status of the refresh activity pause close Don’t Don’t scroll the loading indicator off-screen, as it hides the status of the refresh activity. It could imply that the refresh activity is associated with a specific component, such as a card, instead of the entire screen.

## [overview] illustrations

- `9029ee85109cef5b.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fcl84h-Loa
- `c8f1d44c10d4c2b5.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fcq8u9-Loa
- `fb4c06dc4e36cb9b.jpg` ← https://m3.material.io/static/assets/m3-social.jpg

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fcl84h-Loading-Indicator-Overv`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fcq8u9-Loading-Indicator-Overv`

## [specs] illustrations

- `075378ec123f9c6a.png` ← https://lh3.googleusercontent.com/LnXFKWQjx1upNdSL52LpDEe6n6-9Wj_WQoZalB2nwnCKeNjhZ2p0tsq1q-LsV9gaDEcCVwuRicHG
- `2d357dfc9e33ab5d.png` ← https://lh3.googleusercontent.com/S67BxQ4QnYuKbYkLGmjsAX8gn1nTYNayufiu-mDSMxsT73giCJ_t_8P1G4A2t8JTcDOho15zfr2h
- `cd70bc068d1b403c.png` ← https://lh3.googleusercontent.com/kHiYDI_rJi33eQIGCCvJY8rB8T0KnCrajoGZaedLVM70FSKqCIMxwGTFc8j4A-DWWGTVgXQ2pWZq
- `6904f2b1f4e273d0.png` ← https://lh3.googleusercontent.com/wCgczdkIgvjvmJLlIlHuSP8ND2z0Xtw8K6oBWnYfaw0z39kFlhxprzY4LQSis0abslHlp69jMprJ
- `923beb22874c3abc.png` ← https://lh3.googleusercontent.com/wXvvKvCbB0kpP7qvp_XSbnQ2y_ulUlpCVLZ7wbz7FUvxiAsnXyH-AZBHnf5pKvC3JldNmmgC2GpN
- `7929f6958216796e.png` ← https://lh3.googleusercontent.com/ymEEU7ii6n5M1aJlvEK-YdTlpbtGoMaALgiyMHTJwgl6wqdPQOiBLyCeSZV9C032V24-ctzx396w
- `fb4c06dc4e36cb9b.jpg` ← https://m3.material.io/static/assets/m3-social.jpg

## [guidelines] illustrations

- `f30f2f38ee8a78b7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0cads86-7.p
- `07f4c92da9f0d1f1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0cafeiy-8.p
- `1b2abf94d80940ab.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0caha9b-9.p
- `f72414b9370e13ad.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0caprda-12.
- `b2b6f61b2a944e87.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd0ml7-Loa
- `96ca3bd267e6b224.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd16y4-Loa
- `760141321eea3735.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd1o64-Loa
- `550e51ac09752182.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd27h6-Loa
- `2389bd309d74cc61.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd4yi5-Loa
- `ba5fa0a58b137ed8.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd5yv7-Loa
- `25e6a887f15852c6.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd65dd-Loa
- `079f8571be17142c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdewmr-Loa
- `7f6021692fbbbc2a.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdfatx-Loa
- `c540b8bb5c6247cd.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdfhyq-Loa
- `bbf2c2e35e1e8da4.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdfwxf-Loa
- `1dc73175af7ddbb5.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdg3wa-Loa
- `c748e9cf57536334.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm41ke7ak-Loa
- `c39f8b67c68a91c3.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm41keuij-Loa
- `3281e49c66e397d9.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm5l84tah-Loa
- `55934da00353466d.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm5l855gf-Loa
- `60d5de073d5e7b3c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmbf4z7li-GM3
- `fb4c06dc4e36cb9b.jpg` ← https://m3.material.io/static/assets/m3-social.jpg

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd0ml7-Loading_Indicator-B.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd16y4-Loading_Indicator-C.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd1o64-Loading_Indicator-D.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd27h6-Loading-Indicator-E.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd4yi5-Loading-Indicator-I.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd5yv7-Loading-Indicator-J.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fd65dd-Loading-Indicator-K.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdewmr-Loading-Indicator-M.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdfatx-Loading-Indicator-N.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdfhyq-Loading-Indicator-O.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdfwxf-Loading-Indicator-P.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0fdg3wa-Loading-Indicator-Q.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm41ke7ak-Loading_Indicator-A2.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm41keuij-Loading-Indicator-H2.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm5l84tah-Loading-Indicator-F3.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm5l855gf-Loading-Indicator-G2.mp`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmbf4z7li-GM3_Expressive_Loading-`

## [accessibility] illustrations

- `0582f94ea93edae4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0cb8rsa-5.p
- `9cd5719444ce41bb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmaguuv6h-2_d
- `c34e6f4e69a47ea6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmaguuziu-3_d
- `e48a480a5d801a7f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmagv3srk-1.p
- `0dd697f2af1d2b14.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmbf509tn-GM3
- `fb4c06dc4e36cb9b.jpg` ← https://m3.material.io/static/assets/m3-social.jpg

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmbf509tn-GM3_Expressive_Loading-`
