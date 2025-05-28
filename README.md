With this tool we can create themes compatible with Tailwind. Basically, we'll use the common variables across generated themes to style our stuff. We can change themes to change colors and any variables to affect use like padding, gaps.

A css file is generated with all the variables under a class. Look at `sd.config.js`, but no action there is needed. So to change theme `<html class="dark">`

Steps to create a new theme.

1. Add a new theme `packages/design-tokens/constants.cjs`
2. Create a file of that name in `packages/design-tokens/src/tokens/color`
3. Run `npm run build`
4. Generated code is in `packages/design-tokens/src/themes` and `output`
5. `output` is where other packages and apps import from, so have a look in `exports` in `package.json`


## Scripts

| Script | Description |
|--------|-------------|
| `build` | `unbuild && node ./sd.config.cjs` |
| `lint` | `eslint .` |
| `lint:fix` | `eslint --fix .` |
| `types` | `tsc -p tsconfig.typecheck.json` |
| `types2` | `npx -y tsc -p . --excludeFiles sd.config.cjs --outDir build` |

