const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const shimRoot = path.resolve(__dirname, "shims/react-native-vector-icons");
const elementsBackgroundImageShim = path.resolve(
  __dirname,
  "shims/react-native-elements/BackgroundImage.js"
);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native-vector-icons": shimRoot,
};

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "./BackgroundImage" &&
    context.originModulePath
      .replace(/\\/g, "/")
      .includes("react-native-elements/dist/config")
  ) {
    return {
      filePath: elementsBackgroundImageShim,
      type: "sourceFile",
    };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
