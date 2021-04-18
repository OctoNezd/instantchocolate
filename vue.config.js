const { gitDescribeSync } = require("git-describe");
process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash;
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
