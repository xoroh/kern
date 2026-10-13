# M3 component: cards

_Archive: `m3-archive/spec/components/cards/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/cards/…_

## Overview (full text)

Cards – Material Design 3
 Availability & resources Differences from M2 Use cards to contain related elements Three variants:
 elevated
 Elevated cards have a drop shadow, providing more separation from the background than filled cards, but less than outlined cards
 ,
 filled
 Filled cards provide subtle separation from the background. This has less emphasis than elevated or outlined cards.
 ,
 outlined
 Outlined cards have a visual boundary around their container. This can provide greater emphasis than the other types.
 Contents can include anything from images to headlines, supporting text,
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 , and
 lists
 Lists are continuous, vertical indexes of text and images.
 More on lists
 Can also contain other components Cards have flexible
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 and dimensions based on their contents Elevated card Filled card Outlined card Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Android Views (MDC-Android) Available android Jetpack Compose Available language Web Unavailable Close Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Elevation: Lower elevation and no shadow by default Variants: Three official card variants –
 elevated
 Elevated cards have a drop shadow, providing more separation from the background than filled cards, but less than outlined cards
 ,
 filled
 Filled cards provide subtle separation from the background. This has less emphasis than elevated or outlined cards.
 , and
 outlined
 Outlined cards have a visual boundary around their container. This can provide greater emphasis than the other types.
 Cards have updated colors, elevation, and variants

## Key measurements (dp, extracted)

- ts Card padding and size measurements Attribute Value Shape 12dp corner radius Left/right padding 16dp P
- adding between cards 8dp max Label text alignment Start-aligned
- Window widths smaller than 600dp, such as a phone in portrait orientatio
- Window widths 840dp to 1199dp, such as a tablet or foldable

## Accessibility (full text)

Cards – Material Design 3
 Use cases Interaction & style Focus Keyboard navigation Labeling elements Use cases People should be able to do the following using assistive technology: Navigate to a card and the elements within a card Get appropriate feedback based on input type documented under Interaction & style Interaction & style A card can be a non-actionable container that holds actions like
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 and links, or it can be directly actionable without any buttons or links. This is to avoid stacking actionable elements. An action shouldn’t be placed on an actionable surface. Non-actionable card with buttons Directly actionable card with no buttons Touch When a user taps on a directly actionable card, a touch ripple appears across the card, indicating feedback. Non-actionable cards don’t ripple. pause Touch: Tap Dragging and dismissing To meet Material's accessibility standards, any dragging and swiping interactions need a single-pointer alternative, like selecting the same actions from a menu. For example, tapping a card, or pressing and holding, should open a menu to change its position in a list. That menu could also contain an action to delete the card. pause Use containers like bottom sheets or menus to show single-pointer options It isn’t recommended to place menus on top of the card on the draggable state. If doing so is necessary, ensure that the interaction can be completed. exclamation Caution Ensure that the menu doesn't cover the card Cursor When a directly actionable card is hovered, the
 hover state
 A hover state communicates when a user has placed a cursor above an interactive element.
 More on hover state
 provides a visual cue to the person that the element is interactive. Non-actionable cards don’t have a hover state. When a directly actionable card is clicked, a ripple appears, providing feedback. pause Cursor: Hover, Click Keyboard A focus indicator appears around actionable elements when tabbing through cards. This provides a visual cue to a person that the destination is now
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 and an action can be taken. A person can Tab to navigate between actionable elements of the cards. If the cards are non-actionable, Tab navigates directly to the actionable
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 or links within the cards. When engaging with a focused actionable card or element using the Space or Enter key, an action is performed or a secondary action is available, such as a
 menu
 Menus display a list of choices on a temporary surface.
 More on menus
 . Within the menu, a person is able to Arrow through the menu items, Space or Enter to select an item, or Tab to exit. pause Keyboard: Tab, Arrows Focus All interactive elements of cards need a tab stop so they can be
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 . Directly actionable cards are tab stops. For non-actionable cards, the card itself is not a tab stop. However, every actionable element in the card is a tab stop so they’re all visited before focus navigates to the next card. Use T ab to navigate through all buttons in a card Card layouts can change on different devices Keyboard navigation Keys Actions Tab Move to the next actionable element Directly actionable cards: Move to next card container Non-actionable cards with actionable elements: Move to next actionable element Space or Enter Confirm action Labeling elements The informative contents of a card are verbalized when navigating to them using a screen reader. If an image in a card is purely decorative, hide it from screen readers. All actionable elements must receive both screen reader and keyboard focus. Directly actionable cards can have the button or link role, depending on how they’re used. Non-actionable cards are purely containers, so they don’t need a role. Non-actionable card elements are navigable, focused in order, and verbalized when in focus. In this example, the order is: Heading Image Body text Primary button Secondary button

## Specs (full text)

Cards – Material Design 3
 Tokens & specs Elevated card Filled card Outlined card Measurements Tokens & specs Select a component variant below to see its elements, attributes, tokens, and their values. Card - Elevated arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down folder Dragged keyboard_arrow_down Close Elevated card Container Elevated card color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Elevated card color roles used for light and dark themes: Surface container low Elevated card states States are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Elevated card states: Hovered Focused Pressed Dragged Disabled Filled card Container Filled card color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Filled card color roles used for light and dark themes: Surface container highest Filled card states States are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Filled card states: Hovered Focused Pressed Dragged Disabled Outlined card Container Outline Outlined card color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Outlined card color roles used for light and dark themes: Surface Outline variant Outlined card states States are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Outlined card states: Hovered Focused Pressed Dragged Disabled Measurements Card padding and size measurements Attribute Value Shape 12dp corner radius Left/right padding 16dp Padding between cards 8dp max Label text alignment Start-aligned

## Guidelines (full text)

Cards – Material Design 3
 Usage Anatomy Cards in a collection Adaptive design Behavior Usage Use a card to display content and actions on a single topic. Cards should be easy to scan for relevant and actionable information. Elements like text and images should be placed on cards in a way that clearly indicates hierarchy. Cards can display content and actions on a single topic Cards can serve as entry points into deeper levels of detail or navigation, such as a music album or details on an upcoming vacation. Card text and image show a clear hierarchy Use cards to display related information on a single subject Cards can be displayed together in a grid, vertical list, or
 carousel
 Carousels show a collection of items that can be scrolled on and off the screen.
 More on carousels
 . check Do Cards can be shown together close Don’t Don't force content into cards when spacing, headlines, or dividers would create a simpler visual hierarchy There are three card variants:
 Elevated
 Elevated cards have a drop shadow, providing more separation from the background than filled cards, but less than outlined cards
 Filled
 Filled cards provide subtle separation from the background. This has less emphasis than elevated or outlined cards.
 Outlined
 Outlined cards have a visual boundary around their container. This can provide greater emphasis than the other types.
 Each provides the same legibility and functionality, so the variant you use depends on style alone. Elevated card Filled card Outlined card Elevated cards have a drop shadow, providing more separation from the background than filled cards, but less than outlined cards Filled cards provide subtle separation from the background. This has less emphasis than elevated or outlined cards. Outlined cards have a visual boundary around the container. This can provide greater emphasis than the other variants. Anatomy The card container is the only required element in a card. Card layouts can vary to support the kinds of content they contain. Below is a common configuration of elements. Container Image Button Supporting text Subhead Headline Container Card containers hold all card elements. Their size is determined by the space those elements occupy. Card elevation is expressed by the container. The card container is the only required element of a card. All other elements are optional. Card size is determined by the elements it contains Content blocks Card contents are grouped into blocks. Content can have different levels of visual emphasis depending on importance. Card layouts vary to support the kinds of content they contain. Cards can contain a headline, subhead, supporting text, media, and actions Dividers Dividers can separate regions in cards or indicate areas of a card that can expand. 1. Use full-width dividers for content that can be expanded 1. Use inset dividers, which don’t run the full width of a card, to separate related content Media Thumbnail Cards can include thumbnails for an avatar or logo. Image Cards can include photos, illustrations, and other graphics, such as weather icons. Video Cards can include video. Cards can contain thumbnails, images, and video Text Headline Headline text often communicates the subject of the card, such as the name of a photo album or article. Subhead Subheads are smaller text elements, such as an article byline or a tagged location. Supporting text Supporting text includes body content, such as an article summary or a restaurant description. Headline, subhead, and supporting text in a card Layering text, icons, and images It isn’t recommended to place text or icons on images. If it’s necessary, ensure the background image provides sufficient contrast for the text to meet
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 standards. Add a translucent scrim or bounding shape beneath the text or icon to help ensure proper contrast. exclamation Caution Ensure that text on images meets accessible contrast standards exclamation Caution When placing text or icons on images, consider using a bounding shape to ensure proper contrast Actions Primary action area Cards can be one large touch target triggering an expanded detail screen. Cards can include a primary action area that expands into a full-screen view Buttons Cards can include
 buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 for actions such as Learn more or Add to cart . Icon buttons Cards can include
 icon buttons
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 for actions such as Save , Heart , or Leave a 4-star review . Selection controls Cards can also include
 chips
 Chips help people enter information, make selections, filter content, or trigger actions.
 More on chips
 ,
 sliders
 Sliders let users make selections from a range of values.
 More on sliders
 ,
 checkboxes
 Checkboxes let users select one or more items from a list, or turn an item on or off.
 More on checkboxes
 , and other selection controls. Linked text There can be a link in the supporting text on a card. Cards can include multiple action areas containing buttons, links, and other controls Cards can contain icon buttons like stars to rate content Cards can contain choice chips in the action area Cards can contain a slider control in the action area Overflow menu Overflow menus contain related actions. They are typically placed in the upper-right or lower-right corner of a card. Overflow menus are usually located in the upper-right or lower-right corner of a card Cards in a collection Multiple cards can be grouped together into collections displayed in a grid,
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 , or
 carousel
 Carousels show a collection of items that can be scrolled on and off the screen.
 More on carousels
 . By default, cards in a collection are coplanar. They share the same resting elevation unless they're picked up or
 dragged
 A dragged state communicates when a user presses and moves an element.
 More on dragged state
 . Multiple cards can be grouped into collections with a shared resting elevation Filtering and sorting Card collections can be filtered in a variety of ways, including by date or alphabetical order. If a collection can be filtered, the filter must apply to each card in the collection. Filter or sorting options should be placed outside of the card collection. Card collections can be filtered in a variety of ways, including by date: 1. A sort-by-date option is placed outside of the card collection Organize card collections so that they'e easy to use. Their
 layout
 Layout is the visual arrangement of elements on the screen.
 More on layout
 affects how they are perceived. Place cards in a collection in a straightforward, easy-to-use manner Grid Cards can be displayed together in a grid. pause Cards displayed in a grid The default grid can be customized in code to show cards in staggered or mosaic grids. Custom mosaic grid Custom staggered grid Vertical list Cards can be displayed together in a vertical list. pause Cards can be shown in a vertical list Carousel Cards can be displayed together in a horizontal row or
 carousel
 Carousels show a collection of items that can be scrolled on and off the screen.
 More on carousels
 . pause Cards displayed together in a horizontal row or carousel Adaptive design As cards scale to adapt to different breakpoints , their position and alignment can also change. Cards and their elements can align left, right, or center as the layout scales. Card position and alignment changes as the screen size changes Ergonomics Adjust the
 layout
 Layout is the visual arrangement of elements on the screen.
 More on layout
 of cards to meet the ergonomic needs of large screens. For example, a horizontally-oriented card in a
 compact breakpoint
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 may become a larger, vertically-oriented card in an
 expanded breakpoint
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , with more space for images and text on the larger screen. Adjust the card layout so content remains the main focus on large screens Visual presentation To adjust the presentation of content-focused components, begin with spacing. Allow components like
 lists
 Lists are continuous, vertical indexes of text and images.
 More on lists
 , cards, and images to optimize space while filling the region of a screen that suits a device breakpoint’s ergonomic needs. Spacing adjusts for components such as cards, lists, and images Example of the same card with two different orientations and element positioning Column-based layouts In mobile layouts, components such as
 lists
 Lists are continuous, vertical indexes of text and images.
 More on lists
 or cards are stretched to fit the full width of the screen without compromising visual quality or user experience. When designing for large screens with an
 expanded breakpoint
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 , use multiple columns to display content. Avoid extending UI elements across the screen when possible. On larger screens, rearrange groups of related cards into horizontal rows or
 carousels
 Carousels show a collection of items that can be scrolled on and off the screen.
 More on carousels
 , to allow for better content organization. When designing for large screens, use multiple columns to display content Small screens On smaller screens with the
 compact breakpoint
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , consider swapping cards for
 lists
 Lists are continuous, vertical indexes of text and images.
 More on lists
 , which can display images and text in a more compact form. Make sure that controls, actions, and other component-specific elements are maintained. pause Certain devices or user contexts require different components to meet platform expectations Behavior Expanding Cards can use a container transform transition pattern to reveal additional content. Reserve this pattern for hero moments that are meant to be expressive. pause A card expands to fill the full screen using a parent-child transition pause check Do Expand a card to reveal information pause close Don’t Don’t scroll within a card to reveal information Navigation Cards can use a forward and backward transition pattern to navigate between screens at consecutive levels of hierarchy. This pattern has a simpler motion style compared to container transform, which makes it suitable for common navigation transitions. pause Cards can use a forward and backward transition pattern to navigate between screens Gestures Swipe A swipe
 gesture
 Gestures are all the ways people interact with UI elements using touch.
 More on gestures
 can be performed on a single card at a time, anywhere on that card. It can be used to: Dismiss a card Change the
 state
 States show the interaction status of a component or UI element.
 More on states
 of a card, such as flagging or archiving it pause check Do A card should only have one swipe action assigned to it pause close Don’t Cards shouldn’t contain content that can be swiped, such as an image carousel or pagination. Also, swipe gestures shouldn’t cause portions of cards to detach upon swiping. Pick up & move The pick-up-and-move
 gesture
 Gestures are all the ways people interact with UI elements using touch.
 More on gestures
 allows users to move and reorder cards in a collection. pause check Do When moving a card, increase its elevation pause close Don’t Don’t let cards bump other elements out of the way. When a card is picked up, it appears in front of all elements, except app bars and navigation. Scrolling Card content that’s taller than the maximum card height is truncated and doesn’t scroll, but can be displayed by expanding the height of a card. A card can expand beyond the maximum height of the screen, in which case the card scrolls within the screen. pause check Do On a mobile device, cards can expand to reveal more content, scrolling within the screen. Content within cards doesn’t scroll. pause close Don’t On a mobile device, cards can't internally scroll, as it could cause two scroll bars to be displayed Scrolling on desktop On a desktop device, card content can expand and scroll within a card. pause On a desktop, content can expand and scroll within a card

## [overview] illustrations

- `0b820995c0e95b66.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuilyza-1.p
- `28fb271c1130ae9a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuimnd8-2.p
- `356d0702a9a74600.png` ← https://lh3.googleusercontent.com/wN0u_0s9DujWzdKZlthDs80f4hCuXzU3GjK9hjJTmJoVxjtsU1av94BfcBJxrkIPPHyAo2Ym9_V3

## [specs] illustrations

- `646140ec7d306da4.png` ← https://lh3.googleusercontent.com/28sRV5HrMfndGdrvcX_VHMHcm9rf_kk7W_LC3Jom8_R9rtsrEJAMjjPVT552KXBmxiaMKszeZ5Qe
- `64e16f96e27186ee.png` ← https://lh3.googleusercontent.com/8OD9zWeF6hOtcHP-XQEqSVrCYSmtOFcwnb19h4zkqIDtpszCMXho0opgebc5B_ukqbsOiK-Q_iMQ
- `8795c4c6829d8bdb.png` ← https://lh3.googleusercontent.com/E3Vi9qZnejfvkANGxN7TTmb5Utn3gzxXo8tbngvR9A83WXhpvV-mK_p9erAn4wBXMFmFRXpw2SmD
- `59a3e31d828dde6c.png` ← https://lh3.googleusercontent.com/RbaHdHqyYyeHjx_eq4Kbjc4e3WWtYoHRrwqEg2mnQUhLVLjtwyp3KtjjaHrV6kdyFRPu5O26lbeX
- `243985322c27b274.png` ← https://lh3.googleusercontent.com/X8jbeHzsvv736FiatKGB2IOlsdiGVljvmrVCHUTgi0Au8RPx_aVvF1UMhbbjcAu--WnKD3LAWI4h
- `0476bdc40ccda6ef.png` ← https://lh3.googleusercontent.com/dyvw6FZH2BO4dAPsybP7VtJyu3dvPM_SK6YtHcXcFOSbUXx2KFiOganJcT29S4R85p3ZNem11PKa
- `bb817d7f7fab7c19.png` ← https://lh3.googleusercontent.com/el_YhKWDFNMsVV51gm6oChPgPeNh4NiZU7_jdajUv38w5rT3nVlzDXfArepuPH38d1er7SCslFJy
- `892857d41a6c8e52.png` ← https://lh3.googleusercontent.com/gOvzxWalOCyRSRq6I8AqYgS6Y-XJlhBZ7VW82pxtb3dFUccU5LHnNcaccQ4BVnHcQflh6KOXqswx
- `4821517a02817647.png` ← https://lh3.googleusercontent.com/knnDmfc6SIH-85gkuLOhQRHJhvHpPRGu_OzMgaQMMtDnloC-fCR1jJl1PGG0AP72kt6sqmBKlZgI
- `f0ffe51753c6a8d4.png` ← https://lh3.googleusercontent.com/mwuwAzgNXs1xArEeUNQ5ayKXGbsLGzverYdD2EPiqL9Nk2EoZb5LEVop_RyeltCreY-py6o6B5Ry
- `356d0702a9a74600.png` ← https://lh3.googleusercontent.com/wN0u_0s9DujWzdKZlthDs80f4hCuXzU3GjK9hjJTmJoVxjtsU1av94BfcBJxrkIPPHyAo2Ym9_V3

## [guidelines] illustrations

- `e337041551016085.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwujy207-1.p
- `a5d093e5efbc3469.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwujyk5p-2.p
- `42d4648d362d0ec1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwujz8zw-3.p
- `72b761c02fee1e1d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwujzmmd-4.p
- `375a15ff0971bf51.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk08jk-5.p
- `f4cafbbd7dc1f3d1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk0pob-6.p
- `3721628322199cea.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk16p3-7.p
- `84253ef8ce00c5d2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk25nc-8.p
- `2a0b1d2c4ebe6d4c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk2m44-9.p
- `cf2524dcddedd9b7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk337j-10.
- `f4957004c8ee1a9d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk4ddn-12.
- `ea83b4e90ceb6c9b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk4w24-13.
- `fd402febffdd2687.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk5dl8-14.
- `575961b50c025fae.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk5r9g-15.
- `967cca4490a116fa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuk7ixf-16.
- `c1aede26c24f0d36.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuke2rr-18.
- `4a8aeced5c8f58fb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwukejwa-19.
- `4acee4e23e618f74.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwukf67i-20.
- `7c3506c0e9e93ce7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwukfjtw-21.
- `5e91cb6da97565e9.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwukg62l-22.
- `d6ef235f2f4541db.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwukgix5-23.
- `13e98595ae74bac4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwukgu3i-24.
- `1c0341051960acce.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwukh83p-25.
- `23b10d9c4e943af1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwukhv18-26.
- `542dabea48656784.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwukig38-27.

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwumleea-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwummhcq-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwumodmh-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwumrs3a-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwumvwvk-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwumwjkp-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwumxklj-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwumypwh-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwumzbld-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwun0601-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwun0v03-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwun21j4-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwun2kqe-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwun3hn1-GM3-Components-Cards-Gu`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwunn86t-GM3-Components-Cards-Gu`

