# M3 component: app-bars

_Archive: `m3-archive/spec/components/app-bars/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/app-bars/…_

## Overview (full text)

Top app bar – Material Design 3
 Availability & resources M3 Expressive update Differences from M2 Focus on describing the current page and provide 1–2 essential actions Displays labels and page navigation controls at the top of the page. (Use a
 toolbar
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 to display page actions) Four variants: Search app bar, small, medium flexible, large flexible On scroll, apply a fill color to separate from body content Can animate on and off screen with another bar of controls, like a row of
 chips
 Chips help people enter information, make selections, filter content, or trigger actions.
 More on chips
 Search app bar Small Medium flexible Large flexible Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Jetpack Compose: Expressive Available android Android Views (MDC-Android) Available android Android Views (MDC-Android): Expressive Available language Web Unavailable language Web: Expressive Unavailable Close M3 Expressive update May 2025 The new search app bar supports icons inside and outside the search bar, and centered text. It opens the search view component when selected. The new medium flexible and large flexible app bars come with significant improvements, and should replace medium and large app bars, which are no longer recommended. The small app bar is updated with the same flexible improvements. More on M3 Expressive Variants and naming: Renamed component from top app bar to app bar Added search app bar Medium and large app bars are no longer recommended Added medium flexible and large flexible app bars with: Reduced overall height Larger title text Subtitle Left- and center-aligned text options Text wrapping More flexible elements for imagery and filled buttons Added features to small app bar: Subtitle Center-aligned text option More flexible elements for imagery and filled buttons Search app bar Small Medium flexible Large flexible Differences from M2 Color: New color mappings and compatibility with dynamic color On scroll: No drop shadow, instead a color fill creates separation from content Typography: Larger default text Layout: Smaller default height M2: Elevation and a drop shadow raise the top app bar when content is present underneath M3: On scroll, a color fill overlay separates the app bar from the content beneath

## Key measurements (dp, extracted)

- s App bar - Size - Medium (baseline) arrow_drop_down search 112dp App bar medium container height Aa Head
- line Small 24dp App bar medium icon button size Aa Labe
- ween leading and trailing app bar elements until it reaches 312dp. Then, it should only grow further to f

## Accessibility (full text)

Top app bar – Material Design 3
 Use cases Interaction & style Color Keyboard navigation Labeling elements Use cases People should be able to do the following using assistive technology: Understand what page they’re currently visiting Take actions or navigate to a new page destination Maintain access to app bar actions when the content is scrolled Interaction & style Touch When tapping on an icon button, a touch ripple appears, indicating interaction feedback. pause Touch: Tap Cursor When hovered, the hover state provides a visual cue to the user that the element is interactive. When clicked (in both active and inactive states), a ripple appears to indicate feedback. pause Cursor: Hover, Click Keyboard or switch When navigating to an interactive element, a focus indicator appears to show that action can be taken. When the element is selected, an action is then performed. pause Interactive elements should have focus rings Initial focus Focus should initially land on the leading button, since it’s the first interactive element of the app bar. Use Tabs to navigate through interactive items Use Space or Enter to activate actions Color On search app bars, use the default color roles when possible. Search container: surface container Search label: on surface variant On darker backgrounds, search bar containers can use the surface bright role to maintain strong visual contrast. If mapping to other color roles, make sure the text and container have 3:1 contrast to ensure readability. check Do Make sure search bars and their labels have at least 3:1 contrast. Use the default colors when possible. close Don’t Avoid using custom color roles for the search bar container and search label text. If custom roles are necessary, make sure they have contrast of at least 3:1. Keyboard navigation Keys Actions Tab Move focus to the next interactive element Space or Enter Activate the focused element Labeling elements The accessibility label for a title should be the same as the content within the title. If needed, add additional context to the accessibility label to ensure users understand what page they’re on or what content is being shown. Screen readers will read the UI text followed by the component’s role. An app bar’s accessibility label can incorporate its UI text as well as additional context Label icon buttons according to their accessibility guidelines . An icon button should be clearly labeled on the action it takes, like View on map

## Specs (full text)

Top app bar – Material Design 3
 Variants Configurations Tokens & specs Anatomy Color Measurements Baseline app bars Variants Search app bar Small Medium flexible Large flexible Baseline variants The baseline M3 medium and large app bars are no longer recommended in M3 Expressive, and should be replaced with medium flexible and large flexible app bars, which are similar visually, but have multi-line support, a shorter height, and can contain a wide variety of elements, like images. Jump to baseline app bar specs Baseline variants Medium Large Variant M3 M3 Expressive Search app bar -- Available Small Available Available Center-aligned Available Merged into small . Use centered-text configuration. Medium (baseline) Available Not recommended. Use medium flexible Medium flexible -- Available Large (baseline) Available Not recommended. Use large flexible Large flexible -- Available Configurations Text alignment Text labels, including supporting text, can be aligned to the leading edge or centered Category Configuration M3 M3 Expressive Text alignment Leading edge (default) Available Available Centered -- Available Tokens & specs Select a token set to view in the table's menu. App bar token sets are organized into a common token set, and size-specific tokens. Learn about design tokens App bar - Common arrow_drop_down search expand_all folder Color keyboard_arrow_down folder Spacing keyboard_arrow_down folder Shape keyboard_arrow_down folder Size keyboard_arrow_down Close Search component tokens & specs The default
 Search lets people enter a keyword or phrase to get relevant information.
 More on search
 component tokens are used in the search app bar. Search - View arrow_drop_down search expand_all Default, Light arrow_drop_down #6750A4 Search view container surface tint layer color folder Color keyboard_arrow_down folder Layout and Text keyboard_arrow_down Close Anatomy Container Leading button Trailing elements Headline Subtitle App bars can be customized to include: An image or logo A subtitle A filled icon button Avoid customizing the size of the heading and subtitle, or adding too many actions. The app bar can have different layouts depending on which elements are shown Search The search app bar can include trailing actions inside and outside the search bar. When the search bar is selected, it should open the
 search view
 The search view is a full-screen modal often used to display a list of search results. It can also be opened by selecting a search icon.
 More on search view
 component. Container Leading icon button Hinted search text Trailing icon or avatar Search container A leading element and a trailing element outside search A leading element, a trailing element inside search, and a trailing element outside search A leading element and two trailing elements outside search Image An image can be placed in the app bar. In small app bars, this can replace the label text. Images can be added to app bars and can replace label text on small app bars Filled trailing icon button The app bar's trailing icon buttons can be replaced with a single, primary, or tonal filled icon button in default or wide sizes. The trailing icons can be configured to be a single filled icon button Subtitle The medium flexible and large flexible app bars hug the text contents, so they are taller when a subtitle is visible Small Small with subtitle Medium flexible Medium flexible with subtitle Large flexible Large flexible with subtitle Color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens All app bars share the same color roles. On scroll, the container changes color to surface container . App bar color roles used for light and dark themes: Surface On surface On surface variant On surface On surface variant Surface container (on scroll) Search app bar color roles used for light and dark themes: Surface On surface variant On surface variant On surface variant Surface container Surface container Surface container highest Scroll states The app bar changes color when flat or on scroll. The search bar can also change color on scroll. Flat On scroll Measurements Search app bar Search app bar padding and size measurements Small app bar Small app bar padding and size measurements Medium flexible app bar Medium flexible app bar padding and size measurements Large flexible app bar Large flexible app bar padding and size measurements Baseline app bars The medium and large app bars are no longer recommended in M3 Expressive. Use the medium flexible and large flexible app bars in their place. Medium and large app bars have the same elements: Container Leading button Trailing icons Headline Tokens & specs Select a token set to view in the table's menu. Baseline app bar token sets are organized into medium, large, and older baseline token sets. Learn about design tokens App bar - Size - Medium (baseline) arrow_drop_down search 112dp App bar medium container height Aa Headline Small 24dp App bar medium icon button size Aa Label Large Close Color Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. Learn more about design tokens Medium top app bar color roles used for light and dark schemes: Surface On surface On surface On surface variant Measurements Medium app bar Medium app bar padding and size measurements Large app bar Large app bar padding and size measurements

## Guidelines (full text)

Top app bar – Material Design 3
 Usage Search app bar Anatomy Adaptive design Behavior App bars show information about the page, key actions, and navigation actions like Back or Menu Usage Use an app bar to provide content and actions related to the current page, such as page navigation actions, headlines, images, and 1–2 essential actions. The information and actions in the app bar should be contextual and specific to a page, but can also include global product controls, such as search or notifications. App bars provide content and actions related to the current page App bars should only have one action, two if necessary. The primary action should alter or exit the entire page, like Send , Save , or Edit . If the product has many actions, place those in a
 toolbar
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 . Avoid placing an overflow menu in the app bar when possible. App bars can display one high visibility action to boost its prominence To boost visibility of a primary action, change the style of the icon button to filled or tonal, and consider using a wide icon button.   Avoid using multiple filled or tonal buttons. check Do Use a filled or tonal button for important actions close Don’t Don’t put multiple filled or tonal buttons in the app bar The four variants of app bars are: Search app bar Use on home pages when search is key to the product. Small Use in dense layouts or when a page is scrolled. Medium flexible Use to display a larger headline. It can collapse into a small app bar on scroll. Large flexible Use to emphasize the headline of the page. Search app bar Small Medium flexible Large flexible Baseline app bars There are two baseline app bars that are no longer recommended: Medium Replace with medium flexible. Large Replace with large flexible. Medium Large Search app bar Use a search app bar to provide an emphasized entry-point to open the search view. Search app bars have a search field instead of heading text 
 Search bars
 The search bar is a persistent and prominent search field at the top of the screen.
 More on search bars
 should always include the word Search . They can use various capitalization styles depending on the product. Search Searching a specific area Example: Search inbox Search [Product] Example: Search Photos Use proper capitalization depending on what’s being searched Buttons in search app bar In addition to a trailing avatar, search app bars can have up to two trailing icons on mobile. Trailing icons can be placed inside or outside the search bar. Put the most used actions on the left and least used on the right The leading element of a search app bar can be used for a product’s logo to brand the app’s overall experience. This logo can be purely cosmetic, or can trigger an action like returning to the home screen or refreshing it. Avoid using a logo to open an
 expanded navigation rail
 Expanded navigation rails show text labels and an extended FAB, and can be default or modal.
 . The leading element can be a product logo Don’t use more than two trailing icon buttons with an avatar. If more actions are needed, place them in a
 toolbar
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 instead. close Don’t Don’t use three icons and an avatar in a search app bar Large screens The search app bar dynamically adapts to available width. There should be up to four trailing icons on larger screens. Increased horizontal space on larger screens allows for up to four trailing icons. Alternate color options By default, search containers in app bars use the surface container color to distinguish it from the app background. If the background is darker, use a lighter container color on the search bar, like surface bright . When choosing alternate colors, make sure the search text and container have at least 3:1 contrast for readability. Search app bars can use different colors, like surface bright , for improved contrast with surrounding elements Anatomy Container Headline Trailing icons Subtitle Leading button Container The app bar container holds all information and actions at the top of a screen, including navigation icons, headlines, and buttons. Avoid changing the position or shape of the container. check Do Use straight corners for app bars close Don’t Don’t use curved shapes. This implies that the container can expand upon interaction. Always use the default height of the app bar, and make it span the full width of the window. check Do Default heights were chosen to ensure readability of on-screen elements close Don’t Don't make an app bar shorter than its default height Adding logos Image logos can be used in app bars to bolster brand identity or visual appeal. The image should be high quality and pertinent, and shouldn’t disrupt the app bar's functionality. Image logos can replace all text in small app bars, and appear above the text in other app bars Leading button The leading button should be used for navigating the product. It typically is one of the following: A menu icon, which opens a modal
 expanded navigation rail
 Expanded navigation rails show text labels and an extended FAB, and can be default or modal.
 A back arrow, which returns to the previous screen Leading Back button Headline The headline can describe: The current page The current section The product Headline text should be brief enough to easily fit in the app bar. In medium flexible and large flexible app bars, the headline can wrap to a second line. Don’t truncate the headline text. check Do If headline text is long, use a medium flexible or large flexible app bar and wrap the headline to two lines maximum close Don’t Don’t wrap text in a small app bar Headlines can be aligned to the leading edge or centered. The headline’s typography size and style change depending on the app bar variant. Headline typography style for each app bar Search: Body large Small: Title large Medium flexible: Headline medium Large flexible: Display small Subtitle Subtitles can add additional context to a page. These can be leading-aligned or center-aligned with the headline text. Subtitle typography style for each app bar: Small: Label medium Medium flexible: Label large Large flexible: Title medium Trailing icon buttons Up to two icon buttons can be placed after the headline, aligned to the trailing edge of the app bar. Place most-used actions closest to the leading edge. Avoid using these buttons to open a menu with more actions. If more actions are needed, place them in a
 toolbar
 Toolbars display frequently used actions relevant to the current page.
 More on toolbars
 instead. If changing the icon button color style to filled or tonal, only use one icon button. Put the most used actions on the left and least used on the right Use filled icons when possible for the best visibility. Outlined icons can also be used, particularly for unselected toggle
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 . check Do Use filled icons for clear, visible actions exclamation Caution Outlined icons can be used as needed, or when using toggle buttons Adaptive design Adaptive design allows an interface to respond or change based on context, such as the user, device, and usage. More on adaptive design Resizing The width of the app bar container responds to the view or device width. It should always span 100% of the window width. pause The app bar’s container responds to always fill the window width Resizing may cause actions at the trailing edge of the app bar to collapse into an overflow menu at smaller breakpoints. These actions become visible again at larger sizes. pause Actions at the trailing edge collapse into an overflow menu The search container of the search app bar should fill 100% of the space between leading and trailing app bar elements until it reaches 312dp. Then, it should only grow further to fill 50% of that space. pause The search field adapts to the amount of space between other elements in the app bar Presentation The app bar automatically supports right-to-left (RTL) languages by aligning the layout of elements to the leading and trailing edges of the container. This means that in RTL languages, the layout of the app bar is mirrored. The app bar’s layout is mirrored for right-to-left (RTL) languages Behavior Scrolling App bars should initially be the same color as the background, then fill with a contrasting color on scroll to provide visual separation from the background. The app bar can remain on a page at all times, or can hide and reappear when scrolling. pause Upon scrolling, an app bar container fills with contrasting color to create a visual separation To focus more on body content, consider setting the app bar container to be transparent on scroll. This allows the buttons to float above the content. Make sure icon buttons have a container fill. Consider using narrow-width
 icon buttons
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 for actions, like Back , to reduce the amount of space they take up. pause Upon scrolling, an app bar container remains transparent and actions inside become filled icon buttons Selecting the search bar should open the
 search view
 The search view is a full-screen modal often used to display a list of search results. It can also be opened by selecting a search icon.
 More on search view
 component. pause When selected, a search app bar opens a search view When scrolled, medium flexible and large flexible app bars can transform into small app bars. They should remain small until the page is scrolled back to the top. Don’t transform app bars into a search app bar . pause The app bar can hide when scrolling up and reveal when scrolling down pause Medium and large flexible app bars can use the compress effect to transform into small app bars when scrolled

## [overview] illustrations

- `adad8103e43d5c84.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlktxqjf-01.
- `6d95f4a62b417ef7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlku5356-05.
- `4e9dd43c029e6f76.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlkui2vk-07.
- `2b789f23919767f8.png` ← https://lh3.googleusercontent.com/cBekWt7xDa8xEu5XXaem1OHo1sbSYkWtpPf8V_6QeBgGzxia-Ba6WoZDfUkaUvywiflh3J89oatL
- `6eeeee2566d42ad9.png` ← https://lh3.googleusercontent.com/fIECPEOSQvGp2jqHKH6PlnyuHk0gNO_Mh6mYWg9YnYiRbrXQ7zXZCBGIqL59P17MtnpMyOoHtg7P

