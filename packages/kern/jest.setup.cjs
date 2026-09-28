// Minimal native-module mock for Jest (RN 0.87 ships no jest preset).
// react-test-renderer never talks to real native code; the bridge only
// needs to exist, not function.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
global.nativeFabricUIManager = {};
jest.mock("react-native/Libraries/Core/InitializeCore", () => ({}));
jest.mock("react-native/Libraries/BatchedBridge/NativeModules", () => ({
  __esModule: true,
  default: {
    SourceCode: { getConstants: () => ({ scriptURL: null }) },
    DeviceInfo: {
      getConstants: () => ({
        Dimensions: {
          window: { fontScale: 2, height: 1334, scale: 2, width: 750 },
          screen: { fontScale: 2, height: 1334, scale: 2, width: 750 },
        },
      }),
    },
    UIManager: { getConstants: () => ({}) },
    PlatformConstants: { getConstants: () => ({}) },
  },
}));
