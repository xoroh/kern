# M3 component: divider

_Archive: `m3-archive/spec/components/divider/` (accessibility, guidelines, overview, specs). Live: https://m3.material.io/components/divider/…_

## Overview (full text)

Divider – Material Design 3
 Availability & resources Differences from M2 Make dividers visible but not bold Only use dividers if items can’t be grouped with open space Use dividers to group things, not separate individual items Dividers separating items in a list Availability & resources Type Resource Status Design
 Design Kit (Figma) Available Implementation
 Flutter Available android Jetpack Compose Available android Android Views (MDC-Android) Available language Web Available Close Differences from M2 Color: New color mappings and compatibility with dynamic color Configurations: Ability to have vertical dividers Dividers have new color mappings

## Key measurements (dp, extracted)

- ute Value Divider full-width 100% Divider inset left margin 16dp Divider inset right margin 0dp Divider
- middle-inset left margin 16dp Divider middle-inset right margin 16dp
- Space between divider & supporting-text 4dp Divider right margin 8dp Divider bottom
- margin 8dp

## Accessibility (full text)

Divider – Material Design 3
 Skip to main content menu_open arrow_back Main menu pause Pause animations dark_mode Switch to dark mode menu material_design Material Design 3 search Divider Dividers are thin lines that group content in lists or other containers Resources android flutter +2 arrow_back info Overview style Specs design_services Guidelines accessibility_new Accessibility Dividers are decorative elements, which have no contrast minimums. Decorative elements have no contrast minimums

## Specs (full text)

Divider – Material Design 3
 Tokens and specs Color Measurements Divider Tokens and specs Browse the component elements, attributes, tokens, and their values. Divider arrow_drop_down search expand_all Default, Light arrow_drop_down folder Enabled keyboard_arrow_down Close Color Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. Learn more about design tokens Divider color roles used for light and dark schemes: Outline variant Measurements Measurements Attribute Value Divider full-width 100% Divider inset left margin 16dp Divider inset right margin 0dp Divider middle-inset left margin 16dp Divider middle-inset right margin 16dp Space between divider & supporting-text 4dp Divider right margin 8dp Divider bottom margin 8dp

## Guidelines (full text)

Divider – Material Design 3
 Usage Anatomy Full-width dividers Inset dividers Vertical divider Full-width dividers Usage Dividers are one way to visually group components and create hierarchy. They can also be used to imply nested parent/child relationships. The divider can be used in two ways: Full width Inset Full-width divider Inset divider Anatomy A divider is a simple line. Divider Full-width dividers Use full-width dividers to separate larger sections of unrelated content. They can be used directly on a surface or inside other components like cards or lists. Full-width dividers can also separate interactive areas from non-interactive areas. They are used to group visual elements together, and indicate when elements are related to each other from an interaction perspective. Full-width dividers to indicate separation of content check Do Use full-width divider lines to separate interactive and non-interactive areas of a container such as a card exclamation Caution Use full-width dividers sparingly. Too many divider lines will make an interface look cluttered. Inset dividers Use inset dividers to separate related content within a section. Inset dividers are equally indented from both sides of the screen by default. Inset dividers separate related content, such as emails in a list. They should be used with anchoring elements such as icons or avatars, and align with the leading edge of the screen. Inset dividers in a list of related items Inset dividers can be placed in the middle of a layout to separate elements such as body text from selection chips Using dividers both ways on the same screen If dividers are used both ways in a UI, they must reinforce the hierarchy of information within different sections. To separate a different kind of content, use a full-width divider To separate nested content items, use inset dividers check Do Use a combination of inset and full-width dividers to reflect the hierarchy of information List items with repetitive formats may not require an inset divider, in which using only the margin between items is acceptable. check Do Content may not require a divider line Vertical divider A vertical divider can be used to arrange content on a larger screen, such as separating paragraph text from video or imagery media. Vertical divider in a large screen context

## [overview] illustrations

- `bfc57bd03e83b49b.png` ← https://lh3.googleusercontent.com/8XE8z8nXQKQUenlC67jMRhDdJzHNpRPOb8823ZEjppX7lG4H9KGw8E-NgAdPL9IVpjU0SjUMKM4H
- `c0b490c43933798e.png` ← https://lh3.googleusercontent.com/XzLvQIFI1bPcY94jkG0wH0k2q5oq10abbZE3PxJTJv82onD1lYAfXmBbxIoicWGcqoYM2AKyvx95
- `30fb5a637e8bec93.png` ← https://lh3.googleusercontent.com/nt6TfZJ1hPz6HX6Pn1Lvf2_jMgg3cnIGfttwCupUGgry6V5DHR1JvdSdkkWIUdVopwjJ_BRzYTaA

## [specs] illustrations

