import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {userInfo} from "node:os";

interface UserInfo {
    id: number;
    username: string;
    nickname: string;
    email?: string;
    avatar?: string;
}

export const useUserStore = defineStore("user", () => {
    const token = ref<String | null>(localStorage.getItem("token"));
    const user = ref<UserInfo | null>(null);

    const isAuthenticated = computed(() => !!token.value);

    const login = async (username: string, password: string) => {
        try {
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
    }

    const initialize = async () => {
        if (token.value) {
            try {

            } catch {
                token.value = null;
            }
        }
    }

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
        initialize,
    }
});