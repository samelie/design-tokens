import config from "@adddog/eslint";

export default config()
    .override("antfu/stylistic/rules", { rules: { "ts/no-explicit-any": "off" } });
