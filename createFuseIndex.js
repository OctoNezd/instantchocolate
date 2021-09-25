const fuse = require("fuse.js");
const fs = require("fs");
const packageData = JSON.parse(
    fs.readFileSync(process.argv[process.argv.length - 1])
).packages;
const index = fuse.createIndex(
    ["packageName", "displayName", "summary", "tags"],
    Object.values(packageData)
);
fs.writeFileSync("fuse-index.json", JSON.stringify(index.toJSON()));
