import {createRouter, createWebHashHistory} from "vue-router";
import AuthView from "@/views/auth/AuthView.vue";
import HomeView from "@/views/home/HomeView.vue";
import MissionView from "@/views/mission/MissionView.vue";
import MissionDetail from "@/views/mission/MissionDetailView.vue";
import MissionCreateView from "@/views/mission/MissionCreateView.vue";
import PersonalView from "@/views/personal/PersonalView.vue";
import SecretPage from "@/views/personal/SecretView.vue";
import Settings from "@/views/personal/SettingsView.vue";
import {useUserStore} from "@/stores/user.ts";

const routes = [
    {path: "/", redirect: "/home"},
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

const router = createRouter({
    // history: createMemoryHistory(),
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to) => {
    const authPath = "/auth";
    const userStore = useUserStore()();

    // 需要登录但未登录 → 跳转到登录页
    if (!userStore.isAuthenticated && to.path !== authPath) {
        return authPath;
    }

    // 已登录但访问登录页 → 跳转到首页
    if (to.path === authPath && userStore.isAuthenticated) {
        return '/';
    }
});

export default router;