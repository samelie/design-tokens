import { makeConfig } from "@adddog/build-configs/unbuild";

export default makeUnbuildConfig({
    entries: [
        "src/index", // Main library entry point
        "src/cli", // CLI entry point
    ],

    declaration: true,
    rollup: {
        emitCJS: true,
    },
});
