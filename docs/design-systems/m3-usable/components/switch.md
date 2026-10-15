# M3 component: switch

_Archive: `m3-archive/spec/components/switch/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/switch/…_

## Overview (full text)

Switch – Material Design 3
 Availability & resources Differences from M2 Use switches (not
 radio buttons
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 ) if the items in a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 can be independently controlled Switches are the best way to let people adjust settings Make sure the switch’s
 selection
 Selection lets users choose specific items to act on.
 More on selection
 (on or off) is visible at a glance Switches can be toggled on and off Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Available Close Differences from M2 Accessibility: Visual presentation is more accessible Color: New color mappings meet Material's non-text-contrast requirements in addition to compatibility with
 dynamic color
 Dynamic color takes a single color from a user's wallpaper or in-app content and creates an accessible color scheme assigned to elements in the UI.
 More on dynamic color
 Icons: Ability to have an optional icon within the switch handle Layout: Track is taller and wider M2: Switches have a circular handle that extends beyond the edge of the track M3: Switches have a taller and wider track, new color mappings, and the ability to show an icon in the handle

## Key measurements (dp, extracted)

- ed switches with icons Element Attribute Value Track Height 32dp Width 52dp Outline width 2dp Shape md.s
- ys.shape.corner.full Handle Height (unselected) 16dp Height - with icon 24dp Height (selecte
- d) 24dp Height (pressed) 28dp Width (unselected
- ) 16dp Width - with icon 24dp Width (selected)
- 24dp Width (pressed) 28dp Shape md.sys.shape
- .corner.full State layer Size 40dp Shape md.sys.shape.corner.full Target S
- ize 48dp Icon Size (selected) 16dp Icon Size (un
- selected) 16dp Configurations Without icons Icon on se

## Accessibility (full text)

Switch – Material Design 3
 Use cases Interaction & style Initial focus Keyboard navigation Labeling elements Use cases People should be able to do the following with assistive technology: Navigate to a switch with a keyboard or switch input Toggle the switch on and off Get appropriate feedback based on input type documented under Interaction & style Interaction & style The switch handle increases in size to indicate interactivity for both touch and cursor control interactions. Touch When tapped or
 dragged
 A dragged state communicates when a user presses and moves an element.
 More on dragged state
 , the handle size grows, providing interaction feedback. Cursor When hovered (in both on and off
 states
 States show the interaction status of a component or UI element.
 More on states
 ), the
 hover
 A hover state communicates when a user has placed a cursor above an interactive element.
 More on hover state
 area grows, providing a visual cue that the handle is interactive. When clicked, the handle size grows. Touch: Tap, Drag Cursor: Hover, Click Avoid applying density by default Don't apply density to switches by default — this lowers their targets below our best practice of 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme. To ensure that this density setting can easily be reverted when it's active, keep all targets to change it at a minimum 48x48 CSS pixels each. Initial focus Initial focus lands directly on the switch’s handle, since it’s the primary interactive element of the component. Focus lands on the switch handle The switch is toggled using Space or Enter Keyboard navigation Keys Actions Tab Focus lands on the switch handle Space or Enter Toggles the handle on and off Labeling elements The
 accessibility
 Accessible design makes products usable for people with all kinds of abilities.
 More on accessibility
 label for a switch uses the adjacent label text if implemented correctly. Assistive tech such as a screen reader will read the UI text followed by the component’s role. A switch’s accessibility label can incorporate its adjacent UI text When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a switch visibly labelled Photo album would benefit from additional information to clarify the switch’s function. Consider making the adjacent label text more descriptive when possible. This reduces the need for different accessibility text. While the visible label text reads Photo album , the accessibility label for this switch clarifies its function: Photo album access

## Specs (full text)

Switch – Material Design 3
 Tokens & specs Color States Measurements Configurations Track Handle (formerly "thumb") Icon Tokens & specs Browse the component elements, attributes, tokens, and their values. Learn more about design tokens Switch arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down folder Disabled keyboard_arrow_down folder Hovered keyboard_arrow_down folder Focused keyboard_arrow_down folder Pressed (ripple) keyboard_arrow_down Close Color Color values are implemented through
 design tokens
 Design tokens are the building blocks of all UI elements. The same tokens are used in designs, tools, and code.
 More on tokens
 . For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Switch color roles used for light and dark themes: Surface container highest Outline Outline Primary On primary On primary container Adjacent text label color Use the
 color role
 Color roles are assigned to UI elements based on emphasis, container type, and relationship with other elements. This ensures proper contrast and usage in any color scheme.
 More on color roles
 on surface for adjacent text labels. This remains the same even if interacting with the label or component. The text label uses on surface . Supporting text may use on surface variant . States
 States
 States show the interaction status of a component or UI element.
 More on states
 are visual representations used to communicate the status of a component or interactive element. Learn more about interaction states Enabled Hovered Focused Pressed Disabled State specs are in the token module above Measurements Switches without icons Pressed switches without icons Switches with icons Pressed switches with icons Element Attribute Value Track Height 32dp Width 52dp Outline width 2dp Shape md.sys.shape.corner.full Handle Height (unselected) 16dp Height - with icon 24dp Height (selected) 24dp Height (pressed) 28dp Width (unselected) 16dp Width - with icon 24dp Width (selected) 24dp Width (pressed) 28dp Shape md.sys.shape.corner.full State layer Size 40dp Shape md.sys.shape.corner.full Target Size 48dp Icon Size (selected) 16dp Icon Size (unselected) 16dp Configurations Without icons Icon on selected switch Icon on selected and unselected switch

## Guidelines (full text)

Switch – Material Design 3
 Usage Anatomy Placement Behavior Switches change settings and other options immediately Usage Switches are best used to adjust settings and other standalone options. They make a binary
 selection
 Selection lets users choose specific items to act on.
 More on selection
 : On and off True and false The effects of a switch should start immediately, without needing to save. pause Use a switch to turn an option on and off Use switches to: Toggle a single item on or off Immediately activate or deactivate something Switches are commonly used on mobile to turn settings on or off Switches control binary options, not opposing ones. A binary option represents a single
 selection
 Selection lets users choose specific items to act on.
 More on selection
 that's either on or off. Opposing options are when only one option in a set can be selected at a time, like a
 list
 Lists are continuous, vertical indexes of text and images.
 More on lists
 or map view. Use a
 connected button group
 Connected button groups have smaller inner corners and are best used for selection.
 More on button groups
 instead. check Do Use a connected button group to choose between opposing options close Don’t Avoid using switches to toggle between opposing options Alternate selection controls
 Checkboxes
 Checkboxes let users select one or more items from a list, or turn an item on or off.
 More on checkboxes
 ,
 radio buttons
 Radio buttons let people select one option from a set of options.
 More on radio buttons
 , and switches are the three main kinds of selection controls. They help people make choices, like selecting options or turning settings on and off. Use checkboxes to select multiple related options in a list. Use radio buttons to select a single option in a list. Use switches to select standalone or more verbose options in a list, like settings. Checkboxes Radio buttons check Do Use checkboxes (not switches) to let people select one or more options from a list close Don’t A switch can't replace a button. People expect a call to action to be a button, not a switch. check Do Use radio buttons (not switches) when only one item can be selected from a list close Don’t Avoid using a switch to select multiple options that require people to save. Switches should be immediate. Use checkboxes instead. Anatomy Track Handle Icon (optional) Icon (optional) The switch handle can contain an optional icon. pause The icon within the handle should always communicate the switch's selection Icons can be used to visually emphasize the switch’s
 selection
 Selection lets users choose specific items to act on.
 More on selection
 . The icon’s meaning should be clear and unambiguous to help the people understand whether switch is on or off. check Do Use icons that clearly communicate whether the switch is on or off, such as an X and a checkmark close Don’t Avoid using more ambiguous or non-binary icons, such as a moon or edit icon Label text Switches should always be paired with an inline label describing what the switch controls when selected. check Do Keep labels short and direct. A label should describe what the control does when the switch is on. close Don’t Don't add label text into the switch; the font size would be too small to be accessible. Use an appropriate icon instead. Placement Switches are often arranged in stacked
 layouts
 Layout is the visual arrangement of elements on the screen.
 More on layout
 . Settings screens are common places to use switches Behavior A switch is successfully toggled when the handle slides to the other side of the track after an interaction. pause When selected, the switch handle slides to the opposite end of the track When a person toggles a switch, its handle size changes and the corresponding action takes effect immediately. pause The on state of the switch is indicated by a larger handle size

## [overview] illustrations

- `3a9f132e6e154929.png` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwa9bnl5-1.p
- `efe4c571938675d0.png` ← https://lh3.googleusercontent.com/8Q9gMTX5nAY3wJyezAw1JEzmJ6MbTAT3FkVUc7BIO9RUJ485PUwFFlXz7pAutMPh1eI0ScCnGFUd
- `1b20483554187be1.png` ← https://lh3.googleusercontent.com/P_nhLNZtpt8oAPTScTR_d6oBLsidBWX0xG96t9fCkTURwNMReQpP9Etrpw4rc439wBfOAJBUeGZ3
- `c16f9c63f9e3ddd1.png` ← https://lh3.googleusercontent.com/TVArYuECyDwSc7viB8VaKpMF6_1i36n-BJU7qP6MQcrz0ue1UuV_jw6lBHVOMNmfhII-C3KuYFrV

## [specs] illustrations

- `4f109320448e5db8.png` ← https://lh3.googleusercontent.com/0Xmcv7IiazLYf6Bpg_WWIU0Cnp32mkTymcUwcgN2QxXbvz2KyCIvTMXDW4sOR-m-jzDd4IO3aHqd
- `06d541fe40941b6a.png` ← https://lh3.googleusercontent.com/0fyIBhV6SPL8tV1Vk7CtpveaYQ1-am9tJ41EVA-QaywC5FoZ6CmY7Cevkh6gG8HklU2Ojaj4r0d4
- `5d450640f75d22d2.png` ← https://lh3.googleusercontent.com/PnpKeMQPpfXYol0STNFLWY--Fet6iOSy9Skw-SxaiktaHsBbPbHkXNl2RX7aLYHsrUbIN8LwPshZ
- `2a5a6a2ce01257bf.png` ← https://lh3.googleusercontent.com/QjZaSle3gkHOtKy1j-YDhEIIdbjF3_Uy3kVXdJnmx7F4Gt-Af66rcmJpNFIKXrGIUg2NSEb9U4UA
- `c16f9c63f9e3ddd1.png` ← https://lh3.googleusercontent.com/TVArYuECyDwSc7viB8VaKpMF6_1i36n-BJU7qP6MQcrz0ue1UuV_jw6lBHVOMNmfhII-C3KuYFrV
- `973f55170a4561cc.png` ← https://lh3.googleusercontent.com/a4JkZitJC-KZ1qxKfHvM-B2tuC0JqMsA08tY-fRrBhlXDf6JpvjpQD9IAZ0_zg-R1E0tvzAst-Vw
- `17e5adb5bd64acb4.png` ← https://lh3.googleusercontent.com/pOvYPjVd1P1HEOyZPLp4jziQmmbT5uMefs4zGCMSHg-fiRFgzXIeAz75RDSyfyZSu3yObf70vL6i
- `af98acff3224a66c.png` ← https://lh3.googleusercontent.com/vFaJZa1Ic9jL9_q6ayhWZw_21xhx2LeDKKJpLRhHisCUpo7tFW-cIHTOdD0mj75_m3ov2BhZQavF
- `13c998a7394bfd2e.png` ← https://lh3.googleusercontent.com/wZm_0fDk5iJbWdd6SZL2P6FkEw8Q94mZ9g0laAAb99hOsR4dk08iyhObA6p4OuqUuf8azFV_9Th0
- `657af88febd1e9c6.png` ← https://lh3.googleusercontent.com/yZbAEZRgNI6uOkunAfaXCx8NAExJ8RsY6DkIjWJMH0DanJdyakTEzO8YFyw1bd3AZdvfJv229_ma

## [guidelines] illustrations

- `206ec7a59bef4aca.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwa9phy3-GM3
- `db4b2b8b58109c2c.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwabkmev-GM3
- `90a3495d30750fa9.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwabqhfg-GM3
- `3e4cf4dd343e6d32.mp4` ← https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwabqzdx-GM3
- `a54da833803ccb80.png` ← https://lh3.googleusercontent.com/1tz8VDpVt3FDyf3v9iiqdxIEuIffJuOaXLSfHDYAN83CaPiKc_YZfO7KnZ2yVTmLNA-gmvxmdsHy
- `a1d959ea7042f3f3.png` ← https://lh3.googleusercontent.com/3lI8U8eFaJEBDsf5YJz4e07h87cub5XTw2qWR3w7BbarbCWicdNE9AF4ewEp_r3qh_evjs105-t5
- `d2b7ddb4fbe3a045.png` ← https://lh3.googleusercontent.com/A3Tr_ujhshFdU05BqNPGYMK-n-IYTjRkYIMgLkKqGfjYI5H3uU5oMweusuojA6wu8Xzn9TWID_iS
- `4429b85cf1680314.png` ← https://lh3.googleusercontent.com/EeKlgEcp1KJ-9NfC7YPlsc0sQITFitnLnF1iY76rHsZKNPmeu0J5-a3xlnpj_tPlVvoEuQjX2pVz
- `9541233b5d16809e.png` ← https://lh3.googleusercontent.com/LPCQ-Do-7xjhcg4Q-ocCdWlGZiku8V4RY86JpOCxYReqXVAswVegZ-TLmgF7ogz6UjS_zysFsBwy
- `bbc45ddb1c9b79fe.png` ← https://lh3.googleusercontent.com/RP-OY6cXjDCXhDkZfdNQmY4crSy5rLCujf8DCTUaNSByNPt1XJYvpWHOZm0d5hLprgl_wfU9YZBG
- `c16f9c63f9e3ddd1.png` ← https://lh3.googleusercontent.com/TVArYuECyDwSc7viB8VaKpMF6_1i36n-BJU7qP6MQcrz0ue1UuV_jw6lBHVOMNmfhII-C3KuYFrV
- `cda730005928dffb.png` ← https://lh3.googleusercontent.com/Xcgd1ZKjqsdww-in_mgrJ56JkF9t5rIVuJGByhtHWgjPDKPGYFRHlV_UU-HKcBCYbW3F9L9mZEwk
- `ff686ca8a05ad740.png` ← https://lh3.googleusercontent.com/Yeafv6eDK5lXb6MUK2aXoRw6D8bo7TFoO62JYzQjQDdojRTeYEDf5iCU8M_MdA67qDGCoaqrAke1
- `8bc5ecfb304ffe80.png` ← https://lh3.googleusercontent.com/ZsqrkLA9mtmq2b2QpUDR2rtnKj9uidOEDais9zRVYzpypNMDiPrcugFoM26TU2BfwIEU2f8ayFkO
- `d125606bbf652ce9.png` ← https://lh3.googleusercontent.com/jH1Tkfo_kEijiXDqUqQIT2VMLZB213Hl414Jrmsh6jr0o_QYlwgLsm_8ikjo_XqhgeRa4wI5FrbM
- `4016403263ffe4aa.png` ← https://lh3.googleusercontent.com/muDDs8mxZm8vsI9Bu335VCwdRY6E9Yx8mEUNab4_4FlUdRbaNPSFJCfWKOHTEcH6qj6R8p_E0wTt
- `a753d5d905101463.png` ← https://lh3.googleusercontent.com/n_YcGWfROt1o6Ig3SUMsoD2AJnR1ONaC0AjgVUR9CIQ0_zAlMNw-wWfpshgAv5mru4RBPlzTym7B
- `c986bcd65b620110.png` ← https://lh3.googleusercontent.com/qhcoEcCH8obBM4P2DNuKMOOKaOgdApSQW-0OZVSc5UD46Ttzdkb_GproXkVIIVsl7jOklP8-8RZf
- `b0a4cb9ee3c24cd6.png` ← https://lh3.googleusercontent.com/wjSLtGs-C59hMUplsvCnFm1IjCYlMNcNUGUsnKoR28RxhApBz0YhW6AlO257nPdJ48NIUTezejDl
- `2e5f740051307f7a.png` ← https://lh3.googleusercontent.com/x0AqjOgoDcYjaJyG017Y59vOzTxcqS5NfZ761rJ-Utb8JVw8_RZskFZTYAbBECIFqE23WBpO0Xuf
- `49d3c0471cfe2a7c.png` ← https://lh3.googleusercontent.com/xAewYZioxNc7YhmPjwIC4XEG7_8tdA6130j_66kfuFM3H3h2HH0wx8U1kVxPeNz4StMXWMJG0ICx

