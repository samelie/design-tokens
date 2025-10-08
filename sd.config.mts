/**
 * Internal build script for generating design tokens
 * Uses the new library API to build tokens from design-tokens.config.ts
 */
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildTokens } from "./src/builder";
import { loadConfig } from "./src/config-loader";
import { resolveConfig } from "./src/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
    try {
        console.log("🎨 Building internal design tokens...\n");

        // Load the internal config
        const userConfig = await loadConfig("design-tokens.config.ts", __dirname);
        const config = resolveConfig(userConfig);

        // Build tokens
        const result = await buildTokens(config);

        if (!result.success) {
            console.error("❌ Build failed:");
            for (const error of result.errors ?? []) {
                console.error(`  ${error}`);
            }
            process.exit(1);
        }

        console.log("✅ Build completed successfully!");
        console.log("\nGenerated files:");
        for (const file of result.generatedFiles) {
            console.log(`  - ${file}`);
        }
    } catch (error) {
        console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        process.exit(1);
    }
}

build().catch(console.error);
