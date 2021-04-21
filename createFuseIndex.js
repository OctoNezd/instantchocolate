const axios = require("axios");
const fuse = require("fuse.js");
const fs = require("fs");
const axiosInstance = axios.create({ baseURL: process.env.VUE_APP_API_URL });
(async () => {
  const packageData = (await axiosInstance.get("package_data.json")).data
    .software;
  const index = fuse.createIndex(
    ["packageName", "displayName", "summary", "tags"],
    packageData
  );
  fs.writeFileSync("fuse-index.json", JSON.stringify(index.toJSON()));
})();
