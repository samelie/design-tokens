import { makeConfig } from "@rad/publish/build.config.ts";

export default makeConfig({
    entries: ["src/index"],
    declaration: true,
    rollup: {
        emitCJS: true,
    },
});
