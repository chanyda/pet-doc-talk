import type { Config } from "jest";

const esModules = ["nanoid"].join("|");

const config: Config = {
    preset: "ts-jest",
    rootDir: "src",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/$1",
        "^nanoid(/(.*)|$)": "nanoid$1",
    },
};

export default config;
