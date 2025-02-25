import {createMemoryHistory, createRouter} from "vue-router";
import AuthView from "@/views/auth/AuthView.vue";
import HomeView from "@/views/home/HomeView.vue";
import MissionView from "@/views/mission/MissionView.vue";
import MissionDetail from "@/views/mission/MissionDetailView.vue";
import MissionCreateView from "@/views/mission/MissionCreateView.vue";
import PersonalView from "@/views/personal/PersonalView.vue";
import SecretPage from "@/views/personal/SecretView.vue";
import Settings from "@/views/personal/SettingsView.vue";

const routes = [
    {path: "/", redirect: "/personal"},
    {path: "/auth", component: AuthView},
    // 首页
    {path: "/home", component: HomeView},
    // 任务
    {path: "/mission", component: MissionView},
    {path: "/mission/create", component: MissionCreateView},
    {path: "/mission/detail", component: MissionDetail},
    // 个人
    {path: "/personal", component: PersonalView},
    {path: "/personal/secret", component: SecretPage},
    {path: "/personal/settings", component: Settings}
];

export default createRouter({
    history: createMemoryHistory(),
    routes
});