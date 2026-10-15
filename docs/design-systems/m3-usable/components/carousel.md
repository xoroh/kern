# M3 component: carousel

_Archive: `m3-archive/spec/components/carousel/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/carousel/…_

## Overview (full text)

Carousel – Material Design 3
 Availability & resources Updates Differences from M2 Research Contain visual items like images or video, along with optional label text Six layouts:
 Multi-browse
 The multi-browse carousel layout shows at least one large, medium, and small carousel item at a time.
 ,
 uncontained
 The uncontained carousel layout show items that scroll to the edge of the container.
 ,
 uncontained multi-aspect ratio
 The uncontained multi-aspect ratio layout shows carousel items of various widths.
 ,
 hero
 The hero carousel layout shows at least one large and one small item at a time.
 ,
 center-aligned hero
 The center-aligned hero carousel layout shows at least one large and two small items at a time. The large item is centered.
 and
 full-screen
 The full-screen carousel layout shows one edge-to-edge large item at a time and scrolls vertically.
 Layouts can be start-aligned or center-aligned Item visuals have a parallax effect when scrolled Items change size as they move through the carousel pause Carousels can show items of various sizes Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Unavailable Close Updates November 2025 New carousel layout:
 Uncontained multi-aspect ratio
 The uncontained multi-aspect ratio layout shows carousel items of various widths.
 2023 Additional layouts and configurations:
 Uncontained
 The uncontained carousel layout show items that scroll to the edge of the container.
 Full-screen
 The full-screen carousel layout shows one edge-to-edge large item at a time and scrolls vertically.
 Centered carousels
 The center-aligned hero carousel layout shows at least one large and two small items at a time. The large item is centered.
 Hero carousel layout
 The hero carousel layout shows at least one large and one small item at a time.
 Multi-browse layout
 The multi-browse carousel layout shows at least one large, medium, and small carousel item at a time.
 New carousel layout: uncontained multi-aspect ratio Differences from M2 This component is new in Material 3. Shape : Dynamic carousel items change shape when scrolled Motion : Carousel items move at a different speed than their content, creating a parallax effect Interaction : When scrolled, carousel items snap into place to maintain the same layout.
 Hero carousels
 The hero carousel layout shows at least one large and one small item at a time.
 swipe through one item at a time.
 Multi-browse carousels
 The multi-browse carousel layout shows at least one large, medium, and small carousel item at a time.
 scroll through many items at once. Hero carousels scroll through one large item at a time Research The Material Research Team conducted two studies (quantitative and qualitative) with over 200 participants to understand their perspectives of five different carousel designs. The studies measured their understanding of how to interact with each carousel, their expectations of the number of items in each design, and how they expected carousels to be used. Summary of findings: Participants thought carousels were a good way to explore many different kinds of content A previewed or squished item strongly indicated that there was more content to swipe through Participants expected around 10 items in a carousel that scrolled multiple items at once While some contexts were considered better for some carousel designs, all designs were considered similarly usable

## Key measurements (dp, extracted)

- ailable space. Small carousel items have a minimum width of 40dp and a maximum width of 56dp. Items chan
- alue Alignment Vertically centered Leading/trailing padding 16dp Top/bottom padding 8dp Padding between
- elements 8dp Large item width Dynamic, or user-set M
- edium item width Dynamic Small item width 40–56dp, dynamic Item corner radius 28dp Uncont
- tribute Value Alignment Vertically centered Leading padding 16dp Top/bottom padding 8dp Padding between
- elements 8dp Item corner radius 28dp Uncontained mut
- ulti-aspect ratio carousels only have leading padding, with 8dp of padding between items. Attribute Val
- ue Alignment Vertically centered Leading padding 16dp Top/bottom padding 8dp Padding between
- elements 8dp Item corner radius 28dp Hero The
- alue Alignment Vertically centered Leading/Trailing padding 16dp Top/bottom padding 8dp Padding between
- elements 8dp Large item width Dynamic Small item wid
- th 40-56dp, dynamic Item corner radius 28dp Center
- th 40-56dp, dynamic Item corner radius 28dp Full-s
- Attribute Value Alignment Centered Leading/Trailing padding 0dp Top/bottom padding 0dp Padding between
- elements 16dp
- Window widths smaller than 600dp, such as a phone in portrait orientatio
- Window widths from 600dp to 839dp, such as a tablet or foldable
- e and available space. Small items have a width range of 40–56dp. Large item Small item When the large i
- carousel items The Show all button should have a padding of 4dp If the carousel has a header, you can u
- the leading edge, and the arrow icon should have a size of 48dp Avoid customizing the accessibility sol

## Accessibility (full text)

Carousel – Material Design 3
 Use cases Requirements on scrolling pages Interaction & style Keyboard navigation Labeling elements Reduced motion Use cases Users should be able to do the following with assistive technology: Navigate to the carousel container Navigate between different carousel items Activate a carousel item Skip over the carousel items Requirements on scrolling pages On vertically-scrolling pages, carousels require an accessible way to view all the items without horizontally scrolling. (This requirement doesn't apply to
 full-screen carousels
 The full-screen carousel layout shows one edge-to-edge large item at a time and scrolls vertically.
 .) Material recommends adding a Show all button below the carousel, which opens a dedicated vertically-scrolling page of all carousel items. pause Carousels without headers should use a Show all button to view all carousel items The Show all button should have a padding of 4dp If the carousel has a header, you can use an arrow icon button instead. Place the arrow icon directly next to the header or in the same row. Make sure the header is also displayed on the page of all carousel items. pause Carousels with headers should use an arrow to view all carousel items Headers should align with the leading edge, and the arrow icon should have a size of 48dp Avoid customizing the accessibility solution when possible. However, if your product needs an alternative solution, consider adding a Show all button in nearby navigation, or add alternative control buttons close to the carousel. Avoid adding UI elements, like arrows or other icons, within or beside the carousel. close Don’t Avoid adding buttons into the carousel container or beside it. Place any buttons above or below the carousel. close Don’t Don't cover the carousel with buttons or other UI Interaction & style Touch Tapping on a carousel item changes the shape slightly, and creates a touch ripple for interaction feedback. pause Touch: Tap Cursor The
 hover state
 A hover state communicates when a user has placed a cursor above an interactive element.
 More on hover state
 provides a visual cue that the carousel item is interactive. When the carousel item is clicked (in both active and inactive states), a ripple appears for interaction feedback. pause Cursor: Hover, click Initial focus When navigating to a carousel using assistive technology, use Tab to place initial focus on the first carousel item. Then, use Tab or the arrow keys to navigate the carousel items. Use the up and down arrow keys to leave the carousel and focus on the next element on the page, like the Show all button. check Do Set initial focus on the first carousel item, and use arrows to navigate items close Don’t Avoid focusing on the carousel container Keyboard navigation Keys Actions Tab or Arrows Moves to the previous or next carousel item Space or Enter Activates the
 focused
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 carousel item Labeling elements The carousel container has the container role. The carousel container is labelled appropriately and has the container role Each carousel may have a different number of items, so the label reads out the total amount of items and the current item in focus. The carousel item label indicates the current item in focus and the total number of items Reduced motion When reduced motion settings are turned on, the parallax effect should be removed and carousel items should no longer expand as they come into view. All items are the same size. Make sure carousels with reduced motion reach the edges of the window to avoid clipping visuals. pause Default carousel for multi-scroll Carousel with reduced motion settings turned on For
 hero carousels
 The hero carousel layout shows at least one large and one small item at a time.
 with reduced motion, the small carousel item is only partially shown on screen. pause Default carousel for single-scroll Carousel with reduced motion settings turned on

## Specs (full text)

Carousel – Material Design 3
 Tokens & specs Color States Carousel item dynamic widths Multi-browse Uncontained Uncontained mutli-aspect ratio Hero Center-aligned hero Full-screen Container Large carousel item Medium carousel item Small carousel item Tokens & specs Browse the component elements, attributes, tokens, and their values. Carousel item arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Hover keyboard_arrow_down folder Focus keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down folder Disabled keyboard_arrow_down Close Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Carousel color roles used for light and dark schemes: Container Surface States
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Enabled Hovered Focused Pressed Disabled Carousel item dynamic widths All kinds of carousel items dynamically adapt to the width of the container. Large items have a customizable maximum width that's used to optimally fit carousel items into the available space. Small carousel items have a minimum width of 40dp and a maximum width of 56dp. Items change size as they move through the carousel layout. Small carousel items have a minimum and maximum width Multi-browse The
 multi-browse layout
 The multi-browse carousel layout shows at least one large, medium, and small carousel item at a time.
 shows at least one large, medium, and small carousel item. Container Large carousel item Medium carousel item Small carousel item Measurements Multi-browse carousels have padding on both sides of the container Attribute Value Alignment Vertically centered Leading/trailing padding 16dp Top/bottom padding 8dp Padding between elements 8dp Large item width Dynamic, or user-set Medium item width Dynamic Small item width 40–56dp, dynamic Item corner radius 28dp Uncontained The
 uncontained
 The uncontained carousel layout show items that scroll to the edge of the container.
 layout shows items that scroll to the edge of the container. Container Large carousel item Measurements Uncontained carousel items bleed over the padding on each side when scrolling Attribute Value Alignment Vertically centered Leading padding 16dp Top/bottom padding 8dp Padding between elements 8dp Item corner radius 28dp Uncontained mutli-aspect ratio The uncontained multi-aspect ratio layout shows carousel items of various widths. Container Carousel item (16:9) Carousel item (9:16) Carousel item (1:1) Carousel item (3:4) Measurements Uncontained multi-aspect ratio carousels only have leading padding, with 8dp of padding between items. Attribute Value Alignment Vertically centered Leading padding 16dp Top/bottom padding 8dp Padding between elements 8dp Item corner radius 28dp Hero The
 hero layout
 The hero carousel layout shows at least one large and one small item at a time.
 shows at least one large item and one small item. Container Large carousel item Small carousel item Measurements Hero carousels have padding on both sides of the container Attribute Value Alignment Vertically centered Leading/Trailing padding 16dp Top/bottom padding 8dp Padding between elements 8dp Large item width Dynamic Small item width 40-56dp, dynamic Item corner radius 28dp Center-aligned hero The center-aligned hero layout shows at least one large item and two small items. Container Large carousel item Small carousel item Measurements Center-aligned hero carousels have padding on both sides of the container Attribute Value Alignment Vertically centered Leading/Trailing padding 16dp Top/bottom padding 8dp Padding between elements 8dp Large item width Dynamic Small item width 40-56dp, dynamic Item corner radius 28dp Full-screen The
 full-screen layout
 The full-screen carousel layout shows one edge-to-edge large item at a time and scrolls vertically.
 shows one edge-to-edge large item. Container Large carousel item Measurements Full-screen carousels fill the window edge-to-edge Attribute Value Alignment Centered Leading/Trailing padding 0dp Top/bottom padding 0dp Padding between elements 16dp

## Guidelines (full text)

Carousel – Material Design 3
 Usage Anatomy Adaptive design Behavior Carousel items adapt dynamically based on breakpoint Usage Carousels display a scrollable list of items. Carousel items emphasize visuals, but can also contain brief text that adapts to the item size. There are four carousel layouts:
 Multi-browse
 The multi-browse carousel layout shows at least one large, medium, and small carousel item at a time.
 Uncontained
 The uncontained carousel layout show items that scroll to the edge of the container.
 Hero
 The hero carousel layout shows at least one large and one small item at a time.
 Full-screen
 The full-screen carousel layout shows one edge-to-edge large item at a time and scrolls vertically.
 All of these layouts can be centered, though
 center-aligned hero
 The center-aligned hero carousel layout shows at least one large and two small items at a time. The large item is centered.
 is the most common centered carousel. Carousels can scroll in two ways: Default : Standard scrolling. Recommended for uncontained layouts. Snap-scrolling : Scrolled items snap to the carousel's layout. Recommended for multi-browse, hero, and full-screen layouts A carousel can contain different sized items Choose the best carousel layout for your product. Some layouts are more visual-focused, while others are more customizable. Layout Best used for Multi-browse Browsing many visual items at once (like photos), dynamic designs Uncontained Highly-customized or text-heavy carousels, stacked imaged and text, traditional carousel behavior Hero Spotlighting very large visual items (like a movie or featured app) Center-aligned hero Centered, large visual items Full-screen Vertically-scrolling video or image feeds, immersive experiences Carousel items must be fully visible on-screen (except for the
 uncontained layout
 The uncontained carousel layout show items that scroll to the edge of the container.
 ). When scrolled, items automatically change size and snap into place to maintain the same layout. check Do Set the large carousel item size to ensure the images and text are easy to read and recognize close Don’t Avoid setting carousel items so small that the image isn't recognizable Accessibility requirements on scrolling pages On vertically-scrolling pages, carousels require an accessible way to view all the items without horizontally scrolling. (This requirement doesn't apply to
 full-screen carousels
 The full-screen carousel layout shows one edge-to-edge large item at a time and scrolls vertically.
 .) Material recommends adding a Show all button below the carousel, which opens a dedicated vertically-scrolling page of all carousel items. If the carousel has a header, you can use an arrow icon button instead. View the accessibility tab for more details and alternate solutions. pause Make sure users can scroll vertically through all carousel items Multi-browse The
 multi-browse layout
 The multi-browse carousel layout shows at least one large, medium, and small carousel item at a time.
 is best for browsing many items at once, like photos or event feeds. Snap-scrolling is recommended to ensure items are recognizable and consistently sized. On larger screens, more large and medium items are visible in this layout. Avoid using this layout if the carousel items need lots of text or have complicated imagery. pause A multi-browse layout has different sized items within the carousel At
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , only show up to three carousel items if they have text. If you need to show more than three items, make sure the images and content are easy to understand and recognize. exclamation Caution At compact breakpoints, only show more than three items if the items are easy to understand and recognize Uncontained The
 uncontained layout
 The uncontained carousel layout show items that scroll to the edge of the container.
 is most similar to a traditional carousel, where items are a single size and flow past the edge of the screen. Both default scrolling and snap-scrolling work well with this layout. Since items don't change size, this layout can be customized to show more text or other UI above or below each item without the text being masked or cropped. pause Carousel items are all the same size in an uncontained layout Uncontained multi-aspect ratio The
 uncontained multi-aspect ratio
 The uncontained multi-aspect ratio layout shows carousel items of various widths.
 carousel has the same layout as the uncontained carousel but contains items of various sizes. Item widths can range anywhere between 9:16 for min width size to 16:9 for max width. Only use this carousel layout if the items have various widths. pause Carousel items are of various sizes in an uncontained multi-aspect ratio layout Hero The
 hero layout
 The hero carousel layout shows at least one large and one small item at a time.
 is best for spotlighting content that needs more attention, like movie, shows, or other media thumbnails. It highlights one large image to focus on, while providing a sneak peek of what’s next. On larger screens, more large items are visible. Use snap-scrolling so users can easily cycle through items one at a time. pause A hero carousel at a compact breakpoint should show one large item and one small item Center-aligned hero When the
 hero layout
 The hero carousel layout shows at least one large and one small item at a time.
 is center-aligned, it adds an additional previewed item on the leading edge, making the large carousel item centered. pause A centered hero carousel has two small carousel items, with a large item centered Full-screen The
 full-screen layout
 The full-screen carousel layout shows one edge-to-edge large item at a time and scrolls vertically.
 is best used for immersive experiences like video articles, featured headlines, or items that are visually rich. It can contain text and other UI elements on top of the image. This layout works best with content that is taller than it is wide, and scrolls vertically. It only works in portrait orientation in compact and
 medium breakpoints
 Window widths from 600dp to 839dp, such as a tablet or foldable in portrait orientation.
 More on medium breakpoints
 . Don't use this layout in landscape orientation. Use snap-scrolling for full-screen layouts. Don't use default scrolling. pause Full-screen carousels fill the entire content area of the screen Anatomy Multi-browse carousel (left) and hero carousel (right): Container Large carousel item Medium carousel item Small carousel item Container The carousel container holds all carousel items. The number of carousel items visible in the container can change based on the carousel
 layout
 Layout is the visual arrangement of elements on the screen.
 More on layout
 and
 breakpoint
 Breakpoints are opinionated window sizes where a layout changes to match available space, device conventions, and ergonomics (previously window size classes).
 More on breakpoints
 . The carousel container is a rectangle. It can be used in many ways and stretched to any size. Carousel items Carousel items hold content. A carousel item has no fixed width; it changes width depending on the breakpoint or its position in the carousel's layout. There are three dynamic widths an item can be: large , medium , and small . Large carousel item Medium carousel item Small carousel item Large items have a max width that can be adjusted. This changes how all other large, medium, and small carousel items fit on screen. Large items must remain big enough to be easy to understand and recognize. Medium items adjust width dynamically to the carousel size and available space. Small items have a width range of 40–56dp. Large item Small item When the large item's max width is narrow enough, more items can be shown on screen at once. At compact breakpoints, this is only recommended for carousels with simple imagery. Large item Medium item Small item Item text (optional) Carousel items are primarily visual. Item text is optional and should be brief. If your carousel items require a lot of text, consider using the
 uncontained layout
 The uncontained carousel layout show items that scroll to the edge of the container.
 , which can show more information, or use a series of
 cards
 Cards display content and actions about a single subject.
 More on cards
 instead. exclamation Caution Avoid exceeding two lines of text in carousel items at compact breakpoints unless the background is simple, like a single color Content within a carousel item can adapt dynamically based on the container and breakpoint. Text should always be understandable at each size. Consider adapting the text to use brief labels on smaller carousel items. Large carousel item with the full title and label text Medium carousel item hiding the title text Small carousel item abbreviating the label text Adaptive design As the carousel container size increases, so do the number of carousel items visible at a time. At
 compact breakpoints
 Window widths smaller than 600dp, such as a phone in portrait orientation.
 More on compact breakpoints
 , carousels can comfortably show up to three carousel items at once. At larger breakpoints, more carousel items are added and scale in size.
 Full-screen carousels
 The full-screen carousel layout shows one edge-to-edge large item at a time and scrolls vertically.
 only ever show one item at once. Carousels can show more items at once on larger screens Behavior Scrolling Carousel items have a parallax effect when they're scrolled. The default scrolling behavior doesn't snap items to a layout grid. They can stop anywhere in the container. Only use this for the
 uncontained layout
 The uncontained carousel layout show items that scroll to the edge of the container.
 . The snap-scrolling behavior aligns carousel items to the layout grid after they're scrolled. Items snap to the grid when released. Use this for
 multi-browse
 The multi-browse carousel layout shows at least one large, medium, and small carousel item at a time.
 ,
 hero
 The hero carousel layout shows at least one large and one small item at a time.
 , and
 full-screen layouts
 The full-screen carousel layout shows one edge-to-edge large item at a time and scrolls vertically.
 . pause Carousel items with snap-scrolling maintain the same layout when released In full-screen layouts, make sure the carousel items snap to the edges of the carousel container. Avoid letting them scroll freely or stop halfway. Full-screen layouts must use snap-scrolling. close Don’t Avoid scrolling freely on full-screen carousels

## [overview] illustrations

- `a20836c4de3897c4.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwur4ddz-3.p
- `c054be049a4276f4.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuthdnj-GM3
- `6c5dae3f9e8a0198.png` ← https://lh3.googleusercontent.com/Lhbh9uQp12eLXYQQxLl1F_mns62kBTEjWYFf1LYTZqIrv4hDh_JUSdRf84eiELD9pcGcGHdcyCxf
- `1d544f510b2ef484.png` ← https://lh3.googleusercontent.com/fVj4DyPx6HxKN7gxkVrxReCeNppE22Favi2407XaDtWc5AiUxr-xvwqelWFXfRaQ2AayTCiBEwL0

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuthdnj-GM3-Components-Carousel`

