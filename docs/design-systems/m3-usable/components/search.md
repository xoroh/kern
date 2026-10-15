# M3 component: search

_Archive: `m3-archive/spec/components/search/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/search/…_

## Overview (full text)

Search – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 to M3 baseline Use search for navigating a product with queries A search bar can include a leading search icon, hinted search text, and optional trailing icons Search can display suggested keywords or phrases as a person types A search bar displays search suggestions or results in a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 Use a search
 app bar
 App bars contain page navigation and information at the top of a screen.
 More on app bars
 to provide an emphasized, global entry-point pause When inputting text, search suggestions or results appear below the search bar Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Unavailable
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available language Web Unavailable language Web: Expressive Unavailable Close M3 Expressive update Search has a new visual style, motion, and more flexibility for trailing icons. More on M3 Expressive February 2025   Naming Search bar and search view are now collectively named search Configurations Styles: Search can be contained (recommended) or divided Gaps can separate results into groups Motion The search bar grows wider when focused Supported platforms: Jetpack Compose pause The contained search style features a persistent, filled search container Differences from M2 to M3 baseline Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Elevation: Lower elevation and no shadow by default Name: Search was formerly known as open search bar Variants: Two official variants of search components: search bar and search view M2 open search bars were square and elevated M3 search bars are rounded, use tonal surface, and support dynamic color

## Key measurements (dp, extracted)

- he search bar expands when focused. The margins change from 24dp to 12dp. Unfocused search bar margin me
- n measurements Element Attribute Value Container Width Min: 360dp, max: 720dp Height 56dp Label alignment
- Start-aligned Leading padding Unfocused: 24dp, focused: 12dp Trailing padding Unfocus
- ed: 24dp, focused: 12dp Leading icon and label p
- adding (from tap target) 4dp Label and trailing icon padding (from t
- ap target) 4dp Avatar Size 30dp Focused search Contain
- h Full width Height Full height Docked container Width Min: 360dp, max: 720dp Height Min: 240dp, max: 2/3
- of screen height Search bar container Height 56dp Label alignment Start-aligned Leading p
- adding 16dp Trailing padding 16dp Leading icon and
- label padding (from tap target) 4dp Leading icon and label padding (from ta
- p target) 4dp Divided style Full-screen search paddin
- ner behavior. The container’s margins should be: Unfocused: 24dp Focused: 12dp In the divided (baseline)
- Window widths from 600dp to 839dp, such as a tablet or foldable
- Window widths 840dp to 1199dp, such as a tablet or foldable
- Window widths smaller than 600dp, such as a phone in portrait orientatio

## Accessibility (full text)

Search – Material Design 3
 Use cases Interaction & style Initial focus Keyboard navigation Labeling elements Use cases People should be able to use assistive technology to: Navigate to and focus on a search bar View the hinted search text or persistent label Input text and complete a search Interact with a list of search suggestions and results Clear the input text Interaction & style Autosuggest When search suggestions and results appear, the screen reader must announce the change. This lets people know list items are available for selection. Autocomplete results should be announced by the screen reader Initial focus Initial
 focus
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 lands on the first interactive element. This is often a leading
 icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 or
 text field
 Text fields let users enter text into a UI.
 More on text fields
 . A leading icon button usually activates search directly or opens a navigation component. Initial focus can land on a leading icon If there’s no leading icon, focus lands on the text field Keyboard navigation Keys Actions Tab or Shift + Tab Navigate between interactive elements Space or Enter Activate the search text field for input Arrows Navigate between search result items Labeling elements The hinted search text should be used as the accessibility label describing the search bar.   The role for the input field should be: Android: Text field iOS: Search field The accessibility label should match the hinted search text Leading and trailing icon buttons should be labeled according to their accessibility guidance . Use icon labels for icon buttons Search suggestions and results use the list component. Screen readers automatically announce the results as a list. For accessibility labels, follow the list accessibility guidelines . Search suggestions and results are created using lists

## Specs (full text)

Search – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color States Measurements Variants pause When a person executes a search , results appear in a list below the search bar Variant M3 M3 Expressive Search Available Available Configurations Style Search comes in two styles: Contained: Has an
 expressive
 M3 Expressive is a major update to Material 3, adding visually stunning features, components, and variants, plus updates to the shape, motion, and typography systems.
 More on M3 expressive
 look and feel. It uses a filled container to separate a search bar from a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 of suggestions or results Divided (
 baseline
 Baseline variants and styles are the original M3 component designs. They may not have the latest features introduced in M3 Expressive, like updated motion, shapes, type, and styles.
 ): Doesn’t have the latest visual style, motion, or flexibility The contained style has a persistent, filled container, expressive motion, and rounded shape The divided (baseline) style uses a divider to separate the search bar from suggestions and results Layout Search suggestions and results appear in customizable lists, with two layout options: full-screen and docked. More on search layouts Full-screen layout in the contained style Docked layout in the contained style Full-screen layout in the divided style Docked layout in the divided style Category Configuration M3 M3 Expressive Style Contained -- Available Divided Available Not recommended. Use contained. Layout Docked, full-screen Available Available Tokens & specs Use the table's menu to select a token set. The search bar set only contains tokens for the unfocused search bar. The search view set contains all other tokens when interacting with search, including all styles and layouts. Learn more about design tokens Search - View arrow_drop_down search expand_all Default, Android, Light arrow_drop_down #6750A4 Search view container surface tint layer color folder Color keyboard_arrow_down folder Layout and Text keyboard_arrow_down Close Anatomy Search includes a search bar and a container for suggestions and results. The container is empty by default. Use the
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 component to add content. In the divided (baseline) style, a divider separates the search bar and results. Search bar container Leading icon Supporting text Trailing icon and avatar (optional) Input text Container for search suggestions or results Examples With avatar With one trailing
 icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 With two trailing icon buttons With trailing icon button and avatar Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. Full-screen layout Full-screen search color roles used in light and dark themes: Surface container low On surface variant On surface variant Surface container high On surface variant On surface Docked layout Docked search color roles used in light and dark themes: Surface container high On surface variant On surface variant Surface container high On surface variant On surface States States are visual representations used to communicate the status of a component or an interactive element. In focused search , individual elements maintain their own interaction states. Learn more about interaction states Search bar Enabled Hovered Focused Pressed (ripple) Search suggestions & results Search includes a container for suggestions and results. The container is empty by default. Use the list component to add content. Enabled Hovered Focused Pressed (ripple) Measurements Search bar Unfocused search bar with leading and trailing icon measurements Unfocused search bar with avatar measurements In M3 Expressive, the search bar expands when focused. The margins change from 24dp to 12dp. Unfocused search bar margin measurements Focused search bar margin measurements Element Attribute Value Container Width Min: 360dp, max: 720dp Height 56dp Label alignment Start-aligned Leading padding Unfocused: 24dp, focused: 12dp Trailing padding Unfocused: 24dp, focused: 12dp Leading icon and label padding (from tap target) 4dp Label and trailing icon padding (from tap target) 4dp Avatar Size 30dp Focused search Contained style Full-screen search padding and size measurements for contained style Docked search padding and size measurements for contained style Element Attribute Value Full-screen container Width Full width Height Full height Docked container Width Min: 360dp, max: 720dp Height Min: 240dp, max: 2/3 of screen height Search bar container Height 56dp Label alignment Start-aligned Leading padding 16dp Trailing padding 16dp Leading icon and label padding (from tap target) 4dp Leading icon and label padding (from tap target) 4dp Divided style Full-screen search padding and size measurements for divided style Docked search padding and size measurements for divided style

## Guidelines (full text)

Search – Material Design 3
 Usage Placement Anatomy Adaptive design Behavior pause When focused, a search bar can show a list of search suggestions. As text is entered, search results appear. Usage Search helps people find information quickly. Use search for products with many items to manage, such as files or messages. Search helps people find information in large inboxes like messages or emails Different ways to search The search entry point is dependent on a product’s needs, and should be easy to find:
 Search bar
 The search bar is a persistent and prominent search field at the top of the screen.
 : Use to search contents in a specific view, like Search your messages
 Search app bar
 Search app bars provide an emphasized entry-point to open search.
 More on search app bars
 : Use this
 app bar
 App bars contain page navigation and information at the top of a screen.
 More on app bars
 variant when search is the primary, global function Search
 icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 : Use when search is a secondary action or not the main focus Add a search bar below a title to search specific content For global search, use a persistent search app bar , integrated into an app bar Use a search icon button when search is a secondary action Focused search When a search entry point is selected, it opens
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 search.   Search suggestions can appear before text is entered Search results can show as someone is typing or after a search is executed Individual elements maintain their own interaction
 states
 States show the interaction status of a component or UI element.
 More on states
 when search is focused More on search states When focused, a search bar expands to show search suggestions or results in a list If search is the primary action, focused search can be a standalone destination reached from a
 navigation bar
 Navigation bars let people switch between UI views on smaller devices.
 More on navigation bars
 . Focused search can be a standalone destination, reached by selecting an item in a navigation bar Search suggestions & results Search suggestions and results both appear in a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 component by default. To help people find information quickly, consider adding variety and context, such as: Leading icons related to suggestions Category labels, like Recent , Contacts , or Suggestions Avatars or other high-priority items Filter chips to narrow down results Include high-priority items like avatars in search suggestions or results Gaps Use gaps to separate a list of suggestions or results into groups. More on using gaps in lists To separate list items into distinct groups, use a gap Placement A search bar is typically placed at the top of a screen to remain prominent and accessible. Its location depends on whether search is the primary focus of a product or a secondary action. A search bar can be the primary focus of a page Search bars should usually be placed at the top of the content Search can be a secondary action Focused search layouts When focused, search suggestions and results appear in a list below the search bar.   There are two layout options: Docked opens a list below the search bar, with a scrim covering main content Full-screen expands to fill the screen More on adaptive design Docked layout on a tablet Full-screen layout on mobile Anatomy Search bar container Leading icon Supporting text Avatar or trailing icon (optional) Input text Container for search suggestions or results Search bar container In the contained style, the search bar container remains the same shape in both the unfocused and focused states. Avoid changing the container behavior. The container’s margins should be: Unfocused: 24dp Focused: 12dp In the divided (baseline) style, a divider separates the search bar and results. Search bar containers have persistent, rounded corners Container color Search bars use the surface container high
 color role
 Material has 26 standard color roles organized into six groups: primary, secondary, tertiary, error, surface, and outline.
 More on color roles
 . This role applies when the screen background is white or a tonal surface color, ensuring the container has clear contrast. Search bars use surface container high to provide clear contrast Avoid using a surface container high color on a surface container background. This can cause the search bar to blend in, making it difficult for people to find. To ensure proper contrast, use surface container roles that are more than one step apart. exclamation Caution Using a surface container high color on a surface container background reduces contrast and may affect accessibility Icons & icon buttons Leading icons The leading side of a search bar should include either: A navigational icon button, such as a menu or arrow A non-functional search icon A search bar can contain a non-functional search icon Trailing icons A search bar should have one or two trailing icons or icon buttons. Trailing actions can include: Additional modes of searching like voice search A separate high-level action such as current location or profile An overflow menu A decorative search icon Use a maximum of two trailing icons Combine an avatar with up to one other trailing icon button Focused search can show an optional clear icon to remove input text Text Hinted search text Provide a short description of the information people can search, like Search replies or Search your messages . Input text When a person starts typing, the hinted text is replaced with the input text. pause Hinted search text is replaced when a search query is entered Adaptive design The search bar position and alignment should scale with the layout, and stay close to the searchable content. In most cases, a search bar should: Stay in its pane and scale in width accordingly Internal elements anchor to the left and right as the parent container scales More on applying layout pause Keep the search bar close to the content a person can search Focused search When focused, search can switch between showing suggestions or results in a: Docked layout : Best for
 medium
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 and
 expanded
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 windows Full-screen layout : Default for
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 More on search layouts   A docked layout on a large screen A full-screen layout, the default for compact screens Search suggestions or results should swap from full-screen in compact windows to docked in larger
 breakpoints
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 .   pause Search suggestions and results should adapt to fit different window sizes Behavior Focused search When a search bar is selected, search becomes focused and can: Show historical suggestions before typing Show suggestions or results as someone is typing Wait to show suggestions or results until a search is queried  The back icon releases focus, dismisses any suggestions or results, and returns the search bar to its original state. pause When focused, a list of search suggestions can appear pause Focus is released when the back icon is selected Scroll Depending on needs, a search bar can: Scroll away with content, then reappear when a person begins scrolling up Remain fixed at the top of the screen pause A search bar can scroll up with content, then reappear when a person scrolls down Search results To execute a search, a person can: Type a query and press Enter Select a suggestion or result without querying a search Search results appear in a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 below the bar, and scroll beneath the bar.    For accessibility, focused search needs a clear status indicator that it’s searching content, like a search icon or Results label. More on search accessibility Show search results in a compact, organized list, with an indicator like Quick results When search results are queried, the input text should remain visible, but not in focus. pause Search suggestions and results display in a list, and the input text remains visible Predictive back On Android, predictive back allows a person to swipe left or right on search. Search detaches from the screen edge to signal the full-screen layout will minimize The previous screen is revealed in a preview More predictive back design guidance pause The search surface and content scale back in the direction of the gesture

## [overview] illustrations

- `11d3cf5897317a11.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlb0x4f4-GM3
- `3e0f3981141a4808.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlb19j2i-GM3
- `ce188f98257468a5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlb1gn7s-04.
- `1f78fdbabd4cdfd5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlb1hcrs-05.
- `d07d3a2c064229b0.png` ← https://lh3.googleusercontent.com/7EJCMuog77nY8-ki87RYJLmAIM742wl7oexjfN0SnDatOv9SG_LRPxt4A0fwtiLaTYED_9bIaSWU

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlb0x4f4-GM3%20-%20Search%20Bar%`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlb19j2i-GM3%20-%20Search%20Bar%`

## [specs] illustrations

- `0202b274984af2fd.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmm28azl5-GM3%20-%20Search%2
- `650400bf255d354e.png` ← https://lh3.googleusercontent.com/4DOSj_PCy0dVTh_Mwwa-JmNfmmABObXarzG6mlKcjL7V1kdeh9_yrI9kQM5t1UhpsVOtc4bIq7mU
- `fe4b3ecfd9e162d9.png` ← https://lh3.googleusercontent.com/4FjOzW97D9JP3Mvu2GyfQ-PQhbAvpQRPjPjsqj3iM_125CTJgfv8X_u-qeSu4ti3i7ytSIZf4Crk
- `8c74694070292dea.png` ← https://lh3.googleusercontent.com/52yDW7vsdT_ythER_zFPD7eAyH2K5BvU_V9fB4COC5khSNA81CffErRCuS1kxNZkIfPYCWceEYxr
- `4a39edac5ffc17b1.png` ← https://lh3.googleusercontent.com/5Hst6KPsjyxhxQTptCBbkRahderHldeKa_33ucNVW9xZ9svHkx9eBhbhDKYR656D5DkvhdfdMIPh
- `d07d3a2c064229b0.png` ← https://lh3.googleusercontent.com/7EJCMuog77nY8-ki87RYJLmAIM742wl7oexjfN0SnDatOv9SG_LRPxt4A0fwtiLaTYED_9bIaSWU
- `c653ababa3734d64.png` ← https://lh3.googleusercontent.com/GAGCWflTpnmoM0DwwKy1v0DdcEY5uW2zCwZpY8CaR61iuDKk3E7JY7yVPwx3ukkfq4B7qyOQOLIn
- `88bb7c4cabe250f5.png` ← https://lh3.googleusercontent.com/OfNDMCVyfuBJXmI9HLNp26jlV-aQMKAawCfhfzbzlt-wYn0lR4BxkbXOVbiEP6I2tgz0HFbjC2SY
- `9be9223928ae61b9.png` ← https://lh3.googleusercontent.com/R4k1-IGNQH3zamzgc2laHGU70E3SDajTXtksf4eWJIQO7gmrwoj9PCGHzqhrOju-IKtpdeoOCRi7
- `55efce2ad2fa5efa.png` ← https://lh3.googleusercontent.com/RhpQaBUaokljf6Qv0Pb6sUHofotzoGbLGs7O74snG2B9yjauRk1iv6JFhmSRsHNdUu3nacOIuEmi
- `66bd54d80d2d7aaf.png` ← https://lh3.googleusercontent.com/SlF8qBuCFFB-x7eQOBSJ6O2BgEmepkVWMQvU1b0gtBUdISdyG2QJbz0MeS6HPrO49nL_AZQaOil5
- `de8cf0602a41f631.png` ← https://lh3.googleusercontent.com/UN8OMCnrmxaASc6CRHtAONOcdeZf71JD03xLHV9sDt8-A6pMWEWH2DxRbjhxM7M8_IE2H7_w8mtd
- `d7b2e2ced3dd3619.png` ← https://lh3.googleusercontent.com/YhREfAtX7rK4eHN7NEAdJA3S1VPgesRkPzepAVAMJWT7aA0MSV9dxw8A248GG0PwSTS8FjyLqzor
- `476a2f4872a3c181.png` ← https://lh3.googleusercontent.com/b0xykJB3s1NEcZz6gQP37YfP-r6S3fbfqNKJaY-XbWy2AyoWViOPlmHhW6Lq6b4IbhmcDYAQJHon
- `2e09f2f9f8b5af34.png` ← https://lh3.googleusercontent.com/dURHAt9JC2YGWnXNGRK34cv-wK4xrn9GhPUNnWdQ3ZcgzjMRuwGi5KNwpFaWn19j7Nls-mp9PTDF
- `de4867a159985af8.png` ← https://lh3.googleusercontent.com/mGptx_4JUwLVcbHz93O72eFnZN6uaFTxfpTyUe7VfjOxvJQn0kew6pVVDeiAeV4S5rWjZ0xQR-Rs
- `f92535d4b2c62851.png` ← https://lh3.googleusercontent.com/mZviJwGIZh_IpUNqJc4qSUDOLFrmDTpbjX_bufkF90qso_IE6fyfgB1e2VmG5N_E6Picjiw05l7v
- `3b41050e3292ea95.png` ← https://lh3.googleusercontent.com/nfgJlo7RsO4mElkJBSEo5E2yo1OPaLlu6o9PxA4lLhre5XuuiXAOj1LsjVPDk01MysoC5dasvtMX
- `8b35036d7f0e89ce.png` ← https://lh3.googleusercontent.com/nq53ckQlKsYuKPXvcEYzyrhQ7Fevp-zkK7TzePU0X7GjTIveyJLPIHzZrZ3ejyWOGKASNBS7Ir8_
- `6e11eda9aff383e0.png` ← https://lh3.googleusercontent.com/r1ddmkgjt_KkZZC-S8XGOaYfxyTvkqH_xLNf6MgWq89lOToWeBm5mEo8Kz2QhMxh3H_FOF_Ejatn
- `b0ce86bc16a3369e.png` ← https://lh3.googleusercontent.com/sA1JTXVXpg8LWSsXFxuxTShN08cJnxWigVkMDRzrHVQT6XnlvmPuvbVrmmeMZ7ZgDpNyRgv6T-zO
- `8889eaf143cdcd45.png` ← https://lh3.googleusercontent.com/xcvU3lGYJQELKKllc3w1uW68diJE9YJPeiCtbZM8tC9Gzg0qg5TBBzjEiFkl8hYOWcik2XUQfgqp

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmm28azl5-GM3%20-%20Search%20Bar%20-%20Specs%200`

## [guidelines] illustrations

- `65e0cc93e99675e5.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfkefwf-GM3
- `3d5479d1fbd6253d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfkhcoi-02.
- `c9b3ff7a0ed9b8fe.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfkodgz-03.
- `1ea3f90b9516ad73.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfkpcee-04.
- `4655c87ae314735a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfkq5y2-05.
- `633554fd28ead7cd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfkth1m-07.
- `db14ee2ee08acc9c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfkz1fo-06.
- `fe4c7d7fa6b678ec.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlflqra9-09.
- `05dbd48ae4818552.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfm1yld-10.
- `3d7e779d62137cec.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfmbc2s-21.
- `36a822d4a1d45c1e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfmc255-22.
- `562cfe29a73bc2f5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfmcmiv-23.
- `766bb5fbdfd5801d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfmf49n-08.
- `27ea97db6cb1f83b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfmg7bg-07.
- `244a5000a64540b0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfmu14l-13.
- `fd9aac045585ff31.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfmvyj4-14.
- `315acffa27b835bb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfn371r-15.
- `0d0aae9127a68b4c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfn8hr6-16.
- `e586e1b66a9780b3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfnb1td-17.
- `e2a9cc376ccd8713.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfncrm8-18.
- `828d1e97d70a0e51.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfndiyw-19-
- `e341ea01e619e509.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfngra0-GM3
- `d56a5f12b3aeb3a8.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfnplfk-GM3
- `9657e01801e5f277.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfnv4wh-25.
- `165b37b7c7b62769.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfo0cyf-GM3

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfkefwf-GM3%20-%20Search%20Bar%`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfngra0-GM3%20-%20Search%20Bar%`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfnplfk-GM3%20-%20Search%20Bar%`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlfo0cyf-GM3%20-%20Search%20Bar%`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgr7r58-GM3%20-%20Search%20Bar%`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgr95m2-GM3%20-%20Search%20Bar%`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgrahif-GM3%20-%20Search%20Bar%`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgrdhl9-GM3%20-%20Search%20Bar%`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgrejsr-GM3%20-%20Search%20Bar%`

## [accessibility] illustrations

- `ec8d814fd52a41b8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgrjdxa-01.
- `34578e8df535f593.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgrkpb6-02.
- `b66cd640b54647d0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgrl9ca-03.
- `52e6dfdd8888be56.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgrql4p-04.
- `abcf86d8a0f90370.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgrt6xt-05.
- `6b0e3eb24eec63f0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlgrwf25-06.
- `d07d3a2c064229b0.png` ← https://lh3.googleusercontent.com/7EJCMuog77nY8-ki87RYJLmAIM742wl7oexjfN0SnDatOv9SG_LRPxt4A0fwtiLaTYED_9bIaSWU