## [accessibility] illustrations

- `12c2be17ae784ace.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuobzmz-1.p
- `9a3132a21627eb14.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuodgu3-5.p
- `026dc480dbd39526.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuoeob6-6.p
- `16f8781ac94f356e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuonrmp-GM3
- `bb58b7952324f097.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuoolew-GM3
- `da911178916793ee.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuop9fg-GM3
- `b0489743980390dc.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm6gok77f-Components-Cards-A
- `543d16e45862e7ee.png` ← https://lh3.googleusercontent.com/UtnmXzj_hGKzI5R_xHaZroWQFz8QVFP84FZQS0iNVQIeJqE0-5q6CQGAszShyOylV59mHPIT3kyf
- `19733d5fc94c8f86.png` ← https://lh3.googleusercontent.com/kRZc33v7W2dec-MuK-hHKuYiBNxg2bd94Nl5lLgVpvf6JgZqUcU41USNzujmZqRUy3FjNddyFflM
- `356d0702a9a74600.png` ← https://lh3.googleusercontent.com/wN0u_0s9DujWzdKZlthDs80f4hCuXzU3GjK9hjJTmJoVxjtsU1av94BfcBJxrkIPPHyAo2Ym9_V3

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuonrmp-GM3-Components-Cards-Ac`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuoolew-GM3-Components-Cards-Ac`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuop9fg-GM3-Components-Cards-Ac`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fm6gok77f-Components-Cards-Accessibility-1-v01%2`