## [specs] illustrations

- `84b57caa13989234.png` ← https://lh3.googleusercontent.com/1SazYXoMFnNnFpmqXCe7pchjco1F_R03ws6GfweuJDv4cgafUAQ0l0P_8ELNDh-l8UEyycEhodtk
- `568f66548ad7806c.png` ← https://lh3.googleusercontent.com/4LmjbjezXxY7ctWR2bmLAa35m3No8ErHZO31L0jTLxRBc3ivUMC_DA5rDEEZRILu8VlJLE__deFf
- `0b852ad615330ab2.png` ← https://lh3.googleusercontent.com/Bfe7F5i-YHBu3MctH6XdfsSYD1VNZVWrAC2hTpG-vOuHgn1-npiiivwifJe1ddHkbRZxlXtKJuq0
- `4488aa89efa1afdd.png` ← https://lh3.googleusercontent.com/D7QutV1hQsVv50Nbn-UkT_BAJ4JRYAHLcohN50l4y2t5BDjn0pSq5jHk29phmxHU4H-UZszf7UaQ
- `64d0c40d8282fb36.png` ← https://lh3.googleusercontent.com/FM3l_rU4tOFqCVj-gmDwOG9zyWk279AI0tz5aHQa5hRW5v3P4cS3ydvtXKwZMy_ClxODMX76POeP
- `4f483d57988510f4.png` ← https://lh3.googleusercontent.com/I9ALEx4jwdluVMjRmR2zhTCFVHo3N05uccMHUOXxA1pAD-XMUdr9GNHJPfOT9mkNz862VyWH2ItN
- `369c2f7258598a58.png` ← https://lh3.googleusercontent.com/LOm-yrGl6Hmuxn-eQ995_1ZlFqkd90so8hX-xPss8PWGCyXWDJECAupl-paVut_4taB6DVA7OENO
- `6c5dae3f9e8a0198.png` ← https://lh3.googleusercontent.com/Lhbh9uQp12eLXYQQxLl1F_mns62kBTEjWYFf1LYTZqIrv4hDh_JUSdRf84eiELD9pcGcGHdcyCxf
- `ac3abd60c33393d9.png` ← https://lh3.googleusercontent.com/Mzrpy7os0Evw3KGIkxaFfkon8IgFJgpyqGgYD2DIMMbywuPHponDXt8yaG9F6u0lJAhluoYHtJE1
- `4f899a0071e11a96.png` ← https://lh3.googleusercontent.com/Py7GKPNbLAGSs7Zx0w19v21_MWZgZSX5ztGYvSQ8bDM4DeZ-ilsU5Ra3bR2_24qAgkiEn8j7dTfd
- `266fbc113b833308.png` ← https://lh3.googleusercontent.com/SuFPyTcmkMVHYU4NubWqAMrraBaL0OAFzvUcuXPWlkmIsASj8fOjlwGNfNpl4LP9revB2iU8dc-o
- `9e33dcd61c64e656.png` ← https://lh3.googleusercontent.com/bn-epGZhbTWJijBRurEco_OYDKB-s-DEYMJgCwj7OSBbLJMEm34yEZY1AaKy2gEKjnMCT--UTHHq
- `7df6fa0d2edec962.png` ← https://lh3.googleusercontent.com/evx3sPQvpKArdG4MTkQQCOFPM387eGsABK9x_Ecv_LeJy23RGxJyVZU50_GThcTacMUgP5tuLoPO
- `5ed34bf6fcd5361f.png` ← https://lh3.googleusercontent.com/kHmHj0O9aT5Nlb2KyOQq6CWd8sRWmGjzg3TMKEzoHQLd9OG08KSdrH7g3vUxMkGebXOb17s3kAT6
- `5a926fef8885af7d.png` ← https://lh3.googleusercontent.com/l_O_4sY-OWT2K7Ot5jY_yhXxSErGV6Cu33URxwXPnt8D6oTDXh3oWlg5utAL2Iw0afdYNvkjpYZz
- `5a24ff67dea96d3d.png` ← https://lh3.googleusercontent.com/p9Q_QbNpwi3QeDBOCZ64MWO3Vm83NIV7SFc6IqJ7BPGlsGidp5FJdTOq4yVq6zCZkqkSf03SLJ2p
- `67d8e4a328d52ec7.png` ← https://lh3.googleusercontent.com/qo38AJlGFDaPzNKJX24tQG5PrvIQ_PRl0ZEmeh-7YE8FvikHGuh96N5ggGpDoOStYSzbhUAg0-36

