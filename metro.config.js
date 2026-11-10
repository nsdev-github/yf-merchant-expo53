const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const shimRoot = path.resolve(__dirname, "shims/react-native-vector-icons");

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native-vector-icons": shimRoot,
};

module.exports = config;
