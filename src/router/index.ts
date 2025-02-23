import {createMemoryHistory, createRouter} from "vue-router";
import HomeView from "@/views/home/HomeView.vue";
import MissionView from "@/views/mission/MissionView.vue";
import MissionCreateView from "@/views/mission/pages/MissionCreatePage.vue";
import PersonalView from "@/views/personal/PersonalView.vue";
import SecretPage from "@/views/personal/pages/SecretPage.vue";
import MissionDetail from "@/views/mission/pages/MissionDetail.vue";

const routes = [
    {path: "/", redirect: "/mission"},
    // 首页
    {path: "/home", component: HomeView},
    // 任务
    {path: "/mission", component: MissionView},
    {path: "/mission/create", component: MissionCreateView},
    {path: "/mission/detail", component: MissionDetail},
    // 个人
    {path: "/personal", component: PersonalView},
    {path: "/personal/secret", component: SecretPage}
];

export default createRouter({
    history: createMemoryHistory(),
    routes
});