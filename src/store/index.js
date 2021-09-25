import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        packageList: { timestamp: "0", packages: {} },
        installQueue: []
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
        }
    },
    modules: {}
});
