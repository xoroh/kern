import { Avatar } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Avatar examples — who something belongs to.
 *
 * The size axis is DIMENSIONS, not treatment: `sm`, `default` and `lg` are
 * three fixed boxes, so a row of avatars lines up without the caller
 * measuring anything.
 */
export const AVATAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "avatar-sizes",
    title: "Three sizes, one frame",
    description:
      "The fallback carries the initials, and it is the caller's text — which is also where the localisation of those initials belongs. The frame is a full round corner, so any image is clipped to the same shape.",
    render: () => (
      <div className="flex items-center gap-4">
        <Avatar.Root size="sm">
          <Avatar.Fallback delay={0}>KO</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback delay={0}>KO</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root size="lg">
          <Avatar.Fallback delay={0}>KO</Avatar.Fallback>
        </Avatar.Root>
      </div>
    ),
    code: `<Avatar.Root size="sm">
  <Avatar.Fallback delay={0}>KO</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root>
  <Avatar.Fallback delay={0}>KO</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="lg">
  <Avatar.Fallback delay={0}>KO</Avatar.Fallback>
</Avatar.Root>`,
  },
];
