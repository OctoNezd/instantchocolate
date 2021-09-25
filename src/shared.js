import { mapState } from "vuex";
export const packageMixin = {
    methods: {
        findPackage: function(packageName) {
            return this.packageList[packageName];
        }
    },
    computed: mapState({
        packageList: state => state.packageList.packages,
        installQueue: state => state.installQueue
    })
};
