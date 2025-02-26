import "@vuemap/vue-amap/dist/style.css";
import {createApp} from "vue";
import {createPinia} from "pinia";
import {initAMapApiLoader} from "@vuemap/vue-amap";
import App from "./App.vue";
import router from "./router";
import {Open} from "./dao/db.ts";
import {MissionModel} from "./dao/Mission.ts";
import {MissionCarDataModel} from "./dao/MissionCarData.ts";
import {UserPaillierSecretModel} from "./dao/UserPaillierSecret.ts";
import {ConfigProvider, Dialog, Notify, SwipeCell, Row, Col} from "vant";
import "vant/es/dialog/style";

Open().then(db => {
    const app = createApp(App);
    const pinia = createPinia();

    app.use(pinia);
    app.use(ConfigProvider);
    app.use(Dialog);
    app.use(Notify);
    app.use(SwipeCell);
    app.use(Row);
    app.use(Col);

    initAMapApiLoader({
        key: "0a2469a1a69e21f3a6cda365dfa5e397",
        securityJsCode: "88a1b61b3e36e26d1a8d17535dbfbce9"
    });

    app.provide("MissionModel", new MissionModel(db));
    app.provide("MissionCarDataModel", new MissionCarDataModel(db));
    app.provide("UserPaillierSecretModel", new UserPaillierSecretModel(db));
    app.provide("DatabaseLoaded", true);

    app.use(router);
    app.mount("#app");
}).catch(e => {
    console.error(e);
});
