# webpack-unused-check

Check your frontend code for files/assets that are no longer used.

Uses the output of `webpack --json` to see which files are actually used in your bundle,
and lists files which haven't been required.

forked from https://github.com/latentflip/webpack-unused and add nested modules handling in webpack stats file.

## Usage:

```bash
# install webpack-unused-check
npm install -g webpack-unused-check
# or
npx webpack-unused-check

# run webpack using your normal webpack config etc
# with the --json switch to output the stats.json
# unused files in the cwd will be listed
npm run build 
webpack-unused-check --stats dist/stats.json --output dist/unused.txt

# if your source code is in a directory, like src/ pass that as a flag:
webpack-unused-check -s src

# or auto delete unused files
webpack-unused-check -s src --stats dist/stats.json --output dist/unused.txt --autodelete

```

## Related

- [webpack-unused](https://github.com/latentflip/webpack-unused) - Find unused files
