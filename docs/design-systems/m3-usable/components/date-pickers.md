# M3 component: date-pickers

_Archive: `m3-archive/spec/components/date-pickers/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/date-pickers/…_

## Overview (full text)

Date pickers – Material Design 3
 Availability & resources Differences from M2 Date pickers can display past, present, or future dates Three variants:
 docked
 Docked date pickers open from an onscreen input similar to a text field. They're often used within forms.
 More on docked date pickers
 ,
 modal
 Modal date pickers extend full-screen. They're often used for selecting a date range.
 More on modal date pickers
 ,
 modal input
 Modal date inputs allow the manual entry of dates using the numbers on a keyboard. They're often used in compact layouts.
 More on modal date inputs
 Clearly indicate important dates, such as current and selected days Follow common patterns, like a calendar view Docked date picker Modal date picker Modal date input Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Unavailable Close Differences from M2 Typography and spacing: Titles and labels are larger and have increased spacing to accommodate 48dp target size Color: New color mappings and compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Variants: The three variants of date pickers have been renamed to not be device-dependent. The former desktop date picker is now known as the
 docked date picker
 Docked date pickers open from an onscreen input similar to a text field. They're often used within forms.
 More on docked date picker
 . The former mobile date picker and date input are now known as
 modal date picker
 Modal date pickers extend full-screen. They're often used for selecting a date range.
 More on modal date picker
 and
 modal date input
 Modal date inputs allow the manual entry of dates using the numbers on a keyboard. They're often used in compact layouts.
 More on modal date input
 to reinforce that the user must take an action. M2: Date pickers had a drop shadow and different color mappings M3: Date pickers have larger typography, no shadow, and new color mappings compatible with dynamic color

## Key measurements (dp, extracted)

- labels are larger and have increased spacing to accommodate 48dp target size Color: New color mappings a
- Window widths 840dp to 1199dp, such as a tablet or foldable
- . Interactive targets for all elements meet Material's 48x48dp minimum touch target requirement. Incre
- ability to switch to the modal date input Touch targets are 48x48dp Date entry methods The date entry compo

## Accessibility (full text)

Date pickers – Material Design 3
 Use cases Interaction & style Date entry methods Accessible date input Optional Clear button Affordance for keyboard shortcuts Truncated labels & tooltips Color contrast between dates Keyboard navigation Labeling elements Screen reader verbalizations Use cases People should be able to: Enter dates manually by inputting text, without using the picker Use multiple input methods, making it accessible to those using assistive technology On the
 docked date picker
 Docked date pickers open from an onscreen input similar to a text field. They're often used within forms.
 More on docked date picker
 , the text field can be used for input. On the
 modal date picker
 Modal date pickers extend full-screen. They're often used for selecting a date range.
 More on modal date picker
 , the date input option should be available using the edit icon. Interaction & style The edit icon indicates the ability to switch to the
 modal date input
 Modal date inputs allow the manual entry of dates using the numbers on a keyboard. They're often used in compact layouts.
 More on modal date inputs
 . Interactive targets for all elements meet Material's 48x48dp minimum touch target requirement. Increasing density would negatively impact
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 by limiting tappable/clickable targets. The edit icon indicates the ability to switch to the modal date input Touch targets are 48x48dp Date entry methods The date entry component offers two ways to enter a date: Direct text entry into a text field Through the date picker The calendar icon is the exclusive entry point for the date picker. This improves efficiency for a screen reader and other keyboard users, as it makes interaction with the date picker optional and reduces the amount of key presses required to input a date. Each input is a separate tab stop, which improves discoverability of the control. Entering a date either through direct text entry or the date picker Accessible date input Automatically format the date after the user hits “Enter“ or navigates out of the text field. Don't automatically format the date by adding slashes or other special characters while the user is typing (also known as input masks). This can cause confusion for people using screen readers because it changes what they typed.   To reduce errors, accept a range of formats including dashes, spaces, slashes, dots, and 0 to the left of a single digit month/day. This is especially helpful for assistive technology users who might be more prone to errors when interacting with complex inputs. The text field's logic can adapt to the user's actual input format, applying the correct formatting after the user has completed their text entry Optional Clear button If it's not needed for your use case, remove the Clear button from the screen to reduce the number of tab stops for keyboard users. Remove non-critical actions to reduce the number of tab stops for keyboard users Affordance for keyboard shortcuts Ensure keyboard shortcuts are readily available for keyboard and screen reader users by providing the shortcut key in the
 tooltip
 Tooltips display brief labels or messages.
 More on tooltips
 . It should be included in the hint description to be read out by the screen reader. As shown here, the previous year button is interactive and can therefore be focused via the keyboard. Upon
 focus
 A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.
 More on focused state
 , the tooltip explains the behavior of the button and shows the shortcut key. Keyboard tooltip example for date picker Truncated labels & tooltips Truncating labels isn't ideal, but tooltips allow the full text to be shown on
 hover
 A hover state communicates when a user has placed a cursor above an interactive element.
 More on hover state
 or keyboard focus. Days of the week are not interactive and are therefore not focusable via keyboard, yet the tooltip is available on hover. The date picker relies on the conventionality of these abbreviations for some assistive technology users. Days of the week are not navigable via keyboard, so the tooltip is shown only on pointer hover Color contrast between dates Dates should have contrast of at least 4.5:1 between the link text colors and the background. Dates pass the 4.5:1 contrast minimum Keyboard navigation Keys Actions Enter/return Enter/return Enter/return Closes the calendar and saves the selected date Page up/down Move to the same date on next/previous month Home/End Move to the first day of the month Shift + Page up/down Moves to the same date in the next/previous year Shift + M Moves to the month list dropdown Shift + Y Moves to the year list dropdown Labeling elements The text field's accessibility label should clearly state the purpose of the input (for example, event date or reservation date) and should match the placeholder text when the field is empty. The helper text (below the text field) should specify the date format (for example, MM/DD/YYYY or YYYY/MM/DD) and act as a description for the text field. The default helper text is "MM/DD/YYYY," but this can be customized. The accessibility label clearly states the kind of input as an event date Element A11y label Role Previous / next month and year “{label}” Button Month and year dropdowns “{label}” Button Days of the week Column header Month grid Grid Screen reader verbalizations To support screen reader users, labels are used to enumerate the complete date. This allows screen reader users to hear the full context of "Monday, August 17” instead of just part of the date. Screen readers will state the full day, month, date, and year instead of just the number 17

## Specs (full text)

Date pickers – Material Design 3
 Tokens & specs Docked date picker Modal date picker Modal date input Element states Tokens & specs Select a component variant below to see its elements, attributes,
 tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 , and their values. Date picker - Docked arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Docked date picker Outlined text field Menu button: Month selection Menu button: Year selection Icon button Weekdays label text Unselected date Today’s date Outside month date Text buttons Selected date Container Outlined text field Menu button: Month selection (pressed) Menu button: Year selection (disabled) Header Menu Selected list item Unselected menu list item Container Docked date picker color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Docked date picker color roles used for light and dark themes: Primary On surface variant On surface variant On surface On surface Primary On surface variant Primary Surface container high Primary On primary Docked date picker menu color roles used for light and dark themes: Primary On surface variant On surface Outline variant Surface container high Surface variant On surface Docked date picker measurements Docked date picker padding and size measurements Docked date picker month menu padding and size measurements Docked date picker configurations Day selection Month selection Year selection Modal date picker Headline Supporting text Header Container Icon button Icon buttons Weekdays Today’s date Unselected date Text buttons Selected date Menu button Divider Headline Supporting text Header Container Icon button Unselected year Selected year Text buttons Divider Menu button Headline Supporting text Icon button Header Text button Icon button Weekdays label text Container Today’s date Unselected date In-range active indicator In-range date Month subhead Selected date Divider Modal date picker color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Modal date picker color roles used for light and dark themes in a day selection menu: On surface On surface variant Surface container high On surface variant On surface variant On surface Primary On surface Primary Primary On surface variant Outline variant Modal date picker color roles used for light and dark themes in a year selection menu: On surface On surface variant Surface container high On surface variant On surface variant Primary Primary Outline variant On surface variant Modal date picker range selector color roles used for light and dark themes: On surface On surface variant On surface variant Surface container high Primary On surface variant On surface Primary On surface Secondary container On secondary container Outline variant On surface variant Primary Modal date picker measurements Modal date picker padding and size measurements Modal date picker year selector padding and size measurements Modal date picker date range selector padding and size measurements Modal date picker configurations Single date selection Date range selection Year selection Modal date input Headline Supporting text Header Container Icon button Outlined text field Text buttons Divider Modal date input color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Modal date input color roles used for light and dark themes: On surface On surface variant Surface container high On surface variant Primary Primary Outline variant Modal date input measurements Modal date input padding and size measurements Modal date input configurations Single date input Date range input Element states States for date and year selection: Default (enabled) Disabled Hovered Focused Pressed (ripple)

## Guidelines (full text)

Date pickers – Material Design 3
 Usage Anatomy Docked date picker Modal date picker Modal date input Docked date picker on desktop Usage Date pickers let people select a date or range of dates. They should be suitable for the context in which they appear. Date pickers can be embedded into:
 Dialogs
 Dialogs provide important prompts in a user flow.
 More on dailogs
 on compact breakpoints like mobile
 Text field
 Text fields let users enter text into a UI.
 More on text fields
 drop-downs on medium and
 expanded breakpoints
 Window widths 840dp to 1199dp, such as a tablet or foldable in landscape orientation, or desktop.
 More on expanded breakpoints
 like tablet and desktop Date picker dialog on mobile
 Date picker text field dropdown on desktop There are three variants of date pickers: Docked date picker Modal date picker Modal date input 1. Docked date picker 2. Modal date picker 3. Modal date input Anatomy Docked date picker Text field Menu button Icon button Label text Menu Text buttons Container 1. Text field 2. Menu button 3. Menu Modal date picker Headline Supporting text Container Icon button Previous/next month buttons Day of week labels Today’s date Unselected date Text buttons Selected date Menu button Divider Headline Supporting text Container Icon button Unselected year Selected year Text buttons Divider Menu button Modal date input 1. Headline 2. Supporting text 3. Container 4. Icon button 5. Date input 6. Text buttons 7. Divider Full-screen date picker 1. Headline 2. Supporting text 3. Icon button 4. Container 5. Text button 6. Icon button 7. Divider 8. Day of week labels 9. Today’s date 10. Selected date range 11. Unselected date 12. Text buttons 13. Selected date range start date 14. Month label Docked date picker Usage Docked date pickers allow the
 selection
 Selection lets users choose specific items to act on.
 More on selection
 of a specific date and year. The docked date picker displays a date
 input
 Inputs are devices that provide interactive control of an app. Common inputs are a mouse, keyboard, and touchpad.
 field by default, and a dropdown calendar appears when the user taps on the input field. Either form of date entry can be interacted with. Docked date pickers are ideal for navigating dates in both the near future or past and the distant future or past, as they provide multiple ways to select dates. Docked date picker on desktop Behavior Dates can be added by using a keyboard or by navigating the calendar UI; both options are immediately available when the docked date picker is accessed. Docked date picker pause Docked date pickers adjust size dynamically pause The year selection menu replaces the calendar view Month selection Month
 selection
 Selection lets users choose specific items to act on.
 More on selection
 can be navigated with the corresponding back and next arrows or by tapping the dropdown menu. Docked date picker month selection Year selection Year selection can be navigated with the corresponding back and next arrows or by tapping the dropdown menu. Docked date picker year selection Modal date picker Behavior Modal date pickers navigate across dates in several ways: To navigate across months, swipe horizontally To navigate across years, scroll vertically To access the year picker, tap the year Don’t use a modal date picker to prompt for dates in the distant past or future, such as a date of birth. In these cases, use a modal input picker or a docked date picker instead. pause To navigate across months, swipe horizontally pause To navigate across years, tap the year picker and scroll vertically Date range selection Date range selection provides a start and end date. Common use cases include: Booking a flight Reserving a hotel Modal date pickers navigate across date ranges in several ways: To select a range of dates, tap the start and end dates on the calendar T o navigate across months, scroll vertically pause Modal date range picker pause Modal date range picker with vertical scroll Modal date input Usage Modal date inputs allow the manual entry of dates using the numbers on a keyboard. People can input a date or a range of dates in a dialog. Modal date with manual input check Do For dates that don’t require a calendar view, the modal date input can be the default view check Do Alternatively, a text field with appropriate hint text can prompt for dates, such as in a form Behavior You can swap between the
 modal date picker
 Modal date pickers extend full-screen. They're often used for selecting a date range.
 More on modal date pickers
 and
 modal date input
 Modal date inputs allow the manual entry of dates using the numbers on a keyboard. They're often used in compact layouts.
 More on modal date inputs
 using the edit or calendar icon. pause Switching from a modal date picker to a mobile date input for selecting ranges pause Switching from a modal date picker to a modal date input for selecting a single date Compact breakpoint On compact breakpoints , such as mobile, a full-screen
 modal date picker
 Modal date pickers extend full-screen. They're often used for selecting a date range.
 More on modal date picker
 is recommended to increase readability and touch target size. It can cover the entire screen. A full-screen modal date picker on mobile Medium and expanded breakpoints The docked date picker works best for medium and expanded breakpoints. It displays a date input field by default, and a dropdown calendar appears when a person taps on the input field. A person can interact with either form of date entry. Docked date pickers are ideal for navigating dates in both the near future or past, and in the distant future or past, as they provide multiple ways to select dates. A docked date picker with a full calendar view is best used on larger devices Selection Selection is indicated through color, drawing visual attention. In date ranges, start and end dates are selected, while dates in-between appear connected with a subtle highlight. pause Differences between selected the selected date range (August 17–23) and today's date (August 5) are shown through color and fill Appearing and disappearing Like other kinds of dialogs, modal date pickers use an enter and exit transition pattern to appear on the screen. To exit a date picker, the input can either be confirmed ( OK ) or dismissed ( Cancel ). Interacting outside of the dialog will also dismiss the
 time picker
 Time pickers help users select and set a specific time.
 . Unless one of these actions is taken, a time picker will continue to retain focus. Mobile full-screen pickers also have an additional close affordance (x) icon button and Save confirmation. Docked date pickers appear just below the input field. pause Modal date pickers can be dismissed through interacting with content outside the dialog, or with the action buttons in the lower right pause Interacting with the input for a docked date picker makes the calendar view appear below Responsive layout The sizing of the docked and modal date picker components don’t scale responsively to different breakpoints. close Don’t Don’t scale the date picker responsively to a larger size

## [overview] illustrations

- `64a5db4e2431e050.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fle4qmou9-1P-
- `1b7b80fe84d67b49.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5mxu7o-01.
- `46b71c61c26e8e6d.png` ← https://lh3.googleusercontent.com/HWA4owUgCVU0oIuTW-9x1wyLuHIA6m_aaks97Ih_BEz-wvMRKQqmb8-FsElnU5Jxck9-Hi-br9L5
- `9521ec76541db266.png` ← https://lh3.googleusercontent.com/YMcDQwccIYdZQCclnmL3BQj8juhrhmwZnKP5tOPuggWxqQp1nUwzSiM2kb452O-rXM93BVfEwbrC

## [specs] illustrations

- `ada281110489f6a3.png` ← https://lh3.googleusercontent.com/-H_XlEpqZPu5-zavBZl448ZPXeg3RwDWwmtidrkSwPBcUKrXk0b_4uZrjvsdt-chOrMLLquYznzK
- `fd41bea5cdf92016.png` ← https://lh3.googleusercontent.com/6XspP-OQE7aCNEQ93nEte0mKmgkyvY2j9jfFYbQHtiUK-tfwKvK1ncuufXe5RMFHSrGkqZSvzbPT
- `e6806878ba654e61.png` ← https://lh3.googleusercontent.com/8dm3XqLpo47xIT6RMfiGCFeylnMi_-bxLabwkeigMuXB6e17c35Pf_uhK7ykl7vKRDm5NzrY5V_r
- `5b0f1923f8210176.png` ← https://lh3.googleusercontent.com/KEpszqYIa1lMPVecD3eDqQDiYPTnl02lIWnD6vRP4EuLg1B1bCy9pvIWH567lYGjxPeOeC_Hdvm_
- `b03f6acaf9635454.png` ← https://lh3.googleusercontent.com/KtGAhuY4gAAooTlzNro5r28R-JqaNn-GIuLF784YUnV4r9xuN73HBLIGoK2ngiHQTkEBH3-Pv5i_
- `82085161a4e7879d.png` ← https://lh3.googleusercontent.com/LkaUY6KA1A3o2AsE0U9A8Yka862hS-QLjbWWC7etGxAi8UU55KnFHwor3AeHy814pTq_IJgpND4k
- `2d2f9458127e3e06.png` ← https://lh3.googleusercontent.com/LpdT8F1acz-J6VISmCSL1-BMFHSFrOP0Ey9WkdUVp0xjdG_8xA4mWV3fz2aSuws2Sjq5YllidbsV
- `79f7982d4ba3f0af.png` ← https://lh3.googleusercontent.com/MEsCpopd1hOL195tikhDp1oekUbo_Dgjj3C8uO-1DuhPneuxpqu6Rntq6FMue_xJj6Bg0cvUFGBr
- `47c384de74cf02e5.png` ← https://lh3.googleusercontent.com/MKNjpAopgtytl_kFpz85rnKyX4WdXng4gAvBAcQPMcDKWYzvwPrFzXEaKJoof31oj0KDhcCZLG0n
- `a2d816afb5813b6e.png` ← https://lh3.googleusercontent.com/MTNVLCkRAS7bSuaXx8wcn3u_6dmltsszWRSC3Qo7cnc_G2Lk1K_QkeULzwaGWNidXlO12HIxRvKn
- `a7f6206bdc5cf693.png` ← https://lh3.googleusercontent.com/M_rfbkLJHuLrKAZGQQmuEVaZMyte_u_3ybmULmG8aiNvTnIcB9OmLtKv9dswOeVNC0NML5TtfQVS
- `7fbdb69ddd3a30c6.png` ← https://lh3.googleusercontent.com/PTixdykCflNGubuMrHJpl5MMA4Gg3W9U8LDFn2SjrMoswSQ2F_uJAVkm8NtkjoxRvJbQsyUev55l
- `b486cbbdec84ac20.png` ← https://lh3.googleusercontent.com/Qe-iPyRhBKhCxHScEGB4S8BssYvRdETO_pEbYIPRrGLewt2ObrK4fEJXcRN7DnsWZeAWSlL0J1fX
- `50a746cf14260540.png` ← https://lh3.googleusercontent.com/VAgYqCiSgxR776ucqoudANiddYBjkUwzrtQPxdVWC3vLAjapPUH0OjC_aHhHU1gX-a7jAtlSdyfL
- `11387a1e96231f71.png` ← https://lh3.googleusercontent.com/X5qMWXDD7RFiXL6-gzkVulqL9pNGDfUX0efsHAsahVvpsZYW9bLkl-4UyWkXho6YWmAxoVSpz3dh
- `9521ec76541db266.png` ← https://lh3.googleusercontent.com/YMcDQwccIYdZQCclnmL3BQj8juhrhmwZnKP5tOPuggWxqQp1nUwzSiM2kb452O-rXM93BVfEwbrC
- `163612826ebe62aa.png` ← https://lh3.googleusercontent.com/dL3RrXAFk0yAelVnpdVtEswLMzDgTjbDjVW1Ws00MppaklNXca5Dwx0PDdWkU6pc7SYy9I0xUXQ1
- `e19bc4ec8606f16f.png` ← https://lh3.googleusercontent.com/iefNrcoiuJ0ugSFq7Sr-IDU2JcAbmJPJqObTZJRuoEd3MIKOdAZZuy2PBx-hnXJEYrmXuN-BwMsI
- `dce8a7218e9946ff.png` ← https://lh3.googleusercontent.com/lTTHd1QoFOtnUn9kre2Ifx3m8tZlBEcNzwIbibxsbeIo3srW5t25mBOewAYkO5fFIFLzW4JA0uiD
- `ef5ff50593d4a4c3.png` ← https://lh3.googleusercontent.com/t5niu5LsIjOjw0wey4JXXcQ9J0PQuCxTW7cXasgVguRXLf1Sjuuv7VDs81XvQvD9GfrYj9CXwjPp
- `31a9644d5d4655aa.png` ← https://lh3.googleusercontent.com/tETsEHo8OLEiIv-Aaw1wjb742B5Thac-7QZTp95nvITcOKMWXrSKJTl0gTnbAwyOiSl9EvWo8aMt
- `2166fd8b979af60c.png` ← https://lh3.googleusercontent.com/y_Bb20CqP7MSVjr8eJmNwxui08VclLGtULHxuZijAxVbdPmwcdepZbOoM1dKSK0YSXbOaKhGQqan
- `20633589f957b8f0.png` ← https://lh3.googleusercontent.com/z3NPv_bl1zhqrcVdxulXJmeLSWmbTfWTkIMYyQCoeXa4HbUQUuV3mm1rtgBDFRBxgZ__Q-YBLJ__

## [guidelines] illustrations

- `08b18ba2188c6b06.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhhvs4s-12.
- `3cead2c84bf8ef72.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhi1ze1-GM3
- `bf0dc0be46f80277.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhi7618-GM3
- `a2ccefa987621dfe.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkhvz2-GM3
- `201771d1fab1bd46.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkizck-GM3
- `45d2bfa94a79eb5e.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhklm21-GM3
- `50e5d593ab2a082c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkmci9-GM3
- `bb376c4e7e76cfc6.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkrz7i-GM3
- `3e567594559ec9f6.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhksla9-GM3
- `75aa0c8275bc9d9c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkykpc-GM3
- `1c9aa4b400d78051.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhl1ir9-GM3
- `bb45ef1c5332dffa.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhl2xgp-GM3
- `7e398196ea118b9b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5o0x3j-01.
- `68dda197c4bdd0f2.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5sha07-02.
- `9023485156758e8a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5si8zx-03.
- `a2aa6aa1d5bc2d4e.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5sj3v5-04.
- `4dcf8edf6bb89658.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5skthv-06.
- `0af9628c876eb256.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5slanf-07.
- `366d19b4609e5747.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5sma00-08.
- `fab7f6bd15baf65a.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5smpl6-09.
- `9890b2ecddc684ef.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5sng56-10.
- `6b02ae4bd01132a1.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5srxxg-11.
- `56ca5a53c9fc53be.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5swv36-13.
- `41d58ce9e30550de.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5sxs60-16.
- `0e8a4d3bd182d8cd.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5t0t93-17.

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhi1ze1-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhi7618-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkhvz2-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkizck-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhklm21-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkmci9-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkrz7i-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhksla9-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhkykpc-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhl1ir9-GM3-Components-DatePick`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhl2xgp-GM3-Components-DatePick`

## [accessibility] illustrations

- `949b8454c4bed406.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwhl9jct-3.p
- `c12d58498b0bbe9c.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5tcq2g-01.
- `c0d3d195dde79804.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5tdrn3-02.
- `b11e813c668d6d82.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5tjcxl-04.
- `2e59ee343ddb368b.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5tl1kf-05.
- `85fdf81d177063cb.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5tmhkf-06.
- `e5b661bdb623eaa7.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5tnt2t-07.
- `3350a5793095e181.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5tp1fs-08.
- `888a9603d8ae50aa.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5tqs6i-09.
- `c8fddf7f506266e0.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmd5tw17z-10.
- `9521ec76541db266.png` ← https://lh3.googleusercontent.com/YMcDQwccIYdZQCclnmL3BQj8juhrhmwZnKP5tOPuggWxqQp1nUwzSiM2kb452O-rXM93BVfEwbrC
