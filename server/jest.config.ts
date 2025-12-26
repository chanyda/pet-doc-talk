import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": [
            "ts-jest",
            {
                tsconfig: {
                    module: "commonjs",
                },
            },
        ],
    },
    collectCoverageFrom: ["**/*.(t|j)s"],
    coverageDirectory: "../coverage",
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/$1",
    },
    extensionsToTreatAsEsm: [],
    globals: {},
};

export default config;
