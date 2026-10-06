# Comparison matrix — all systems × part families

Codes: they-have **Y** have · **P** partial · **–** absent. kern: **B** both renderers · **W** web · **N** native · **G** gap · **R** rent/wrap.
Columns: M3W m3-material-web · MUI · SH shadcn · BU Base UI · MA Mantine · CH Chakra · ANT · CAR Carbon · FLU Fluent · TAM Tamagui · RNP RN Paper · NB NativeBase (legacy) · GLU Gluestack.

| Part family | M3W | MUI | SH | BU | MA | CH | ANT | CAR | FLU | TAM | RNP | NB | GLU | kern |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Buttons/variants | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | B |
| FAB | Y | Y | P | – | P | P | Y | – | – | – | Y | P | Y | B |
| Icon buttons | Y | Y | P | – | Y | Y | Y | Y | Y | P | Y | P | – | B |
| Chips/badges | Y | Y | Y | – | Y | Y | Y | Y | Y | – | Y | Y | Y | B |
| Dialog/alert | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | B |
| Sheets/bottom-sheet | P | Y | Y | – | Y | Y | Y | – | – | Y | – | – | Y | N (leads) |
| Drawer | – | Y | Y | Y | Y | – | Y | – | – | – | Y | – | Y | B |
| Snackbar/toast | Y | Y | Y | Y | Y | Y | Y | Y | – | Y | Y | Y | Y | B |
| Menu/popover/tooltip | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | B |
| Select/combobox/autocomplete | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | P | Y | – | B |
| Text input/field/textarea/OTP | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | B |
| Checkbox/radio/switch/slider | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | B |
| Tabs/segments | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | P | Y | Y | B |
| Navigation (bar/drawer/menu) | Y | Y | Y | Y | Y | Y | Y | Y | Y | – | Y | P | – | B |
| Pagination/breadcrumbs | – | Y | Y | – | Y | Y | Y | Y | Y | – | – | – | – | B (pag.; crumb G) |
| Progress/loader/skeleton | Y | Y | Y | Y | Y | Y | Y | Y | Y | – | Y | Y | Y | B |
| Avatar/list/card/divider | Y | Y | Y | Y | Y | Y | Y | Y | Y | – | Y | Y | Y | B |
| Table basic / grid advanced | P/– | Y/Y | Y/– | – | Y/– | Y/– | Y/– | Y/P | Y/– | – | Y/– | – | Y/– | W / R-G |
| Calendar/date/time/range | P | Y | Y | – | Y | – | Y | – | – | – | – | – | Y | B / G-range |
| Tree view | – | Y | – | – | P | – | Y | – | – | – | – | – | – | G |
| Charts | – | Y | Y | – | Y | Y | Y | Y | – | – | – | – | – | R-G |
| Scheduler/Gantt | – | Y | – | – | – | – | – | – | – | – | – | – | – | G |
| RTE/file-manager/pivot/diagram | – | – | – | – | – | – | P | – | – | – | – | – | – | G (rent-only) |
| Carousel | – | – | Y | – | Y | Y | Y | – | – | – | – | – | – | B |
| Command palette/spotlight | – | – | Y | – | Y | – | – | – | – | – | – | – | – | B (command) |
| Search | P | – | – | – | – | – | – | – | – | – | Y | – | – | B |
| Form/validation lib | – | – | Y | Y | Y | – | Y | – | – | – | – | Y | Y | B-basic/G-valid |
| Hooks library | – | – | – | – | Y | – | – | – | – | – | – | – | – | G |
| Blocks/patterns/templates | – | Y | Y | – | P | P | Y | Y | – | – | – | – | Y | planned |
| Theming tokens (roles/scales) | Y | Y | Y | – | Y | Y | Y | Y | Y | Y | Y | Y | Y | B (M3 roles) |
| Dark/dynamic color | Y | Y | Y | – | Y | Y | Y | – | Y | Y | Y | Y | Y | B |
| A11y per-component | P | Y | – | Y | P | – | P | Y | Y | – | P | P | P | B (contract+axe) |
| AI surface (llms/MCP/skills) | – | Y | Y | – | Y | Y | Y | Y | – | – | – | – | – | planned |
| Copy-paste/registry | – | – | Y | – | – | Y | – | – | – | – | – | – | Y | planned (mcp) |
| Multi-platform (web+native) | – | – | – | – | – | – | Y | – | Y | Y | N-only | Y | Y | B (contract) |

## Reading the matrix
- kern leads outright in exactly one cell family: **sheets** (no surveyed system has kern-native's sheet family).
- kern's structural edge (no competitor has it): **one parity contract across web+native + M3-deviations slot + AI surface planned**.
- Biggest red cells: advanced grid, charts, tree, scheduler, RTE/file-manager, hooks library, blocks (planned, not shipped).
- Every G needs a standing decision (build / rent / never) — that decision list is the design this track feeds.
