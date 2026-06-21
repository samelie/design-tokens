import { defineKnipConfig } from "@adddog/monorepo-consistency";

export default defineKnipConfig({
    entry: ["src/**/*.ts"],
    project: ["src/**/*.ts"],
}, {
    ignoreDependencies: [
        "@adddog/monorepo-consistency",
        "@adddog/build-configs",
    ],
});
