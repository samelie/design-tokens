import { makeConfig } from "@rad/publish/build.config";

export default makeConfig({
    entries: [
        "src/index", // Main library entry point
        "src/cli", // CLI entry point
    ],

    declaration: true,
    rollup: {
        emitCJS: true,
    },
});
