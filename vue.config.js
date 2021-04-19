const { gitDescribeSync } = require("git-describe");
console.log(gitDescribeSync());
process.env.VUE_APP_GIT_HASH = gitDescribeSync().semverString;
module.exports = {
  pages: {
    index: {
      canonicalurl: process.env.CANONICAL_URL,
      // entry for the page
      entry: "src/main.js",
      // the source template
      template: "public/index.html",
      // output as dist/index.html
      filename: "index.html",
    },
  },
};
