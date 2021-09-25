import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
var modalCache = {};
export default new Vuex.Store({
    state: {
        packageList: { timestamp: "0", packages: {} },
        installQueue: [],
        packageModalData: undefined
    },
    mutations: {
        updatePackageList(state, newPackageList) {
            state.packageList = newPackageList;
        },
        appendToInstallQueue(state, newItem) {
            if (!state.installQueue.includes(newItem)) {
                state.installQueue.push(newItem);
            }
        },
        removeFromInstallQueue(state, itemToRemove) {
            state.installQueue.splice(
                state.installQueue.indexOf(itemToRemove),
                1
            );
        },
        clearInstallQueue(state) {
            state.installQueue = [];
        },
        setInstallQueue(state, queue) {
            state.installQueue = queue;
        },
        clearPackageModal(state) {
            state.packageModalData = undefined;
        },
        setPackageModal(state, packageData) {
            state.packageModalData = packageData;
        }
    },
    actions: {
        updatePackageList({ commit, state }, newPackageList) {
            console.log("update package list", commit, newPackageList);
            commit("updatePackageList", newPackageList.data);
            const urlParams = new URLSearchParams(window.location.search).get(
                "p"
            );
            if (urlParams !== null) {
                const pendingSoftwareCatalog = urlParams.split(" ");
                var pendingSoftwareGood = true;
                for (const pendingSoftware of pendingSoftwareCatalog) {
                    pendingSoftwareGood =
                        state.packageList.packages[pendingSoftware];
                    if (!pendingSoftwareGood) {
                        console.log("Unknown package", pendingSoftware);
                        break;
                    }
                }
                if (pendingSoftwareGood) {
                    commit("setInstallQueue", pendingSoftwareCatalog);
                }
            }
        },
        toggleInstallQueueItem({ commit, state }, item) {
            if (!state.installQueue.includes(item)) {
                commit("appendToInstallQueue", item);
            } else {
                commit("removeFromInstallQueue", item);
            }
        },
        setPackageModal({ commit }, packageName) {
            if (packageName in modalCache) {
                commit("setPackageModal", this.modalCache[this.packageName]);
            } else {
                this.axios
                    .get(`package_info/${packageName}.json`)
                    .then(response => {
                        console.log("downloaded package info for", packageName);
                        commit("setPackageModal", response.data);
                    });
            }
        }
    },
    modules: {}
});