Videos:
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwa9phy3-GM3-Components-Switch-1`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwabkmev-GM3-Components-Switch-2`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwabqhfg-GM3-Components-Switch-3`
- `https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwabqzdx-GM3-Components-Switch-4`

## [accessibility] illustrations

- `bc1427bcd5f53bca.png` ← https://lh3.googleusercontent.com/1waGLXuMxUHtjHjDVCcLWQF2ioH5mGvSRVlVJn9IO1rTSeiTTUE6pG2zQ6VskRok4RHejMQHucCf
- `71ac5a944ea4b91a.png` ← https://lh3.googleusercontent.com/RL42kRexZDwly3y3IIMPDdcDUEkd7C4jOQuq9me0IQa3vkWH9zl08KjI5yLcp6KCZIM7S8f56Oa4
- `c16f9c63f9e3ddd1.png` ← https://lh3.googleusercontent.com/TVArYuECyDwSc7viB8VaKpMF6_1i36n-BJU7qP6MQcrz0ue1UuV_jw6lBHVOMNmfhII-C3KuYFrV
- `37cd15057cb0fa20.png` ← https://lh3.googleusercontent.com/W9k8FZDab4FlAZdkKblIJVtCzjSJ48pu4wxgFourwAHfPsYc5RPK8gTPW4H7hVTj-hJNoR4iqQpZ
- `d60368ea47b33038.png` ← https://lh3.googleusercontent.com/ncRMKB_fQpAaCrlUNBYQ-UXNOAdAP-bmIlZy3hiiGoTic1gTMurPu6wqzFLKBTWIMrhDa3bhrLT4
- `47f5c7d7ce89a55c.png` ← https://lh3.googleusercontent.com/uQCgvmrYgUn5jsyprqaHwVc9uV4Jgg0cJR11xFDTeF-WdA4w1h72Cm-S3xtz6IwTdRUEpj7rt3vl
- `24f466413b9c447b.png` ← https://lh3.googleusercontent.com/zJYFK9dmp7xQR83LnteRstjk0HCH3wuryW_dm29AYmjj3K4U6GM91uuwHh9CLjlV49GMndpgnSlY
