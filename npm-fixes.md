# Possible fixes for common problems with NPM packages

## Q1: My Sass isn't compiling at all or the `-w` flag is not working

### Solution 1

This may be because you're using a different `node-sass` version than the one I use in the videos. Please uninstall `node-sass` with:

`npm uninstall node-sass --save-dev`

Then install version `4.5.3` with;

`npm install node-sass@4.5.3 --save-dev`.

### Solution 2

This is more of a workaround if Solution 1 doesn't work. You can install a package called `nodemon` to run node.js code directly. Install it with:

`npm install nodemon --save-dev`

Then in the `package.json` file, add the following tasks:

```
"compile:sass": "node-sass sass/main.scss css/style.comp.css"
"watch:sass": "nodemon -e scss -x \"npm run compile:sass\""
```

### Solution 3

If you're using VSCode, the defualt autosave setting is that it saves your file each time you stroke a key. This made me run into some errors in the videos. The fix is to change the autosave setting to `onFocusChange`. You can do so by copying the following instruction to the settings (panel on the right side):

`"files.autoSave": "onFocusChange"`

## Q2: Autoprefixer isn't working on Windows

On Windows you will have to escape the `"` in the autoprefixer task, just like this:

`"prefix:css": "postcss --use autoprefixer -b \"last 10 versions\" css/style.concat.css -o css/style.prefix.css"`

## Q3: General problems

If your NPM packages don't work at all, please make sure you have at least node `v6.x.x` installed on your computer. You can check your version with `node -v`.

You can also try setting all your NPM packages to the same versions used in the videos. It works like described in **Q1** of this document (`node-sass` example). These are the versions I used in the videos:

```
"autoprefixer": "^7.1.4",
"concat": "^1.0.3",
"node-sass": "^4.5.3",
"npm-run-all": "^4.1.1",
"postcss-cli": "^4.1.1"
```

**I will keep this document updated if more issues arise.**