## [specs] illustrations

- `95fb9f7df16867d2.png` ← https://lh3.googleusercontent.com/-4xgb9ld5H8Q6HnmK-ld1O5qM0mfNJy_2WtE_WggmW1lbxjvzZp6GwimCbCZ92GiXuzdak-pBH-h
- `e8b87c1ade396455.png` ← https://lh3.googleusercontent.com/4jbnUGWxs16YDyExE7HfAtikzuBERI0C_O6PT00TGtEezDt5SyYIv-V3mUOU_fOoUYk9hJ4uowBc
- `0599f2c31ebe9478.png` ← https://lh3.googleusercontent.com/BOvvsqx3bdHcU0IHwgEXTkgiwJuhU9DOQ6kiQLIdTQ8qiU9YfauXCNFb6HxOTs-PbX7r-OTeqQBl
- `fcd80973bdfa480f.png` ← https://lh3.googleusercontent.com/Fwsip8AL-32WvFsouymOxtfDAK9nsgZu6JggbrZsEe1uIQ8Tm8E48NLKY4SPX1C687pcmu65V9xy
- `869861e0d590728f.png` ← https://lh3.googleusercontent.com/GLzA-Bs2FesMv8_iNKDnGK-rmtF4_QBlkamCvjO3g0PR4Ohvu51Whqg_8UDbMF2Be0V0fNt2yy_Y
- `875b6f445bfd2fb9.png` ← https://lh3.googleusercontent.com/JaHOGKnlXOrSArCuG_UGfPN8Muth2rZ_WwBu0ZlvUPFvU8HdVdkDWZoz1M3pm1GB7vw8o_IUE-So
- `d3f121b3a354a4d9.png` ← https://lh3.googleusercontent.com/LZMvu4Uh6hlTMMN4lXncpG5Pl1yEm5A90QCK9BFFHrKogTsNr1PAWKpJ0su8E4BmXMOdKMzH3jk2
- `d84bdc7d7a4999f7.png` ← https://lh3.googleusercontent.com/MgtUMHWDy00vUnks39ztFGEG28QfDRkbQeSEcmqqCBT0K5FWc4uP_-7g3LLkrMJC-g76aUQW1xsZ
- `02c055e29b5078cf.png` ← https://lh3.googleusercontent.com/OCgIkeJ9Mk6ibxz6tz0uSYOLL4zgYINQJdBhE0uqKG_KivTrv_i-4wbgiz0sNLxmAymZPsvXyPnH
- `840ef7cc45513407.png` ← https://lh3.googleusercontent.com/T7dF8lnMsgF-ctH-bJxhvlTFNYfNCtaKFJ3_kWhNeWOT70jVcz5e2K6dcCMdvyTEMMwCh0VusP7U
- `09faac0a78fa8df3.png` ← https://lh3.googleusercontent.com/UCS56fBRH7I7KiKUuK_vBKPDUCV85-8G25OIOM9PxyVN3dgUEozWDPgj2liGjw8OI7X5PTD6n2Ic
- `749d9732017f9e29.png` ← https://lh3.googleusercontent.com/VsxxC6080HgD_QsQ6TLzafi0UFXVHAU3R4k2NDE144aZQBU9CYNjEOCd7tPTV3ur_gcYzZJO3Lez
- `4573c6151119af08.png` ← https://lh3.googleusercontent.com/ZwtGrnk6IwZVeEjENYgXaaBm1o78pMZeWbKEvSKrXMaC4EsY1x5d6AyMOmeP5xBxsEtomfWPfRQe
- `b5968f0e8101e175.png` ← https://lh3.googleusercontent.com/a4e5waYXECuiUcxK2FX7nimSG7veFWYYiISRWkojPDXodUOqnLT2npaBpJhmc1AUBfOr9G3hcZ4T
- `6eeeee2566d42ad9.png` ← https://lh3.googleusercontent.com/fIECPEOSQvGp2jqHKH6PlnyuHk0gNO_Mh6mYWg9YnYiRbrXQ7zXZCBGIqL59P17MtnpMyOoHtg7P
- `87fe36284e8ee069.png` ← https://lh3.googleusercontent.com/iJPK4tOaZD9dNaqh6nZnimQR2kRKofGNS-fhCmjPY4mo8cyDKbIJg5nY8Osnxa7EVzTNNSIkA_3O
- `ac5c67eddd93a4f0.png` ← https://lh3.googleusercontent.com/rM0ncqi1MU1B-iUCqpNvS1r6GIsPwybXwHKtPEB0hAo1k3NMLM3dqUpH_NK-k9vOlihsEFSneMWw
- `962889f016a934ab.png` ← https://lh3.googleusercontent.com/spB1ibTSmb0Q0vxy5WCz5hWULWcRYZTwf1gzkHBzBAOOx1kjBmF9_rN3rFooHw8wbZdYdo2piv_r
- `75748d2f976bec61.png` ← https://lh3.googleusercontent.com/tO6HUsX_WzDWijRcUovy7YHYqXB9nFkpIdJ1rb9xRF1f53fb5lfigX2U4DhrYnf54WpJxf_VMpqs
- `d1d4945aababd658.png` ← https://lh3.googleusercontent.com/tRaHBa-YYJoR3wAF4m6Sr9plFPu3juGtThHBYYsKPfs-6nHxwPrhg7vEpJfwSA6hfyjHrl6k4Tzh
- `f417630e427a6c35.png` ← https://lh3.googleusercontent.com/v37338PXuQO2QKzvv6eDPG3ATToEprV5f1RbgAP6J85Kkk5uUpqPb3M3U7L3YgKxNTDd_UlhkKMB
- `94ef0a8144d84735.png` ← https://lh3.googleusercontent.com/xpRALH4p7nwRTCrQbJRWXJjjKyr6SI9Lcz7DShFjgvTK8Zsvl45I69Y-m1OfJcWkp9Cc3cOV4UyC

