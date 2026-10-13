# M3 component: time-pickers

_Archive: `m3-archive/spec/components/time-pickers/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/time-pickers/…_

## Overview (full text)

Time pickers – Material Design 3
 Availability & resources Differences from M2 Time pickers are modal and cover the main content Two variants:
 dial
 Dial time pickers let people set a time by moving a handle around the dial. They're often used for setting an alarm or calendar event.
 and
 input
 Input time pickers allow people to set a time using a keyboard. This option is accessible from any mobile time picker interface via the keyboard icon.
 People can select hours, minutes, or periods of time Make sure time can easily be selected by hand on a mobile device Time picker dial Time picker input Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Unavailable Close Differences from M2 Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 M2: Time pickers had different color mappings M3: Time pickers have new color mappings compatible with dynamic color

## Key measurements (dp, extracted)

- c Height Dynamic Headline alignment Left Top/bottom padding 24dp Left/right padding 24dp Time selector c
- ontainer Width 96dp Width (24h vertical) 114dp Height 80dp
- Period selector container Width (vertical layout) 52dp Height (vertical layout) 80dp Width (ho
- rizontal layout) 216dp Height (horizontal layout) 38dp Clock d
- ial container Size 256dp Clock dial selector handle Size 48dp Cl
- ock dial selector center Size 8dp Clock dial selector track Width 2dp Tim
- c Height Dynamic Headline alignment Left Top/bottom padding 24dp Left/right padding 24dp Time input fiel
- d container Width 96dp Height 72dp Period selector container W
- idth 52dp Height 72dp Configurations Vertical ori
- default option Targets Targets for dial selectors should be 48x48dp. Dial selector targets should be 48x48d

## Accessibility (full text)

Time pickers – Material Design 3
 Use cases Interaction & style Keyboard navigation Labeling elements Use cases People should be able to use assistive technology to: Select or enter hours/minutes, and in some cases, seconds/milliseconds Choose from multiple time formats, including 24-hour clock view and AM/PM Enter time selection manually using input fields Interaction & style Time pickers should allow manual time entry through text input, rather than exclusively through the dial selector. This makes it easier for those using keyboard
 inputs
 Inputs are devices that provide interactive control of an app. Common inputs are a mouse, keyboard, and touchpad.
 rather than touchscreens. If a screen is not large enough to display the dial selector, consider displaying the input selector alone. Currently for Android Views, the dial selector is always visible. The input selector should be accessible from the dial selector via the keyboard icon. This interaction allows multiple input methods and makes the time picker accessible for assistive technology users. For time selection that doesn’t require a dial view, make a time input picker the default option Targets Targets for dial selectors should be 48x48dp. Dial selector targets should be 48x48dp Keyboard navigation Keys Actions Tab Focus lands on (non-disabled) time slot Space or Enter Activates the (non-disabled) time slot Labeling elements If the input text is correctly linked, assistive tech like a screenreader will read the component’s role first, then the UI text. The hour and minute fields have the text input role The dial selector will read a selection of total hours, such as Hour 7 of 12 . A screen reader reads the text label of a dial selector Dial selector Element Accessibility label Role (Wiz and Jetpack Compose) Role (Android Views) Hour input (input picker) Hour Text input - Minutes input Minute Text input - AM/PM selection AM or PM Radio button (in list) Checkbox (in list) Keyboard button Toggle input picker Button Button Cancel button Cancel Button Button OK button OK Button Button Clock dial time selection (dial selector) {Value} Hours or minutes of {Total} Button - Input selector Element Accessibility label Role (Wiz and Jetpack Compose) Role (Android Views) Hour input (input picker) Hour Text input - Minutes input Minute Text input - Clock button Toggle dial picker Button Button Cancel button Cancel Button Button OK button OK Button Button

## Specs (full text)

Time pickers – Material Design 3
 Tokens & specs Anatomy Color States Measurements Configurations Tokens & specs Select a component variant below to see its elements, attributes, tokens, and their values. Learn more about design tokens Time picker - Dial arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Anatomy Time picker dial Headline Time selector separator Container Period selector container Period selector label text Clock dial selector center Clock dial selector track Text button Icon button Clock dial selector container Clock dial label text Clock dial container Time selector label text Time selector container Time picker input Headline Time input field seperator Container Period selector container Period selector label text Text button Icon button Time input field supporting text Time input field label text Time input field container Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Time picker dial color Time picker dial color roles used for light and dark themes: On surface variant On surface Surface container highest On surface Tertiary container On tertiary container Surface container high Outline On surface Primary On primary Primary On surface variant On surface Surface container highest On primary container Primary container Time picker input color Time picker input color roles used for light and dark themes: On surface variant On surface Surface container highest On surface Tertiary container On tertiary container Surface container high Outline On surface Primary On surface variant On primary container Primary container States Enabled Hover
 Focus
 Pressed States specs can be found in the token module above Measurements Time picker dial - vertical Vertical time picker dial padding and size measurements Element Attribute Value Container Width Dynamic Height Dynamic Headline alignment Left Top/bottom padding 24dp Left/right padding 24dp Time selector container Width 96dp Width (24h vertical) 114dp Height 80dp Period selector container Width (vertical layout) 52dp Height (vertical layout) 80dp Width (horizontal layout) 216dp Height (horizontal layout) 38dp Clock dial container Size 256dp Clock dial selector handle Size 48dp Clock dial selector center Size 8dp Clock dial selector track Width 2dp Time picker dial - horizontal Horizontal time picker dial padding and size measurements Element Attribute Value Container Width Dynamic Height Dynamic Headline alignment Left Top/bottom padding 24dp Left/right padding 24dp Time selector container Width 96dp Width (24h vertical) 114dp Height 80dp Period selector container Width (vertical layout) 52dp Height (vertical layout) 80dp Width (horizontal layout) 216dp Height (horizontal layout) 38dp Clock dial container Size 256dp Clock dial selector handle Size 48dp Clock dial selector center Size 8dp Clock dial selector track Width 2dp Time picker input Time picker input padding and size measurements Element Attribute Value Container Width Dynamic Height Dynamic Headline alignment Left Top/bottom padding 24dp Left/right padding 24dp Time input field container Width 96dp Height 72dp Period selector container Width 52dp Height 72dp Configurations Vertical orientation and horizontal orientation Vertical layout (default on mobile)
 Horizontal layout 24-hour time picker dial 24h dial in vertical layout (default on mobile)
 24h dial in horizontal layout 12-hour and 24-hour time picker inputs 12h input
 24h input

## Guidelines (full text)

Time pickers – Material Design 3
 Usage Anatomy Placement Adaptive design Behavior Dial selector time picker for a 12-hour clock Usage Time pickers allow people to enter a specific time value. They’re displayed in
 dialogs
 Dialogs provide important prompts in a user flow.
 More on dialogs
 and can be used to select hours, minutes, or periods of time. They can be used for a wide range of scenarios. Common use cases include: Setting an alarm Scheduling a meeting Time pickers are not ideal for nuanced or granular time
 selection
 Selection lets users choose specific items to act on.
 More on selection
 , such as milliseconds for a stopwatch application. check Do Hour selection in a mobile calendar picker Time input picker Time input pickers allow people to specify a time using keyboard numbers. This input option should be accessible from any other mobile time picker interface by tapping the keyboard icon. Hour input with keyboard entry 24-hour time selection The dial view can be changed to reflect time
 selection
 Selection lets users choose specific items to act on.
 More on selection
 across 24 hours. This option is set outside of the time picker component, typically through system settings. 24-hour dial view Anatomy Label (headline) Time selector separator Input field Input text Period selector (selected) Period selector text (selected) Container Period selector outline Period selector text Dial selector track Dial label (selected) Text buttons Icon button Dial label (unselected) Clock dial Input text (selected) Input field (selected) Label (headline) Time selector separator Input field Input text Period selector (selected) Period selector text (selected) Container Period selector outline Period selector text (unselected) Text buttons Icon button Input text (selected) Input field (selected) Container Like
 dialogs
 Dialogs provide important prompts in a user flow.
 More on dialogs
 , the container should appear above other screen elements. To focus attention, surfaces behind the container have a temporary scrim overlay to make them less prominent. The container includes all time picker elements Input selector The input selector is a unique kind of
 text field
 Text fields let users enter text into a UI.
 More on text fields
 input. It differs from typical text field inputs in that it has: An added highlight to call attention to the selected field A larger shape, size, and font A label below the field Hours and minutes should have separate inputs. For people using a 12-hour clock, an AM/PM selector appears to the right of minutes. For people using a 24-hour clock, the AM/PM selector shouldn’t appear. Input selector for a 12-hour clock Dial selector Dial selectors always mimic a round watch face. Hours and minutes can be selected by tapping a number or dragging the dial selector track. When representing a 12-hour dial, all numbers appear in the outer ring. When representing a 24-hour dial, even numbers appear in an inner ring, and odd numbers appear in an outer ring. Dial selector for a 12-hour clock Text & icon buttons
 Icon buttons
 Icon buttons help people take minor actions with one tap.
 More on icon buttons
 are used to switch between the input selector, represented by a keyboard, and the dial selector, represented by a clock.
 Text buttons
 Buttons let people take action and make choices with one tap.
 More on buttons
 are used to exit the
 dialog
 Dialogs provide important prompts in a user flow.
 More on dialogs
 ( Cancel ) and save the selector input ( OK ). The keyboard icon allows people to switch between the dial selector (pictured) and the input selector Landscape orientation The clock dial interface adapts to a device’s orientation. In landscape mode, the stacked input and selection options are positioned side-by-side. On mobile, the time picker can adapt to landscape orientation Placement Time pickers shouldn’t be obscured by other elements.   Time pickers should change orientation or variant to ensure they aren't cropped by the edge of the screen. Time pickers are modal windows above a scrim. This puts the time pickers at the forefront of a person's view, calling attention to make a
 selection
 Selection lets users choose specific items to act on.
 More on selection
 of time. The time picker should change to fit the size of the screen so the time picker is always fully visible Adaptive design Time pickers can swap between orientation or variant depending on device orientation and viewport constraints.  For example, the time picker can change to landscape orientation on larger breakpoints or when viewport height is limited, to avoid scrolling the dial presentation.  Time pickers can fallback to the
 input time picker
 Input time pickers allow people to set a time using a keyboard. This option is accessible from any mobile time picker interface via the keyboard icon.
 when there isn’t enough vertical real estate to present the landscape orientation without scrolling. High-density time picker displayed on mobile Density Don’t apply density to the time picker dial when the viewport is constrained. Instead, use an input picker. close Don’t Don’t apply density to the time picker dial when the viewport is constrained. Instead, use an input picker. Behavior There are two primary methods for selecting time with the mobile time picker. People can: Type in a specific value in the hour and minute fields Select the hour or minute field from the text input and adjust the clock dial to simultaneously change the corresponding time field above pause The dial time picker supports both manual and dial input Appearing & disappearing Like other kinds of
 dialogs
 Dialogs provide important prompts in a user flow.
 More on dialogs
 , time pickers use an enter and exit transition pattern to appear on the screen. To exit a time picker, the input can either be confirmed ( OK ) or dismissed ( Cancel ). Interacting outside of the dialog will also dismiss the time picker. Unless one of these actions is taken, a time picker will continue to retain focus. pause OK confirms the entry and closes the dialog Toggle between dial & input Tapping the keyboard icon on a mobile time picker switches the view to the
 input picker
 Input time pickers allow people to set a time using a keyboard. This option is accessible from any mobile time picker interface via the keyboard icon.
 . pause The keyboard icon in the lower left toggles between the input picker and the dial picker Scrolling Time pickers should avoid scrolling, and swap component orientation or variant based on device orientation or viewport size.  Time pickers don’t scroll with elements outside of the modal window, such as the background. Time pickers shouldn’t scroll

## [overview] illustrations

- `50f64d751adb24f5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcyz4dh2-01.
- `b6259eb208378843.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcz00a3d-02.
- `023874b6d4f0df70.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmcz04x96-03.
- `a6950fbacfe3594f.png` ← https://lh3.googleusercontent.com/edq1G3NVjMSEgPd8h-TBEZZ-_BUwcN4kXycHYfKK5YCKFTj0Lik3fIJpXpYv0ihTw0RBbn6CY1Hj

