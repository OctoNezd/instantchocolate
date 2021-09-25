const { gitDescribeSync } = require("git-describe");
process.env.VUE_APP_GIT_HASH = gitDescribeSync().semverString;
console.log("Downloading latest installer...");
const axios = require("axios");
const fs = require("fs");

axios
    .get(
        `https://api.github.com/repos/${process.env.INSTALLER_REPOSITORY}/releases/latest`
    )
    .then(releaseData => {
        axios
            .get(releaseData.data.assets[0].browser_download_url, {
                responseType: "stream"
            })
            .then(installerFile => {
                const file = fs.createWriteStream("public/installerBase.exe");
                installerFile.data.pipe(file);
                console.log("Installer download complete");
            });
    });

module.exports = {
    pages: {
        index: {
            canonicalurl: process.env.CANONICAL_URL,
            // entry for the page
            entry: "src/main.js",
            // the source template
            template: "public/index.html",
            // output as dist/index.html
            filename: "index.html"
        }
    }
};
