import { mapState } from "vuex";
export const packageMixin = {
    methods: {
        findPackage: function(packageName) {
            return this.packageList[packageName];
        }
    },
    computed: {
        packageModalVisible: {
            get() {
                return this.packageModalData !== undefined;
            },
            set(newValue) {
                if (newValue === false) {
                    this.$store.commit("clearPackageModal");
                }
            }
        },
        ...mapState({
            packageList: state => state.packageList.packages,
            installQueue: state => state.installQueue,
            packageModalData: state => state.packageModalData
        })
    }
};
