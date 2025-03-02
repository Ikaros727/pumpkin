import {defineStore} from "pinia";
import {ref} from "vue";
import {User} from "@/dao/model/User.ts";
import {UserModel} from "@/dao/User.ts";
import sha256 from "crypto-js/sha256";

export const useUserStore = (deps: { userModel: UserModel }) => {
    return defineStore("user", () => {
        const isInitialized = ref(false);
        const isAuthenticated = ref(false);
        const user = ref<User | null>(null);

        let userModel: UserModel = deps.userModel;

        const register = (u: User): Promise<User> => {
            return new Promise((resolve, reject) => {
                u.Password = sha256(u.Password).toString();
                userModel.Create(u).then(res => {
                    resolve(res);
                }).catch(e => {
                    reject(e);
                });
            });
        };

        const login = (username: string, password: string): Promise<User> => {
            return new Promise((resolve, reject) => {
                password = sha256(password).toString();
                userModel.Get({
                    Username: username, Password: password
                }).then(res => {
                    if (res === null) {
                        reject(new Error("账号或密码错误"));
                        return;
                    }
                    user.value = res;
                    isAuthenticated.value = true;
                    resolve(user.value);
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