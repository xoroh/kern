---
"@xoroh/kern-native": patch
---

Native `Button` no longer swallows a press dispatched without a preceding press-in.

Press reporting routes through the kernel model (`useKernPress`), which reads
the gesture from the captured press-in event. A press event arriving on its own
— synthetic dispatches, assistive-technology activation — carried no captured
event, so the consumer's `onPress` never fired. The press handler now falls back
to the press event itself when no press-in was captured. Cancel semantics are
unchanged: press-out without press still reports nothing.
