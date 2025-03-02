<template>
  <ViewTpl title="智能车联数据聚合平台" :has-tabbar="false">
    <div class="auth-container">
      <!-- 表单标题 -->
      <h2 class="form-title">{{ isLogin ? "用户登录" : "用户注册" }}</h2>

      <!-- 表单区域 -->
      <van-form @submit="onSubmit" class="auth-form">
        <!-- 用户名 -->
        <van-field
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
        />

        <!-- 注册专用字段 -->
        <template v-if="!isLogin">
          <van-field
              v-model="form.nickname"
              name="nickname"
              label="昵称"
              placeholder="请输入昵称"
              :rules="[{ required: true, message: '请填写昵称' }]"
          />

          <van-field
              v-model="form.email"
              name="email"
              label="邮箱"
              placeholder="请输入邮箱"
              :rules="[
              { required: true, message: '请填写邮箱' },
              { validator: emailValidator, message: '邮箱格式不正确' }
            ]"
          />
        </template>

        <!-- 密码相关 -->
        <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[
            { required: true, message: '请填写密码' },
            { validator: passwordValidator, message: '密码需6-20位且包含字母数字' }
          ]"
        />

        <van-field
            v-if="!isLogin"
            v-model="form.confirmPassword"
            type="password"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[
            { required: true, message: '请确认密码' },
            { validator: confirmValidator, message: '两次输入密码不一致' }
          ]"
        />

        <!-- 注册时显示手机号 -->
        <van-field
            v-if="!isLogin"
            v-model="form.mobile"
            name="mobile"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
            { required: true, message: '请填写手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
          ]"
        />

        <!-- 提交按钮 -->
        <div style="margin: 16px;">
          <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="submitting"
              :text="isLogin ? '登录' : '立即注册'"
          />
        </div>

        <!-- 切换链接 -->
        <div class="toggle-link">
          <template v-if="isLogin">
            <span>没有账号？</span>
            <a @click="switchSignType">立即注册</a>
          </template>
          <template v-else>
            <span>已有账号？</span>
            <a @click="switchSignType">返回登录</a>
          </template>
        </div>
      </van-form>

      <!-- 协议声明 -->
      <div class="agreement" v-if="!isLogin">
        <van-checkbox v-model="agree">已阅读并同意</van-checkbox>
        <span class="link">《用户协议》</span>
      </div>
    </div>
  </ViewTpl>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import {showToast} from "vant";
import ViewTpl from "@/components/ViewTpl.vue";
import {useUserStore} from "@/stores/user.ts";
import {User} from "@/dao/model/User.ts";

const isLogin = ref(true);
const agree = ref(false);
const submitting = ref(false);
const form = ref({
  username: "",
  nickname: "",
  password: "",
  confirmPassword: "",
  email: "",
  mobile: ""
});

const userStore = useUserStore()();
const router = useRouter()

onMounted(() => {

});

// 切换表单
const switchSignType = () => {
  isLogin.value = !isLogin.value;
  form.value = {
    username: form.value.username,  // 保留已填用户名
    nickname: form.value.nickname,  // 保留已填昵称
    password: "",
    confirmPassword: "",
    email: form.value.email,        // 保留已填邮箱
    mobile: form.value.mobile      // 保留已填手机
  };
};

// 验证规则（保持原有验证逻辑不变）
const passwordValidator = (val: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(val);

const confirmValidator = (val: string) =>
    val === form.value.password;

const emailValidator = (val: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);

const onSubmit = async () => {
  if (!isLogin.value && !agree.value) {
    showToast("请先同意用户协议");
    return;
  }
  submitting.value = true;
  if (isLogin.value) {
    userStore.login(form.value.username, form.value.password)
        .then(() => {
          showToast("登录成功");
          router.push({
            path: "/home"
          });
        })
        .catch(e => {
          showToast("登录失败：" + e.message);
        })
        .finally(() => {
          submitting.value = false;
        });
  } else {
    userStore.register(new User({
      Username: form.value.username,
      Nickname: form.value.nickname,
      Email: form.value.email,
      Mobile: form.value.mobile,
      Password: form.value.password
    }))
        .then(() => {
          showToast("注册成功");
          switchSignType()
        })
        .catch(e => {
          showToast("注册失败：" + e.message);
        })
        .finally(() => {
          submitting.value = false;
        });
  }
};
</script>

<style scoped>
/* 新增表单标题样式 */
.form-title {
  text-align: center;
  font-size: 24px;
  color: #323233;
  margin: 30px 0 40px;
  font-weight: 500;
}

/* 保持其他样式不变 */
.auth-container {
  padding: 20px;
}

.toggle-link {
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  color: #969799;
}

.toggle-link a {
  color: #1989fa;
  margin-left: 5px;
  text-decoration: underline;
}

.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  font-size: 14px;
}

.link {
  color: #1989fa;
  margin-left: 5px;
}

.auth-form {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
</style>