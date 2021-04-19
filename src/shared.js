export const findPackageMixin = {
  methods: {
    findPackage: function(packageName) {
      // https://stackoverflow.com/a/13964186
      var software = this.softwareCatalog.filter((obj) => {
        return obj.packageName.toLowerCase() === packageName.toLowerCase();
      })[0];
      if (software === undefined) {
        console.warn("Failed to find", packageName);
      }
      return software;
    },
  },
};