## [guidelines] illustrations

- `1120e26285119308.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmaco62fo-GM3
- `d2bc95c8510e7d00.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnt9v4x-01.
- `85fe4c2168be5400.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlntdon8-02.
- `85497012159b109f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnth1j3-03.
- `5dc32a5416e8aa9d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlntiy4b-04-
- `0e29e4235b879f6f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlntjjnv-05-
- `5ed3cd31cd0acd94.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlntmieq-06.
- `6cf2f7962288697e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlntnwot-07.
- `1b2e5f84df8dfd01.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlntr0ls-08.
- `527a19192e0e525e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlntrvt2-09.
- `ca661387b6437608.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlntvpyq-10.
- `2165b619b105151b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlntz91y-11.
- `4dce730a084e2597.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnu01cf-12-
- `a2bd484ebe9f619b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnu4je0-13.
- `de0ec1c33f69ee7b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnu68g2-14.
- `fb5d4efdb7ab0d82.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnub2xp-15.
- `b4c3e1960215e733.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnuf0r2-16-
- `c796d39a1acd8872.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnugbt5-17-
- `e0d8b759ad47015d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnuiiym-18-
- `7a62d6266e61be00.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnuja9a-19-
- `2f67172b4786ee36.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnuliot-20.
- `5e11da17238865fd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnumedg-21.
- `605e4a1fe8dcd1a8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnurf1u-22-
- `b9cfdcde80335816.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnus8yg-23-
- `746a8c900e276d2c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlnuwnod-24.

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmaco62fo-GM3_Adaptive_AppBar_Gui`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlp67nmz-GM3%20-%20Top%20App-Bar`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlp6cznn-GM3%20-%20App-bar%20-%2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlp6geio-GM3%20-%20App-bar%20-%2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlp6hnuc-GM3%20-%20App-bar%20-%2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlp6jluz-GM3%20-%20App-bar%20-%2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlp6o2a1-GM3%20-%20App-bar%20-%2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlp6pkl9-GM3%20-%20App-bar%20-%2`

## [accessibility] illustrations

- `4d52adf7b3e6071d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlos0avb-09.
- `f5dda521fd747c9e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlos1na5-08.
- `d3b6112bc8a0143f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlos5etv-06-
- `ce5e60fce484a101.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlos65h6-07-
- `4ffb94a104f66aec.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlos7r6g-04.
- `c73639f993af9b1e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlos8gq8-05.
- `9342f3846a49bf22.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlosad0z-GM3
- `1cf8bdc89a3f9c09.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlosc4c9-GM3
- `e13120270e3277ed.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlosdik1-GM3
- `6eeeee2566d42ad9.png` ← https://lh3.googleusercontent.com/fIECPEOSQvGp2jqHKH6PlnyuHk0gNO_Mh6mYWg9YnYiRbrXQ7zXZCBGIqL59P17MtnpMyOoHtg7P

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlosad0z-GM3%20-%20App-bar%20-%2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlosc4c9-GM3%20-%20App-bar%20-%2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmlosdik1-GM3%20-%20App-bar%20-%2`