## [specs] illustrations

- `4dbfbc318d1c8a90.jpg` ← https://lh3.googleusercontent.com/2yPFvDOYGLJVQZMR6u6XxQe0yKZcdjOxZisoE_nNHnj72E4dyq2I8vSihXm2jbqhEwmtUaHOdrrc
- `0bd96ecd3a1cf6ea.jpg` ← https://lh3.googleusercontent.com/5OUv797RnNR2XL9-3tT1sy3rKIjyxF2D4rnITJ4nURQm20-jzkT7Mygba3MDoShEFegMNRkNUE38
- `eab1f99410b522ba.png` ← https://lh3.googleusercontent.com/FgpC_ZjE7NOxcqQBBUWoNg2IzyW6Wa2fUmWzGFf8nvuKlW2ZDSNovmYN5K645AAEsF9aGQKd904y
- `ee51128c0470621e.png` ← https://lh3.googleusercontent.com/MwlBqM5KsVnml1NDvUxDoQA_7yMRkFhQYxC5VMUBe1FPGKPR0t1b7y9pIT5Rn-gjTZX3O6ju0vY7
- `7c8aac7a4553c35d.png` ← https://lh3.googleusercontent.com/SWtG7bnOOsaGYyC_KZbnqnO2SdcEIquR2TiLO6WAIdja0IDe8P8OQ9OehHUxTYAhf1vXNKGrjkMe
- `798e901f058fb197.png` ← https://lh3.googleusercontent.com/WmiYd7XEBckVcinYGeo-3xr2eeeOOIIWF9dZ0VTU4ajlR6R63EP3LMH9AakmYwtl5XlTulsT_uJX
- `83fbaea68cd33eb5.png` ← https://lh3.googleusercontent.com/YLwHepIx8fINPXo6ZMe0kk0nFoE45b4o9Rvtdre11V6KVm_pbkSMOb4Ltiu4Sgk-NyG0M5t1Cs5g
- `a6950fbacfe3594f.png` ← https://lh3.googleusercontent.com/edq1G3NVjMSEgPd8h-TBEZZ-_BUwcN4kXycHYfKK5YCKFTj0Lik3fIJpXpYv0ihTw0RBbn6CY1Hj
- `da6bb1d4f4acfc4d.png` ← https://lh3.googleusercontent.com/fEL90tTIe0i1cDIA4nKzUlbA5mbzo5VJxmQrzgNnf2RF1SiZXQ3szYwn4PancFx48zU5hY-Kx_GL
- `a0e9f1e06c9b7e90.png` ← https://lh3.googleusercontent.com/oh1OcUsaz4lc3Bj48OezLBgBFvrMsglz1zYFK0mO9Cf8GuLmflhif0VpKC57fGOLp8xxpj2C9Vp9
- `977b6061ad84f51d.png` ← https://lh3.googleusercontent.com/pTsIaFUPD07juD1tkEAvb1p0JJU1I0QmuQdvKL7rBgtjB7hWWTAGzoRFAag-kQi9AYqTpJixai14
- `8eaeed5fe2fb32a0.png` ← https://lh3.googleusercontent.com/tS5QmHOdLQaGFzVS3OBV8hKVk1lcswec2uan7b-7CS_hhmglq3X45gYIkux28kcLyIRqYhetBz8x