- `bfc57bd03e83b49b.png` ← https://lh3.googleusercontent.com/8XE8z8nXQKQUenlC67jMRhDdJzHNpRPOb8823ZEjppX7lG4H9KGw8E-NgAdPL9IVpjU0SjUMKM4H
- `1d9425e9ebfaf900.png` ← https://lh3.googleusercontent.com/nAdfpj-iAPZ7Zohh6rLalqf_NXmdrLUmqhQTZkfAgJdp7OJdRTb82SMH0U5GOJF-yTm3P8nRpycQ
- `6a708398117bf7af.png` ← https://lh3.googleusercontent.com/nlIs7BqldeOjL6zGRe-b05BxdussoGedN4o35xv0KouVO0agDSZ_X4Zza-CK00qaH3gG-EGfemhg
- `42a76dda2395b775.png` ← https://lh3.googleusercontent.com/oj7KVyynAuq1UwXg5w1-mMew6K5ScAJ6p3N8AitVYbECX8ZoEZM6gDLGiHWOvokrG3F4SRpj-DAJ

## [guidelines] illustrations

- `fb3c65b12020cc3b.png` ← https://lh3.googleusercontent.com/4XBmZ8OFNWayERiVW6Fdq8UFj6GsBuDAedl24YkYLxpx4fK3tpJ_nQbAmqkGmZZMRila9X3oBJ72
- `f0af19595298ae77.png` ← https://lh3.googleusercontent.com/73z9FMjAg3kPm-IYbmoPDJ6fOmuspGFNCtmQEWgt8JLmF5oT4bjAP-A5Tcj4MVQ7ELxoXajWECc4
- `bfc57bd03e83b49b.png` ← https://lh3.googleusercontent.com/8XE8z8nXQKQUenlC67jMRhDdJzHNpRPOb8823ZEjppX7lG4H9KGw8E-NgAdPL9IVpjU0SjUMKM4H
- `e6b3f6cc526f4272.png` ← https://lh3.googleusercontent.com/8qy1TKw_O4CDgg-I21yl5m3LqA-zovoSJRXPBmNZrpjKwJOndAzvtwYQ6Ygcv8r1ZgKvNOZ1LyCO
- `a57bc25a3c5d4186.png` ← https://lh3.googleusercontent.com/FgHeBjA2pgAJv-fZVU1JhTuAme8am-qHRLp7yzskrVdd9FsFxrwNBh8Qix8daXPUoszK8MDaLd1v
- `429c05227ae922e7.png` ← https://lh3.googleusercontent.com/INRwkh2QYMmX3bMlDSOkNkd4VkmiTdrtfSTugzZRjpXg8AJmwBetxY8X0J7R6tO4BDjrbfccqoIy
- `07815f161a3bf7b3.png` ← https://lh3.googleusercontent.com/NSGvcJJazPdtNGNH-K6P-F91kufNOLf9qtNdySyBRGvYt1edvTYfXpo8Ig6-lOGNj4mtEGwJAp6r
- `f851472ff6071bde.png` ← https://lh3.googleusercontent.com/Ocsunun7K_5J7rsyAVoml4Fe1sIK0wlHa_SkLJ9wy0hcw1BaPbhvAuL1bR01kH-CmpcwnkXQvcwv
- `244c3ae79018cdd5.png` ← https://lh3.googleusercontent.com/PWseJ13-mt9cW2123ZzekkPFAqLgB998Vjq2SYtjrWMPrU6GPe3cu5JHXhYm9FyBUe7FhVf5WtzV
- `7d284e0f64089bc6.png` ← https://lh3.googleusercontent.com/WDF7BBHGj8yQ1azq5jKExXR0QzYBWIOu6yObWLR6w-aLYAjQLT7WWi3da0oMmSl5Nsc2UxhiE8Yv
- `5e9dbc3f684a78a7.png` ← https://lh3.googleusercontent.com/_YTqmkqyO4zUBu2JzRnIRTQKqR-G3eVpUcSkIgZoEeAdrvF6IhcFv7zEkr_oheP2gc4IJLDWHpqZ
- `08e722b2e9050be3.png` ← https://lh3.googleusercontent.com/egzEzqVWWnBhzhHhro6zbSyUckQRrRFnJps3EwXXFbsN91CgCSkg9ZeDIccnwo_Btq7YJxUgt0UZ
- `c3d3f2f91e4e97c3.png` ← https://lh3.googleusercontent.com/uAlit0uWcMbAwUFNbD7Y8crsaxcYSRvlS-I_AR1iGqbOTa3nE8mVfIb0BHugHnsDP1tYEe6YClZb
- `a6a9dfa47b350a85.png` ← https://lh3.googleusercontent.com/yRjwwhcfrgoa4HRyAnyy-06NN-uC6jQ232awWcwLrDqhqan4dM72d3fdBibiEqqPuQ0Y57iEPJjp

## [accessibility] illustrations

- `bfc57bd03e83b49b.png` ← https://lh3.googleusercontent.com/8XE8z8nXQKQUenlC67jMRhDdJzHNpRPOb8823ZEjppX7lG4H9KGw8E-NgAdPL9IVpjU0SjUMKM4H
- `34cd6a4fc43230fb.png` ← https://lh3.googleusercontent.com/OZaQfCJIkmhGm1J_JkXzYIWGRF0v5Iw-HUlrr30InFSeGfmwf4nksdVFgUdbht_b4-rCEarR8deQ
