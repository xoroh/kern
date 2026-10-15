# M3 component: tabs

_Archive: `m3-archive/spec/components/tabs/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/tabs/…_

## Overview (full text)

Tabs – Material Design 3
 Availability & resources Differences from M2 Use tabs to group content into helpful categories Two variants:
 primary
 Primary tabs display an app's main content destinations. They're are placed at the top of the screen, often under a top app bar.
 and
 secondary
 Secondary tabs display related content within a content area. They're always placed below primary tabs.
 Tabs can horizontally scroll, so a UI can have as many tabs as needed Place tabs next to each other as peers Primary tabs Secondary tabs Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Available Close Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Layout: Icons and labels are now vertically centered within the container Tab icons and labels are positioned in the vertical center of the container

## Key measurements (dp, extracted)

- side the container. Primary tab active indicators are inset 2dp on each side, have a fully rounded corn
- er radius, and a minimum length of 24dp. Attribute Value Container height (labe
- l text only) 48dp Container height (icon and label text)
- 64dp Icon size 24dp Divider height 1dp Prima
- ry active indicator height 3dp Secondary active indicator height 2dp A
- indicator shape 3, 3, 0, 0 Active indicator minimum length 24dp Padding between inline icon and text 8d
- p Padding between inline text and badge 4dp Overlap of badge on stacked icon 6dp
- scrollable tabs, the first visible tab should be offset by 52dp from the left side of the device for bo
- dding on each tab. check Do Offset the first scrollable tab 52dp from the leading edge so it's clear tha

## Accessibility (full text)

Tabs – Material Design 3
 Use cases Interaction & style Initial focus Keyboard navigation Labeling elements Use cases Users should be able to: Undertake actions or invoke navigation to a new destination with assistive tech Select an action or destination from an off screen tab with assistive tech Maintain access of primary actions when the content is in a scrolled
 state
 States show the interaction status of a component or UI element.
 More on states
 Interaction & style Touch When a user taps on an
 icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 , a touch ripple appears, indicating interaction feedback The selected indicator becomes active and shifts into position once the touch has been engaged pause Touch: Tap Scrollable When a set of tabs cannot fit on screen, scrollable tabs are used. They are best used for browsing on touch interfaces. To navigate between scrollable tabs, users swipe the set left or right. Users can also use arrow/tab to navigate through. It's not recommended to loop a tab set where it scrolls infinitely. This can trap users who are navigating linearly with a screen reader. To select an individual tab, users tap or press space/enter. Horizontal scrolling tabs meet accessibility requirements because they need to increase in width to respond to label text without affecting the layout, and horizontal scrolling is necessary to view those labels. pause Scrollable: Scrollable Tabs Cursor When hovered, the
 hover state
 A hover state communicates when a user has placed a cursor above an interactive element.
 More on hover state
 appears, providing a visual cue that the
 icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 is interactive. When clicked (in both active and inactive states), a ripple appears and the indicator shifts into position, showing the user feedback. pause Cursor: Hover, Click Keyboard/Switch When tabbed, a focus indicator appears, providing a visual cue to the user that the destination is now selected When the user engages with the selected tab via Space/Enter in active
 states
 States show the interaction status of a component or UI element.
 More on states
 , the user is taken to a new destination Within the tab menu, the user is able to arrow/tab through the menu items, Space/Enter to select an item, or tab to exit the active state pause Keyboard/Switch: Tab, Space/Enter, Arrow Avoid applying density by default Don't apply density to tabs by default — this lowers their targets below our best practice of 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme. To ensure that this density setting can be easily reverted when it's active, keep all the targets to change it at minimum 48x48 CSS pixels each. Initial focus On arrow/tab in a tab
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 , the active indicator appears on the first interactive element, providing feedback to the user that it is selected. The user is then able to tab to additional interactive elements until all available items are complete within the tab menu. pause check Do Use Arrow/Tab to navigate through items pause close Don’t Don't use Space/Enter for navigating tabs. Space/Enter is only used for completing actions. Keyboard navigation Keys Actions Arrow Focus lands on the next available navigation destination Space / Enter Activates the
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 navigation destination Arrow Allows navigation through
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 items Labeling elements When the visible UI text is ambiguous, or there is no visible UI text,
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 labels need to be more descriptive. For example, an
 icon button
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 that visually represents a “video camera” requires additional information in its accessibility label to clarify the icon’s intent. While the icon visually represents a “Video camera,” the accessibility label for this tab clarifies its function: “Video format media content”

## Specs (full text)

Tabs – Material Design 3
 Tokens and specs Primary tabs Secondary tabs Measurements Tokens and specs Select a component variant below to see its elements, attributes, tokens, and their values. Tabs - Primary navigation arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Primary tabs Container Badge (optional) Icon (optional) Label Divider Active indicator Primary tabs color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Primary tab color roles used for light and dark schemes: Surface Primary Primary On surface variant On surface variant Outline variant Primary Primary tabs states Enabled (active destination) Hover (active destination) Focused (active destination) Pressed (active destination) Enabled (inactive destination) Hover (inactive destination) Focused (inactive destination) Pressed (inactive destination) Secondary tabs Container Badge (optional) Label Divider Active indicator Secondary tabs color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Secondary tab color roles used for light and dark schemes: Surface On surface On surface variant Outline variant Primary Secondary tabs states Enabled (active destination) Hover (active destination) Focused (active destination) Pressed (active destination) Enabled (inactive destination) Hover (inactive destination) Focused (inactive destination) Pressed (inactive destination) Measurements Tabs are divided into equal sections, with labels and icons positioned vertically centered. The divider is included in the height, placed inside the container. Primary tab active indicators are inset 2dp on each side, have a fully rounded corner radius, and a minimum length of 24dp. Attribute Value Container height (label text only) 48dp Container height (icon and label text) 64dp Icon size 24dp Divider height 1dp Primary active indicator height 3dp Secondary active indicator height 2dp Active indicator shape 3, 3, 0, 0 Active indicator minimum length 24dp Padding between inline icon and text 8dp Padding between inline text and badge 4dp Overlap of badge on stacked icon 6dp

## Guidelines (full text)

Tabs – Material Design 3
 Usage Anatomy Choosing the tab variant Placement Responsive layout Behavior Usage Tabs organize groups of related content that are at the same level of hierarchy. Tab labels can include icons and text. Text labels should be short. There are two variants of tabs: Primary tabs Secondary tabs Primary tabs are placed at the top of the content
 pane
 Panes are layout containers that house other components and elements within a single app. A pane can be: fixed, flexible, floating, or semi permanent.
 More on panes
 under an
 app bar
 App bars display information and actions at the top of a screen.
 More on app bars
 . They display the main content destinations. Secondary tabs are used within a content area to further separate related content and establish hierarchy. Primary tabs
 Secondary tabs Related content Use tabs to group related content, not sequential content. check Do Utilize tabs to categorize related groups of content into clearly defined sets close Don’t Don’t use tabs to move through sequential content that needs to be read in a particular order. Instead, create hierarchy within the content using techniques like typography style and open space. Anatomy Container Icon (optional) Badge (optional) Label Divider Active indicator Container The container holds multiple tabs. Its contents can be fixed or scrollable. The container should always extend the full width of the window and be divided into equal sections, one for each tab. The container is defined by a
 divider
 Dividers are thin lines that group content in lists or other containers.
 More on dividers
 on the bottom edge to separate it from the content below. Content may scroll under the container. The container is the area that contains the tabs directly under the title above Icon (optional) Icons communicate the kind of content within a tab. Icons should be simple and recognizable. Tabs can use a combination of labels and icons Icons alone aren’t as effective as text labels at communicating complex content. Use caution when representing tab content with icons alone, as an icon’s meaning may not be clear. check Do Use icons that are globally recognized when using icons alone close Don’t Don’t use tabs with both icons and text labels on only some tabs, but not others Label Text labels should clearly and succinctly describe the content within the tab. Tab labels appear in a single row. Labels can use a second line if needed, with truncated text. Alternatively, scrollable tabs can allow room for longer titles. Tab labels should be short and succinct. There should be a clear relationship to the title above. When using scrollable tabs, the first visible tab should be offset by 52dp from the left side of the device for both web and mobile. The width of each tab is defined by the length of its text label. Avoid using inconsistent padding on each tab. check Do Offset the first scrollable tab 52dp from the leading edge so it's clear that more content is available close Don’t Don’t truncate labels unless required, as truncated text can impede comprehension Badges (optional)
 Badges
 Badges show notifications, counts, or status information on navigation items and icons.
 More on badges
 can be used on primary or secondary tabs to show notifications or updates related to a specific tab. Limit badge content to four characters, including a "+". Once the user views the relevant content in the tab, the badge value should update or the badge should disappear entirely. Small and large badges can both be used with tabs. Read the badge guidance for more details. Badges are used to highlight notifications related to tab specific content Active indicator To differentiate an active tab from an inactive tab, apply an underline and color change to the active tab’s text and icon. pause An underline and color change differentiate an active tab from the inactive ones Choosing the tab variant 
 Primary tabs
 Primary tabs display an app's main content destinations. They're are placed at the top of the screen, often under a top app bar.
 should be used when just one set of tabs are needed.
 Secondary tabs
 Secondary tabs display related content within a content area. They're always placed below primary tabs.
 are necessary when a screen requires more than one level of tabs. These tabs use a simpler style of indicator, but their function is identical to primary tabs. Tabs can be joined with components like app bars, embedded in a specific UI region, or nested within components like cards and sheets. Tabs control the UI region displayed below them. Placement Tabs are displayed in a single row, with each tab connected to the content it represents. As a set, all tabs are unified by a shared topic.
 Secondary tabs
 Secondary tabs display related content within a content area. They're always placed below primary tabs.
 should always be placed below
 primary tabs
 Primary tabs display an app's main content destinations. They're are placed at the top of the screen, often under a top app bar.
 . Secondary tabs are found within other content to assist users with greater detail Responsive layout For fixed tabs, the maximum width for each tab should be determined by the width of the widest tab. The group of tabs should use a fluid
 margin
 Margins are the spaces between the edge of a nested element and its parent element, such as the space between a button's label text and the edge of its container.
 More on margins
 and align to the center or leading edge of the body region. Avoid using more than four tabs at once. At five or more tabs, the container becomes cramped. Tabs can grow in width in relation to the number of items contained within Behavior States By default, tabs inherit
 enabled
 An enabled state communicates an interactive component or element.
 More on enabled state
 states
 States show the interaction status of a component or UI element.
 More on states
 with one active state.The inactive and active states of a tab can inherit a
 hover
 A hover state communicates when a user has placed a cursor above an interactive element.
 More on hover state
 ,
 focus
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 , and
 pressed
 A pressed state communicates a user tap.
 More on pressed state
 states. Active, hover, focused, and pressed states Fixed tabs Fixed tabs display all tabs in a set simultaneously. They are best for switching between related content quickly, such as between transportation methods in a map. To navigate between fixed tabs, tap an individual tab, or swipe left or right in the content area. pause Fixed tabs allow users to see all possible kinds of content available Tap a tab Navigate to a tab by tapping on it. pause Tapping on a tab directly Swipe within the content area To navigate between tabs, users can swipe left or right within the content area. pause Users can swipe between fixed tabs to see related content quickly Use caution when placing other swipeable content (such as interactive maps or
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 items) in the content area. pause check Do Use different gesture directions when using tabs pause close Don’t Avoid placing swipeable items in the content area of a UI that has tabs, as the user may mistakenly swipe the wrong component Scrollable tabs When a set of tabs cannot fit on screen, use scrollable tabs. Scrollable tabs can use longer text labels and a larger number of tabs. They are best used for browsing on touch interfaces. pause Padding should remain the same when using scrolllable tabs and long labels Scrolling content When a screen scrolls up and down through content, tabs can either be fixed to the top of the screen, or scroll off the screen. If they scroll off the screen, they will return when the user scrolls upward. pause Tabs can be use to create elevation pause check Do Tabs can scroll offscreen on scroll, and reappear when the page is scrolled up pause close Don’t Don’t scroll tabs behind an app bar. When tabs are attached to a component, they should appear and move as a single unit.

## [overview] illustrations

- `acdee47612ebcc3a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k3okei-2.p
- `7766b4a53123eed4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2kfqg9k-1.p
- `0a5204f06d323de6.png` ← https://lh3.googleusercontent.com/8U59FOnr9wjH8Eux1lxzMUQoMOAuE32q0p8r08sC-4xWBEPfll7iHC452ku9B-z52zHiKIxvHYRg

## [specs] illustrations

- `8c4564f101aed067.png` ← https://lh3.googleusercontent.com/0bS99kVjUnrfIUIKGAMWl8zeoYciELsgT5jPWeC4JJ9gcDC2cfnKH-p9qOYsX0OJ000ePPYMARw_
- `0a5204f06d323de6.png` ← https://lh3.googleusercontent.com/8U59FOnr9wjH8Eux1lxzMUQoMOAuE32q0p8r08sC-4xWBEPfll7iHC452ku9B-z52zHiKIxvHYRg
- `a953c6354a6d5801.png` ← https://lh3.googleusercontent.com/KNDnEXfu6HZxqBLD84eQfamUeoe8b_N3wygSYqpk5Hq1MxT7_9RNL34wYce0tPDml6rb6lP7cQO8
- `13d10d8b90a6c534.png` ← https://lh3.googleusercontent.com/SVFdAJr5_8cGN6FTMVabD3nie8TwI7380y6PuVzSxatYH1YBsdf49aWd1upXNO7uDcsKDd8Uge2W
- `aeeb67aa0e5d1748.png` ← https://lh3.googleusercontent.com/dmXLWuK2u_6U_iIQaK_nWtayfYfcfZU6mZyf5IAPmgu9y14-Puo51QN7a74fZJ34z0ESD88OfHOv
- `f57dbcc7dc75aeb1.png` ← https://lh3.googleusercontent.com/kyON5nMIlowboe0XsmPdlYKlFdIzCFTab9gzT4uEJtS2WMvRd1uBJHEMDDOKujs1u1iJYlb66cSc
- `7c39a974d9984302.png` ← https://lh3.googleusercontent.com/lEVgg_QRIKA7HpYLAWEddeY7ZCHa5FmlPc1K3C0yx1c5cmW_wxci7cAmdW_55RvUextO4vEHupXx
- `4752ccebaffab160.png` ← https://lh3.googleusercontent.com/mrLdFHBC7H_M0bhZxPDT-VaJeoB01vnZMaY_9Pyj_EenTQbIT6OO75CWFdZLyvMxD0ycppRCoWXu
- `66e7dec2773e2972.png` ← https://lh3.googleusercontent.com/oEbOwsXXP2m1EE9Sh7tJFcTP1GIHVkX6lbOkKN-gdwnF4WbJnoyezqHEr1rtaeAPTY2cHj6txNpy

## [guidelines] illustrations

- `44ddac121eadd6e7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k0hhto-1.p
- `632ea587a916c4cf.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k0jkg6-3.p
- `c519403dfd7298f8.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k0jyu3-4.p
- `7425aec0dd2c7120.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k0lum1-5.p
- `e6eb0a3b3adc149c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k0mdfv-6.p
- `3a7f72536e1c1508.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k0o3dw-7.p
- `67165cf148e381bb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k0sbsy-8.p
- `d03db6fd242ece4b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k0t3i6-9.p
- `8b560dffb3a3b919.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k1942z-10.
- `f165b624a5c636d6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k19jjz-11.
- `df484f7b9171bf09.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k1a0sc-12.
- `c81b0010df1d274a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k1yl6w-13.
- `779a7fa2fdfd7de2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k20o4c-15.
- `2c2771f0dda88104.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k217y6-16.
- `3d868309696be0d2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k2312r-18.
- `69d2217a26c57c1e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60drx93-GM3-Components-Tab
- `bd04c5be47f540c9.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dtw9m-GM3-Components-Tab
- `f34a79625740d65b.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60duq4j-GM3-Components-Tab
- `112a8c60f67dc7ff.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dvuo4-GM3-Components-Tab
- `c98abdb5752376b8.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dwpex-GM3-Components-Tab
- `f35fc63710ad24d9.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dxhwe-GM3-Components-Tab
- `31d1989c2e3f336c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dygta-GM3-Components-Tab
- `e1326c03c266e73c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dz0ae-GM3-Components-Tab
- `03ab3ef25d3c8854.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dztv7-GM3-Components-Tab
- `e9cedacffdbba5fb.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60e0d2q-GM3-Components-Tab

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60drx93-GM3-Components-Tabs-Guidelines-1-v01.m`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dtw9m-GM3-Components-Tabs-Guidelines-2-v01.m`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60duq4j-GM3-Components-Tabs-Guidelines-3-v01.m`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dvuo4-GM3-Components-Tabs-Guidelines-4-v01.m`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dwpex-GM3-Components-Tabs-Guidelines-5.1-v01`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dxhwe-GM3-Components-Tabs-Guidelines-5.2-v01`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dygta-GM3-Components-Tabs-Guidelines-6-v01.m`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dz0ae-GM3-Components-Tabs-Guidelines-7-v01.m`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60dztv7-GM3-Components-Tabs-Guidelines-8.1.mp4`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60e0d2q-GM3-Components-Tabs-Guidelines-8.2.mp4`

## [accessibility] illustrations

- `0028e4572b4b66e2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm2k3h2mn-7.p
- `051957c8435a08f0.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bkpen-GM3-Components-Tab
- `d0129d07a7c8e9ce.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bllqp-GM3-Components-Tab
- `153a68fe2697ea8f.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bmbt7-GM3-Components-Tab
- `4e70c5e751ae86d4.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bmwk8-GM3-Components-Tab
- `778c9978ee0f04b0.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bo0sa-GM3-Components-Tab
- `c332c1b6b02bb916.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bot9i-GM3-Components-Tab
- `0a5204f06d323de6.png` ← https://lh3.googleusercontent.com/8U59FOnr9wjH8Eux1lxzMUQoMOAuE32q0p8r08sC-4xWBEPfll7iHC452ku9B-z52zHiKIxvHYRg

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bkpen-GM3-Components-Tabs-Accessibility-1-v0`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bllqp-GM3-Components-Tabs-Accessibility-2-v0`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bmbt7-GM3-Components-Tabs-Accessibility-3-v0`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bmwk8-GM3-Components-Tabs-Accessibility-4-v0`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bo0sa-GM3-Components-Tabs-Accessibility-5.1-`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm60bot9i-GM3-Components-Tabs-Accessibility-5.2-`
