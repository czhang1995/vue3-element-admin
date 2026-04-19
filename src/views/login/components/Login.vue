<template>
  <div class="auth-panel-form">
    <h3 class="auth-panel-form__title" text-center>{{ t("login.login") }}</h3>
    <el-form
      ref="loginFormRef"
      :model="loginFormData"
      :rules="loginRules"
      size="large"
      :validate-on-rule-change="false"
    >
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model.trim="loginFormData.username" :placeholder="t('login.username')">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
        <el-form-item prop="password">
          <el-input
            v-model.trim="loginFormData.password"
            :placeholder="t('login.password')"
            type="password"
            show-password
            @keyup="checkCapsLock"
            @keyup.enter="handleLoginSubmit"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button :loading="loading" type="primary" class="w-full" @click="handleLoginSubmit">
          {{ t("login.login") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { LoginRequest } from "@/types/api";
import router from "@/router";
import { useUserStore } from "@/store";

const { t } = useI18n();
const userStore = useUserStore();
const route = useRoute();

const loginFormRef = ref<FormInstance>();
const loading = ref(false);
// 是否大写锁定
const isCapsLock = ref(false);

const loginFormData = ref<LoginRequest>({
  username: "",
  password: "",
  captchaId: "",
  captchaCode: "",
});

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.username.required"),
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required"),
      },
      {
        min: 6,
        message: t("login.message.password.min"),
        trigger: "blur",
      },
    ],
  };
});

/**
 * 登录提交
 */
async function handleLoginSubmit() {
  // 1. 表单验证
  const valid = await loginFormRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid) return;

  loading.value = true;
  try {
    // 2. 执行登录
    await userStore.login(loginFormData.value).then(
      async () => {
        // 登录成功，跳转到目标页面
        const redirectPath = (route.query.redirect as string) || "/";
        console.log("Redirecting to:", redirectPath);
        await router.push(decodeURIComponent(redirectPath));
      },
      (error) => {
        throw error;
      }
    );
  } finally {
    loading.value = false;
  }
}

// 检查输入大小写
function checkCapsLock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
}
</script>

<style lang="scss" scoped>
.auth-panel-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-panel-form__title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.third-party-login {
  .divider-container {
    display: flex;
    align-items: center;
    margin: 16px 0;

    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, var(--el-border-color-light), transparent);
    }

    .divider-text {
      padding: 0 16px;
      font-size: 12px;
      color: var(--el-text-color-regular);
      white-space: nowrap;
    }
  }

  .social-login {
    display: flex;
    gap: 1.25rem;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--el-text-color-secondary);

    &__item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      font-size: 20px;
      cursor: pointer;
      border-radius: 8px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: var(--el-fill-color);
      }
    }
  }
}
</style>
