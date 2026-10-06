# React Native Paper — part-by-part vs kern

**Identity:** the MD3-native incumbent: 30+ components, PaperProvider + useTheme/withTheme, MD2/MD3 dual themes, tonal palettes, 6 elevation levels as color overlays, dynamic color (Material You), PortalHost.
**Sources:** oss.callstack.com/react-native-paper (theming guide); deepwiki theming-system; tessl registry 5.14.

## Parts: they-have / we-will-have
- Actions (Button, IconButton, FAB, TouchableRipple): Y / **B** (button, icon-button, fab; ripple via states).
- Navigation (Appbar Header/Content/Action, BottomNavigation, Drawer): Y / **B** (top-app-bar, navigation-bar, navigation-drawer).
- Overlays (Dialog Title/Content/Actions/ScrollArea/Icon, Menu, Modal, Portal, Snackbar): Y / **B** (dialog, menu, snackbar; PortalHost equivalent in shell).
- Display (Avatar, Badge, Banner, Card, Chip, Divider, List, Surface, Text variants, DataTable, Searchbar, ToggleButton, HelperText): Y / **B** nearly all (avatar, badge, banner, card, chip, list-item, text, search; DataTable advanced = R/G).
- Indicators (ActivityIndicator, ProgressBar): Y / **B** (loader, linear-progress).
- Inputs (TextInput, Checkbox, RadioButton): Y / **B** (input/field, checkbox, radio-group).
- Theming (MD3Light/Dark, getTheme, configureFonts, adaptNavigationTheme, dynamic elevations via surface+primary alpha mix): Y / kern scheme + dynamic-color track (steal the elevation-mix math for docs).
- MD2 legacy (`version: 2`): Y / kern has no MD2 mode — record as non-goal.

## Why this file matters
Paper is the direct native competitor on MD3 compliance. kern's differentiators vs Paper: cross-renderer parity contract, M3-deviations slot (strictness with declared deltas), shadcn-style blocks/registry, AI surface. Every Paper component kern lacks should be a conscious G, not an oversight.