## [guidelines] illustrations

- `32a72b43bd48e710.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7tgqq3-12.
- `5e8e8c7f3d992bd1.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8wa0wg-GM3
- `d563dfc1246d84b2.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8waqdc-GM3
- `977b5f90b452f27d.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8wbaye-GM3
- `8b723b965964f8ce.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2pwu0i-01.
- `d68979c1374f588f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2q22nz-02.
- `2a6f5b63cceb2354.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2q5unb-03.
- `acc283a23b238511.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2q7fdq-04.
- `7786911e75a25dd7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2u47yh-05.
- `5745bc3cb29f13e1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2u4xoe-06.
- `54c2d5261ee33956.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2u8t61-07.
- `8ab85b10458cf6ee.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2ugmkj-08.
- `5dd1bb7a470c6ac5.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2uji74-09.
- `89cf345edf472c12.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2uqf01-10.
- `e6906ad1c8797f3a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2uzinf-13.
- `b0ba5b7128aec44b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2v1wt2-14_
- `973eeef273d49809.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2v8xeq-18.
- `bb7cc04ddcaafb57.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2wil5z-11.
- `a6950fbacfe3594f.png` ← https://lh3.googleusercontent.com/edq1G3NVjMSEgPd8h-TBEZZ-_BUwcN4kXycHYfKK5YCKFTj0Lik3fIJpXpYv0ihTw0RBbn6CY1Hj

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8wa0wg-GM3-Components-TimePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8waqdc-GM3-Components-TimePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw8wbaye-GM3-Components-TimePick`

## [accessibility] illustrations

- `9675ccbb38166354.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2w3xxn-01.
- `89076ab708d0d07f.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2w61b9-02.
- `236e21b8a33588d7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2w8i4o-03.
- `03e308fdd59cd14b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd2w9ugu-04.
- `a6950fbacfe3594f.png` ← https://lh3.googleusercontent.com/edq1G3NVjMSEgPd8h-TBEZZ-_BUwcN4kXycHYfKK5YCKFTj0Lik3fIJpXpYv0ihTw0RBbn6CY1Hj
