/**
 * Vite `?raw` module declarations.
 *
 * Block pages show a block's source as the copyable Code tab. Importing the
 * file as text (`import src from "../blocks/x.tsx?raw"`) means the fence IS
 * the file — it cannot drift the way a hand-copied `code:` string can.
 */
declare module "*?raw" {
  const content: string;
  export default content;
}
