// Test double for react-native: style-map tests never render, they only
// need the module to import without crashing (real RN ships Flow sources
// that bundlers outside Metro cannot parse).
const stub = () => null;

export const View = stub;
export const Text = stub;
export const Pressable = stub;
export const TextInput = stub;
