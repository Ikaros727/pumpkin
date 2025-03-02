import {defineStore} from "pinia";
import {ref} from "vue";
import {User} from "@/dao/model/User.ts";
import {UserModel} from "@/dao/User.ts";

// 更安全的浏览器端哈希（仍需配合后端）
async function sha256Hash(text: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export const useUserStore = (deps: { userModel: UserModel }) => {
    return defineStore("user", () => {
        const isInitialized = ref(false);
        const isAuthenticated = ref(false);
        const user = ref<User | null>(null);

        let userModel: UserModel = deps.userModel;

        const register = (u: User): Promise<User> => {
            return new Promise((resolve, reject) => {
                sha256Hash(u.Password).then((hash) => {
                    u.Password = hash;
                    userModel.Create(u).then(res => {
                        resolve(res);
                    }).catch(e => {
                        reject(e);
                    });
                }).catch(e => {
                    reject(e);
                })
            });
        };

        const login = (username: string, password: string): Promise<User> => {
            return new Promise((resolve, reject) => {
                sha256Hash(password).then((hash) => {
                    password = hash;
                    userModel.Get({
                        Username: username, Password: password
                    }).then(res => {
                        if (res === null) {
                            reject(new Error("账号或密码错误"));
                            return
                        }
                        user.value = res;
                        isAuthenticated.value = true;
                        resolve(user.value);
                    }).catch(reject);
                }).catch(reject);
            });
        };

        const logout = () => {
            user.value = null;
            isAuthenticated.value = false;
        };

        const initialize = () => {
            if (isInitialized.value) return;
            isInitialized.value = true;
        };

        return {user, isAuthenticated, register, login, logout, initialize};
    }, {
        persist: true
    });
};