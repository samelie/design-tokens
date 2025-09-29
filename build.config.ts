import { makeConfig } from "@rad/publish/build.config";

export default makeConfig({
    entries: ["src/index"], // Only build the main entry point
    declaration: true,
    rollup: {
        emitCJS: true,
    },
});
