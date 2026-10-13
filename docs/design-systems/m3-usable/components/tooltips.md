# M3 component: tooltips

_Archive: `m3-archive/spec/components/tooltips/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/tooltips/…_

## Overview (full text)

Tooltips – Material Design 3
 Availability & resources Differences from M2 Use tooltips to add additional context to a
 button
 Buttons let people take action and make choices with one tap.
 More on buttons
 or other UI element Two variants:
 plain
 Plain tooltips briefly describe a UI element. They're often used for labelling UI elements with no text, like icon-only buttons and fields.
 and
 rich
 Rich tooltips provide additional context about a UI element. They can optionally contain a subhead, buttons, and hyperlinks.
 Use plain tooltips to describe elements or actions of
 icon buttons
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 Use rich tooltips to provide more details, like describing the value of a feature Rich tooltips can include an optional title, link, and buttons Plain tooltip Rich tooltip Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Unavailable android Jetpack Compose Available android Android Views (MDC-Android) Unavailable language Web Unavailable Close Differences from M2 Color : New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Shape :
 Rich tooltips
 Rich tooltips provide additional context about a UI element. They can optionally contain a subhead, buttons, and hyperlinks.
 have more rounded corners M2: Rich tooltips have slightly rounded corners M3: Rich tooltips have more rounded corners and support dynamic color

## Key measurements (dp, extracted)

- ding and size measurements Attribute Value Container height 24dp Padding 8dp Rich tooltip Subhead Contai
- p padding and size measurements Attribute Value Top padding 12dp Bottom padding 8dp Left and right paddi
- ng 16dp Rich tooltip configurations
- f there's a visual boundary, like a button, the distance is 4dp If there's no visual boundary, like wit
- h text baselines, the distance is 8dp If the element is in an
- elow the element at the same distance. Plain tooltip with a 4dp distance between the target and tooltip
- ioning The position of the tooltip adjusts in increments of 8dp to avoid going off-screen. Desktop plac

## Accessibility (full text)

Tooltips – Material Design 3
 Use cases Interaction & style Focus order Keyboard navigation Labeling elements Use cases People should be able to do the following using assistive technology: Receive a tooltip message Activate a tooltip with a keyboard or switch input Interaction & style Plain and rich tooltips without required actions should remain on screen long enough for people to receive the information without disrupting their existing flow or task. pause check Do Plain tooltips should remain on the screen temporarily after the cursor moves away Tooltips can appear when an actionable element, like a button or navigation rail, is hovered or focused. However, this tooltip shouldn’t hide crucial information. Rich tooltips can also appear by selecting an element instead of hovering or focusing on it. Tooltips can appear on hover or focus to explain actions Rich tooltips can appear when an element is selected Focus order Tooltip containers should not block important information or prevent a person from completing an action. Focus order within the rich tooltip moves top to bottom between interactive elements. Avoid trapping screen reader and keyboard focus on rich tooltips. People should be able to move linearly through the rest of the page. Parent element Inline link Text button Keyboard navigation Keys Actions Tab Focus lands on button, if available Space or Enter Activates the focused element Labeling elements Tooltips should have the Tooltip role, or similar. Label all elements in the tooltip according to their own accessibility guidance. The tooltip container should have the Tooltip role

## Specs (full text)

Tooltips – Material Design 3
 Tokens & specs Plain tooltip Rich tooltip Tokens & specs Select a component variant below to see its attributes, tokens, and values. Tooltip - Plain arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down Close Plain tooltip Supporting text Container Plain tooltip colors Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Plain tooltip color roles used for light and dark themes: Inverse on surface Inverse surface Plain tooltip measurements Plain tooltip padding and size measurements Attribute Value Container height 24dp Padding 8dp Rich tooltip Subhead Container Supporting text Text button Rich tooltip colors Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Rich tooltip color roles used for light and dark themes: On surface variant Surface container On surface variant Primary Rich tooltip measurements Rich tooltip padding and size measurements Attribute Value Top padding 12dp Bottom padding 8dp Left and right padding 16dp Rich tooltip configurations
 Rich tooltips
 Rich tooltips provide additional context about a UI element. They can optionally contain a subhead, buttons, and hyperlinks.
 can have a headline, body, and up to two
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 . The headline and number of buttons can be configured. Subhead, supporting text, and two buttons Subhead, supporting text, and one button Subhead and supporting text Supporting text and one button Supporting text and two buttons

## Guidelines (full text)

Tooltips – Material Design 3
 Usage Anatomy Placement Behavior Plain and rich tooltips serve different purposes Usage A tooltip provides additional context for a UI element. Plain tooltips Plain tooltips briefly describe a UI element. They're best used for labelling UI elements with no text, like icon-only
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 and fields. Rich tooltips Rich tooltips provide additional context about a UI element. They can optionally contain a subhead, buttons, and hyperlinks. Rich tooltips are best used for longer text like definitions or explanations. Plain tooltip Rich tooltip check Do Use plain tooltips to label icon-only buttons close Don’t Plain tooltips aren't needed when the UI element already has label text check Do Use rich tooltips to provide extra information and actions about a UI element or new feature close Don’t Don't hide critical information within tooltips as it’s easy to miss. Use an interruptive dialog instead. Anatomy Plain tooltip Container Supporting text Supporting text check Do Briefly describe a UI element exclamation Caution Avoid wrapping text to multiple lines or including many pieces of information Rich tooltip Subhead (optional) Container Supporting text Text button (optional) Subhead (optional) Keep subheads brief, ideally to one line. They should summarize or describe the message of the
 rich tooltip
 Rich tooltips provide additional context about a UI element. They can optionally contain a subhead, buttons, and hyperlinks.
 . Subheads are important to include when the rich tooltip appears automatically, like when the page loads. check Do Summarize the message in a few words close Don’t Avoid wrapping to more than one line Text buttons (optional) Rich tooltips can have up to two text
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 . These should be brief and relevant to the message in the supporting text. Keep buttons short so they can be side by side. Avoid stacking them when possible. exclamation Caution Avoid stacking buttons Placement Plain tooltips By default, plain tooltips are positioned directly above the parent element. If there's a visual boundary, like a button, the distance is 4dp If there's no visual boundary, like with text baselines, the distance is 8dp If the element is in an
 app bar
 App bars contain page navigation and information at the top of a screen.
 More on app bars
 , the plain tooltip appears below the element at the same distance. Plain tooltip with a 4dp distance between the target and tooltip Rich tooltips By default, rich tooltips are positioned to the bottom right of the parent element. They adjust position to avoid going off screen. Tooltips shouldn't cover the parent element. Dynamic positioning The position of the tooltip adjusts in increments of 8dp to avoid going off-screen. Desktop placement On desktop, tooltips may appear centered below the parent element and remain visible while moving within the target region. Four different rich tooltip locations based on dynamic positioning Behavior To show a tooltip,
 hover
 A hover state communicates when a user has placed a cursor above an interactive element.
 More on hover state
 on the parent element on desktop, or tap and hold the element on mobile. Persistent
 rich tooltips
 Rich tooltips provide additional context about a UI element. They can optionally contain a subhead, buttons, and hyperlinks.
 only appear when clicked or tapped. Transient by default Both
 plain
 Plain tooltips briefly describe a UI element. They're often used for labelling UI elements with no text, like icon-only buttons and fields.
 and rich tooltips disappear 1.5 seconds after navigating away from the target region. Triggering a new tooltip immediately closes any other open tooltip. pause Tooltips disappear after a 1.5 second delay when no other element is hovered close Don’t Only display one tooltip at a time Persistent rich tooltips Persistent rich tooltips appear when either: The parent element is clicked The page loads and a new feature is being explained Persistent rich tooltips remain active even when leaving the target region. They only disappear once a person interacts with another UI element. Hovering doesn't trigger the tooltip. When appearing on page load, the tooltip can introduce and explain new features on various parent elements. Avoid using persistent rich tooltips on icon buttons. close Don’t Don’t use a persistent rich tooltip on icon buttons

## [overview] illustrations

- `b1615743a6f8b564.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6q4295-01.
- `381205648607ffef.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6q4dmm-03.
- `9c6dc9d21633382c.png` ← https://lh3.googleusercontent.com/eJToL16cXcvuWuH7Ajb0sRtM7yFr6qMf_tbIdsR5hAfrIRinT4UfyLsr2Me5goaDHO1RAXuagPp2
- `c4817b1ae8f63606.png` ← https://lh3.googleusercontent.com/lJM3Eft4qYA2-u8hGts3octhkDMZxRC1yHOnmzOn9CfZGAm7DImHyZyZqvu1YnF7fYICpR5WFWJG

## [specs] illustrations

- `d45c25887886f6c2.png` ← https://lh3.googleusercontent.com/IP6aFfF9CPT86pHLyDQsPlpgpwRfiWWm4SrvrDszC_Mu_Y6iKdMcOlLuBrITk7y8afU-PxXvO26X
- `b6554ca2ddf72747.png` ← https://lh3.googleusercontent.com/Vf161JCMtFZVXhyzhmfRoDmGW_vYVmOm5QdZOy8djJu0aEPo-gylreVY1ooQuFsAy-VFBqzRHbt1
- `ff92d5d9b77d3355.png` ← https://lh3.googleusercontent.com/WodvJBwtv0NFdfsgMkOfxWI698jM_8D6CP7cqU4CmxliBFAtsYOv1CqBQTgkHIP1gkYYLWMaTB9k
- `dcfde0cdb86d844f.png` ← https://lh3.googleusercontent.com/abK2uBeEApgbWbQQrMibCEslnADu90AFpFRPbT9RVSeKZfO8baP5s6myVNJKPIUtmc_S-X99Pt04
- `c4817b1ae8f63606.png` ← https://lh3.googleusercontent.com/lJM3Eft4qYA2-u8hGts3octhkDMZxRC1yHOnmzOn9CfZGAm7DImHyZyZqvu1YnF7fYICpR5WFWJG
- `82e232112b1c5e74.png` ← https://lh3.googleusercontent.com/pWZE_wQc3sD5MfnKWOQ1zSkmWFK-kLD9AHIu7iUz7DPUnF9xsNdzNhcOLz6f3jTBP-8BSkD-sKs3
- `e4687591c6149f74.png` ← https://lh3.googleusercontent.com/ugboOBv4d02ZjiINyFUTI_S1IvPfMXxkgoCqYcmns1a23omQzQaAHWU5NzrwD7G96VQpAU3oi6sx
- `20ca40cf030cf535.png` ← https://lh3.googleusercontent.com/zHG-py73NpfFfT9V5YL21rpv8EdODG2H97qgSjjGF4IaiQlAmma5D47553mD-KCljwP7WL8j8lby

## [guidelines] illustrations

- `2a30df40b139efd6.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwj9io0m-GM3
- `28cbf85183f55b3e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6qnzgx-01.
- `9e534e6610d7abbb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6qs96y-02.
- `d614e3569f9cb04e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6qu5gx-03-
- `6fb1aa80aaaccb66.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6quvhe-04-
- `7014f678dc1e2d09.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6qx7on-05-
- `14977239589b89ff.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6qywbu-6-d
- `20a4cee7be1c32a5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6r0a08-07.
- `69ade6f5bd268863.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6r2ci0-08-
- `108e15471e79ea2c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6r3rse-09-
- `ba0e1ec20799fae2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6r9edz-11-
- `edc3f887b56a9f81.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6ra39j-12-
- `fd3c1f472cb21c46.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6rdax0-13-
- `74af8a6abfce31ae.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6rg1hz-14.
- `cd955928a19571d9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6riq0z-15.
- `efdf1bdd51e0b259.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6ro0ii-17-
- `c9c56cb708a04a69.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6rq50p-18-
- `7d7fe223d151a039.png` ← https://lh3.googleusercontent.com/Qrg3y9UWvNZtKfeefdMriNm0BUWNB_4KL5lW4pDAdtSVGnRbdnJq_bOmpBVvYt7o6eS-pUOtaKvG
- `c4817b1ae8f63606.png` ← https://lh3.googleusercontent.com/lJM3Eft4qYA2-u8hGts3octhkDMZxRC1yHOnmzOn9CfZGAm7DImHyZyZqvu1YnF7fYICpR5WFWJG

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwj9io0m-GM3-Components-ToolTips`

## [accessibility] illustrations

- `1143ba25cafad1f9.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm1i00uln-lwj
- `23cf026bbaab3822.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6ru5uh-02.
- `3f3eb510871dc5d9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6ruf33-03.
- `2341632bf6127083.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme6ry9ry-05.
- `adffac6a65efeaa1.png` ← https://lh3.googleusercontent.com/KCWqivAVbjIzMGBp1AVQbceVT02tQdKQSNJOd-FA_ARUYwMLQX2GUYZi55K0wxG_c2dYdGFnsBnB
- `c4817b1ae8f63606.png` ← https://lh3.googleusercontent.com/lJM3Eft4qYA2-u8hGts3octhkDMZxRC1yHOnmzOn9CfZGAm7DImHyZyZqvu1YnF7fYICpR5WFWJG

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm1i00uln-lwj9io0m-GM3-Components`
