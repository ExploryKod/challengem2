export default {
    collectCoverage: true,
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testRegex: "^((?!int|e2e).)*.test.tsx?$",
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
    coverageDirectory: "../coverage",
    coverageProvider: "v8",
    moduleFileExtensions: ["js", "json", "ts", "tsx"],
    rootDir: "src",
    moduleNameMapper: {
      "^@taotask/(.*)$": "<rootDir>/$1",
    },
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "/in-memory*",
      ".*\\.factory\\.ts$",
    ],
    transform: {
      "^.+\\.tsx?$": [
        "ts-jest",
        {
          diagnostics: false,
          jsx: "react",
          target: "es2017",
          allowJs: true,
        },
      ],
    },
  };