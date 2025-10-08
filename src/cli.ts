#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { resolve } from "node:path";
import { watch } from "chokidar";
import { Command } from "commander";
import pc from "picocolors";
import { buildTokens } from "./builder";
import { resolveConfig } from "./config";
import { findConfigFile, loadConfig } from "./config-loader";
import { configTemplate } from "./templates";

const program = new Command();

program
    .name("design-tokens")
    .description("Build and manage design tokens with Style Dictionary")
    .version("1.0.0");

// Build command
program
    .command("build")
    .description("Build design tokens from configuration")
    .option("-c, --config <path>", "Path to config file")
    .option("-w, --watch", "Watch for changes and rebuild")
    .option("--no-color", "Disable colored output")
    .action(async options => {
        try {
            const cwd = process.cwd();
            console.log(pc.blue("🎨 Building design tokens...\n"));

            // Load and resolve config
            const userConfig = await loadConfig(options.config, cwd);
            const config = resolveConfig(userConfig);

            // Build tokens
            const result = await buildTokens(config);

            if (!result.success) {
                console.error(pc.red("❌ Build failed:\n"));
                for (const error of result.errors ?? []) {
                    console.error(pc.red(`  ${error}`));
                }
                process.exit(1);
            }

            console.log(pc.green("✅ Build completed successfully!\n"));
            console.log(pc.gray("Generated files:"));
            for (const file of result.generatedFiles) {
                console.log(pc.gray(`  - ${file}`));
            }

            // Watch mode
            if (options.watch) {
                console.log(pc.blue("\n👀 Watching for changes...\n"));

                const configPath = options.config
                    ? resolve(cwd, options.config)
                    : findConfigFile(cwd);

                if (!configPath) {
                    console.error(pc.red("❌ No config file found for watch mode"));
                    process.exit(1);
                }

                const watcher = watch(configPath, {
                    persistent: true,
                    ignoreInitial: true,
                });

                watcher.on("change", async () => {
                    console.log(pc.yellow("\n🔄 Config changed, rebuilding...\n"));
                    try {
                        const updatedConfig = await loadConfig(options.config, cwd);
                        const resolved = resolveConfig(updatedConfig);
                        const watchResult = await buildTokens(resolved);

                        if (watchResult.success) {
                            console.log(pc.green("✅ Rebuild completed!\n"));
                        } else {
                            console.error(pc.red("❌ Rebuild failed:\n"));
                            for (const error of watchResult.errors ?? []) {
                                console.error(pc.red(`  ${error}`));
                            }
                        }
                    } catch (error) {
                        console.error(
                            pc.red(
                                `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                            ),
                        );
                    }
                });

                // Keep the process running
                process.on("SIGINT", () => {
                    console.log(pc.blue("\n👋 Stopping watch mode..."));
                    watcher.close();
                    process.exit(0);
                });
            }
        } catch (error) {
            console.error(
                pc.red(
                    `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                ),
            );
            process.exit(1);
        }
    });

// Init command
program
    .command("init")
    .description("Create a starter configuration file")
    .option("-f, --force", "Overwrite existing config file")
    .action(async options => {
        try {
            const cwd = process.cwd();
            const configPath = resolve(cwd, "design-tokens.config.ts");

            // Check if file exists
            try {
                await fs.access(configPath);
                if (!options.force) {
                    console.log(pc.yellow("⚠️  Config file already exists!"));
                    console.log(pc.gray(`  ${configPath}`));
                    console.log(
                        pc.gray("\n  Use --force to overwrite, or edit the existing file."),
                    );
                    process.exit(1);
                }
            } catch {
                // File doesn't exist, proceed
            }

            // Write template
            await fs.writeFile(configPath, configTemplate, "utf-8");

            console.log(pc.green("✅ Configuration file created!\n"));
            console.log(pc.gray(`  ${configPath}\n`));
            console.log(pc.blue("Next steps:"));
            console.log(pc.gray("  1. Edit the config file to define your themes"));
            console.log(pc.gray("  2. Run 'design-tokens build' to generate tokens"));
            console.log(
                pc.gray("  3. Import generated tokens in your application\n"),
            );
        } catch (error) {
            console.error(
                pc.red(
                    `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                ),
            );
            process.exit(1);
        }
    });

// Validate command
program
    .command("validate")
    .description("Validate configuration file")
    .option("-c, --config <path>", "Path to config file")
    .action(async options => {
        try {
            const cwd = process.cwd();
            console.log(pc.blue("🔍 Validating configuration...\n"));

            const userConfig = await loadConfig(options.config, cwd);
            const config = resolveConfig(userConfig);

            // Basic validation
            console.log(
                pc.green(
                    `✅ Configuration is valid! Found ${config.themes.length} theme(s):\n`,
                ),
            );
            for (const theme of config.themes) {
                const colorCount = Object.keys(theme.colors).length;
                console.log(
                    pc.gray(
                        `  - ${theme.name} (${colorCount} color${colorCount !== 1 ? "s" : ""})`,
                    ),
                );
                if (theme.extends) {
                    console.log(pc.gray(`    extends: ${theme.extends}`));
                }
            }

            console.log(pc.gray(`\nOutput directory: ${config.output.directory}`));
            console.log(
                pc.gray(`Formats: ${config.output.formats.join(", ")}`),
            );
            console.log(pc.gray(`Prefix: ${config.output.prefix}\n`));
        } catch (error) {
            console.error(
                pc.red(
                    `❌ Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                ),
            );
            process.exit(1);
        }
    });

program.parse();
