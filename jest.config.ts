export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jest-environment-jsdom",

  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};
