const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Monorepo: watch the workspace so edits under packages/ rebuild the app.
config.watchFolders = [workspaceRoot];

// Resolve app deps first, then whatever bun hoists to the workspace root
// (workspace links to packages/kern live there).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Honor package.json `exports`, so `@xoroh/kern/native` resolves through its
// `react-native` condition instead of the web entry.
config.resolver.unstable_conditionNames = ["react-native", "require", "import"];
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