## [guidelines] illustrations

- `584af5b7aee68865.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwusb1kq-1.p
- `f756bb92a58c6199.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwusbuoo-2.p
- `7670b21070dd35a6.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuscosc-3-d
- `c91804cf6387771a.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwusd3wu-3-d
- `2e8cffd912b379a0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwusga4v-6.p
- `4c2d17f4452bf18a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwushw0z-11.
- `36694c00b33ba711.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwusikhn-12.
- `d597877b00eaa347.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwusj1ii-13.
- `00b89286c82a68c5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwusjjti-14.
- `00d896d5c75a62fa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuslefr-15.
- `900915fdb1ba5e0d.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwusmns4-16.
- `8107258aff763bcb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuso0q8-18.
- `dffd2b704f094ff2.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuspl2g-20-
- `aa17868a47a2b1ee.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwusqbrm-17.
- `21b109c37314e47e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutlc75-GM3
- `1a8bdf48fb00366b.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutm3x8-GM3
- `18227ead7cbe2164.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutpwf6-GM3
- `2c04fc5d2676acb4.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutqti0-GM3
- `907149bcf1a0767c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuts7ja-GM3
- `fe28b0103be8259b.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutt19y-GM3
- `1d048ad76fdb7f3a.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutupr4-GM3
- `50f907348cd71ef8.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmgtvndn1-GM3
- `6c5dae3f9e8a0198.png` ← https://lh3.googleusercontent.com/Lhbh9uQp12eLXYQQxLl1F_mns62kBTEjWYFf1LYTZqIrv4hDh_JUSdRf84eiELD9pcGcGHdcyCxf

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutlc75-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutm3x8-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutpwf6-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutqti0-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuts7ja-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutt19y-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutupr4-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmgtvndn1-GM3_Expressive_Carousel`

## [accessibility] illustrations

- `209b7ce412d40fff.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwut0q8v-2.p
- `870a91a5dd5f2e25.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwut172a-4.p
- `f1004c03aba0250b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwut9phs-8.p
- `de2c61afae3dddb1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuta5uo-9.p
- `ff93c75a51308ba3.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutav24-10.
- `81c92d023a000177.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutbdy7-11.
- `c66190a38a09f24f.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutxg2r-GM3
- `9adbacefbfa2d52b.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutykt0-GM3
- `63cb262d8fbcd7a0.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuu2jae-GM3
- `f375f3360390213a.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuu32xk-GM3
- `ef31e750363920d7.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuu4mjv-GM3
- `75609f966652dd8c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuu5ddb-GM3
- `a23518cdfbb1d690.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwykx1vc-5a-
- `b264f76e4542c65a.bin` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwykxhsn-5b-
- `6c5dae3f9e8a0198.png` ← https://lh3.googleusercontent.com/Lhbh9uQp12eLXYQQxLl1F_mns62kBTEjWYFf1LYTZqIrv4hDh_JUSdRf84eiELD9pcGcGHdcyCxf

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutxg2r-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwutykt0-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuu2jae-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuu32xk-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuu4mjv-GM3-Components-Carousel`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwuu5ddb-GM3-Components-Carousel`
