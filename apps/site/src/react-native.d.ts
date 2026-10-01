// react-native-web 0.21 ships JavaScript with no bundled type declarations.
// The vite alias maps `react-native` onto it so @xoroh/kern-native sources
// resolve on the web (S2.3). Until RNW publishes types, the module surface is
// declared as `any`: the site typechecks Kern's own native props through
// @xoroh/kern-native's .d.ts, which is the contract this site must honour.
declare module "react-native";
