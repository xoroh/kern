import { Button, IconButton, PulseButton } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import {
  T_BODY_SM,
  T_CODE,
  T_LABEL_MD,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  INK,
  INK_SOFT,
  PILL_ACTIVE,
  PILL_REST,
  STAGE,
  STRIP,
  TRANSITION,
} from "../../domains/shared/systems/ui";
import { CopyButton } from "../../showcase/copy-button";
import { HighlightedCode } from "../docs/highlight";

const WEB_CODE = `import { Button, PulseButton, IconButton } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";

export function OrderActions() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="filled" icon={<Icon name="check" />}>
        Approve
      </Button>
      <PulseButton variant="tonal" shape="square">
        Hold to confirm
      </PulseButton>
      <IconButton
        label="Bookmark"
        variant="outlined"
        toggle
        icon={<Icon name="bookmark" />}
        selectedIcon={<Icon name="check" />}
      />
    </div>
  );
}`;

const NATIVE_CODE = `import { Button, PulseButton, IconButton } from "@xoroh/kern-native";
import { View } from "react-native";

export function OrderActionsNative() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Button variant="filled" onPress={() => {}}>
        Approve
      </Button>
      <PulseButton
        variant="tonal"
        shape="square"
        onHaptic={(phase) => console.log("haptic:", phase)}
        onPress={() => {}}
      >
        Hold to confirm
      </PulseButton>
      <IconButton
        label="Bookmark"
        variant="outlined"
        toggle
        onPressedChange={() => {}}
      />
    </View>
  );
}`;

export function SplitThemeAndPlatformFrame() {
  const [platformTab, setPlatformTab] = useState<"web" | "native">("web");
  const code = platformTab === "web" ? WEB_CODE : NATIVE_CODE;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className={`${STAGE} flex flex-col gap-4 p-6`}>
          <div className="flex items-center justify-between">
            <h3
              id="surface-standard-preview"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              Standard Surface Container
            </h3>
            <span className={`${T_CODE} ${INK_SOFT}`}>
              --sys-color-surface-container
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 py-4">
            <Button variant="filled" icon={<Icon name="check" />}>
              Approve
            </Button>
            <PulseButton variant="tonal" shape="square">
              Pulse lock
            </PulseButton>
            <Button variant="outlined" color="danger">
              Reject
            </Button>
            <IconButton
              label="Bookmark"
              variant="tonal"
              toggle
              defaultPressed
              icon={<Icon name="bookmark" />}
              selectedIcon={<Icon name="check" />}
            />
          </div>
        </div>

        <div
          data-theme="dark"
          className="dark flex flex-col gap-4 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-highest) p-6 text-(--sys-color-on-surface)"
        >
          <div className="flex items-center justify-between">
            <h3
              id="surface-high-preview"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              High-Elevation Surface Container
            </h3>
            <span className={`${T_CODE} ${INK_SOFT}`}>
              --sys-color-surface-container-highest
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 py-4">
            <Button variant="elevated" icon={<Icon name="bolt" />}>
              Elevated
            </Button>
            <PulseButton variant="filled">Primary pulse</PulseButton>
            <Button variant="tonal" color="danger">
              Delete
            </Button>
            <IconButton
              label="Favorite"
              variant="filled"
              icon={<Icon name="favorite" />}
            />
          </div>
        </div>
      </div>

      <div className={`${STRIP} flex flex-col gap-3 p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPlatformTab("web")}
              className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-3.5 ${T_LABEL_MD} ${TRANSITION} ${FOCUS_RING} ${
                platformTab === "web" ? PILL_ACTIVE : PILL_REST
              }`}
            >
              Web (@xoroh/kern)
            </button>
            <button
              type="button"
              onClick={() => setPlatformTab("native")}
              className={`inline-flex min-h-9 cursor-pointer items-center border-0 px-3.5 ${T_LABEL_MD} ${TRANSITION} ${FOCUS_RING} ${
                platformTab === "native" ? PILL_ACTIVE : PILL_REST
              }`}
            >
              React Native (@xoroh/kern-native)
            </button>
          </div>
          <CopyButton text={code} />
        </div>
        <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
          Both packages consume <code>BUTTON_SPRING_TOKENS</code> from{" "}
          <code>@xoroh/kern-tokens</code> and share the same 5 variants, 2
          colors, 9 size keys, and shape-stable <code>PulseButton</code>{" "}
          contract (D1024 C1 &amp; C4).
        </p>
        <pre
          className={`codeblock m-0 overflow-x-auto rounded-(--sys-shape-corner-medium) bg-(--sys-color-surface-container-high) p-4 ${T_CODE} ${INK}`}
        >
          <HighlightedCode code={code} language="tsx" />
        </pre>
      </div>
    </div>
  );
}
