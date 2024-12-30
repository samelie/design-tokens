import config from "@rad/eslint";

export default config()
    .override("antfu/stylistic/rules", { rules: { "ts/no-explicit-any": "off" } });
