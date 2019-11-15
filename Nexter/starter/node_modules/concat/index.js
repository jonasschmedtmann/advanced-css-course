"use strict";
const fs_1 = require("fs");
const path_1 = require("path");
const log = (err) => console.log(err);
const isFile = (f) => fs_1.statSync(f).isFile();
const write = (fName, str) => new Promise((res, rej) => {
    fs_1.writeFile(path_1.resolve(fName), str, (err) => {
        if (err)
            return rej(err);
        return res(str);
    });
});
const readFolder = (folder) => new Promise((res, rej) => {
    fs_1.readdir(path_1.resolve(folder), (err, files) => {
        if (err)
            rej(err);
        const fileList = files.map(f => path_1.join(folder, f));
        res(fileList.filter(isFile));
    });
});
const read = (fName) => new Promise((res, rej) => {
    fs_1.readFile(path_1.resolve(fName), (err, str) => {
        if (err)
            rej(err);
        res(str);
    });
});
const concat = (files) => new Promise((res, rej) => {
    return Promise.all(files.map(read))
        .then(src => res(src.join('\n')))
        .catch(rej);
});
module.exports = (folder, outFile) => new Promise((res, rej) => {
    let concatenated;
    if (typeof folder === 'string') {
        concatenated = readFolder(folder)
            .then(concat);
    }
    else {
        concatenated = concat(folder);
    }
    if (outFile) {
        concatenated.then((out) => write(outFile, out)
            .then(res)
            .catch(rej)).catch(rej);
    }
    else {
        concatenated.then(res).catch(rej);
    }
});
