# M3 component: badges

_Archive: `m3-archive/spec/components/badges/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/badges/…_

## Overview (full text)

Badge – Material Design 3
 Availability & resources Differences from M2 Can contain labels or numbers Two variants:
 small
 Small badges are a simple circle used to indicate an unread notification.
 and
 large
 Large badges contain label text communicating item count information.
 Anchor badges inside the icon bounding box, at the upper trailing edge of the icon Limit content to four characters, including a + Keep the default color mapping Small badge on a navigation item Large badge on a navigation item Large badge with max characters on a navigation item Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Unavailable Close Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Badges have new color mappings

## Key measurements (dp, extracted)

- ing and size measurements Attribute Value Small badge shape 3dp corner radius Small badge size (HxW) 6d
- p Large badge shape 8dp corner radius Large badge one digit siz
- e (HxW) 16dp Large badge max character count size (H
- xW) 16x34dp Small badge: distance from top trailing
- icon corner to bottom leading badge corner (HxW) 6x6dp Large badge: distance from top trailing
- icon corner to bottom leading badge corner (HxW) 14x12dp Large badge padding between badge and t
- ext container 4dp Configuration Different badges are show

## Accessibility (full text)

Badge – Material Design 3
 Use cases Interaction & style Visual indicators Labeling elements Use cases People should be able to use assistive technology to : Understand the dynamic information conveyed in badges, such as counts or labels Address badge announcements by selecting corresponding navigation destinations Interaction & style Badges are most commonly used within other components, such as
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 ,
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 ,
 app bars
 App bars display navigation, actions, and text at the top of a screen.
 More on app bars
 , and
 tabs
 Tabs organize content across different screens and views.
 More on tabs
 . When a badge is used to indicate an unread notification, the badge gets hidden once it's selected. pause Visual indicators Badges use a color intended to stand out against labels, icons, and navigation elements. Use the default color mapping to avoid color conflict issues. check Do Badges must use default color with at least 3:1 contrast close Don’t Avoid using custom color roles for the badge container and label text. If custom roles are necessary, make sure they have contrast of at least 3:1. Labeling elements The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 label for a badge item will be read after its navigation destination. Any numerical badges will have their number read, while non-counting badges will simply announce New notification . Numerical badges will have their number read Non-counting badges will simply announce New notification

## Specs (full text)

Badge – Material Design 3
 Tokens & specs Color Measurements Configuration Navigation bar Small badge Large badge container Large badge label Large badge maximum character count container Large badge maximum character count label Navigation rail Small badge Large badge container Large badge label Large badge maximum character count container Large badge maximum character count label Tokens & specs Browse the component elements, attributes, tokens, and their values. Badges arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down Close Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Badge color roles used for light and dark schemes in navigation bar: Error Error On error On error Error Badge color roles used for light and dark schemes in navigation rail: Error On error Error On error Error Measurements Badge padding and size measurements Attribute Value Small badge shape 3dp corner radius Small badge size (HxW) 6dp Large badge shape 8dp corner radius Large badge one digit size (HxW) 16dp Large badge max character count size (HxW) 16x34dp Small badge: distance from top trailing icon corner to bottom leading badge corner (HxW) 6x6dp Large badge: distance from top trailing icon corner to bottom leading badge corner (HxW) 14x12dp Large badge padding between badge and text container 4dp Configuration Different badges are shown on navigation destinations in various
 states.
 States show the interaction status of a component or UI element.
 More on states
 Inactive with label - small badge Inactive with label - large badge Inactive with label - large badge max character count Inactive - small badge Inactive - large badge Inactive - large badge max character count Active with label - small badge Active with label - large badge Active with label - large badge max character count Active nav bar no label - small badge Active nav bar no label - large badge Active nav bar no label - large badge max character count Active nav rail no label - small badge Active nav rail no label - large badge Active nav rail no label - large badge max character count

## Guidelines (full text)

Badge – Material Design 3
 Usage Anatomy Container Placement Large badges and a small badge in a navigation bar Usage Badges are used to indicate a notification, item count, or other information relating to a navigation destination. They are placed on the ending edge of icons, typically within other components. There are two variants: Small badge Large badge Navigation bar with four badges A small badge is a simple circle, used to indicate an unread notification.   A large badge contains label text communicating item count information. Small badge Large badge With other components Badges are most commonly used within other components, such as
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 ,
 navigation rail
 Navigation rails let people switch between UI views on mid-sized devices.
 More on navigation rails
 ,
 app bars
 App bars display navigation, actions, and text at the top of a screen.
 More on app bars
 , and
 tabs
 Tabs organize content across different screens and views.
 More on tabs
 . In navigation bars, hide the badge once the destination has been selected Anatomy Small badge Large badge container Large badge label Container There are two container options for the badge:
 Small badge
 Small badges are a simple circle used to indicate an unread notification.
 with no text
 Large badge
 Large badges contain label text communicating item count information.
 with text A small badge uses only shape to indicate a status change or new notification A large badge displays a number within a container to indicate a quantifiable status change related to a destination Badge containers are anchored inside the icon bounding box. As the number count increases for
 large badges
 Large badges contain label text communicating item count information.
 , their width expands, but keeps the same placement. Badges use a color intended to stand out against labels, icons, and navigation elements. Use the default color mapping to avoid color conflict issues. check Do Change the position of the badge for right-to-left languages close Don’t Badges have fixed positions. Don’t change the position of the badge arbitrarily or place the badge over the icon. check Do Use the default badge color close Don’t Avoid using custom color roles for the badge container and label text. If custom roles are necessary, make sure they have contrast of at least 3:1. Label text Label
 large badges
 Large badges contain label text communicating item count information.
 with counts or a status. The maximum number of characters within large badge label text is four, including a + to indicate more. Large badges with one to four characters Use the recommended maximum character count to ensure labels don’t extend beyond the badge container. check Do Truncate badge labels as needed close Don’t Don’t let the badge get cut off or collide with another element Placement check Do Use a large badge to show count information when visual collisions aren’t an issue, such as in a navigation rail exclamation Caution Use a small badge when spaces are tightly constrained, such as app bars. Small badges won’t run into the edge of the screen. check Do When an icon with a badge is followed by text or another element, place a large badge at the trailing edge close Don’t Avoid using a large badge when it might overlap with a trailing element. Either place it at the trailing edge or use a small badge instead.

## [overview] illustrations

- `1e7a53355cf689a7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8hopxl-01.
- `4f6efdebc4a86c30.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8hz0r2-02.
- `853f0f2e38ba6372.png` ← https://lh3.googleusercontent.com/jTOaIAaN8d0Hwa7vnfG1biZu2gTDNbwTTihNDf3O5_Bxq_CfF11D5UV1LHvPLTVcJyuXyvixK-4f

## [specs] illustrations

- `1f905854b677e437.png` ← https://lh3.googleusercontent.com/1c2wjkW2_C9l1HmNkRT8GpeQ7WqSDcJdMKdNym4xk_wPBfFSgVP3NhSXBwBV52vI3L-Z7CAmnY7c
- `3d667d50341c3e27.png` ← https://lh3.googleusercontent.com/8-bcqHO-CggN9L5OTiWVxPDT-wPzcurO0xXI7dZeo5htfXRjDwMnoMl_Qco9Z8NGG9CE2_5qrO2Q
- `9e46a45f50b13fa4.png` ← https://lh3.googleusercontent.com/9yjKmecr7ZJh2Tm71DBDcwftLy2cMEpCW2yl73CCr7kUctUtmKaW78yFdO-0ZUSBXShJh9CDLZtQ
- `1343a97f430a1ce6.png` ← https://lh3.googleusercontent.com/GXqQAaWohBPLwvJAZUGaxFwy8CI_R4BLcAXPDq-e4P67CObmbEHL-GzwJbo6hBOmuqFuoV8QrPMX
- `2b59b28e98ecbe70.png` ← https://lh3.googleusercontent.com/_9tsQOYHX4YH6bQJJwi1ylkI-nu2RJBNb84ivjXE8ksTqqpuE4w-riSO17Sh2gclSOMxjzlDHS_B
- `f31b7bc385bbda36.png` ← https://lh3.googleusercontent.com/dmnjAmE1Ol38Ijd8REgLVSvLNv733cEX_WngU88yFKfiKjSdwanYmhHnCGueyMQAzJRxRMrvdgtC
- `853f0f2e38ba6372.png` ← https://lh3.googleusercontent.com/jTOaIAaN8d0Hwa7vnfG1biZu2gTDNbwTTihNDf3O5_Bxq_CfF11D5UV1LHvPLTVcJyuXyvixK-4f

## [guidelines] illustrations

- `09ddd9962836adbd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvm8dp3k-5.p
- `7e7c44e6fd5b5093.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvm8fkil-7.p
- `fb78aa79fa6553e4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8jybps-08.
- `ce44129371ffb6e0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8k2962-9-d
- `d5119ff126bbd419.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8k2vet-10-
- `1e98bae15fea98a9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8ks60f-13.
- `003f61d77cbf397a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8kxkle-17_
- `b2e9e9f615f74d76.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8kyp7i-18_
- `7867fe6aa17e8561.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8kzbcm-19_
- `16c6bcb3ddd87478.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0wmkr4-01.
- `f9be96926c601dc7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0wmphl-02.
- `844414f88721dc49.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0womos-07.
- `375245d5d860ea14.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0wr0gz-11_
- `bd3be274cdb8e9ee.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0wr4mw-12_
- `2d327aa1001b99db.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0wrqi2-14_
- `ba4a0ad107742da2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0wru4w-15_
- `840c10db1b569528.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0wsl1o-16_
- `34606de4ec5d6506.png` ← https://lh3.googleusercontent.com/UiES3FVbu4QTgh3y8L-WfQz6q2u2ao86ZpjIGDu6CxAIgDLxmu7zM-RC33uLQPuDaUJtgI1qqck8
- `2461521522d76427.png` ← https://lh3.googleusercontent.com/Xnibw8kAnTzaV0TmLVU5oOfL5xZTO6E8gxqFFo843YlClRZ3TI3eTR7cGtDL76c7_3oQ6xVKU3l7
- `853f0f2e38ba6372.png` ← https://lh3.googleusercontent.com/jTOaIAaN8d0Hwa7vnfG1biZu2gTDNbwTTihNDf3O5_Bxq_CfF11D5UV1LHvPLTVcJyuXyvixK-4f

## [accessibility] illustrations

- `d790c06d3e8e1334.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp03lg1-GM3
- `ea386ff40949d72a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8l8lhl-04.
- `7a90784dff64504a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fme8l9na6-05.
- `d1868a9bae7722a9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0x2h51-02_
- `95ec0bb2effa5aed.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmg0x2kti-03_
- `853f0f2e38ba6372.png` ← https://lh3.googleusercontent.com/jTOaIAaN8d0Hwa7vnfG1biZu2gTDNbwTTihNDf3O5_Bxq_CfF11D5UV1LHvPLTVcJyuXyvixK-4f

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp03lg1-GM3-Components-Badges-A`
