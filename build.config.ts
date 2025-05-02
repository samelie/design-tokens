import { makeConfig } from "@rad/publish/src/build.config";

export default makeConfig({
    entries: ["src/index"],
    declaration: true,
    rollup: {
        emitCJS: true,
    },
});
